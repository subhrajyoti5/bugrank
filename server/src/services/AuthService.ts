import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database';
import { User } from '@bugpulse/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const SESSION_EXPIRY_HOURS = 24;

export interface RegisterData {
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface GoogleOAuthData {
  googleId: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface SessionData {
  sessionToken: string;
  userId: number;
  expiresAt: Date;
}

export class AuthService {
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<{ user: User; token: string; sessionToken: string }> {
    const { email, password, displayName } = data;
    const normalizedEmail = this.normalizeEmail(email);

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, created_at, total_score, total_submissions, successful_submissions, profile_data, last_login)
       VALUES ($1, $2, $3, NOW(), 0, 0, 0, '{}'::jsonb, NOW())
       RETURNING id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, profile_data, last_login`,
      [normalizedEmail, passwordHash, displayName || normalizedEmail.split('@')[0]]
    );

    const userRow = result.rows[0];
    const user: User = {
      id: userRow.id.toString(),
      email: userRow.email,
      displayName: userRow.display_name,
      photoURL: userRow.photo_url,
      createdAt: userRow.created_at,
      totalScore: userRow.total_score,
      totalSubmissions: userRow.total_submissions,
      successfulSubmissions: userRow.successful_submissions,
    };

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Create session
    const sessionToken = await this.createSession(parseInt(user.id), null, null);

    return { user, token, sessionToken };
  }

  /**
   * Login user with email and password
   */
  async login(data: LoginData, ipAddress?: string, userAgent?: string): Promise<{ user: User; token: string; sessionToken: string }> {
    const { email, password } = data;
    const normalizedEmail = this.normalizeEmail(email);

    // Find user by email
    const result = await pool.query(
      `SELECT id, email, password_hash, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, profile_data
       FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const userRow = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userRow.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last_login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userRow.id]);

    const user: User = {
      id: userRow.id.toString(),
      email: userRow.email,
      displayName: userRow.display_name,
      photoURL: userRow.photo_url,
      createdAt: userRow.created_at,
      totalScore: userRow.total_score,
      totalSubmissions: userRow.total_submissions,
      successfulSubmissions: userRow.successful_submissions,
    };

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Create session
    const sessionToken = await this.createSession(userRow.id, ipAddress, userAgent);

    return { user, token, sessionToken };
  }

  /**
   * Logout user by invalidating session
   */
  async logout(sessionToken: string): Promise<void> {
    await pool.query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
  }

  /**
   * Validate session token
   */
  async validateSession(sessionToken: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT u.id, u.email, u.display_name, u.photo_url, u.created_at, u.total_score, u.total_submissions, u.successful_submissions
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_token = $1 AND s.expires_at > NOW()`,
      [sessionToken]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const userRow = result.rows[0];
    return {
      id: userRow.id.toString(),
      email: userRow.email,
      displayName: userRow.display_name,
      photoURL: userRow.photo_url,
      createdAt: userRow.created_at,
      totalScore: userRow.total_score,
      totalSubmissions: userRow.total_submissions,
      successfulSubmissions: userRow.successful_submissions,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string | undefined): Promise<User | null> {
    if (!userId || isNaN(parseInt(userId))) {
      return null;
    }

    const result = await pool.query(
      `SELECT id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions
       FROM users WHERE id = $1`,
      [parseInt(userId)]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const userRow = result.rows[0];
    return {
      id: userRow.id.toString(),
      email: userRow.email,
      displayName: userRow.display_name,
      photoURL: userRow.photo_url,
      createdAt: userRow.created_at,
      totalScore: userRow.total_score,
      totalSubmissions: userRow.total_submissions,
      successfulSubmissions: userRow.successful_submissions,
    };
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
        throw new Error('Invalid token payload');
      }
      return decoded as { userId: string };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Create a new session
   */
  private async createSession(userId: number, ipAddress?: string | null, userAgent?: string | null): Promise<string> {
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);

    await pool.query(
      `INSERT INTO sessions (user_id, session_token, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, sessionToken, expiresAt, ipAddress, userAgent]
    );

    return sessionToken;
  }

  /**
   * Generate a random session token
   */
  private generateSessionToken(): string {
    // Generate a secure random hex string instead of a JWT to ensure it fits in VARCHAR(255)
    // and to distinguish it from the main JWT token.
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Clean up expired sessions (run periodically)
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
    return result.rowCount || 0;
  }

  /**
   * Update user profile data
   */
  async updateProfileData(userId: string, profileData: any): Promise<void> {
    await pool.query(
      'UPDATE users SET profile_data = $1 WHERE id = $2',
      [JSON.stringify(profileData), parseInt(userId)]
    );
  }

  /**
   * Get user profile data
   */
  async getProfileData(userId: string): Promise<any> {
    const result = await pool.query('SELECT profile_data FROM users WHERE id = $1', [parseInt(userId)]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0].profile_data;
  }

  /**
   * Handle Google OAuth sign-in/sign-up
   */
  async googleAuth(data: GoogleOAuthData, ipAddress?: string, userAgent?: string): Promise<{ user: User; token: string; sessionToken: string }> {
    const { googleId, email, displayName, photoURL } = data;
    const normalizedEmail = this.normalizeEmail(email);

    // Check if user already exists with this Google ID
    let result = await pool.query(
      `SELECT id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, google_id
       FROM users WHERE google_id = $1`,
      [googleId]
    );

    let userRow = result.rows[0];

    if (!userRow) {
      // Check if user exists with this email
      const emailResult = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [normalizedEmail]
      );

      if (!emailResult.rows.length) {
        const randomPassword = crypto.randomBytes(24).toString('hex');
        const passwordHash = await bcrypt.hash(randomPassword, 10);

        // Create new user with Google OAuth
        const createResult = await pool.query(
          `INSERT INTO users (email, password_hash, display_name, photo_url, google_id, google_profile, created_at, total_score, total_submissions, successful_submissions, profile_data, last_login)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), 0, 0, 0, '{}'::jsonb, NOW())
           RETURNING id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, google_id`,
          [normalizedEmail, passwordHash, displayName, photoURL, googleId, JSON.stringify({ googleId, displayName, photoURL })]
        );

        userRow = createResult.rows[0];
      } else {
        // Link Google OAuth to existing email account
        const linkResult = await pool.query(
          `UPDATE users 
           SET google_id = $1, google_profile = $2, photo_url = $3
           WHERE email = $4
           RETURNING id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, google_id`,
          [googleId, JSON.stringify({ googleId, displayName, photoURL }), photoURL, normalizedEmail]
        );

        userRow = linkResult.rows[0];
      }
    } else {
      // Update last login for existing user
      await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userRow.id]);
    }

    const user: User = {
      id: userRow.id.toString(),
      email: userRow.email,
      displayName: userRow.display_name,
      photoURL: userRow.photo_url,
      createdAt: userRow.created_at,
      totalScore: userRow.total_score,
      totalSubmissions: userRow.total_submissions,
      successfulSubmissions: userRow.successful_submissions,
    };

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Create session
    const sessionToken = await this.createSession(userRow.id, ipAddress, userAgent);

    return { user, token, sessionToken };
  }
}

export default new AuthService();

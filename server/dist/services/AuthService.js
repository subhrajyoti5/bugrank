"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const SESSION_EXPIRY_HOURS = 24;
class AuthService {
    /**
     * Register a new user
     */
    async register(data) {
        const { email, password, displayName } = data;
        // Check if user already exists
        const existingUser = await database_1.default.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            throw new Error('User with this email already exists');
        }
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
        // Insert user into database
        const result = await database_1.default.query(`INSERT INTO users (email, password_hash, display_name, created_at, total_score, total_submissions, successful_submissions, profile_data, last_login)
       VALUES ($1, $2, $3, NOW(), 0, 0, 0, '{}'::jsonb, NOW())
       RETURNING id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, profile_data, last_login`, [email, passwordHash, displayName || email.split('@')[0]]);
        const userRow = result.rows[0];
        const user = {
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
    async login(data, ipAddress, userAgent) {
        const { email, password } = data;
        // Find user by email
        const result = await database_1.default.query(`SELECT id, email, password_hash, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, profile_data
       FROM users WHERE email = $1`, [email]);
        if (result.rows.length === 0) {
            throw new Error('Invalid email or password');
        }
        const userRow = result.rows[0];
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, userRow.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Update last_login
        await database_1.default.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userRow.id]);
        const user = {
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
    async logout(sessionToken) {
        await database_1.default.query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
    }
    /**
     * Validate session token
     */
    async validateSession(sessionToken) {
        const result = await database_1.default.query(`SELECT u.id, u.email, u.display_name, u.photo_url, u.created_at, u.total_score, u.total_submissions, u.successful_submissions
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_token = $1 AND s.expires_at > NOW()`, [sessionToken]);
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
    async getUserById(userId) {
        const result = await database_1.default.query(`SELECT id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions
       FROM users WHERE id = $1`, [parseInt(userId)]);
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
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }
    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return decoded;
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    /**
     * Create a new session
     */
    async createSession(userId, ipAddress, userAgent) {
        const sessionToken = this.generateSessionToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);
        await database_1.default.query(`INSERT INTO sessions (user_id, session_token, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`, [userId, sessionToken, expiresAt, ipAddress, userAgent]);
        return sessionToken;
    }
    /**
     * Generate a random session token
     */
    generateSessionToken() {
        return jsonwebtoken_1.default.sign({ random: Math.random() }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }
    /**
     * Clean up expired sessions (run periodically)
     */
    async cleanupExpiredSessions() {
        const result = await database_1.default.query('DELETE FROM sessions WHERE expires_at < NOW()');
        return result.rowCount || 0;
    }
    /**
     * Update user profile data
     */
    async updateProfileData(userId, profileData) {
        await database_1.default.query('UPDATE users SET profile_data = $1 WHERE id = $2', [JSON.stringify(profileData), parseInt(userId)]);
    }
    /**
     * Get user profile data
     */
    async getProfileData(userId) {
        const result = await database_1.default.query('SELECT profile_data FROM users WHERE id = $1', [parseInt(userId)]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0].profile_data;
    }
    /**
     * Handle Google OAuth sign-in/sign-up
     */
    async googleAuth(data, ipAddress, userAgent) {
        const { googleId, email, displayName, photoURL } = data;
        // Check if user already exists with this Google ID
        let result = await database_1.default.query(`SELECT id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, google_id
       FROM users WHERE google_id = $1`, [googleId]);
        let userRow = result.rows[0];
        if (!userRow) {
            // Check if user exists with this email
            const emailResult = await database_1.default.query(`SELECT id FROM users WHERE email = $1`, [email]);
            if (!emailResult.rows.length) {
                // Create new user with Google OAuth
                const createResult = await database_1.default.query(`INSERT INTO users (email, display_name, photo_url, google_id, google_profile, created_at, total_score, total_submissions, successful_submissions, profile_data, last_login)
           VALUES ($1, $2, $3, $4, $5, NOW(), 0, 0, 0, '{}'::jsonb, NOW())
           RETURNING id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, google_id`, [email, displayName, photoURL, googleId, JSON.stringify({ googleId, displayName, photoURL })]);
                userRow = createResult.rows[0];
            }
            else {
                // Link Google OAuth to existing email account
                const linkResult = await database_1.default.query(`UPDATE users 
           SET google_id = $1, google_profile = $2, photo_url = $3
           WHERE email = $4
           RETURNING id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, google_id`, [googleId, JSON.stringify({ googleId, displayName, photoURL }), photoURL, email]);
                userRow = linkResult.rows[0];
            }
        }
        else {
            // Update last login for existing user
            await database_1.default.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userRow.id]);
        }
        const user = {
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
exports.AuthService = AuthService;
exports.default = new AuthService();

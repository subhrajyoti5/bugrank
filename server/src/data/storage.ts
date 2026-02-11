import { Challenge, Submission, User, TestCase } from '@bugpulse/shared';
import pool from '../config/database';

/**
 * All data is now stored in PostgreSQL database
 * In-memory storage has been removed - using userDb, submissionDb, and challengeDb instead
 */

/**
 * Database operations for users
 */
export const userDb = {
  async create(user: Omit<User, 'id'> & { passwordHash?: string }): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions, profile_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '{}'::jsonb)
       RETURNING id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions`,
      [
        user.email,
        (user as any).passwordHash || '',
        user.displayName,
        user.photoURL || null,
        user.createdAt,
        user.totalScore,
        user.totalSubmissions,
        user.successfulSubmissions,
      ]
    );
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      email: row.email,
      displayName: row.display_name,
      photoURL: row.photo_url,
      createdAt: row.created_at,
      totalScore: row.total_score,
      totalSubmissions: row.total_submissions,
      successfulSubmissions: row.successful_submissions,
    };
  },

  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions
       FROM users WHERE id = $1`,
      [parseInt(id)]
    );
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      email: row.email,
      displayName: row.display_name,
      photoURL: row.photo_url,
      createdAt: row.created_at,
      totalScore: row.total_score,
      totalSubmissions: row.total_submissions,
      successfulSubmissions: row.successful_submissions,
    };
  },

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions
       FROM users WHERE email = $1`,
      [email]
    );
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      email: row.email,
      displayName: row.display_name,
      photoURL: row.photo_url,
      createdAt: row.created_at,
      totalScore: row.total_score,
      totalSubmissions: row.total_submissions,
      successfulSubmissions: row.successful_submissions,
    };
  },

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.displayName !== undefined) {
      fields.push(`display_name = $${paramIndex++}`);
      values.push(updates.displayName);
    }
    if (updates.photoURL !== undefined) {
      fields.push(`photo_url = $${paramIndex++}`);
      values.push(updates.photoURL);
    }
    if (updates.totalScore !== undefined) {
      fields.push(`total_score = $${paramIndex++}`);
      values.push(updates.totalScore);
    }
    if (updates.totalSubmissions !== undefined) {
      fields.push(`total_submissions = $${paramIndex++}`);
      values.push(updates.totalSubmissions);
    }
    if (updates.successfulSubmissions !== undefined) {
      fields.push(`successful_submissions = $${paramIndex++}`);
      values.push(updates.successfulSubmissions);
    }

    if (fields.length === 0) return user;

    values.push(parseInt(id));
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions`,
      values
    );

    const row = result.rows[0];
    return {
      id: row.id.toString(),
      email: row.email,
      displayName: row.display_name,
      photoURL: row.photo_url,
      createdAt: row.created_at,
      totalScore: row.total_score,
      totalSubmissions: row.total_submissions,
      successfulSubmissions: row.successful_submissions,
    };
  },

  async getAll(): Promise<User[]> {
    const result = await pool.query(
      `SELECT id, email, display_name, photo_url, created_at, total_score, total_submissions, successful_submissions
       FROM users ORDER BY total_score DESC`
    );
    
    return result.rows.map(row => ({
      id: row.id.toString(),
      email: row.email,
      displayName: row.display_name,
      photoURL: row.photo_url,
      createdAt: row.created_at,
      totalScore: row.total_score,
      totalSubmissions: row.total_submissions,
      successfulSubmissions: row.successful_submissions,
    }));
  },
};

/**
 * Database operations for submissions
 */
export const submissionDb = {
  async create(submission: Submission): Promise<Submission> {
    const result = await pool.query(
      `INSERT INTO submissions (id, user_id, challenge_id, code, diff, attempt_number, time_taken, code_quality, is_correct, points_earned, analysis, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        submission.id,
        parseInt(submission.userId),
        submission.challengeId,
        submission.code,
        submission.diff || null,
        submission.attemptNumber,
        submission.timeTaken,
        submission.codeQuality,
        submission.isCorrect,
        submission.pointsEarned || 0,
        JSON.stringify(submission.analysis),
        submission.submittedAt,
      ]
    );
    
    return this.mapRowToSubmission(result.rows[0]);
  },

  async findById(id: string): Promise<Submission | null> {
    const result = await pool.query('SELECT * FROM submissions WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRowToSubmission(result.rows[0]) : null;
  },

  async findByUserId(userId: string): Promise<Submission[]> {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE user_id = $1 ORDER BY submitted_at DESC',
      [parseInt(userId)]
    );
    return result.rows.map(row => this.mapRowToSubmission(row));
  },

  async findByChallengeId(challengeId: string): Promise<Submission[]> {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE challenge_id = $1 ORDER BY submitted_at DESC',
      [challengeId]
    );
    return result.rows.map(row => this.mapRowToSubmission(row));
  },

  async findByUserAndChallenge(userId: string, challengeId: string): Promise<Submission[]> {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE user_id = $1 AND challenge_id = $2 ORDER BY submitted_at DESC',
      [parseInt(userId), challengeId]
    );
    return result.rows.map(row => this.mapRowToSubmission(row));
  },

  async getAll(): Promise<Submission[]> {
    const result = await pool.query('SELECT * FROM submissions ORDER BY submitted_at DESC');
    return result.rows.map(row => this.mapRowToSubmission(row));
  },

  mapRowToSubmission(row: any): Submission {
    return {
      id: row.id,
      userId: row.user_id.toString(),
      challengeId: row.challenge_id,
      code: row.code,
      diff: row.diff,
      attemptNumber: row.attempt_number,
      timeTaken: row.time_taken,
      codeQuality: row.code_quality,
      isCorrect: row.is_correct,
      pointsEarned: row.points_earned,
      analysis: row.analysis,
      submittedAt: row.submitted_at,
    };
  },
};

/**
 * Database operations for challenges
 */
export const challengeDb = {
  async create(challenge: Challenge): Promise<Challenge> {
    const result = await pool.query(
      `INSERT INTO challenges 
        (id, title, description, difficulty, language, buggy_code, expected_output, test_cases, time_limit, base_score, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        challenge.id,
        challenge.title,
        challenge.description,
        challenge.difficulty,
        challenge.language,
        challenge.buggyCode,
        challenge.expectedOutput,
        challenge.testCase ? JSON.stringify(challenge.testCase) : null,
        challenge.timeLimit,
        challenge.baseScore,
        challenge.createdAt || new Date(),
      ]
    );
    
    return this.mapRowToChallenge(result.rows[0]);
  },

  async findById(id: string): Promise<Challenge | null> {
    const result = await pool.query('SELECT * FROM challenges WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRowToChallenge(result.rows[0]) : null;
  },

  async getAll(): Promise<Challenge[]> {
    const result = await pool.query('SELECT * FROM challenges ORDER BY difficulty, title');
    return result.rows.map(row => this.mapRowToChallenge(row));
  },

  async update(id: string, updates: Partial<Challenge>): Promise<Challenge | null> {
    const challenge = await this.findById(id);
    if (!challenge) return null;

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.title) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.description) {
      fields.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.difficulty) {
      fields.push(`difficulty = $${paramIndex++}`);
      values.push(updates.difficulty);
    }

    if (fields.length === 0) return challenge;

    values.push(id);
    const result = await pool.query(
      `UPDATE challenges SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return this.mapRowToChallenge(result.rows[0]);
  },

  mapRowToChallenge(row: any): Challenge {
    // Handle test_cases - PostgreSQL may return it as object or string
    let testCase: TestCase | undefined;
    if (row.test_cases) {
      if (typeof row.test_cases === 'string') {
        testCase = JSON.parse(row.test_cases);
      } else {
        testCase = row.test_cases;
      }
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      difficulty: row.difficulty,
      language: row.language,
      buggyCode: row.buggy_code,
      expectedOutput: row.expected_output,
      timeLimit: row.time_limit,
      baseScore: row.base_score,
      testCase,
      createdAt: new Date(row.created_at),
    };
  },
};


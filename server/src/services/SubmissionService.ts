import { diffLines, Change } from 'diff';
import { 
  Submission, 
  Challenge, 
  User, 
  AIAnalysis, 
  DEFAULT_SCORING_CONFIG 
} from '@bugrank/shared';
import { BaseService, GeminiService } from './GeminiService';
import { challenges, submissions, users } from '@/data/storage';

/**
 * Service for handling code submissions (Run & Submit)
 * Follows Single Responsibility and Open/Closed Principles
 */
export class SubmissionService extends BaseService {
  private geminiService: GeminiService;

  constructor() {
    super();
    this.geminiService = new GeminiService();
  }

  /**
   * Handle "Run" button - Test code without scoring or attempt counting
   */
  async runCode(
    userId: string,
    challengeId: string,
    code: string
  ): Promise<{ aiAnalysis: AIAnalysis; feedback: string }> {
    this.logInfo('Running code (no scoring)', { userId, challengeId });

    const challenge = await this.getChallenge(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Perform AI analysis
    const aiAnalysis = await this.geminiService.analyzeCode(
      challenge.buggyCode,
      code,
      challenge.language
    );

    return {
      aiAnalysis,
      feedback: this.generateFeedback(aiAnalysis, false),
    };
  }

  /**
   * Handle "Submit" button - Full evaluation with scoring (only if correct)
   */
  async submitCode(
    userId: string,
    challengeId: string,
    code: string,
    timeTaken: number
  ): Promise<{
    submission: Submission;
    score?: number;
    aiAnalysis: AIAnalysis;
    message: string;
  }> {
    this.logInfo('Submitting code for evaluation', { userId, challengeId });

    const challenge = await this.getChallenge(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Get current user and their attempt count for this challenge
    const attempts = await this.getUserAttempts(userId, challengeId);
    const linesChanged = this.calculateLinesChanged(challenge.buggyCode, code);

    // Perform AI analysis
    const aiAnalysis = await this.geminiService.analyzeCode(
      challenge.buggyCode,
      code,
      challenge.language
    );

    // Check if solution is correct (AI accuracy >= threshold)
    const isCorrect = aiAnalysis.accuracyScore >= DEFAULT_SCORING_CONFIG.successThreshold;

    // Calculate score ONLY if correct
    let finalScore: number | undefined;
    if (isCorrect) {
      finalScore = this.calculateScore(
        challenge.baseScore,
        attempts + 1,
        linesChanged,
        timeTaken
      );
    }

    // Create submission document
    const submission: Submission = {
      id: `${userId}_${challengeId}_${Date.now()}`,
      userId,
      challengeId,
      code,
      linesChanged,
      attempts: attempts + 1,
      timeTaken,
      aiAccuracyScore: aiAnalysis.accuracyScore,
      isCorrect,
      score: finalScore,
      aiAnalysis,
      createdAt: new Date(),
    };

    // Save submission to memory
    submissions.set(submission.id, submission);

    // Update user stats if correct
    if (isCorrect && finalScore !== undefined) {
      await this.updateUserStats(userId, finalScore, true);
    } else {
      await this.updateUserStats(userId, 0, false);
    }

    return {
      submission,
      score: finalScore,
      aiAnalysis,
      message: this.generateFeedback(aiAnalysis, true),
    };
  }

  /**
   * Calculate lines changed using diff algorithm
   */
  private calculateLinesChanged(original: string, fixed: string): number {
    const diff: Change[] = diffLines(original, fixed);
    return diff.filter(part => part.added || part.removed).length;
  }

  /**
   * Calculate score using the penalty formula
   * Only called when solution is correct
   */
  private calculateScore(
    baseScore: number,
    attempts: number,
    linesChanged: number,
    timeTaken: number
  ): number {
    const score =
      baseScore -
      attempts * DEFAULT_SCORING_CONFIG.attemptPenalty -
      linesChanged * DEFAULT_SCORING_CONFIG.linePenalty -
      timeTaken * DEFAULT_SCORING_CONFIG.timePenalty;

    // Ensure score is not negative
    return Math.max(0, Math.round(score));
  }

  /**
   * Get challenge from memory
   */
  private async getChallenge(challengeId: string): Promise<Challenge | null> {
    return challenges.get(challengeId) || null;
  }

  /**
   * Get user's attempt count for a specific challenge
   */
  private async getUserAttempts(userId: string, challengeId: string): Promise<number> {
    let count = 0;
    submissions.forEach(submission => {
      if (submission.userId === userId && submission.challengeId === challengeId) {
        count++;
      }
    });
    return count;
  }

  /**
   * Get all submissions for a user
   */
  async getUserSubmissions(userId: string): Promise<Submission[]> {
    const userSubmissions: Submission[] = [];
    submissions.forEach(submission => {
      if (submission.userId === userId) {
        userSubmissions.push(submission);
      }
    });
    return userSubmissions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 50);
  }

  /**
   * Update user statistics
   */
  private async updateUserStats(
    userId: string,
    scoreEarned: number,
    isSuccess: boolean
  ): Promise<void> {
    let userData = users.get(userId);

    // Auto-create user if doesn't exist
    if (!userData) {
      this.logInfo('Creating new user profile', { userId });
      userData = {
        id: userId,
        email: 'demo@bugrank.com',
        displayName: 'Demo User',
        photoURL: undefined,
        createdAt: new Date(),
        totalScore: 0,
        totalSubmissions: 0,
        successfulSubmissions: 0,
      };
    }

    userData.totalScore += scoreEarned;
    userData.totalSubmissions += 1;
    if (isSuccess) {
      userData.successfulSubmissions += 1;
    }

    users.set(userId, userData);
    this.logInfo('User stats updated', { userId, totalScore: userData.totalScore, submissions: userData.totalSubmissions });
  }

  /**
   * Generate user-friendly feedback message
   */
  private generateFeedback(aiAnalysis: AIAnalysis, isSubmit: boolean): string {
    if (aiAnalysis.isCorrect) {
      return `Excellent work! ${aiAnalysis.feedback}`;
    } else {
      if (isSubmit) {
        return `Not quite right. ${aiAnalysis.feedback} Try again!`;
      } else {
        return `${aiAnalysis.feedback} Use 'Submit' when ready for evaluation.`;
      }
    }
  }
}

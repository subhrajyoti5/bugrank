import { diffLines, Change } from 'diff';
import { 
  Submission, 
  Challenge, 
  User, 
  AIAnalysis, 
  DEFAULT_SCORING_CONFIG 
} from '@bugrank/shared';
import { BaseService, GeminiService } from './GeminiService';
import { CompilerService } from './CompilerService';
import { submissionDb, userDb, challengeDb } from '@/data/storage';

/**
 * Service for handling code submissions (Run & Submit)
 * Follows Single Responsibility and Open/Closed Principles
 */
export class SubmissionService extends BaseService {
  private geminiService: GeminiService;
  private compilerService: CompilerService;

  constructor() {
    super();
    this.geminiService = new GeminiService();
    this.compilerService = new CompilerService();
  }

  /**
   * Handle "Run" button - Test code without scoring or attempt counting
   */
  async runCode(
    userId: string,
    challengeId: string,
    code: string,
    testInput?: string
  ): Promise<{ 
    compilerOutput: string;
    aiAnalysis?: AIAnalysis; 
    feedback?: string;
  }> {
    this.logInfo('Running code (no scoring)', { userId, challengeId });

    const challenge = await this.getChallenge(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Compile and run if C++
    if (challenge.language === 'cpp') {
      const input = testInput || '';
      const numChallengeId = typeof challengeId === 'string' ? parseInt(challengeId, 10) : challengeId;
      const result = await this.compilerService.compileAndRun(code, input, numChallengeId);
      const compilerOutput = this.compilerService.formatCompilerOutput(result.compilation, result.execution);
      
      this.compilerService.cleanup(numChallengeId);

      return {
        compilerOutput,
      };
    }

    // For non-C++ languages, use AI analysis
    const aiAnalysis = await this.geminiService.analyzeCode(
      challenge.buggyCode,
      code,
      challenge.language
    );

    return {
      compilerOutput: '',
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
    timeTaken: number,
    testInput?: string
  ): Promise<{
    submission: Submission;
    score?: number;
    aiAnalysis?: AIAnalysis;
    compilerOutput?: string;
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

    // Compile and run if C++
    let compilerOutput = '';
    let compilationSuccess = true;
    let testCaseOutput = '';
    let testCasePassed = true;
    
    if (challenge.language === 'cpp') {
      const numChallengeId = typeof challengeId === 'string' ? parseInt(challengeId, 10) : challengeId;
      
      // First run with test case input
      if (challenge.testCase) {
        const result = await this.compilerService.compileAndRun(code, challenge.testCase.input, numChallengeId);
        compilationSuccess = result.compilation.success && result.execution?.success;
        
        if (compilationSuccess) {
          testCasePassed = this.compilerService.validateOutput(
            result.execution!.output,
            challenge.testCase.expectedOutput
          );
          testCaseOutput = this.compilerService.formatOutputComparison(
            challenge.testCase.expectedOutput,
            result.execution!.output
          );
          
          if (!testCasePassed) {
            compilationSuccess = false;
          }
        } else {
          testCaseOutput = 'Test case compilation or execution failed';
          testCasePassed = false;
        }
        
        compilerOutput = this.compilerService.formatCompilerOutput(result.compilation, result.execution);
      } else {
        // No test case, just run normally
        const result = await this.compilerService.compileAndRun(code, testInput || '', numChallengeId);
        compilationSuccess = result.compilation.success && result.execution?.success;
        compilerOutput = this.compilerService.formatCompilerOutput(result.compilation, result.execution);
      }
      
      this.compilerService.cleanup(numChallengeId);
    }

    // Perform AI analysis
    const aiAnalysis = await this.geminiService.analyzeCode(
      challenge.buggyCode,
      code,
      challenge.language
    );

    // Check if solution is correct
    // For C++ with test cases: prioritize test case validation
    // For others or C++ without test cases: use AI analysis
    let isCorrect = false;
    if (challenge.language === 'cpp' && challenge.testCase) {
      // If test case exists and passes, that's the primary validation
      isCorrect = compilationSuccess && testCasePassed;
    } else {
      // Fall back to AI analysis for non-C++ or when no test case exists
      isCorrect = aiAnalysis.accuracyScore >= DEFAULT_SCORING_CONFIG.successThreshold && compilationSuccess;
    }

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

    // Save submission to database
    await submissionDb.create(submission);

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
      compilerOutput,
      testCaseOutput,
      testCasePassed,
      message: isCorrect 
        ? `✅ Bug fixed correctly! Score: ${finalScore}` 
        : `⚠️ Bug not fully fixed yet. Try again!`,
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
   * Get challenge from database
   */
  private async getChallenge(challengeId: string): Promise<Challenge | null> {
    return await challengeDb.findById(challengeId);
  }

  /**
   * Get user's attempt count for a specific challenge
   */
  private async getUserAttempts(userId: string, challengeId: string): Promise<number> {
    const userSubmissions = await submissionDb.findByUserAndChallenge(userId, challengeId);
    return userSubmissions.length;
  }

  /**
   * Get all submissions for a user
   */
  async getUserSubmissions(userId: string): Promise<Submission[]> {
    const userSubmissions = await submissionDb.findByUserId(userId);
    return userSubmissions.slice(0, 50);
  }

  /**
   * Update user statistics
   */
  private async updateUserStats(
    userId: string,
    scoreEarned: number,
    isSuccess: boolean
  ): Promise<void> {
    let userData = await userDb.findById(userId);

    // User should already exist (authenticated)
    if (!userData) {
      this.logWarning('User not found in database', { userId });
      return;
    }

    // Update stats
    await userDb.update(userId, {
      totalScore: userData.totalScore + scoreEarned,
      totalSubmissions: userData.totalSubmissions + 1,
      successfulSubmissions: userData.successfulSubmissions + (isSuccess ? 1 : 0),
    });
    
    this.logInfo('User stats updated', { 
      userId, 
      totalScore: userData.totalScore + scoreEarned, 
      submissions: userData.totalSubmissions + 1 
    });
  }

  /**
   * Generate user-friendly feedback message
   */
  private generateFeedback(aiAnalysis: AIAnalysis, isSubmit: boolean): string {
    // For submit: return simple success/failure message
    // Detailed feedback is shown via compiler output or AI analysis
    if (isSubmit) {
      return aiAnalysis.isCorrect 
        ? `✅ Bug fixed correctly!` 
        : `⚠️ Bug not fully fixed yet. Try again!`;
    }
    
    // For run: return simple message
    return aiAnalysis.isCorrect 
      ? `✅ Code looks good! Use Submit to score.`
      : `⚠️ Bug still present. Keep trying!`;
  }
}

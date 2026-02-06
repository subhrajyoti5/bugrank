"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionService = void 0;
const diff_1 = require("diff");
const shared_1 = require("@bugpulse/shared");
const GeminiService_1 = require("./GeminiService");
const CompilerService_1 = require("./CompilerService");
const ExecutionService_1 = require("./ExecutionService");
const storage_1 = require("@/data/storage");
/**
 * Service for handling code submissions (Run & Submit)
 * Follows Single Responsibility and Open/Closed Principles
 */
class SubmissionService extends GeminiService_1.BaseService {
    constructor() {
        super();
        this.geminiService = new GeminiService_1.GeminiService();
        this.compilerService = new CompilerService_1.CompilerService();
    }
    /**
     * Handle "Run" button - Test code with execution + AI analysis (FREE)
     * Now uses self-hosted execution instead of just AI
     */
    async runCode(userId, challengeId, code, testInput) {
        this.logInfo('Running code with self-hosted execution + AI analysis', { userId, challengeId });
        const challenge = await this.getChallenge(challengeId);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        let compilerOutput = '';
        // For C++, run actual execution (self-hosted - FREE)
        if (challenge.language === 'cpp') {
            const executionResult = await ExecutionService_1.ExecutionService.executeCode(code, testInput || challenge.testCase?.input || '');
            compilerOutput = this.formatExecutionOutput(executionResult);
        }
        // Use AI analysis for additional insights - FREE
        const aiAnalysis = await this.geminiService.analyzeCode(challenge.buggyCode, code, challenge.language);
        // Combine execution output with AI feedback
        const feedback = this.generateFeedback(aiAnalysis, false);
        if (!compilerOutput) {
            compilerOutput = `🤖 AI Code Analysis (Test Mode)\n\n${feedback}`;
        }
        else {
            compilerOutput += `\n\n🤖 AI Insights:\n${aiAnalysis.feedback}`;
        }
        return {
            compilerOutput,
            aiAnalysis,
            feedback,
        };
    }
    /**
     * Handle "Submit" button - Full evaluation with scoring using Judge0 API (PAID)
     * Uses Judge0 for actual compilation with fallback to local
     */
    async submitCode(userId, challengeId, code, timeTaken, testInput) {
        this.logInfo('Submitting code for evaluation (Judge0 API)', { userId, challengeId });
        const challenge = await this.getChallenge(challengeId);
        if (!challenge) {
            throw new Error('Challenge not found');
        }
        // Get current user and their attempt count for this challenge
        const attempts = await this.getUserAttempts(userId, challengeId);
        const linesChanged = this.calculateLinesChanged(challenge.buggyCode, code);
        // Compile and run if C++ using self-hosted execution (FREE)
        let compilerOutput = '';
        let compilationSuccess = true;
        let testCaseOutput = '';
        let testCasePassed = true;
        console.log(`🔍 Challenge language: ${challenge.language}`);
        console.log(`🔍 Has test case: ${!!challenge.testCase}`);
        console.log(`🔍 Test case:`, challenge.testCase);
        if (challenge.language === 'cpp') {
            // Run with test case input using ExecutionService (self-hosted - $0)
            if (challenge.testCase) {
                console.log(`🚀 Calling ExecutionService.executeCode with input: "${challenge.testCase.input}"`);
                const executionResult = await ExecutionService_1.ExecutionService.executeCode(code, challenge.testCase.input);
                console.log(`🎯 Execution result:`, executionResult);
                // Map execution result to compiler result format
                compilationSuccess = executionResult.status !== 'CE' && executionResult.status !== 'SE';
                if (compilationSuccess) {
                    // Check if output matches expected
                    testCasePassed = ExecutionService_1.ExecutionService.compareOutput(executionResult.stdout, challenge.testCase.expectedOutput);
                    testCaseOutput = `Expected Output:\n${challenge.testCase.expectedOutput}\n\nActual Output:\n${executionResult.stdout}`;
                    if (!testCasePassed) {
                        compilationSuccess = false;
                    }
                }
                else {
                    testCaseOutput = 'Test case compilation or execution failed';
                    testCasePassed = false;
                }
                // Format compiler output
                compilerOutput = this.formatExecutionOutput(executionResult);
            }
            else {
                // No test case, just run normally
                const executionResult = await ExecutionService_1.ExecutionService.executeCode(code, testInput || '');
                compilationSuccess = executionResult.status !== 'CE' && executionResult.status !== 'SE';
                compilerOutput = this.formatExecutionOutput(executionResult);
            }
        }
        // Perform AI analysis for additional insights
        const aiAnalysis = await this.geminiService.analyzeCode(challenge.buggyCode, code, challenge.language);
        // Check if solution is correct
        // For C++ with test cases: prioritize test case validation
        // For others or C++ without test cases: use AI analysis
        let isCorrect = false;
        if (challenge.language === 'cpp' && challenge.testCase) {
            // If test case exists and passes, that's the primary validation
            isCorrect = compilationSuccess && testCasePassed;
        }
        else {
            // Fall back to AI analysis for non-C++ or when no test case exists
            isCorrect = aiAnalysis.accuracyScore >= shared_1.DEFAULT_SCORING_CONFIG.successThreshold && compilationSuccess;
        }
        // Calculate score ONLY if correct
        let finalScore;
        if (isCorrect) {
            finalScore = this.calculateScore(challenge.baseScore, attempts + 1, linesChanged, timeTaken);
        }
        // Create submission document
        const submission = {
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
        await storage_1.submissionDb.create(submission);
        // Update user stats if correct
        if (isCorrect && finalScore !== undefined) {
            await this.updateUserStats(userId, finalScore, true);
        }
        else {
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
    calculateLinesChanged(original, fixed) {
        const diff = (0, diff_1.diffLines)(original, fixed);
        return diff.filter(part => part.added || part.removed).length;
    }
    /**
     * Calculate score using the penalty formula
     * Only called when solution is correct
     */
    calculateScore(baseScore, attempts, linesChanged, timeTaken) {
        // Convert time from seconds to minutes for penalty calculation
        const timeInMinutes = timeTaken / 60;
        const score = baseScore -
            attempts * shared_1.DEFAULT_SCORING_CONFIG.attemptPenalty -
            linesChanged * shared_1.DEFAULT_SCORING_CONFIG.linePenalty -
            timeInMinutes * shared_1.DEFAULT_SCORING_CONFIG.timePenalty;
        // Ensure score is not negative
        return Math.max(0, Math.round(score));
    }
    /**
     * Get challenge from database
     */
    async getChallenge(challengeId) {
        return await storage_1.challengeDb.findById(challengeId);
    }
    /**
     * Get user's attempt count for a specific challenge
     */
    async getUserAttempts(userId, challengeId) {
        const userSubmissions = await storage_1.submissionDb.findByUserAndChallenge(userId, challengeId);
        return userSubmissions.length;
    }
    /**
     * Get all submissions for a user
     */
    async getUserSubmissions(userId) {
        const userSubmissions = await storage_1.submissionDb.findByUserId(userId);
        return userSubmissions.slice(0, 50);
    }
    /**
     * Update user statistics
     */
    async updateUserStats(userId, scoreEarned, isSuccess) {
        let userData = await storage_1.userDb.findById(userId);
        // User should already exist (authenticated)
        if (!userData) {
            this.logWarning('User not found in database', { userId });
            return;
        }
        // Update stats
        await storage_1.userDb.update(userId, {
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
    generateFeedback(aiAnalysis, isSubmit) {
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
    /**
     * Format execution result output (replaces CompilerService formatting)
     */
    formatExecutionOutput(result) {
        let output = '';
        // Status indicator
        switch (result.status) {
            case 'AC':
            case 'WA':
                output += `✅ Compilation: Success\n`;
                output += `✅ Execution: Completed\n\n`;
                if (result.stdout) {
                    output += `📤 Output:\n${result.stdout}\n`;
                }
                break;
            case 'CE':
                output += `❌ Compilation: Failed\n\n`;
                output += `📋 Compilation Errors:\n${result.compilationError || result.stderr || 'Unknown compilation error'}\n`;
                break;
            case 'TLE':
                output += `⏱️ Time Limit Exceeded\n\n`;
                output += `Your code took too long to execute (>5 seconds)\n`;
                if (result.stderr) {
                    output += `\n📋 Error Output:\n${result.stderr}\n`;
                }
                break;
            case 'RE':
                output += `💥 Runtime Error\n\n`;
                output += `Your code crashed during execution\n`;
                if (result.stderr) {
                    output += `\n📋 Error Output:\n${result.stderr}\n`;
                }
                break;
            case 'SE':
                output += `⚠️ System Error\n\n`;
                output += `An error occurred during execution. Please try again.\n`;
                if (result.stderr) {
                    output += `\n📋 Error Details:\n${result.stderr}\n`;
                }
                break;
        }
        return output;
    }
}
exports.SubmissionService = SubmissionService;

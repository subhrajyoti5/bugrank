export interface User {
    id: string;
    email: string;
    displayName: string;
    username?: string;
    photoURL?: string;
    createdAt: Date;
    totalScore: number;
    totalSubmissions: number;
    successfulSubmissions: number;
}
export interface TestCase {
    input: string;
    expectedOutput: string;
}
export interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    language: 'cpp' | 'java';
    buggyCode: string;
    expectedOutput: string;
    timeLimit: number;
    baseScore: number;
    testCase?: TestCase;
    createdAt: Date;
}
export interface Submission {
    id: string;
    userId: string;
    challengeId: string;
    code: string;
    diff?: string;
    attemptNumber: number;
    timeTaken: number;
    codeQuality: number;
    isCorrect: boolean;
    pointsEarned?: number;
    analysis: AIAnalysis;
    submittedAt: Date;
}
export interface AIAnalysis {
    accuracyScore: number;
    timeComplexity: string;
    spaceComplexity: string;
    feedback: string;
    isCorrect: boolean;
}
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    displayName: string;
    photoURL?: string;
    totalScore: number;
    successfulSubmissions: number;
    lastUpdated: Date;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export declare enum SubmissionType {
    RUN = "RUN",// No scoring, no attempt count
    SUBMIT = "SUBMIT"
}
export interface RunResult {
    aiAnalysis?: AIAnalysis;
    feedback?: string;
    compilerOutput?: string;
    testCaseOutput?: string;
    testCasePassed?: boolean;
}
export interface SubmitResult {
    submission: Submission;
    score?: number;
    aiAnalysis?: AIAnalysis;
    compilerOutput?: string;
    testCaseOutput?: string;
    testCasePassed?: boolean;
    message: string;
}
export interface ScoringConfig {
    baseScore: number;
    attemptPenalty: number;
    linePenalty: number;
    timePenalty: number;
    successThreshold: number;
}
export declare const DEFAULT_SCORING_CONFIG: ScoringConfig;

// User types
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

// Test Case types
export interface TestCase {
  input: string;
  expectedOutput: string;
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'cpp' | 'java';
  buggyCode: string;
  expectedOutput: string;
  timeLimit: number; // seconds
  baseScore: number;
  testCase?: TestCase; // Hidden test case for validation
  createdAt: Date;
}

// Submission types
export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  diff?: string;
  attemptNumber: number;
  timeTaken: number; // seconds
  codeQuality: number;
  isCorrect: boolean;
  pointsEarned?: number;
  analysis: AIAnalysis;
  submittedAt: Date;
}

// AI Analysis types
export interface AIAnalysis {
  accuracyScore: number; // 1-10
  timeComplexity: string;
  spaceComplexity: string;
  feedback: string;
  isCorrect: boolean;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  photoURL?: string;
  totalScore: number;
  successfulSubmissions: number;
  lastUpdated: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Run vs Submit types
export enum SubmissionType {
  RUN = 'RUN', // No scoring, no attempt count
  SUBMIT = 'SUBMIT' // Full evaluation with scoring
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

// Scoring config
export interface ScoringConfig {
  baseScore: number;
  attemptPenalty: number;
  linePenalty: number;
  timePenalty: number; // per minute
  successThreshold: number; // AI accuracy minimum (e.g., 8)
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  baseScore: 100,
  attemptPenalty: 5,
  linePenalty: 1,
  timePenalty: 0.1,
  successThreshold: 8
};

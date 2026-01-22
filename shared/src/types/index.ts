// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  totalScore: number;
  totalSubmissions: number;
  successfulSubmissions: number;
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
  createdAt: Date;
}

// Submission types
export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  linesChanged: number;
  attempts: number;
  timeTaken: number; // seconds
  aiAccuracyScore: number; // 1-10
  isCorrect: boolean;
  score?: number; // Only set if correct
  aiAnalysis: AIAnalysis;
  createdAt: Date;
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
  aiAnalysis: AIAnalysis;
  feedback: string;
}

export interface SubmitResult {
  submission: Submission;
  score?: number;
  aiAnalysis: AIAnalysis;
  message: string;
}

// Scoring config
export interface ScoringConfig {
  baseScore: number;
  attemptPenalty: number;
  linePenalty: number;
  timePenalty: number; // per second
  successThreshold: number; // AI accuracy minimum (e.g., 8)
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  baseScore: 100,
  attemptPenalty: 5,
  linePenalty: 1,
  timePenalty: 0.1,
  successThreshold: 8
};

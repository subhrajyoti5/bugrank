import { Challenge, Submission, User } from '@bugrank/shared';

/**
 * Shared in-memory storage for all services
 * This ensures challenges loaded in routes are accessible in services
 */
export const challenges: Map<string, Challenge> = new Map();
export const submissions: Map<string, Submission> = new Map();
export const users: Map<string, User> = new Map();

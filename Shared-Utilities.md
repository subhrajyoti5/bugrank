# BugPulse - Shared Utilities Technology Stack

## Overview
The shared package provides common TypeScript types, interfaces, and utilities used across the client and server applications. It ensures type safety and consistency throughout the monorepo.

## Package Structure

### TypeScript Configuration
- **Purpose**: Type-safe shared code between frontend and backend
- **Build Output**: Both CommonJS and ES modules
- **Declaration Files**: TypeScript declaration files for IDE support

## Core Type Definitions

### User Types
```typescript
interface User {
  id: number;
  email: string;
  displayName?: string;
  photoUrl?: string;
  totalScore: number;
  totalSubmissions: number;
  successfulSubmissions: number;
  profileData: Record<string, any>;
}
```

### Authentication Types
```typescript
interface AuthToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}
```

### Challenge Types
```typescript
interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  baseScore: number;
  category: string;
  testCases: TestCase[];
}

interface TestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}
```

### Submission Types
```typescript
interface Submission {
  id: string;
  userId: number;
  challengeId: string;
  code: string;
  diff?: string;
  attemptNumber: number;
  timeTaken: number;
  codeQuality: number;
  isCorrect: boolean;
  pointsEarned: number;
  analysis?: AnalysisResult;
  submittedAt: Date;
}

interface AnalysisResult {
  aiFeedback?: string;
  compilationErrors?: string[];
  runtimeErrors?: string[];
  testResults?: TestResult[];
}
```

### Leaderboard Types
```typescript
interface LeaderboardEntry {
  userId: number;
  displayName: string;
  totalScore: number;
  successfulSubmissions: number;
  averageTime: number;
  rank: number;
}

interface UserStats {
  totalScore: number;
  totalSubmissions: number;
  successfulSubmissions: number;
  averageTime: number;
  bestStreak: number;
  currentStreak: number;
}
```

## API Response Types

### Generic API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

### Specific API Responses
- **AuthResponse**: Login/register result with user data and token
- **ChallengeResponse**: Challenge details with test cases
- **SubmissionResponse**: Submission result with analysis
- **LeaderboardResponse**: Paginated leaderboard data

## Utility Functions

### Type Guards
```typescript
function isUser(obj: any): obj is User
function isChallenge(obj: any): obj is Challenge
function isSubmission(obj: any): obj is Submission
```

### Validation Helpers
```typescript
function validateEmail(email: string): boolean
function validatePassword(password: string): boolean
function sanitizeCodeInput(code: string): string
```

### Data Transformation
```typescript
function formatTime(milliseconds: number): string
function calculateScore(time: number, quality: number, difficulty: string): number
function generateSubmissionId(): string
```

## Constants and Enums

### Difficulty Levels
```typescript
enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}
```

### Challenge Categories
```typescript
enum ChallengeCategory {
  MEMORY_LEAK = 'memory-leak',
  BUFFER_OVERFLOW = 'buffer-overflow',
  INTEGER_OVERFLOW = 'integer-overflow',
  CONST_CORRECTNESS = 'const-correctness'
}
```

### API Endpoints
```typescript
enum ApiEndpoints {
  AUTH_LOGIN = '/api/auth/login',
  AUTH_REGISTER = '/api/auth/register',
  CHALLENGES = '/api/challenges',
  SUBMISSIONS = '/api/submissions',
  LEADERBOARD = '/api/leaderboard'
}
```

## Error Types

### Custom Error Classes
```typescript
class ValidationError extends Error {
  field: string;
  code: string;
}

class AuthenticationError extends Error {
  code: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'UNAUTHORIZED';
}

class ApiError extends Error {
  statusCode: number;
  endpoint: string;
}
```

## Configuration Types

### Environment Configuration
```typescript
interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'test';
  features: FeatureFlags;
}

interface FeatureFlags {
  aiAnalysis: boolean;
  realTimeExecution: boolean;
  leaderboard: boolean;
}
```

## Build and Distribution

### Package Configuration
- **Main Entry**: `dist/index.js`
- **Types Entry**: `dist/index.d.ts`
- **Module Formats**: CommonJS and ES modules
- **Dependencies**: Zero runtime dependencies (pure types)

### Build Process
- **TypeScript Compilation**: Strict mode compilation
- **Output Cleaning**: Clean dist directory before build
- **Source Maps**: Development build with source maps

## Usage in Client and Server

### Client Integration
```typescript
import { User, Challenge, ApiResponse } from '@bugpulse/shared';

interface ComponentProps {
  user: User;
  challenges: Challenge[];
}
```

### Server Integration
```typescript
import { User, Submission, validateEmail } from '@bugpulse/shared';

function createUser(data: Partial<User>): User {
  if (!validateEmail(data.email!)) {
    throw new ValidationError('Invalid email');
  }
  // ... implementation
}
```

## Type Safety Benefits

### Compile-Time Validation
- **API Contracts**: Enforced request/response shapes
- **Data Models**: Consistent data structures across applications
- **Error Handling**: Typed error responses

### Development Experience
- **IntelliSense**: Full IDE support and autocompletion
- **Refactoring**: Safe code changes across the monorepo
- **Documentation**: Self-documenting code through types

## Future Enhancements

### Advanced Types
- **Generic API Types**: More flexible response typing
- **Union Types**: Better error handling with discriminated unions
- **Branded Types**: Type-safe IDs and tokens

### Utility Libraries
- **Date Helpers**: Consistent date formatting and parsing
- **String Utilities**: Code formatting and sanitization
- **Math Helpers**: Scoring algorithm utilities

### Runtime Validation
- **Schema Validation**: Runtime type checking with Zod or similar
- **API Validation**: Request/response validation middleware
- **Data Sanitization**: Input cleaning and XSS prevention

### Code Generation
- **API Client Generation**: Automatic client code from types
- **Database Types**: Generated types from database schema
- **Mock Data**: Type-safe test data generation

## Maintenance and Evolution

### Version Management
- **Semantic Versioning**: Breaking changes in major versions
- **Backward Compatibility**: Gradual migration paths
- **Deprecation Notices**: Clear migration timelines

### Testing
- **Type Tests**: Ensure type correctness
- **Utility Tests**: Validate helper functions
- **Integration Tests**: Cross-package compatibility

### Documentation
- **Type Documentation**: JSDoc comments on all exports
- **Usage Examples**: Code samples for common patterns
- **Migration Guides**: Breaking change documentation

This shared utilities package forms the foundation of type safety and consistency across the BugPulse platform, enabling reliable development and maintenance of both frontend and backend codebases.</content>
<parameter name="filePath">c:\Users\subhr\OneDrive\Desktop\Bigpulse\Shared-Utilities.md
# BugPulse - Backend Technology Stack

## Overview
The backend is a Node.js/Express API server that handles authentication, challenge management, code execution, and leaderboard functionality. It's built with TypeScript for type safety and scalability.

## Runtime Environment
### Node.js (LTS)
- **Purpose**: JavaScript runtime for server-side development
- **Version**: Compatible with Node.js 18+ (based on dependencies)
- **Key Features Used**:
  - ES modules support
  - Async/await for asynchronous operations
  - Built-in modules (fs, path, crypto)

## Web Framework
### Express.js 4.18.2
- **Purpose**: Minimalist web framework for Node.js
- **Architecture**: RESTful API design
- **Middleware Stack**:
  - CORS handling
  - JSON parsing
  - Security headers (Helmet)
  - Rate limiting
  - Authentication middleware

## Type Safety
### TypeScript 5.3.3
- **Purpose**: Compile-time type checking and enhanced developer experience
- **Configuration**: Strict mode with custom tsconfig
- **Benefits**:
  - API contract enforcement
  - Refactoring safety
  - IDE support and autocompletion

## Database
### PostgreSQL 15.x with pg 8.17.2
- **Purpose**: Relational database for persistent data storage
- **Features Used**:
  - JSONB for flexible user profile data
  - Connection pooling
  - Parameterized queries for SQL injection prevention
- **Schema**: Tables for users, sessions, challenges, submissions

## Authentication & Security
### JWT (jsonwebtoken 9.0.3)
- **Purpose**: Stateless authentication tokens
- **Implementation**: 24-hour session tokens
- **Security**: Proper token validation and refresh mechanisms

### bcryptjs 3.0.3
- **Purpose**: Password hashing for secure credential storage
- **Configuration**: Salt rounds for computational security

### Helmet 7.1.0
- **Purpose**: Security middleware for setting HTTP headers
- **Headers Set**: Content Security Policy, HSTS, X-Frame-Options, etc.

## API Development
### Express Rate Limit 7.5.1
- **Purpose**: API rate limiting to prevent abuse
- **Configuration**:
  - 15 requests per 15 minutes (general)
  - 30 requests per 5 minutes (stricter windows)
- **Storage**: Memory-based (suitable for single instance)

### CORS 2.8.5
- **Purpose**: Cross-Origin Resource Sharing configuration
- **Configuration**: Allows frontend origin in development/production

## Code Execution Services
### ExecutionService (Self-hosted)
- **Purpose**: In-house code compilation and execution service
- **Platform**: VPS-hosted on Hostinger KVM (Ubuntu)
- **Languages Supported**: C++ (GCC 9.2.0+)
- **Features**:
  - SHA-256 result caching (1-hour TTL)
  - Job directory management (/srv/bugpulse/jobs)
  - Runner script execution (run_cpp.sh)
  - Resource limits (5s CPU, 256MB memory)
  - Isolated executor user with network blocking
- **Usage**: Both "Run" and "Submit" - completely free

### Google Gemini AI (@google/generative-ai 0.1.3)
- **Purpose**: AI-powered code analysis for instant feedback
- **Usage**: "Run" functionality - free, instant code analysis
- **Integration**: REST API calls to Google AI services

## Development Tools
### ESLint 8.55.0 with TypeScript
- **Purpose**: Code quality and style enforcement
- **Configuration**: TypeScript-specific rules and best practices

### Jest 29.7.0
- **Purpose**: Unit testing framework
- **Configuration**: TypeScript support with tsx
- **Coverage**: Future consideration for test coverage reporting

### tsx 4.7.0
- **Purpose**: TypeScript execution and REPL
- **Usage**: Development server with hot reloading

## Project Structure
```
server/
├── src/
│   ├── config/         # Database and external service configuration
│   ├── data/           # Database operations and seed data
│   ├── middleware/     # Express middleware functions
│   ├── routes/         # API route handlers
│   ├── services/       # Business logic and external integrations
│   └── index.ts        # Application entry point
├── migrations/         # Database schema migrations
└── Configuration files # package.json, tsconfig.json, etc.
```

## Key Services Architecture
### AuthService
- User registration and login
- JWT token generation and validation
- Password hashing and verification

### SubmissionService
- Execution orchestration (self-hosted)
- Test case validation
- Scoring algorithm implementation
- AI analysis integration
- Output comparison and diff calculation

### ExecutionService
- Self-hosted C++ code execution
- SHA-256 result caching (1-hour TTL)
- Job directory management (/srv/bugpulse/jobs)
- Status mapping (CE, TLE, RE, AC, WA, SE)
- Error handling and cleanup
- Mutex-based execution queue
- Runner script invocation

### GeminiService
- AI code analysis integration
- Response parsing and error handling
- Fallback mechanisms

### UsageTracker
- Execution monitoring and metrics
- Cache performance tracking
- Resource usage monitoring

## Environment Configuration
### dotenv 16.3.1
- **Purpose**: Environment variable management
- **Configuration**: Separate .env files for different environments
- **Security**: Sensitive keys and database credentials

## Error Handling
### Custom Error Handler Middleware
- Centralized error processing
- Appropriate HTTP status codes
- Error logging and user-friendly messages

## Performance Considerations
- **Database Connection Pooling**: Efficient connection management
- **Rate Limiting**: Prevents server overload
- **Result Caching**: SHA-256-based execution result caching (1-hour TTL)
- **Horizontal Scaling**: Stateless design supports multiple instances
- **Resource Optimization**: OS-level execution limits (CPU, memory, time)
- **Docker Containerization**: Isolated execution environment
- **Execution Queue**: Mutex-based sequential execution

## Deployment Considerations
- **Containerization**: Docker-based deployment
- **VPS Infrastructure**: Hostinger KVM with Ubuntu
- **Process Management**: Docker container lifecycle management
- **Environment Variables**: .env file with NODE_ENV=production
- **Database Migrations**: Manual SQL execution on VPS
- **Health Checks**: /health endpoint
- **Security Hardening**: 
  - Isolated executor user inside container
  - Network blocking for executor user
  - Resource limits (ulimit)
  - Runner script with sudo isolation

## Future Enhancements
- **Multi-language Support**: Java, Python, C execution
- **Queue-based Execution**: Parallel job processing
- **Docker/Podman**: Enhanced container isolation
- **GraphQL API**: Consider for complex data fetching
- **Redis Caching**: For session storage and performance
- **API Versioning**: For backward compatibility
- **Monitoring**: Application Performance Monitoring (APM)
- **Database Optimization**: Query optimization and indexing strategy</content>
<parameter name="filePath">c:\Users\subhr\OneDrive\Desktop\Bigpulse\Backend-Tech-Stack.md
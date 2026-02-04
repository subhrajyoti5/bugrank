# BugPulse - AI and External Services Technology Stack

## Overview
BugPulse integrates AI technology and self-hosted code execution to provide code analysis, execution, and validation capabilities. The system now uses a fully self-hosted execution pipeline, eliminating external API dependencies and costs.

## Primary AI Service

### Google Gemini AI (@google/generative-ai 0.1.3)
- **Purpose**: AI-powered code analysis for instant feedback
- **Provider**: Google DeepMind's Gemini models
- **Integration**: REST API via Google AI SDK
- **Usage Context**: "Run" and "Submit" functionality - AI-assisted analysis

#### Key Features
- **Code Review**: Automated code quality assessment
- **Bug Detection**: AI-powered static analysis
- **Performance Analysis**: Code efficiency suggestions
- **Best Practices**: Coding standard recommendations

#### Technical Implementation
- **API Endpoint**: Google AI Generative Language API
- **Authentication**: API key-based authentication
- **Request Format**: Structured prompts with code context
- **Response Parsing**: JSON response handling and error management

#### Cost Structure
- **Free Tier**: Generous free usage for development
- **Pay-per-Use**: Token-based pricing for production
- **Rate Limits**: API quota management

## Code Execution Service

### Self-Hosted Execution System (NEW)
- **Purpose**: Local code compilation and execution
- **Provider**: Self-managed VPS infrastructure
- **Integration**: Direct OS-level execution via ExecutionService
- **Usage Context**: Both "Run" and "Submit" functionality - $0 cost per execution

#### Supported Languages
- **Primary**: C++ (GCC 9.2.0+, C++17 standard)
- **Future**: Java, Python, C (planned)
- **Configuration**: Compiler flags optimized for education/debugging
- **Execution Environment**: Isolated user context with resource limits

#### Technical Implementation
- **Architecture**:
  - ExecutionService (TypeScript/Node.js)
  - Bash runner scripts (`/srv/bugpulse/runner/run_cpp.sh`)
  - Isolated executor user with network blocking
  - OS-level resource limits (CPU, memory, time)
  
- **Security Features**:
  - Dedicated execution user (non-root)
  - Network access disabled via iptables
  - Resource limits: 5s CPU, 256MB memory
  - Separate job directories per submission
  - Automatic cleanup of old executions

- **Cache System**:
  - SHA-256-based result caching
  - 1-hour TTL (Time To Live)
  - In-memory cache with automatic expiry
  - Cache cleanup every 10 minutes

#### Cost Structure
- **Infrastructure**: Fixed VPS cost (already paid)
- **Per-Execution**: $0 (no external API fees)
- **Annual Savings**: ~$170 for 100k submissions vs Judge0
- **Maintenance**: Minimal (automated cleanup)

## Hybrid Execution Strategy

### Architecture Overview
```
User Code Input
├── "Run" (Execution + AI Analysis)
│   ├── ExecutionService (self-hosted)
│   ├── Gemini AI Service (analysis)
│   ├── Instant feedback
│   └── Cost: $0 for execution
└── "Submit" (Full Validation + Scoring)
    ├── ExecutionService (self-hosted)
    ├── Test case validation
    ├── Gemini AI (quality analysis)
    └── Score calculation

Both operations now use self-hosted execution!
```

### Decision Logic
- **Run**: Quick feedback, execution + AI suggestions, unlimited usage
- **Submit**: Official scoring, test case validation, unlimited usage
- **Cost**: $0 per execution for both operations

### Fallback Mechanisms
- **Execution Errors**: Detailed error reporting (CE, TLE, RE, SE)
- **AI Service Down**: Graceful degradation to execution-only results
- **Resource Limits**: User-friendly error messages with retry suggestions

## External Service Integration

### Axios HTTP Client (1.13.3)
- **Purpose**: HTTP client for AI service calls
- **Configuration**:
  - Base URLs for Gemini API
  - Authentication headers
  - Timeout configurations
  - Retry logic for transient failures

### Service Configuration
#### Environment Variables
- `GEMINI_API_KEY`: Google AI service authentication
- ~~`RAPIDAPI_KEY`: Removed (no longer needed)~~
- ~~`RAPIDAPI_HOST`: Removed (no longer needed)~~

#### Service Classes
- **GeminiService**: AI analysis integration
- **ExecutionService**: Self-hosted code execution (NEW)
- ~~**Judge0Service**: Removed~~
- ~~**CompilerService**: Removed~~

## Usage Tracking and Cost Management

### UsageTracker Service
- **Purpose**: Monitor system usage and performance
- **Features**:
  - Execution count tracking
  - Cache hit rate monitoring
  - Error rate analysis
  - Performance metrics
  - Disk usage monitoring

#### Metrics Tracked
- **AI Requests**: Gemini API call volume
- **Execution Requests**: Self-hosted submission count
- **Cache Performance**: Hit/miss ratios
- **Error Rates**: Failed execution percentages
- **Response Times**: Execution performance monitoring
- **Resource Usage**: Disk space, CPU usage

## Security and Compliance

### Data Privacy
- **Code Transmission**: Local execution (no external transmission)
- **Data Retention**: Configurable job directory cleanup
- **User Privacy**: Code never leaves VPS infrastructure

### Execution Security
- **Isolation**: Dedicated executor user
- **Network Blocking**: No outbound connections allowed
- **Resource Limits**: CPU time, memory, process limits
- **Input Validation**: Code sanitization before execution
- **Output Filtering**: Clean execution results

## Performance Optimization

### Caching Strategies
- **Result Caching**: SHA-256 hash-based deduplication
- **Cache Duration**: 1-hour TTL
- **Cache Cleanup**: Automatic expiry management
- **Result Memoization**: Avoid duplicate compilations

### Asynchronous Processing
- **Non-blocking Calls**: Async/await for execution
- **Timeout Handling**: 12-second total timeout (compile + run)
- **Queue System**: Sequential job processing (future: parallel)

## Error Handling and Resilience

### Service Degradation
- **Graceful Fallbacks**: Clear error messages on failures
- **User Communication**: Status-specific feedback (CE, TLE, RE, SE)
- **Monitoring Alerts**: Disk space, process monitoring

### Error Types Handled
- **Compilation Errors (CE)**: Syntax errors, linker failures
- **Time Limit Exceeded (TLE)**: Execution timeout (5s)
- **Runtime Errors (RE)**: Crashes, segfaults, exceptions
- **System Errors (SE)**: Infrastructure issues

## Future Enhancements

### Advanced Execution Features
- **Multi-language Support**: Java, Python, C
- **Parallel Execution**: Queue-based worker system
- **Docker/Podman**: Enhanced isolation
- **Real-time Progress**: Live execution status
- **Performance Profiling**: Detailed execution metrics

### Alternative AI Services
- **OpenAI GPT**: Code analysis and explanation
- **GitHub Copilot**: Code completion integration
- **Anthropic Claude**: Advanced reasoning capabilities
- **Local AI Models**: Self-hosted for privacy/cost

### Enhanced Security
- **Container Isolation**: Docker/Podman sandboxing
- **SELinux/AppArmor**: Additional security layers
- **Resource Quotas**: Per-user execution limits
- **Audit Logging**: Comprehensive execution logs

## Cost Optimization Achieved

### Current Savings
- **Execution Cost**: $0.0017 → $0.00 per submission
- **Monthly Savings**: ~$14 for 8,500 submissions
- **Annual Savings**: ~$170 for 100,000 submissions
- **Infrastructure**: Fixed VPS cost (already paid)

### Usage Optimization
- **Smart Caching**: SHA-256-based deduplication
- **Automatic Cleanup**: Prevent disk space exhaustion
- **Resource Efficiency**: Optimized compiler flags
- **No API Limits**: Unlimited executions

## Monitoring and Analytics

### Service Health Monitoring
- **Execution Success Rate**: Track CE/TLE/RE/SE rates
- **Performance Metrics**: Compilation/execution times
- **Cache Efficiency**: Hit rate analysis
- **Disk Usage**: Job directory monitoring
- **Resource Utilization**: CPU/memory tracking

### User Experience Analytics
- **Feature Usage**: Run vs Submit patterns
- **Success Rates**: Code correction metrics
- **Time Savings**: Self-hosted vs API latency
- **User Satisfaction**: Feedback integration

## Compliance and Ethics

### Responsible AI Usage
- **Bias Mitigation**: Fair code analysis
- **Transparency**: Clear AI indication
- **User Consent**: Opt-in features
- **Data Privacy**: Minimal data collection

### Academic Integrity
- **Educational Focus**: Learning tool emphasis
- **Code Attribution**: Clear source indication
- **Secure Execution**: Prevent malicious code

This modernized stack eliminates external execution dependencies while maintaining powerful AI-assisted analysis. The self-hosted approach provides unlimited executions at zero marginal cost, making BugPulse truly cost-effective and scalable.</content>
<parameter name="filePath">c:\Users\subhr\OneDrive\Desktop\Bigpulse\AI-and-External-Services.md
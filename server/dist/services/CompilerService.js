"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilerService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const Judge0Service_1 = require("./Judge0Service");
const UsageTracker_1 = require("./UsageTracker");
class CompilerService {
    constructor() {
        this.TIMEOUT_MS = 5000;
        this.MAX_MEMORY_MB = 256;
        this.tempDir = path.join(os.tmpdir(), 'bugrank-compile');
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
        this.judge0Service = new Judge0Service_1.Judge0Service();
    }
    /**
     * Compile and execute in one go
     * Uses Judge0 API only (no local fallback)
     */
    async compileAndRun(sourceCode, input, challengeId) {
        try {
            // Use Judge0 API only (paid API - $0.0017 per submission)
            console.log(`🔄 Attempting Judge0 compilation for challenge ${challengeId}`);
            console.log(`   Input: "${input}"`);
            const judge0Result = await this.judge0Service.compileAndRun(sourceCode, 'cpp', input);
            // Track usage (only if not from cache)
            if (!judge0Result.status) {
                UsageTracker_1.usageTracker.trackSubmission();
            }
            console.log(`📊 Judge0 Raw Response:`, JSON.stringify(judge0Result, null, 2));
            // Convert Judge0 result to our format
            const isCompileSuccess = judge0Result.status.id !== 6; // Status 6 = Compilation Error
            const isExecutionSuccess = judge0Result.status.id === 3; // Status 3 = Accepted
            const compilation = {
                success: isCompileSuccess,
                compilationTime: judge0Result.time ? parseFloat(judge0Result.time) * 1000 : 0,
                output: isCompileSuccess ? 'Compilation successful' : 'Compilation failed',
                errors: judge0Result.compile_output || judge0Result.stderr || '',
                warnings: '',
            };
            if (!isCompileSuccess) {
                return { compilation };
            }
            const execution = {
                success: isExecutionSuccess,
                output: judge0Result.stdout || '',
                executionTime: judge0Result.time ? parseFloat(judge0Result.time) * 1000 : 0,
                exitCode: judge0Result.status.id === 3 ? 0 : judge0Result.status.id,
                timedOut: judge0Result.status.id === 5, // Status 5 = TLE
                memoryUsed: judge0Result.memory || 0,
            };
            console.log(`✅ Judge0 result - Status: ${judge0Result.status.id} (${judge0Result.status.description})`);
            console.log(`   Output: ${judge0Result.stdout || '(none)'}`);
            console.log(`   Stderr: ${judge0Result.stderr || '(none)'}`);
            console.log(`   Message: ${judge0Result.message || '(none)'}`);
            return { compilation, execution };
        }
        catch (error) {
            console.error(`❌ Judge0 API call failed:`, error.message);
            console.error(`   Stack:`, error.stack);
            console.error(`   Response:`, error.response?.data);
            // Throw the error instead of hiding it with a fake result
            throw new Error(`Judge0 API Error: ${error.response?.data?.message || error.message}. Please check your JUDGE0_RAPIDAPI_KEY in .env file. Your current key may be expired or invalid.`);
        }
    }
    /**
     * Local compilation (fallback method)
     */
    async compileAndRunLocal(sourceCode, input, challengeId) {
        const compilation = await this.compileCpp(sourceCode, challengeId);
        if (!compilation.success) {
            return { compilation };
        }
        const execution = await this.executeProgram(challengeId, input);
        return { compilation, execution };
    }
    /**
     * Compile C++ code (local fallback)
     */
    async compileCpp(sourceCode, challengeId) {
        const startTime = Date.now();
        const sourceFile = path.join(this.tempDir, `challenge-${challengeId}.cpp`);
        const executablePath = path.join(this.tempDir, `challenge-${challengeId}.exe`);
        try {
            // Write source code to file
            fs.writeFileSync(sourceFile, sourceCode, 'utf-8');
            // Compile the code
            // const result = spawnSync('g++', [
            //   '-o', executablePath,
            //   '-Wall',
            //   '-Wextra',
            //   '-std=c++17',
            //   sourceFile
            // ], {
            //   encoding: 'utf-8',
            //   stdio: ['pipe', 'pipe', 'pipe'],
            //   timeout: this.TIMEOUT_MS,
            //   maxBuffer: 10 * 1024 * 1024, // 10MB buffer
            // });
            const compilationTime = Date.now() - startTime;
            const result = { error: null, status: 0, stderr: '' }; // Mock result
            if (result.error) {
                return {
                    success: false,
                    compilationTime,
                    output: '',
                    errors: result.error.message,
                    warnings: '',
                };
            }
            if (result.status !== 0) {
                // Compilation failed - parse stderr
                const stderr = result.stderr || '';
                const errors = this.parseCompilerErrors(stderr);
                const warnings = this.parseCompilerWarnings(stderr);
                return {
                    success: false,
                    compilationTime,
                    output: '',
                    errors,
                    warnings,
                };
            }
            // Compilation successful
            return {
                success: true,
                compilationTime,
                output: 'Compilation successful',
                errors: '',
                warnings: result.stderr ? this.parseCompilerWarnings(result.stderr) : '',
            };
        }
        catch (error) {
            return {
                success: false,
                compilationTime: Date.now() - startTime,
                output: '',
                errors: error.message,
                warnings: '',
            };
        }
    }
    /**
     * Execute compiled binary with input and timeout
     */
    async executeProgram(challengeId, input) {
        const startTime = Date.now();
        const executablePath = path.join(this.tempDir, `challenge-${challengeId}.exe`);
        if (!fs.existsSync(executablePath)) {
            return {
                success: false,
                output: '',
                executionTime: Date.now() - startTime,
                exitCode: -1,
                timedOut: false,
            };
        }
        try {
            // const result = spawnSync(executablePath, [], {
            //   input,
            //   encoding: 'utf-8',
            //   stdio: ['pipe', 'pipe', 'pipe'],
            //   timeout: this.TIMEOUT_MS,
            //   maxBuffer: 10 * 1024 * 1024, // 10MB buffer
            // });
            const executionTime = Date.now() - startTime;
            const result = { error: null, status: 0, stdout: 'Mock output', stderr: '' }; // Mock result
            const timedOut = result.error?.code === 'ETIMEDOUT';
            if (timedOut) {
                return {
                    success: false,
                    output: '',
                    executionTime,
                    exitCode: -1,
                    timedOut: true,
                };
            }
            if (result.error) {
                return {
                    success: false,
                    output: result.stdout || '',
                    executionTime,
                    exitCode: result.status || -1,
                    timedOut: false,
                };
            }
            return {
                success: result.status === 0,
                output: result.stdout || '',
                executionTime,
                exitCode: result.status || 0,
                timedOut: false,
            };
        }
        catch (error) {
            return {
                success: false,
                output: '',
                executionTime: Date.now() - startTime,
                exitCode: -1,
                timedOut: false,
            };
        }
    }
    /**
     * Parse compiler errors from g++ output
     */
    parseCompilerErrors(output) {
        const lines = output.split('\n');
        const errors = [];
        for (const line of lines) {
            if (line.includes('error:')) {
                errors.push(line);
            }
        }
        return errors.join('\n');
    }
    /**
     * Parse compiler warnings from g++ output
     */
    parseCompilerWarnings(output) {
        const lines = output.split('\n');
        const warnings = [];
        for (const line of lines) {
            if (line.includes('warning:')) {
                warnings.push(line);
            }
        }
        return warnings.join('\n');
    }
    /**
     * Clean up temporary files
     */
    cleanup(challengeId) {
        try {
            const sourceFile = path.join(this.tempDir, `challenge-${challengeId}.cpp`);
            const executablePath = path.join(this.tempDir, `challenge-${challengeId}.exe`);
            if (fs.existsSync(sourceFile)) {
                fs.unlinkSync(sourceFile);
            }
            if (fs.existsSync(executablePath)) {
                fs.unlinkSync(executablePath);
            }
        }
        catch (error) {
            console.error(`Failed to cleanup challenge ${challengeId}:`, error);
        }
    }
    /**
     * Clean up all temporary files
     */
    cleanupAll() {
        try {
            if (fs.existsSync(this.tempDir)) {
                fs.rmSync(this.tempDir, { recursive: true, force: true });
                fs.mkdirSync(this.tempDir, { recursive: true });
            }
        }
        catch (error) {
            console.error('Failed to cleanup all temp files:', error);
        }
    }
    /**
     * Format compiler output as code
     */
    formatCompilerOutput(compilation, execution) {
        let output = '';
        if (!compilation.success) {
            output += `❌ COMPILATION FAILED\n\n`;
            if (compilation.errors) {
                output += `Errors:\n${compilation.errors}\n`;
            }
            if (compilation.warnings) {
                output += `\nWarnings:\n${compilation.warnings}\n`;
            }
            return output;
        }
        output += `✅ COMPILATION SUCCESSFUL (${compilation.compilationTime}ms)\n\n`;
        if (compilation.warnings) {
            output += `Warnings:\n${compilation.warnings}\n\n`;
        }
        if (execution) {
            if (execution.timedOut) {
                output += `❌ EXECUTION TIMEOUT (> ${this.TIMEOUT_MS}ms)\n`;
            }
            else if (!execution.success) {
                output += `❌ RUNTIME ERROR (Exit code: ${execution.exitCode})\n`;
            }
            else {
                output += `✅ EXECUTION SUCCESSFUL (${execution.executionTime}ms)\n`;
            }
            output += `\nProgram Output:\n`;
            output += execution.output || '(no output)';
        }
        return output;
    }
    /**
     * Validate if actual output matches expected output
     */
    validateOutput(actualOutput, expectedOutput) {
        const actual = actualOutput.trim();
        const expected = expectedOutput.trim();
        return actual === expected;
    }
    /**
     * Format output comparison for display
     */
    formatOutputComparison(expected, actual) {
        const matches = this.validateOutput(actual, expected);
        let comparison = '';
        comparison += `Expected:\n${expected}\n`;
        comparison += `─────────────────────────\n`;
        comparison += `Actual:\n${actual}\n`;
        comparison += `─────────────────────────\n`;
        comparison += matches ? '✅ OUTPUT MATCHES' : '❌ OUTPUT MISMATCH';
        return comparison;
    }
}
exports.CompilerService = CompilerService;

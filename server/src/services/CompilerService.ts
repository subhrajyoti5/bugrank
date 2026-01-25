import { spawn, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Judge0Service } from './Judge0Service';
import { usageTracker } from './UsageTracker';

interface CompilationResult {
  success: boolean;
  compilationTime: number;
  output: string;
  errors: string;
  warnings: string;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  executionTime: number;
  exitCode: number;
  timedOut: boolean;
  memoryUsed?: number;
}

export class CompilerService {
  private tempDir: string;
  private readonly TIMEOUT_MS = 5000;
  private readonly MAX_MEMORY_MB = 256;
  private judge0Service: Judge0Service;

  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'bugrank-compile');
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
    this.judge0Service = new Judge0Service();
  }

  /**
   * Compile and execute in one go
   * Uses Judge0 API with fallback to local compilation
   */
  async compileAndRun(
    sourceCode: string,
    input: string,
    challengeId: number
  ): Promise<{
    compilation: CompilationResult;
    execution?: ExecutionResult;
  }> {
    // Try Judge0 first (paid API - $0.0017 per submission)
    try {
      console.log(`🔄 Attempting Judge0 compilation for challenge ${challengeId}`);
      const judge0Result = await this.judge0Service.compileAndRun(sourceCode, 'cpp', input);
      
      // Track usage (only if not from cache)
      if (!judge0Result.status) {
        usageTracker.trackSubmission();
      }

      // Convert Judge0 result to our format
      const isCompileSuccess = judge0Result.status.id !== 6; // Status 6 = Compilation Error
      const isExecutionSuccess = judge0Result.status.id === 3; // Status 3 = Accepted

      const compilation: CompilationResult = {
        success: isCompileSuccess,
        compilationTime: judge0Result.time ? parseFloat(judge0Result.time) * 1000 : 0,
        output: isCompileSuccess ? 'Compilation successful' : 'Compilation failed',
        errors: judge0Result.compile_output || judge0Result.stderr || '',
        warnings: '',
      };

      if (!isCompileSuccess) {
        return { compilation };
      }

      const execution: ExecutionResult = {
        success: isExecutionSuccess,
        output: judge0Result.stdout || '',
        executionTime: judge0Result.time ? parseFloat(judge0Result.time) * 1000 : 0,
        exitCode: judge0Result.status.id === 3 ? 0 : judge0Result.status.id,
        timedOut: judge0Result.status.id === 5, // Status 5 = TLE
        memoryUsed: judge0Result.memory || 0,
      };

      console.log(`✅ Judge0 compilation successful`);
      return { compilation, execution };

    } catch (error: any) {
      console.warn(`⚠️ Judge0 failed, falling back to local compilation:`, error.message);
      
      // Fallback to local compilation
      return await this.compileAndRunLocal(sourceCode, input, challengeId);
    }
  }

  /**
   * Local compilation (fallback method)
   */
  private async compileAndRunLocal(
    sourceCode: string,
    input: string,
    challengeId: number
  ): Promise<{
    compilation: CompilationResult;
    execution?: ExecutionResult;
  }> {
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
  private async compileCpp(sourceCode: string, challengeId: number): Promise<CompilationResult> {
    const startTime = Date.now();
    const sourceFile = path.join(this.tempDir, `challenge-${challengeId}.cpp`);
    const executablePath = path.join(this.tempDir, `challenge-${challengeId}.exe`);

    try {
      // Write source code to file
      fs.writeFileSync(sourceFile, sourceCode, 'utf-8');

      // Compile the code
      const result = spawnSync('g++', [
        '-o', executablePath,
        '-Wall',
        '-Wextra',
        '-std=c++17',
        sourceFile
      ], {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: this.TIMEOUT_MS,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      });

      const compilationTime = Date.now() - startTime;

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
    } catch (error: any) {
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
  async executeProgram(
    challengeId: number,
    input: string
  ): Promise<ExecutionResult> {
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
      const result = spawnSync(executablePath, [], {
        input,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: this.TIMEOUT_MS,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      });

      const executionTime = Date.now() - startTime;
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
    } catch (error: any) {
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
   * Compile and execute in one go
   */
  async compileAndRun(
    sourceCode: string,
    input: string,
    challengeId: number
  ): Promise<{
    compilation: CompilationResult;
    execution?: ExecutionResult;
  }> {
    const compilation = await this.compileCpp(sourceCode, challengeId);

    if (!compilation.success) {
      return { compilation };
    }

    const execution = await this.executeProgram(challengeId, input);
    return { compilation, execution };
  }

  /**
   * Parse compiler errors from g++ output
   */
  private parseCompilerErrors(output: string): string {
    const lines = output.split('\n');
    const errors: string[] = [];

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
  private parseCompilerWarnings(output: string): string {
    const lines = output.split('\n');
    const warnings: string[] = [];

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
  cleanup(challengeId: number): void {
    try {
      const sourceFile = path.join(this.tempDir, `challenge-${challengeId}.cpp`);
      const executablePath = path.join(this.tempDir, `challenge-${challengeId}.exe`);

      if (fs.existsSync(sourceFile)) {
        fs.unlinkSync(sourceFile);
      }
      if (fs.existsSync(executablePath)) {
        fs.unlinkSync(executablePath);
      }
    } catch (error) {
      console.error(`Failed to cleanup challenge ${challengeId}:`, error);
    }
  }

  /**
   * Clean up all temporary files
   */
  cleanupAll(): void {
    try {
      if (fs.existsSync(this.tempDir)) {
        fs.rmSync(this.tempDir, { recursive: true, force: true });
        fs.mkdirSync(this.tempDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to cleanup all temp files:', error);
    }
  }

  /**
   * Format compiler output as code
   */
  formatCompilerOutput(compilation: CompilationResult, execution?: ExecutionResult): string {
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
      } else if (!execution.success) {
        output += `❌ RUNTIME ERROR (Exit code: ${execution.exitCode})\n`;
      } else {
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
  validateOutput(actualOutput: string, expectedOutput: string): boolean {
    const actual = actualOutput.trim();
    const expected = expectedOutput.trim();
    return actual === expected;
  }

  /**
   * Format output comparison for display
   */
  formatOutputComparison(expected: string, actual: string): string {
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

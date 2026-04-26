import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const execFileAsync = promisify(execFile);

// Safety Limits
const MAX_CODE_SIZE = 100 * 1024; // 100KB
const MAX_INPUT_SIZE = 10 * 1024; // 10KB

const BASE_DIR = process.env.NODE_ENV === 'production' 
  ? '/srv/bugpulse/jobs' 
  : process.env.BUGPULSE_JOBS_DIR || './temp/jobs';
const RUNNER_SCRIPT = process.env.NODE_ENV === 'production'
  ? '/srv/bugpulse/runner/run_all.sh'
  : process.env.BUGPULSE_RUNNER || './scripts/run_all.sh';
const EXECUTION_TIMEOUT = 12000; // 12 seconds (compile + run + overhead)
const IS_WINDOWS = process.platform === 'win32';
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const SUPPORTED_LANGUAGES = ['cpp', 'python', 'java'];

// Execution Queue (simple mutex)
let isExecuting = false;
const executionQueue: Array<() => void> = [];

interface ExecutionResult {
  status: 'AC' | 'WA' | 'TLE' | 'CE' | 'RE' | 'SE';
  stdout: string;
  stderr: string;
  compilationError?: string;
  executionTime?: number;
  memoryUsed?: number;
  exitCode?: number;
}

interface CacheEntry {
  result: ExecutionResult;
  timestamp: number;
}

// In-memory cache (1 hour TTL)
const resultCache = new Map<string, CacheEntry>();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

export class ExecutionService {
  /**
   * Validate code size
   */
  private static validateCode(code: string): void {
    if (!code || code.trim().length === 0) {
      throw new Error('Code cannot be empty');
    }
    if (code.length > MAX_CODE_SIZE) {
      throw new Error(`Code size exceeds limit (${MAX_CODE_SIZE} bytes)`);
    }
  }

  /**
   * Validate language is supported
   */
  private static validateLanguage(language: string): void {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw new Error(`Unsupported language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
    }
  }

  /**
   * Validate input size
   */
  private static validateInput(input: string): void {
    if (input && input.length > MAX_INPUT_SIZE) {
      throw new Error(`Input size exceeds limit (${MAX_INPUT_SIZE} bytes)`);
    }
  }

  /**
   * Get file extension for language
   */
  private static getSourceFileName(language: string): string {
    switch (language) {
      case 'cpp':
        return 'main.cpp';
      case 'python':
        return 'main.py';
      case 'java':
        return 'Main.java';
      default:
        return 'main.cpp';
    }
  }

  /**
   * Acquire execution lock (simple mutex)
   */
  private static async acquireLock(): Promise<void> {
    return new Promise((resolve) => {
      if (!isExecuting) {
        isExecuting = true;
        resolve();
      } else {
        executionQueue.push(() => resolve());
      }
    });
  }

  /**
   * Release execution lock
   */
  private static releaseLock(): void {
    const next = executionQueue.shift();
    if (next) {
      next();
    } else {
      isExecuting = false;
    }
  }

  /**
   * Generate cache key from code, input, and language
   */
  private static generateCacheKey(code: string, input: string, language: string = 'cpp'): string {
    return crypto
      .createHash('sha256')
      .update(`${code}|${language}|${input}`)
      .digest('hex');
  }

  /**
   * Check cache for previous result
   */
  private static getCachedResult(cacheKey: string): ExecutionResult | null {
    const cached = resultCache.get(cacheKey);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_TTL) {
      resultCache.delete(cacheKey);
      return null;
    }

    return cached.result;
  }

  /**
   * Store result in cache
   */
  private static cacheResult(cacheKey: string, result: ExecutionResult): void {
    resultCache.set(cacheKey, {
      result,
      timestamp: Date.now(),
    });
  }

  /**
   * Clean expired cache entries
   */
  public static cleanCache(): void {
    const now = Date.now();
    for (const [key, entry] of resultCache.entries()) {
      if (now - entry.timestamp > CACHE_TTL) {
        resultCache.delete(key);
      }
    }
  }

  /**
   * Generate UUID (simple implementation without external dependency)
   */
  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Create job directory and write files
   */
  private static async createJob(
    code: string,
    input: string,
    language: string = 'cpp'
  ): Promise<string> {
    this.validateLanguage(language);
    const jobId = this.generateUUID();
    const jobDir = path.join(BASE_DIR, jobId);

    await fs.mkdir(jobDir, { recursive: true });
    await fs.chmod(jobDir, 0o777);
    const sourceFileName = this.getSourceFileName(language);
    await fs.writeFile(path.join(jobDir, sourceFileName), code, 'utf8');
    await fs.writeFile(path.join(jobDir, 'input.txt'), input, 'utf8');

    return jobId;
  }

  /**
   * Read execution results from job directory
   */
  private static async collectResult(jobId: string): Promise<ExecutionResult> {
    const jobDir = path.join(BASE_DIR, jobId);

    try {
      const [status, stdout, stderr, compileError] = await Promise.all([
        fs.readFile(path.join(jobDir, 'status.txt'), 'utf8').catch(() => 'SE'),
        fs
          .readFile(path.join(jobDir, 'output.txt'), 'utf8')
          .catch(() => ''),
        fs.readFile(path.join(jobDir, 'error.txt'), 'utf8').catch(() => ''),
        fs
          .readFile(path.join(jobDir, 'compile_error.txt'), 'utf8')
          .catch(() => ''),
      ]);

      const statusCode = status.trim() as
        | 'COMPILING'
        | 'RUNNING'
        | 'COMPLETED'
        | 'CE'
        | 'TLE'
        | 'RE'
        | 'SE';

      // Map internal status to Judge0-compatible status
      let finalStatus: ExecutionResult['status'];
      switch (statusCode) {
        case 'CE':
          finalStatus = 'CE';
          break;
        case 'TLE':
          finalStatus = 'TLE';
          break;
        case 'RE':
          finalStatus = 'RE';
          break;
        case 'COMPLETED':
          finalStatus = 'AC'; // Will be WA if output doesn't match
          break;
        default:
          finalStatus = 'SE';
      }

      return {
        status: finalStatus,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        compilationError: compileError.trim() || undefined,
      };
    } catch (error) {
      return {
        status: 'SE',
        stdout: '',
        stderr: `Failed to collect results: ${error}`,
      };
    }
  }

  /**
   * Execute code with caching and multi-language support
   */
  public static async executeCode(
    code: string,
    input: string,
    language: string = 'cpp'
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    // Validate language
    try {
      this.validateLanguage(language);
      this.validateCode(code);
      this.validateInput(input);
    } catch (error: any) {
      console.error('❌ Validation failed:', error.message);
      return {
        status: 'SE',
        stdout: '',
        stderr: error.message,
      };
    }

    // Check if running in development without VPS setup
    if (IS_DEVELOPMENT && !require('fs').existsSync(RUNNER_SCRIPT)) {
      console.warn(`⚠️ Development mode: Runner script not found at ${RUNNER_SCRIPT}`);
      return {
        status: 'SE',
        stdout: '',
        stderr: 'Development mode: VPS execution environment not configured.\n\nTo enable code execution:\n\n1. Complete Phases 0-3 of JUDGE0_REPLACEMENT_GUIDE.md on your VPS\n2. Set NODE_ENV=production in .env\n3. Deploy to VPS\n\nFor now, only AI analysis is available.',
        compilationError: 'Execution service not configured for local development',
      };
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(code, input, language);
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) {
      console.log(`✅ Cache hit for ${language}: ${cacheKey.substring(0, 16)}...`);
      return cachedResult;
    }

    console.log(`🔄 Cache miss - executing ${language} code`);

    // Acquire execution lock
    await this.acquireLock();

    try {
      // Create job
      const jobId = await this.createJob(code, input, language);
      console.log(`📁 Created job: ${jobId} (${language})`);

      try {
        // Execute runner script with language parameter
        await execFileAsync(RUNNER_SCRIPT, [language, jobId], {
          timeout: EXECUTION_TIMEOUT,
        });
      } catch (error: any) {
        console.error(`⚠️ Execution error for job ${jobId}:`, error.message);
        // Continue to collect results - script may have written status
      }

      // Collect results
      const result = await this.collectResult(jobId);

      // Cache the result
      this.cacheResult(cacheKey, result);

      const executionTime = Date.now() - startTime;
      console.log(`🎯 Execution completed:`, {
        jobId,
        status: result.status,
        executionTime: `${executionTime}ms`,
        cached: false,
      });

      return result;
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ Fatal execution error:`, {
        error: error.message,
        executionTime: `${executionTime}ms`,
      });
      return {
        status: 'SE',
        stdout: '',
        stderr: `System Error: ${error.message}\n\nThis usually means:\n- VPS not configured (Phases 0-3 incomplete)\n- Runner script not accessible\n- File system permissions issue\n\nCheck server logs for details.`,
        compilationError: error.message,
      };
    } finally {
      // Always release the lock
      this.releaseLock();
    }
  }

  /**
   * Compare output with expected output
   */
  public static compareOutput(
    actualOutput: string,
    expectedOutput: string
  ): boolean {
    const normalize = (str: string) =>
      str
        .trim()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('\n');

    return normalize(actualOutput) === normalize(expectedOutput);
  }
}

// Clean cache every 10 minutes
setInterval(() => {
  ExecutionService.cleanCache();
}, 600000);

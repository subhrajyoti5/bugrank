"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionService = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
const BASE_DIR = '/srv/bugpulse/jobs';
const RUNNER_SCRIPT = '/srv/bugpulse/runner/run_all.sh';
const EXECUTION_TIMEOUT = 12000; // 12 seconds (compile + run + overhead)
// Supported languages
const SUPPORTED_LANGUAGES = ['cpp', 'python', 'java'];
// In-memory cache (1 hour TTL)
const resultCache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds
class ExecutionService {
    /**
     * Generate cache key from code, input, and language
     */
    static generateCacheKey(code, input, language = 'cpp') {
        return crypto_1.default
            .createHash('sha256')
            .update(`${code}|${language}|${input}`)
            .digest('hex');
    }
    /**
     * Validate language is supported
     */
    static validateLanguage(language) {
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            throw new Error(`Unsupported language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
        }
    }
    /**
     * Check cache for previous result
     */
    static getCachedResult(cacheKey) {
        const cached = resultCache.get(cacheKey);
        if (!cached)
            return null;
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
    static cacheResult(cacheKey, result) {
        resultCache.set(cacheKey, {
            result,
            timestamp: Date.now(),
        });
    }
    /**
     * Clean expired cache entries
     */
    static cleanCache() {
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
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    /**
     * Get file extension for language
     */
    static getSourceFileName(language) {
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
     * Create job directory and write files
     */
    static async createJob(code, input, language = 'cpp') {
        this.validateLanguage(language);
        const jobId = this.generateUUID();
        const jobDir = path_1.default.join(BASE_DIR, jobId);
        await promises_1.default.mkdir(jobDir, { recursive: true });
        const sourceFileName = this.getSourceFileName(language);
        await promises_1.default.writeFile(path_1.default.join(jobDir, sourceFileName), code, 'utf8');
        await promises_1.default.writeFile(path_1.default.join(jobDir, 'input.txt'), input, 'utf8');
        return jobId;
    }
    /**
     * Read execution results from job directory
     */
    static async collectResult(jobId) {
        const jobDir = path_1.default.join(BASE_DIR, jobId);
        try {
            const [status, stdout, stderr, compileError] = await Promise.all([
                promises_1.default.readFile(path_1.default.join(jobDir, 'status.txt'), 'utf8').catch(() => 'SE'),
                promises_1.default
                    .readFile(path_1.default.join(jobDir, 'output.txt'), 'utf8')
                    .catch(() => ''),
                promises_1.default.readFile(path_1.default.join(jobDir, 'error.txt'), 'utf8').catch(() => ''),
                promises_1.default
                    .readFile(path_1.default.join(jobDir, 'compile_error.txt'), 'utf8')
                    .catch(() => ''),
            ]);
            const statusCode = status.trim();
            // Map internal status to Judge0-compatible status
            let finalStatus;
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
        }
        catch (error) {
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
    static async executeCode(code, input, language = 'cpp') {
        this.validateLanguage(language);
        // Check cache first
        const cacheKey = this.generateCacheKey(code, input, language);
        const cachedResult = this.getCachedResult(cacheKey);
        if (cachedResult) {
            console.log(`✅ Cache hit for ${language}: ${cacheKey.substring(0, 16)}...`);
            return cachedResult;
        }
        console.log(`🔄 Cache miss - executing ${language} code`);
        // Create job
        const jobId = await this.createJob(code, input, language);
        console.log(`📁 Created job: ${jobId} (${language})`);
        try {
            // Execute runner script with language parameter
            await execFileAsync(RUNNER_SCRIPT, [language, jobId], {
                timeout: EXECUTION_TIMEOUT,
            });
        }
        catch (error) {
            console.error(`⚠️ Execution error for job ${jobId}:`, error.message);
            // Continue to collect results - script may have written status
        }
        // Collect results
        const result = await this.collectResult(jobId);
        // Cache the result
        this.cacheResult(cacheKey, result);
        return result;
    }
    /**
     * Compare output with expected output
     */
    static compareOutput(actualOutput, expectedOutput) {
        const normalize = (str) => str
            .trim()
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .join('\n');
        return normalize(actualOutput) === normalize(expectedOutput);
    }
}
exports.ExecutionService = ExecutionService;
// Clean cache every 10 minutes
setInterval(() => {
    ExecutionService.cleanCache();
}, 600000);

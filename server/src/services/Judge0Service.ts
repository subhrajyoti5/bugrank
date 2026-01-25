import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
}

interface CacheEntry {
  result: Judge0Result;
  timestamp: number;
}

export class Judge0Service {
  private client: AxiosInstance;
  private cache: Map<string, CacheEntry>;
  private readonly LANGUAGE_MAP = {
    'cpp': 54,      // C++ (GCC 9.2.0)
    'java': 62,     // Java (OpenJDK 13.0.1)
    'python': 71,   // Python 3.8.1
    'javascript': 63, // JavaScript (Node.js)
  };
  private readonly CACHE_TTL: number;
  private readonly ENABLE_CACHE: boolean;

  constructor() {
    const apiUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
    const rapidApiKey = process.env.JUDGE0_RAPIDAPI_KEY;
    const rapidApiHost = process.env.JUDGE0_RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';

    if (!rapidApiKey) {
      console.warn('⚠️ JUDGE0_RAPIDAPI_KEY not set. Judge0 service will not work.');
    }

    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
      },
      timeout: 30000,
    });

    this.cache = new Map();
    this.CACHE_TTL = parseInt(process.env.JUDGE0_CACHE_TTL || '3600') * 1000; // 1 hour default
    this.ENABLE_CACHE = process.env.JUDGE0_ENABLE_CACHE === 'true';

    // Clean up expired cache entries every 10 minutes
    setInterval(() => this.cleanExpiredCache(), 10 * 60 * 1000);
  }

  /**
   * Compile and run code with caching
   */
  async compileAndRun(
    code: string,
    language: string,
    stdin: string = '',
    expectedOutput?: string
  ): Promise<Judge0Result> {
    // Generate cache key
    const cacheKey = this.generateCacheKey(code, language, stdin);
    
    // Check cache (saves API calls and costs)
    if (this.ENABLE_CACHE) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        console.log('✅ Judge0 cache hit - saving $0.0017');
        return cached.result;
      }
    }

    // Submit to Judge0
    const languageId = this.LANGUAGE_MAP[language as keyof typeof this.LANGUAGE_MAP] || 54;
    
    const submission: Judge0Submission = {
      source_code: Buffer.from(code).toString('base64'),
      language_id: languageId,
      stdin: stdin ? Buffer.from(stdin).toString('base64') : undefined,
      expected_output: expectedOutput ? Buffer.from(expectedOutput).toString('base64') : undefined,
      cpu_time_limit: 5,  // 5 seconds
      memory_limit: 262144, // 256 MB in KB
    };

    try {
      // Create submission
      const createResponse = await this.client.post('/submissions', submission, {
        params: {
          base64_encoded: 'true',
          wait: 'false', // Async submission
        },
      });

      const token = createResponse.data.token;
      console.log(`📤 Judge0 submission created: ${token} (Cost: $0.0017)`);

      // Poll for result (with exponential backoff)
      const result = await this.pollSubmission(token);

      // Decode base64 responses
      const decodedResult = this.decodeResult(result);

      // Cache result
      if (this.ENABLE_CACHE) {
        this.cache.set(cacheKey, {
          result: decodedResult,
          timestamp: Date.now(),
        });
      }

      return decodedResult;
    } catch (error: any) {
      console.error('❌ Judge0 API Error:', error.response?.data || error.message);
      throw error; // Will trigger fallback in CompilerService
    }
  }

  /**
   * Poll submission until complete (with exponential backoff)
   */
  private async pollSubmission(token: string, maxAttempts = 10): Promise<any> {
    let attempts = 0;
    let delay = 500; // Start with 500ms

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, delay));

      const response = await this.client.get(`/submissions/${token}`, {
        params: { base64_encoded: 'true' },
      });

      const status = response.data.status.id;

      // Status: 1=In Queue, 2=Processing
      if (status > 2) {
        return response.data;
      }

      attempts++;
      delay = Math.min(delay * 1.5, 3000); // Exponential backoff, max 3s
    }

    throw new Error('Judge0 submission timeout - polling exceeded max attempts');
  }

  /**
   * Decode base64 result fields
   */
  private decodeResult(result: any): Judge0Result {
    return {
      stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : null,
      stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : null,
      compile_output: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : null,
      message: result.message ? Buffer.from(result.message, 'base64').toString() : null,
      status: result.status,
      time: result.time,
      memory: result.memory,
    };
  }

  /**
   * Generate cache key for deduplication (SHA-256 hash)
   */
  private generateCacheKey(code: string, language: string, stdin: string): string {
    const content = `${code}|${language}|${stdin}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Clean expired cache entries
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.CACHE_TTL) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired Judge0 cache entries`);
    }
  }

  /**
   * Clear all cache (manual cleanup)
   */
  public clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Judge0 cache cleared');
  }

  /**
   * Get cache statistics
   */
  public getCacheStats() {
    return {
      size: this.cache.size,
      ttl: this.CACHE_TTL / 1000, // Convert to seconds
      enabled: this.ENABLE_CACHE,
    };
  }
}

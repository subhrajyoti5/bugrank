/**
 * Track Judge0 API usage and estimated costs
 * Logs to console for monitoring - no user-facing changes
 */
export class UsageTracker {
  private submissionCount: number = 0;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private estimatedCost: number = 0;
  private readonly COST_PER_SUBMISSION = 0.0017;

  /**
   * Track a Judge0 API call (actual submission that costs money)
   */
  trackSubmission(): void {
    this.submissionCount++;
    this.cacheMisses++;
    this.estimatedCost += this.COST_PER_SUBMISSION;
    
    console.log(`📊 Judge0 Stats - Submissions: ${this.submissionCount} | Cost: $${this.estimatedCost.toFixed(4)} | Cache Hit Rate: ${this.getCacheHitRate()}%`);
  }

  /**
   * Track a cache hit (saved API call)
   */
  trackCacheHit(): void {
    this.cacheHits++;
    console.log(`💾 Cache hit - saved $${this.COST_PER_SUBMISSION} | Total saved: $${(this.cacheHits * this.COST_PER_SUBMISSION).toFixed(4)}`);
  }

  /**
   * Get cache hit rate percentage
   */
  private getCacheHitRate(): string {
    const total = this.cacheHits + this.cacheMisses;
    if (total === 0) return '0.00';
    return ((this.cacheHits / total) * 100).toFixed(2);
  }

  /**
   * Get current usage statistics
   */
  getStats() {
    return {
      submissions: this.submissionCount,
      estimatedCost: this.estimatedCost,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      cacheHitRate: this.getCacheHitRate(),
      totalSaved: this.cacheHits * this.COST_PER_SUBMISSION,
    };
  }

  /**
   * Reset all counters (e.g., at start of new billing period)
   */
  reset(): void {
    this.submissionCount = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.estimatedCost = 0;
    console.log('🔄 Usage tracker reset');
  }

  /**
   * Log daily summary
   */
  logDailySummary(): void {
    const stats = this.getStats();
    console.log('\n═══════════════════════════════════════');
    console.log('📈 Daily Judge0 Usage Summary');
    console.log('═══════════════════════════════════════');
    console.log(`Total Submissions: ${stats.submissions}`);
    console.log(`Estimated Cost: $${stats.estimatedCost.toFixed(4)}`);
    console.log(`Cache Hits: ${stats.cacheHits}`);
    console.log(`Cache Misses: ${stats.cacheMisses}`);
    console.log(`Cache Hit Rate: ${stats.cacheHitRate}%`);
    console.log(`Total Saved: $${stats.totalSaved.toFixed(4)}`);
    console.log('═══════════════════════════════════════\n');
  }
}

// Singleton instance
export const usageTracker = new UsageTracker();

// Log summary every 24 hours
setInterval(() => {
  usageTracker.logDailySummary();
}, 24 * 60 * 60 * 1000);

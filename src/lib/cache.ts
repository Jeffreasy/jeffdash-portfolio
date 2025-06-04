/**
 * Enhanced cache service with better invalidation and type safety
 */

import { logger } from './logger';

// Cache configuration
export const CACHE_CONFIG = {
  ttl: {
    short: 2 * 60 * 1000,      // 2 minutes
    medium: 10 * 60 * 1000,    // 10 minutes
    long: 60 * 60 * 1000,      // 1 hour
    extraLong: 24 * 60 * 60 * 1000, // 24 hours
  },
  maxSize: 1000, // Maximum number of cache entries
} as const;

// Cache entry interface
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
  accessCount: number;
  lastAccessed: number;
}

// Cache statistics interface
interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  hitRate: number;
}

class EnhancedCache {
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
    hitRate: 0,
  };

  /**
   * Get cached data with type safety
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.deletes++;
      this.updateStats();
      logger.debug('Cache entry expired and removed', { key });
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    this.stats.hits++;
    this.updateHitRate();
    
    logger.debug('Cache hit', { key, accessCount: entry.accessCount });
    return entry.data as T;
  }

  /**
   * Set cached data with optional TTL and tags
   */
  set<T>(
    key: string, 
    data: T, 
    ttl: number = CACHE_CONFIG.ttl.medium,
    tags: string[] = []
  ): void {
    // Check cache size and evict if necessary
    if (this.cache.size >= CACHE_CONFIG.maxSize) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    this.cache.set(key, entry);
    this.stats.sets++;
    this.updateStats();
    
    logger.debug('Cache set', { key, ttl, tags, size: this.cache.size });
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.updateStats();
      logger.debug('Cache entry deleted', { key });
    }
    return deleted;
  }

  /**
   * Invalidate cache entries by tags
   */
  invalidateByTags(tags: string[]): number {
    let deletedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    
    if (deletedCount > 0) {
      this.stats.deletes += deletedCount;
      this.updateStats();
      logger.info('Cache invalidated by tags', { tags, deletedCount });
    }
    
    return deletedCount;
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidateByPattern(pattern: RegExp): number {
    let deletedCount = 0;
    
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    
    if (deletedCount > 0) {
      this.stats.deletes += deletedCount;
      this.updateStats();
      logger.info('Cache invalidated by pattern', { pattern: pattern.source, deletedCount });
    }
    
    return deletedCount;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.stats.deletes += size;
    this.updateStats();
    logger.info('Cache cleared', { deletedCount: size });
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    let deletedCount = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    
    if (deletedCount > 0) {
      this.stats.deletes += deletedCount;
      this.updateStats();
      logger.debug('Cache cleanup completed', { deletedCount });
    }
    
    return deletedCount;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache keys by tags
   */
  getKeysByTags(tags: string[]): string[] {
    const keys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        keys.push(key);
      }
    }
    
    return keys;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.deletes++;
      logger.debug('LRU eviction', { evictedKey: oldestKey });
    }
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.size = this.cache.size;
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }
}

// Create singleton cache instance
export const cache = new EnhancedCache();

// Auto cleanup every 5 minutes
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    cache.cleanup();
  }, 5 * 60 * 1000);
}

// Helper functions for common cache patterns
export const cacheHelpers = {
  // Blog-specific cache helpers
  blog: {
    invalidateAll: () => cache.invalidateByTags(['blog']),
    invalidatePost: (slug: string) => cache.invalidateByPattern(new RegExp(`blog.*${slug}`)),
    invalidatePagination: () => cache.invalidateByPattern(/published_posts_page/),
    invalidateSearch: (query?: string) => {
      if (query) {
        cache.invalidateByPattern(new RegExp(`published_posts_page.*search.*${query}`));
      } else {
        cache.invalidateByPattern(/published_posts_page.*search/);
      }
    },
  },
  
  // Admin-specific cache helpers
  admin: {
    invalidateAll: () => cache.invalidateByTags(['admin']),
    invalidatePosts: () => cache.invalidateByTags(['admin', 'posts']),
  },
  
  // General helpers
  invalidateByPrefix: (prefix: string) => cache.invalidateByPattern(new RegExp(`^${prefix}`)),
  invalidateByContains: (contains: string) => cache.invalidateByPattern(new RegExp(contains)),
};

export default cache; 
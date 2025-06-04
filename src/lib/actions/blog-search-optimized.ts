/**
 * Optimized blog search functions that take advantage of database indexes
 * This can be used to replace the search functionality in blog.ts when ready
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { cache, CACHE_CONFIG } from '@/lib/cache';
import type { PaginatedPostsResult, PaginationMeta, PublishedPostPreviewType } from './blog';

/**
 * Enhanced search with full-text search capabilities
 * Uses the new search_vector column and GIN indexes for better performance
 */
export async function searchPublishedPostsOptimized(
  searchQuery: string,
  page: number = 1,
  limit: number = 12
): Promise<PaginatedPostsResult> {
  const cacheKey = `optimized_search_${searchQuery}_page_${page}_limit_${limit}`;
  const cached = cache.get<PaginatedPostsResult>(cacheKey);
  if (cached) {
    logger.info('Returning cached optimized search results', { searchQuery, page, limit });
    return cached;
  }

  logger.info('Performing optimized search', { searchQuery, page, limit });
  const supabase = await createClient();
  
  try {
    const offset = (page - 1) * limit;
    const searchTerm = searchQuery.trim();
    
    if (!searchTerm) {
      // Fallback to regular published posts if no search term
      const { data, error, count } = await supabase
        .from('Post')
        .select('id, slug, title, excerpt, featuredImageUrl, featuredImageAltText, tags, category, publishedAt', { count: 'exact' })
        .eq('published', true)
        .order('publishedAt', { ascending: false })
        .order('createdAt', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const result: PaginatedPostsResult = {
        posts: data || [],
        pagination: createPaginationMeta(count || 0, page, limit),
      };

      cache.set(cacheKey, result, CACHE_CONFIG.ttl.short, ['blog', 'search']);
      return result;
    }

    // Use full-text search with the new search_vector column
    const { data, error, count } = await supabase
      .rpc('search_posts_fts', {
        search_term: searchTerm,
        page_offset: offset,
        page_limit: limit
      });

    if (error) {
      logger.warn('Full-text search failed, falling back to ILIKE search', { error: error.message });
      return await fallbackSearch(searchTerm, page, limit, offset);
    }

    const result: PaginatedPostsResult = {
      posts: data || [],
      pagination: createPaginationMeta(data?.length || 0, page, limit),
    };

    cache.set(cacheKey, result, CACHE_CONFIG.ttl.short, ['blog', 'search']);
    return result;
  } catch (error: any) {
    logger.error('Optimized search failed', { 
      searchQuery, 
      page, 
      limit, 
      error: error.message || error 
    });
    
    // Fallback to original search method
    return await fallbackSearch(searchQuery, page, limit, (page - 1) * limit);
  }
}

/**
 * Fallback search using ILIKE (original method)
 */
async function fallbackSearch(
  searchTerm: string,
  page: number,
  limit: number,
  offset: number
): Promise<PaginatedPostsResult> {
  logger.info('Using fallback ILIKE search', { searchTerm, page, limit });
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('Post')
    .select('id, slug, title, excerpt, featuredImageUrl, featuredImageAltText, tags, category, publishedAt', { count: 'exact' })
    .eq('published', true)
    .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
    .order('publishedAt', { ascending: false })
    .order('createdAt', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    posts: data || [],
    pagination: createPaginationMeta(count || 0, page, limit),
  };
}

/**
 * Helper function to create pagination metadata
 */
function createPaginationMeta(totalItems: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Search suggestions using trigram similarity
 * Can be used for "did you mean?" functionality
 */
export async function getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
  const cacheKey = `search_suggestions_${query}_${limit}`;
  const cached = cache.get<string[]>(cacheKey);
  if (cached) {
    return cached;
  }

  logger.info('Getting search suggestions', { query, limit });
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .rpc('get_search_suggestions', {
        search_term: query,
        suggestion_limit: limit
      });

    if (error) {
      logger.warn('Search suggestions failed', { error: error.message });
      return [];
    }

    const suggestions = data || [];
    cache.set(cacheKey, suggestions, CACHE_CONFIG.ttl.medium, ['blog', 'suggestions']);
    return suggestions;
  } catch (error: any) {
    logger.error('Failed to get search suggestions', { query, error: error.message });
    return [];
  }
} 
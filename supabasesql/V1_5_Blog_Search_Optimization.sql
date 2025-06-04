-- V1.5 Blog Search Optimization
-- Optimizes the Post table for better search performance

-- Enable necessary extensions for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add GIN index for array search on tags (for faster tag searching)
CREATE INDEX IF NOT EXISTS "Post_tags_gin_idx" ON "Post" USING GIN ("tags");

-- Add full-text search indexes for better search performance
-- Create a combined tsvector column for title, excerpt, and content
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "search_vector" tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('dutch', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('dutch', coalesce("excerpt", '')), 'B') ||
  setweight(to_tsvector('dutch', coalesce("content", '')), 'C')
) STORED;

-- Create GIN index on the search vector for fast full-text search
CREATE INDEX IF NOT EXISTS "Post_search_vector_idx" ON "Post" USING GIN ("search_vector");

-- Add trigram indexes for fuzzy search on title and excerpt
CREATE INDEX IF NOT EXISTS "Post_title_trgm_idx" ON "Post" USING GIN ("title" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Post_excerpt_trgm_idx" ON "Post" USING GIN ("excerpt" gin_trgm_ops);

-- Optimize existing composite index for pagination
-- Add a more specific index for published posts ordered by publishedAt and createdAt
CREATE INDEX IF NOT EXISTS "Post_published_pagination_idx" ON "Post" ("published", "publishedAt" DESC NULLS LAST, "createdAt" DESC)
WHERE "published" = true;

-- Add index for category filtering combined with published status
CREATE INDEX IF NOT EXISTS "Post_published_category_idx" ON "Post" ("published", "category")
WHERE "published" = true;

-- Add partial index for draft posts (admin use)
CREATE INDEX IF NOT EXISTS "Post_drafts_idx" ON "Post" ("createdAt" DESC)
WHERE "published" = false;

-- Update table statistics for better query planning
ANALYZE "Post";

-- Add comments for documentation
COMMENT ON INDEX "Post_tags_gin_idx" IS 'GIN index for fast array contains searches on tags';
COMMENT ON INDEX "Post_search_vector_idx" IS 'Full-text search index for title, excerpt, and content';
COMMENT ON INDEX "Post_title_trgm_idx" IS 'Trigram index for fuzzy search on titles';
COMMENT ON INDEX "Post_excerpt_trgm_idx" IS 'Trigram index for fuzzy search on excerpts';
COMMENT ON INDEX "Post_published_pagination_idx" IS 'Optimized index for paginated published posts';
COMMENT ON COLUMN "Post"."search_vector" IS 'Generated tsvector for full-text search'; 
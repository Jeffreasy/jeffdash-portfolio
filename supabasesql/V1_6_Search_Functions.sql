-- V1.6 Search Functions
-- Creates database functions for optimized search functionality

-- Function for full-text search with pagination
CREATE OR REPLACE FUNCTION search_posts_fts(
  search_term TEXT,
  page_offset INTEGER DEFAULT 0,
  page_limit INTEGER DEFAULT 12
)
RETURNS TABLE (
  id TEXT,
  slug TEXT,
  title TEXT,
  excerpt TEXT,
  "featuredImageUrl" TEXT,
  "featuredImageAltText" TEXT,
  tags TEXT[],
  category TEXT,
  "publishedAt" TIMESTAMP(3),
  rank REAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.slug,
    p.title,
    p.excerpt,
    p."featuredImageUrl",
    p."featuredImageAltText",
    p.tags,
    p.category,
    p."publishedAt",
    ts_rank(p.search_vector, plainto_tsquery('dutch', search_term)) as rank
  FROM "Post" p
  WHERE 
    p.published = true 
    AND (
      p.search_vector @@ plainto_tsquery('dutch', search_term)
      OR p.tags && ARRAY[search_term]
    )
  ORDER BY 
    rank DESC,
    p."publishedAt" DESC NULLS LAST,
    p."createdAt" DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;

-- Function for getting search suggestions based on existing titles
CREATE OR REPLACE FUNCTION get_search_suggestions(
  search_term TEXT,
  suggestion_limit INTEGER DEFAULT 5
)
RETURNS TABLE (suggestion TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT p.title as suggestion
  FROM "Post" p
  WHERE 
    p.published = true
    AND (
      p.title % search_term 
      OR p.title ILIKE '%' || search_term || '%'
    )
  ORDER BY 
    similarity(p.title, search_term) DESC,
    p.title
  LIMIT suggestion_limit;
END;
$$;

-- Function for tag-based search with popularity ranking
CREATE OR REPLACE FUNCTION search_posts_by_tag(
  tag_name TEXT,
  page_offset INTEGER DEFAULT 0,
  page_limit INTEGER DEFAULT 12
)
RETURNS TABLE (
  id TEXT,
  slug TEXT,
  title TEXT,
  excerpt TEXT,
  "featuredImageUrl" TEXT,
  "featuredImageAltText" TEXT,
  tags TEXT[],
  category TEXT,
  "publishedAt" TIMESTAMP(3)
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.slug,
    p.title,
    p.excerpt,
    p."featuredImageUrl",
    p."featuredImageAltText",
    p.tags,
    p.category,
    p."publishedAt"
  FROM "Post" p
  WHERE 
    p.published = true 
    AND p.tags @> ARRAY[tag_name]
  ORDER BY 
    p."publishedAt" DESC NULLS LAST,
    p."createdAt" DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$;

-- Function to get popular tags (for tag cloud or suggestions)
CREATE OR REPLACE FUNCTION get_popular_tags(
  tag_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  tag TEXT,
  usage_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    unnest(p.tags) as tag,
    COUNT(*) as usage_count
  FROM "Post" p
  WHERE p.published = true
  GROUP BY unnest(p.tags)
  ORDER BY usage_count DESC, tag ASC
  LIMIT tag_limit;
END;
$$;

-- Function for related posts based on tags and category
CREATE OR REPLACE FUNCTION get_related_posts(
  post_slug TEXT,
  related_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  id TEXT,
  slug TEXT,
  title TEXT,
  excerpt TEXT,
  "featuredImageUrl" TEXT,
  "featuredImageAltText" TEXT,
  tags TEXT[],
  category TEXT,
  "publishedAt" TIMESTAMP(3),
  relevance_score INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
  current_post_tags TEXT[];
  current_post_category TEXT;
BEGIN
  -- Get the current post's tags and category
  SELECT p.tags, p.category 
  INTO current_post_tags, current_post_category
  FROM "Post" p 
  WHERE p.slug = post_slug AND p.published = true;
  
  -- Return related posts
  RETURN QUERY
  SELECT 
    p.id,
    p.slug,
    p.title,
    p.excerpt,
    p."featuredImageUrl",
    p."featuredImageAltText",
    p.tags,
    p.category,
    p."publishedAt",
    -- Calculate relevance score based on shared tags and category
    (
      CASE WHEN p.category = current_post_category THEN 2 ELSE 0 END +
      COALESCE(array_length(p.tags & current_post_tags, 1), 0)
    ) as relevance_score
  FROM "Post" p
  WHERE 
    p.published = true 
    AND p.slug != post_slug
    AND (
      p.category = current_post_category
      OR p.tags && current_post_tags
    )
  ORDER BY 
    relevance_score DESC,
    p."publishedAt" DESC
  LIMIT related_limit;
END;
$$;

-- Add function comments for documentation
COMMENT ON FUNCTION search_posts_fts IS 'Full-text search function with ranking and pagination';
COMMENT ON FUNCTION get_search_suggestions IS 'Get search suggestions based on trigram similarity';
COMMENT ON FUNCTION search_posts_by_tag IS 'Search posts by specific tag with pagination';
COMMENT ON FUNCTION get_popular_tags IS 'Get most popular tags across all published posts';
COMMENT ON FUNCTION get_related_posts IS 'Find related posts based on tags and category similarity'; 
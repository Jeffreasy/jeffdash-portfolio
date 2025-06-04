'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import { cache, cacheHelpers } from '@/lib/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { validateAdminSession } from './auth';

// TTL constants for cache
const CACHE_TTL = {
  short: 2 * 60 * 1000,      // 2 minutes
  medium: 10 * 60 * 1000,    // 10 minutes
  long: 60 * 60 * 1000,      // 1 hour
} as const;

// --- Types (Vereenvoudigd - TODO: Verbeteren) --- //

// Basis interface voor een Post (pas aan op basis van tabel)
interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  tags: string[];
  category: string | null;
  published: boolean;
  publishedAt: string | null; // Timestamps zijn strings van Supabase
  metaTitle: string | null;
  metaDescription: string | null;
  featuredImageAltText: string | null;
  createdAt: string;
  updatedAt: string;
}

// Add pagination types
export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedPostsResult = {
  posts: PublishedPostPreviewType[];
  pagination: PaginationMeta;
};

// Type voor publieke post preview
export type PublishedPostPreviewType = Pick<Post,
  'id' | 'slug' | 'title' | 'excerpt' | 'featuredImageUrl' | 'tags' | 'category' | 'publishedAt' | 'featuredImageAltText'
>;

// Type voor volledige publieke post
export type FullPostType = Post; // Voor nu, alle velden

// Type voor admin lijst item
export type AdminPostListItemType = Pick<Post,
  'id' | 'slug' | 'title' | 'category' | 'published' | 'publishedAt' | 'createdAt'
>;

// Type voor volledige admin post
export type FullAdminPostType = Post; // Voor nu, alle velden

// --- Zod Schema voor Post Validatie (blijft grotendeels hetzelfde) ---
const PostSchema = z.object({
  title: z.string().min(3, { message: 'Titel moet minimaal 3 tekens bevatten.' }),
  slug: z.string().min(3, { message: 'Slug moet minimaal 3 tekens bevatten.' })
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug mag alleen kleine letters, cijfers en koppeltekens bevatten.' }),
  content: z.string().min(10, { message: 'Inhoud moet minimaal 10 tekens bevatten.'}),
  excerpt: z.string().optional().nullable(), // Sta null toe
  featuredImageUrl: z.string().url({ message: 'Ongeldige URL voor uitgelichte afbeelding.' }).optional().or(z.literal('')).nullable(), // Sta null toe
  featuredImageAltText: z.string().optional().nullable(), // Sta null toe
  tags: z.preprocess((arg) => {
    if (typeof arg === 'string') return arg.split(',').map(item => item.trim()).filter(Boolean);
    return arg;
  }, z.array(z.string()).optional()),
  category: z.string().optional().nullable(), // Sta null toe
  published: z.preprocess((arg) => arg === 'on' || arg === true, z.boolean().default(false)),
  metaTitle: z.string().optional().nullable(), // Sta null toe
  metaDescription: z.string().optional().nullable(), // Sta null toe
});

// Type voor de state van de post actions
export type PostFormState = {
  success: boolean;
  message?: string;
  // Correct type voor errors: map keys naar string arrays
  errors?: Partial<Record<keyof z.infer<typeof PostSchema>, string[]>> & { general?: string[] };
  postSlug?: string | null;
};

// --- Actions --- //

/**
 * Haalt ALLE blog posts op voor de admin lijst.
 */
export async function getPosts(): Promise<AdminPostListItemType[]> {
  const cacheKey = 'admin_posts_list';
  const cached = cache.get<AdminPostListItemType[]>(cacheKey);
  if (cached) {
    logger.info('Returning cached admin posts list');
    return cached;
  }

  logger.info('Fetching all posts for admin list');
  const supabase = await createClient();
  
  try {
    await validateAdminSession();
    logger.info('Admin session validated for getPosts');

    const { data, error } = await supabase
      .from('Post')
      .select('id, slug, title, category, published, publishedAt, createdAt')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    cache.set(cacheKey, data || [], CACHE_TTL.medium, ['admin', 'posts']);
    return data || [];
  } catch (error: any) {
    logger.error('Failed to fetch posts for admin', { error: error.message || error });
    throw new Error(error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') 
      ? error.message 
      : 'Kon posts niet ophalen.');
  }
}

/**
 * Haalt een enkele post op basis van de slug voor de admin bewerkpagina.
 */
export async function getPostBySlugForAdmin(slug: string): Promise<FullAdminPostType | null> {
  const cacheKey = `admin_post_${slug}`;
  const cached = cache.get<FullAdminPostType>(cacheKey);
  if (cached) {
    logger.info('Returning cached admin post', { slug });
    return cached;
  }

  logger.info('Fetching post for admin edit', { slug });
  if (!slug) return null;
  
  const supabase = await createClient();

  try {
    await validateAdminSession();
    logger.info('Admin session validated for getPostBySlugForAdmin', { slug });

    const { data, error } = await supabase
      .from('Post')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.warn('Post not found for admin edit', { slug });
        return null;
      }
      throw error;
    }

    cache.set(cacheKey, data, CACHE_TTL.medium, ['admin', 'posts', `post-${slug}`]);
    return data;
  } catch (error: any) {
    logger.error('Failed to fetch post by slug for admin', { slug, error: error.message || error });
    throw new Error(error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')
      ? error.message
      : 'Kon post niet ophalen.');
  }
}

/**
 * Verwijdert een blog post.
 */
export async function deletePostAction(postId: string): Promise<{ success: boolean; message?: string }> {
  logger.info('Attempting to delete post', { postId });
  const supabase = await createClient();
  
  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for delete post action', { userId: session.userId });

    const { error } = await supabase
      .from('Post')
      .delete()
      .eq('id', postId);

    // Enhanced cache invalidation
    cacheHelpers.admin.invalidatePosts();
    cacheHelpers.blog.invalidateAll();

    revalidatePath('/admin_area/posts');
    revalidatePath('/blog');
    
    logger.info('Post deleted successfully', { postId });
    return { success: true, message: 'Post succesvol verwijderd.' };
  } catch (error: any) {
    logger.error('Failed to delete post', { postId, error: error.message || error });
    return { 
      success: false, 
      message: error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')
        ? error.message
        : 'Kon post niet verwijderen.' 
    };
  }
}

/**
 * Maakt een nieuwe blog post aan.
 */
export async function createPostAction(prevState: PostFormState | undefined, formData: FormData): Promise<PostFormState> {
  logger.info('Attempting to create new post');
  const supabase = await createClient();
  
  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for create post action', { userId: session.userId });

    // Extract and validate form data
    const formObject = Object.fromEntries(formData.entries());
    const result = PostSchema.safeParse(formObject);
    
    if (!result.success) {
      logger.warn('Post creation validation failed', { errors: result.error.flatten() });
      return {
        success: false,
        message: 'Validatiefout: Controleer de ingevoerde gegevens.',
        errors: result.error.flatten().fieldErrors,
      };
    }

    const validatedData = result.data;

    // Set publishedAt if published
    const publishedAt = validatedData.published ? new Date().toISOString() : null;

    const { data: post, error } = await supabase
      .from('Post')
      .insert({
        ...validatedData,
        publishedAt,
        featuredImageUrl: validatedData.featuredImageUrl || null,
        excerpt: validatedData.excerpt || null,
        featuredImageAltText: validatedData.featuredImageAltText || null,
        category: validatedData.category || null,
        metaTitle: validatedData.metaTitle || null,
        metaDescription: validatedData.metaDescription || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Enhanced cache invalidation
    cacheHelpers.admin.invalidatePosts();
    cacheHelpers.blog.invalidateAll();

    revalidatePath('/admin_area/posts');
    revalidatePath('/blog');
    
    logger.info('Post created successfully', { postId: post.id, slug: post.slug });
    
    return {
      success: true,
      message: 'Post succesvol aangemaakt!',
      postSlug: post.slug,
    };
  } catch (error: any) {
    logger.error('Failed to create post', { error: error.message || error });
    return {
      success: false,
      message: error.message?.includes('duplicate key') 
        ? 'Een post met deze slug bestaat al.'
        : error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')
        ? error.message
        : 'Kon post niet aanmaken.',
    };
  }
}

/**
 * Bewerkt een bestaande blog post.
 */
export async function updatePostAction(prevState: PostFormState | undefined, formData: FormData): Promise<PostFormState> {
  logger.info('Attempting to update post');
  const supabase = await createClient();
  
  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for update post action', { userId: session.userId });

    const postId = formData.get('postId') as string;
    if (!postId) {
      throw new Error('Post ID is required for update.');
    }

    // Extract and validate form data
    const formObject = Object.fromEntries(formData.entries());
    delete formObject.postId; // Remove postId from validation
    
    const result = PostSchema.safeParse(formObject);
    
    if (!result.success) {
      logger.warn('Post update validation failed', { errors: result.error.flatten() });
      return {
        success: false,
        message: 'Validatiefout: Controleer de ingevoerde gegevens.',
        errors: result.error.flatten().fieldErrors,
      };
    }

    const validatedData = result.data;

    // Handle published state changes
    let publishedAt: string | null = null;
    if (validatedData.published) {
      // Check if post was already published
      const { data: existingPost } = await supabase
        .from('Post')
        .select('publishedAt')
        .eq('id', postId)
        .single();
      
      publishedAt = existingPost?.publishedAt || new Date().toISOString();
    }

    const { data: post, error } = await supabase
      .from('Post')
      .update({
        ...validatedData,
        publishedAt,
        featuredImageUrl: validatedData.featuredImageUrl || null,
        excerpt: validatedData.excerpt || null,
        featuredImageAltText: validatedData.featuredImageAltText || null,
        category: validatedData.category || null,
        metaTitle: validatedData.metaTitle || null,
        metaDescription: validatedData.metaDescription || null,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;

    // Enhanced cache invalidation for specific post
    cacheHelpers.admin.invalidatePosts();
    cacheHelpers.blog.invalidatePost(post.slug);
    cacheHelpers.blog.invalidatePagination();

    revalidatePath('/admin_area/posts');
    revalidatePath(`/admin_area/posts/${post.slug}`);
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    
    logger.info('Post updated successfully', { postId: post.id, slug: post.slug });
    
    return {
      success: true,
      message: 'Post succesvol bijgewerkt!',
      postSlug: post.slug,
    };
  } catch (error: any) {
    logger.error('Failed to update post', { error: error.message || error });
    return {
      success: false,
      message: error.message?.includes('duplicate key') 
        ? 'Een post met deze slug bestaat al.'
        : error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')
        ? error.message
        : 'Kon post niet bijwerken.',
    };
  }
}

// --- Publieke Actions ---

/**
 * Haalt gepubliceerde blog posts op met paginering en optionele zoekfunctionaliteit.
 */
export async function getPublishedPosts(
  page: number = 1,
  limit: number = 12,
  searchQuery?: string
): Promise<PaginatedPostsResult> {
  const cacheKey = `published_posts_page_${page}_limit_${limit}_search_${searchQuery || 'none'}`;
  const cached = cache.get<PaginatedPostsResult>(cacheKey);
  if (cached) {
    logger.info('Returning cached published posts with pagination', { page, limit, searchQuery });
    return cached;
  }

  logger.info('Fetching published posts with pagination', { page, limit, searchQuery });
  const supabase = await createClient();
  
  try {
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Base query
    let query = supabase
      .from('Post')
      .select('id, slug, title, excerpt, featuredImageUrl, featuredImageAltText, tags, category, publishedAt', { count: 'exact' })
      .eq('published', true);

    // Add search functionality if provided
    if (searchQuery && searchQuery.trim()) {
      const searchTerm = searchQuery.trim();
      query = query.or(
        `title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
      );
    }

    // Add pagination and ordering
    const { data, error, count } = await query
      .order('publishedAt', { ascending: false })
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Calculate pagination metadata
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const result: PaginatedPostsResult = {
      posts: data || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage,
      },
    };

    // Cache with appropriate TTL and tags
    const ttl = searchQuery ? CACHE_TTL.short : CACHE_TTL.medium;
    const tags = ['blog', 'published-posts'];
    if (searchQuery) tags.push('search');
    
    cache.set(cacheKey, result, ttl, tags);
    return result;
  } catch (error: any) {
    logger.error('Failed to fetch published posts with pagination', { 
      page, 
      limit, 
      searchQuery, 
      error: error.message || error 
    });
    throw new Error('Kon blog posts niet ophalen.');
  }
}

// Legacy function for backward compatibility - now calls the paginated version
export async function getPublishedPostsLegacy(limit?: number): Promise<PublishedPostPreviewType[]> {
  const result = await getPublishedPosts(1, limit || 12);
  return result.posts;
}

/**
 * Zoekt in gepubliceerde blog posts.
 */
export async function searchPublishedPosts(
  searchQuery: string,
  page: number = 1,
  limit: number = 12
): Promise<PaginatedPostsResult> {
  return getPublishedPosts(page, limit, searchQuery);
}

/**
 * Haalt een enkele publieke post op.
 */
export async function getPostBySlug(slug: string): Promise<FullPostType | null> {
  const cacheKey = `published_post_${slug}`;
  const cached = cache.get<FullPostType>(cacheKey);
  if (cached) {
    logger.info('Returning cached published post', { slug });
    return cached;
  }

  logger.info('Fetching published post by slug', { slug });
  if (!slug) return null;
  
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('Post')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.warn('Published post not found', { slug });
        return null;
      }
      throw error;
    }

    cache.set(cacheKey, data, CACHE_TTL.long, ['blog', 'published-posts', `post-${slug}`]);
    return data;
  } catch (error: any) {
    logger.error('Failed to fetch published post by slug', { slug, error: error.message || error });
    return null;
  }
} 
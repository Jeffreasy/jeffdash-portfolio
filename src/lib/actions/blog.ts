'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { validateAdminSession } from './auth';

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
  logger.info('Fetching all posts for admin list with Supabase');
  const supabase = await createClient();
  try {
    // TODO: Autorisatie check? - Aangenomen dat de pagina beveiligd is.
    const { data, error } = await supabase
      .from('Post') // Tabelnaam 'Post'
      .select('id, slug, title, category, published, publishedAt, createdAt') // Selecteer benodigde velden
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    logger.error('Failed to fetch posts for admin', { error: error.message || error });
    return [];
  }
}

/**
 * Haalt een enkele post op basis van de slug voor de admin bewerkpagina.
 */
export async function getPostBySlugForAdmin(slug: string): Promise<FullAdminPostType | null> {
  logger.info('Fetching post for admin edit with Supabase', { slug });
  if (!slug) return null;
  const supabase = await createClient();

  try {
    // TODO: Autorisatie check?
    const { data, error } = await supabase
      .from('Post')
      .select('*') // Haal alle velden op voor bewerken
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
         logger.warn('Post not found for admin edit', { slug });
         return null;
      }
      throw error;
    }
    return data;
  } catch (error: any) {
    logger.error('Failed to fetch post by slug for admin', { slug, error: error.message || error });
    return null;
  }
}

/**
 * Verwijdert een blog post.
 */
export async function deletePostAction(postId: string): Promise<{ success: boolean; message?: string }> {
  logger.info('Attempting to delete post with Supabase', { postId });
  const supabase = await createClient();
  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for delete post action', { userId: session.userId });

    // Verwijder de post
    const { error } = await supabase
      .from('Post')
      .delete()
      .eq('id', postId);

    if (error) throw error;

    logger.info('Post successfully deleted', { postId, userId: session.userId });
    revalidatePath('/admin_area/posts');
    revalidatePath('/blog');
    // TODO: Revalidate specifieke post pagina
    // const postSlug = ??? // Slug is niet bekend hier, mogelijk apart ophalen of niet revalideren.
    // if (postSlug) revalidatePath(`/blog/${postSlug}`);
    return { success: true, message: 'Blog post succesvol verwijderd.' };

  } catch (error: any) {
    logger.error('Failed to delete post', { postId, error: error.message || error });
    let errorMessage = 'Kon blog post niet verwijderen door een serverfout.';
     if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
         errorMessage = error.message;
    } else if (error.code === 'PGRST116') {
         errorMessage = 'Blog post niet gevonden om te verwijderen.';
    }
    return { success: false, message: errorMessage };
  }
}

/**
 * Maakt een nieuwe blog post aan.
 */
export async function createPostAction(prevState: PostFormState | undefined, formData: FormData): Promise<PostFormState> {
  logger.info('Create post action started with Supabase');
  const supabase = await createClient();

  try {
    // Autorisatie
    const session = await validateAdminSession();
    logger.info('Admin session validated for create post action', { userId: session.userId });

    // Validatie
    const validatedFields = PostSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
      logger.warn('Post validation failed (create)', { errors: validatedFields.error.flatten().fieldErrors });
      return {
        success: false,
        message: 'Validatiefouten gevonden.',
        // Gebruik Zod's error object direct (met spread)
        errors: { ...validatedFields.error.flatten().fieldErrors }, // Herstel spread, verwijder assertie
      };
    }

    // Prepare data for Supabase (handle nulls)
    const { published, ...restData } = validatedFields.data;
    const postDataToInsert = {
      ...restData,
      excerpt: restData.excerpt || null,
      featuredImageUrl: restData.featuredImageUrl || null,
      featuredImageAltText: restData.featuredImageAltText || null,
      tags: restData.tags || [],
      category: restData.category || null,
      metaTitle: restData.metaTitle || null,
      metaDescription: restData.metaDescription || null,
      published: published,
      // Zet publishedAt alleen als de post gepubliceerd wordt
      publishedAt: published ? new Date().toISOString() : null,
      // createdAt en updatedAt worden beheerd door de database (als DEFAULT is ingesteld)
      // Anders moeten we ze hier toevoegen:
      // createdAt: new Date().toISOString(),
      // updatedAt: new Date().toISOString(),
    };


    // Database Insert
    logger.info('Attempting to insert post into Supabase', { slug: postDataToInsert.slug });
    const { data: newPost, error: insertError } = await supabase
      .from('Post')
      .insert(postDataToInsert)
      .select('id, slug') // Vraag id en slug terug
      .single();

    if (insertError || !newPost) {
      logger.error('Supabase insert error Post:', { error: insertError });
      if (insertError?.code === '23505' && insertError?.message.includes('Post_slug_key')) {
         return {
           success: false,
           message: 'De opgegeven slug bestaat al.',
           errors: { slug: ['Deze slug is al in gebruik.'] }
         };
      }
      throw insertError || new Error('Kon post niet aanmaken in database.');
    }

    logger.info('Post successfully created', { postId: newPost.id, slug: newPost.slug, userId: session.userId });
    const newPostSlug = newPost.slug;

    // Revalidate paths
    revalidatePath('/admin_area/posts');
    if (published) {
        revalidatePath('/blog');
        revalidatePath(`/blog/${newPostSlug}`);
    }

    return {
      success: true,
      message: 'Blog post succesvol aangemaakt!',
      postSlug: newPostSlug,
    };

  } catch (error: any) {
    logger.error('Failed to create post', { error: error.message || error });
    return {
      success: false,
      message: error.message || 'Kon post niet aanmaken door een serverfout.',
      errors: { general: [error.message || 'Serverfout.'] },
    };
  }
}

/**
 * Werkt een bestaande blog post bij.
 */
export async function updatePostAction(prevState: PostFormState | undefined, formData: FormData): Promise<PostFormState> {
  logger.info('Update post action started with Supabase');
  const postId = formData.get('postId') as string;
  const supabase = await createClient();

  if (!postId) {
      return { success: false, message: 'Post ID ontbreekt.', errors: { general: ['Post ID niet gevonden.'] } };
  }
  logger.info('Attempting to update post', { postId });

  try {
    // Autorisatie
    const session = await validateAdminSession();
     logger.info('Admin session validated for update post action', { userId: session.userId, postId });

    // Validatie
    const validatedFields = PostSchema.safeParse(Object.fromEntries(formData));
     if (!validatedFields.success) {
      logger.warn('Post validation failed (update)', { postId, errors: validatedFields.error.flatten().fieldErrors });
      return {
        success: false,
        message: 'Validatiefouten gevonden.',
        errors: { ...validatedFields.error.flatten().fieldErrors }, // Herstel spread, verwijder assertie
        postSlug: formData.get('slug') as string | null // Geef huidige slug terug voor formulier
      };
    }

    // Haal huidige publicatiestatus op om publishedAt correct te zetten
    const { data: currentPost, error: currentPostError } = await supabase
       .from('Post')
       .select('published, publishedAt')
       .eq('id', postId)
       .single();

    if (currentPostError) {
       logger.error('Could not fetch current post status before update', { postId, error: currentPostError });
       // Ga door, maar publishedAt is mogelijk niet perfect
    }

    // Prepare data for Supabase
    const { published, ...restData } = validatedFields.data;
    let publishedAtValue = currentPost?.publishedAt; // Behoud oude waarde standaard

    // Update publishedAt:
    // 1. Als post NU gepubliceerd wordt en NOG NIET gepubliceerd was: zet timestamp
    if (published && !currentPost?.published) {
       publishedAtValue = new Date().toISOString();
    }
    // 2. Als post NIET MEER gepubliceerd wordt: zet op null
    else if (!published) {
       publishedAtValue = null;
    }
    // 3. Anders (was al gepubliceerd en blijft gepubliceerd): behoud bestaande waarde

    const postDataToUpdate = {
      ...restData,
      excerpt: restData.excerpt || null,
      featuredImageUrl: restData.featuredImageUrl || null,
      featuredImageAltText: restData.featuredImageAltText || null,
      tags: restData.tags || [],
      category: restData.category || null,
      metaTitle: restData.metaTitle || null,
      metaDescription: restData.metaDescription || null,
      published: published,
      publishedAt: publishedAtValue,
      updatedAt: new Date().toISOString(), // Altijd updatedAt bijwerken
    };

    // Database Update
     logger.info('Attempting to update post in Supabase', { postId, slug: postDataToUpdate.slug });
     const { data: updatedPost, error: updateError } = await supabase
       .from('Post')
       .update(postDataToUpdate)
       .eq('id', postId)
       .select('slug') // Vraag slug terug
       .single();

     if (updateError || !updatedPost) {
       logger.error('Supabase update error Post:', { postId, error: updateError });
       if (updateError?.code === '23505' && updateError?.message.includes('Post_slug_key')) {
          return {
            success: false,
            message: 'De opgegeven slug bestaat al.',
            errors: { slug: ['Deze slug is al in gebruik.'] },
            postSlug: formData.get('slug') as string | null
          };
       }
        if (updateError?.code === 'PGRST116') {
             return { success: false, message: 'Post niet gevonden om bij te werken.', errors: { general: ['Post niet gevonden.'] } };
        }
       throw updateError || new Error('Kon post niet bijwerken in database.');
     }

     logger.info('Post successfully updated', { postId, slug: updatedPost.slug, userId: session.userId });
     const updatedPostSlug = updatedPost.slug;

    // Revalidate paths
    revalidatePath('/admin_area/posts');
    revalidatePath(`/admin_area/posts/${updatedPostSlug}`); // Admin detail/edit
    revalidatePath('/blog'); // Publieke lijst
    revalidatePath(`/blog/${updatedPostSlug}`); // Publieke detail

    return {
      success: true,
      message: 'Blog post succesvol bijgewerkt!',
      postSlug: updatedPostSlug,
    };

  } catch (error: any) {
     logger.error('Failed to update post', { postId, error: error.message || error });
     return {
       success: false,
       message: error.message || 'Kon post niet bijwerken door een serverfout.',
       errors: { general: [error.message || 'Serverfout.'] },
       postSlug: formData.get('slug') as string | null // Geef slug terug voor formulier
     };
  }
}

// --- Publieke Actions ---

/**
 * Haalt gepubliceerde blog posts op (voor publieke weergave).
 * @param limit Optioneel: Het maximale aantal posts om op te halen.
 */
export async function getPublishedPosts(limit?: number): Promise<PublishedPostPreviewType[]> {
  logger.info(`Fetching published posts for public view${limit ? ` (limit: ${limit})` : ''} with Supabase`);
  const supabase = await createClient();
  try {
    // Bouw de query op
    let query = supabase
      .from('Post')
      .select('id, slug, title, excerpt, featuredImageUrl, tags, category, publishedAt, featuredImageAltText')
      .eq('published', true)
      .order('publishedAt', { ascending: false });

    // Voeg limiet toe indien opgegeven
    if (limit) {
      query = query.limit(limit);
    }

    // Voer de query uit
    const { data, error } = await query;

    if (error) throw error;

    // Filter posts zonder publishedAt (shouldn't happen with .eq('published', true) and order, but safety check)
    const validPosts = (data || []).filter(post => post.publishedAt);

    return validPosts;
  } catch (error: any) {
    logger.error('Failed to fetch published posts', { error: error.message || error });
    return [];
  }
}

/**
 * Haalt een enkele gepubliceerde post op basis van de slug.
 */
export async function getPostBySlug(slug: string): Promise<FullPostType | null> {
  logger.info('Fetching published post by slug with Supabase', { slug });
  if (!slug) return null;
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('Post')
      .select('*') // Alle velden nodig voor detailweergave
      .eq('slug', slug)
      .eq('published', true) // Moet gepubliceerd zijn
      // .lte('publishedAt', new Date().toISOString()) // Optioneel: check toekomst datum
      .single();

      if (error) {
         if (error.code === 'PGRST116') { // Not found (of niet gepubliceerd)
            logger.warn('Published post not found by slug', { slug });
            return null;
         }
         throw error;
      }
      return data;
   } catch (error: any) {
     logger.error('Failed to fetch published post by slug', { slug, error: error.message || error });
     return null;
   }
} 
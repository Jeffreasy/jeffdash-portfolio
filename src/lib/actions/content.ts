'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import { z } from 'zod';

// Cache configuration
const CACHE_CONFIG = {
  ttl: 5 * 60 * 1000, // 5 minutes
};

// In-memory cache (in production, use Redis or similar)
const cache = new Map<string, { data: any; timestamp: number }>();

// Cache helper functions
function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_CONFIG.ttl) {
    cache.delete(key);
    return null;
  }
  return cached.data as T;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Zod schema for content validation
const ContentSchema = z.object({
  title: z.string().min(3, { message: 'Titel moet minimaal 3 tekens bevatten.' }),
  slug: z.string().min(3, { message: 'Slug moet minimaal 3 tekens bevatten.' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug mag alleen kleine letters, cijfers en koppeltekens bevatten.' }),
  content: z.string().min(10, { message: 'Inhoud moet minimaal 10 tekens bevatten.' }),
  type: z.enum(['page', 'section']),
  published: z.preprocess((arg) => arg === 'on' || arg === true, z.boolean().default(false)),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

// Type for the state of the content form
export type ContentFormState = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof ContentSchema>, string[]>> & { general?: string[] };
  contentSlug?: string | null;
};

/**
 * Gets all content items for the admin area.
 */
export async function getContentItems() {
  const cacheKey = 'admin_content_list';
  const cached = getCached(cacheKey);
  if (cached) {
    logger.info('Returning cached content list');
    return cached;
  }

  logger.info('Fetching content items for admin');
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('Content')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    setCached(cacheKey, data || []);
    return data || [];
  } catch (error: any) {
    logger.error('Failed to fetch content items', { error: error.message || error });
    throw new Error('Kon content items niet ophalen.');
  }
}

/**
 * Gets a single content item by slug.
 */
export async function getContentBySlug(slug: string) {
  const cacheKey = `content_${slug}`;
  const cached = getCached(cacheKey);
  if (cached) {
    logger.info('Returning cached content', { slug });
    return cached;
  }

  logger.info('Fetching content by slug', { slug });
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('Content')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        logger.warn('Content not found', { slug });
        return null;
      }
      throw error;
    }

    setCached(cacheKey, data);
    return data;
  } catch (error: any) {
    logger.error('Failed to fetch content by slug', { slug, error: error.message || error });
    throw new Error('Kon content niet ophalen.');
  }
}

/**
 * Creates a new content item.
 */
export async function createContentAction(prevState: ContentFormState | undefined, formData: FormData): Promise<ContentFormState> {
  logger.info('Create content action started');
  const supabase = await createClient();

  try {
    const validatedFields = ContentSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
      logger.warn('Content validation failed', { errors: validatedFields.error.flatten().fieldErrors });
      return {
        success: false,
        message: 'Validatiefouten gevonden.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { published, ...restData } = validatedFields.data;
    const contentDataToInsert = {
      ...restData,
      metaTitle: restData.metaTitle || null,
      metaDescription: restData.metaDescription || null,
      published,
      publishedAt: published ? new Date().toISOString() : null,
    };

    logger.info('Attempting to insert content', { slug: contentDataToInsert.slug });
    const { data: newContent, error: insertError } = await supabase
      .from('Content')
      .insert(contentDataToInsert)
      .select('id, slug')
      .single();

    if (insertError || !newContent) {
      logger.error('Content insert error', { error: insertError });
      if (insertError?.code === '23505' && insertError?.message.includes('Content_slug_key')) {
        return {
          success: false,
          message: 'De opgegeven slug bestaat al.',
          errors: { slug: ['Deze slug is al in gebruik.'] }
        };
      }
      throw insertError || new Error('Kon content niet aanmaken in database.');
    }

    // Clear relevant caches
    cache.delete('admin_content_list');

    logger.info('Content successfully created', { contentId: newContent.id, slug: newContent.slug });
    const newContentSlug = newContent.slug;

    revalidatePath('/admin_area/content');
    if (published) {
      revalidatePath(`/${newContentSlug}`);
    }

    return {
      success: true,
      message: 'Content succesvol aangemaakt!',
      contentSlug: newContentSlug,
    };
  } catch (error: any) {
    logger.error('Failed to create content', { error: error.message || error });
    return {
      success: false,
      message: 'Er is een fout opgetreden bij het aanmaken van de content.',
      errors: { general: ['Server error'] }
    };
  }
}

/**
 * Updates an existing content item.
 */
export async function updateContentAction(contentId: string, prevState: ContentFormState | undefined, formData: FormData): Promise<ContentFormState> {
  logger.info('Update content action started', { contentId });
  const supabase = await createClient();

  try {
    const validatedFields = ContentSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
      logger.warn('Content validation failed', { errors: validatedFields.error.flatten().fieldErrors });
      return {
        success: false,
        message: 'Validatiefouten gevonden.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { published, ...restData } = validatedFields.data;
    const contentDataToUpdate = {
      ...restData,
      metaTitle: restData.metaTitle || null,
      metaDescription: restData.metaDescription || null,
      published,
      publishedAt: published ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    logger.info('Attempting to update content', { contentId, slug: contentDataToUpdate.slug });
    const { data: updatedContent, error: updateError } = await supabase
      .from('Content')
      .update(contentDataToUpdate)
      .eq('id', contentId)
      .select('slug')
      .single();

    if (updateError || !updatedContent) {
      logger.error('Content update error', { error: updateError });
      if (updateError?.code === '23505' && updateError?.message.includes('Content_slug_key')) {
        return {
          success: false,
          message: 'De opgegeven slug bestaat al.',
          errors: { slug: ['Deze slug is al in gebruik.'] }
        };
      }
      throw updateError || new Error('Kon content niet bijwerken in database.');
    }

    // Clear relevant caches
    cache.delete('admin_content_list');
    cache.delete(`content_${updatedContent.slug}`);

    logger.info('Content successfully updated', { contentId, slug: updatedContent.slug });
    revalidatePath('/admin_area/content');
    revalidatePath(`/${updatedContent.slug}`);

    return {
      success: true,
      message: 'Content succesvol bijgewerkt!',
      contentSlug: updatedContent.slug,
    };
  } catch (error: any) {
    logger.error('Failed to update content', { contentId, error: error.message || error });
    return {
      success: false,
      message: 'Er is een fout opgetreden bij het bijwerken van de content.',
      errors: { general: ['Server error'] }
    };
  }
}

/**
 * Deletes a content item.
 */
export async function deleteContentAction(contentId: string): Promise<{ success: boolean; message?: string }> {
  logger.info('Attempting to delete content', { contentId });
  const supabase = await createClient();

  try {
    // Get the content slug before deleting
    const { data: content, error: fetchError } = await supabase
      .from('Content')
      .select('slug')
      .eq('id', contentId)
      .single();

    if (fetchError) throw fetchError;

    const { error: deleteError } = await supabase
      .from('Content')
      .delete()
      .eq('id', contentId);

    if (deleteError) throw deleteError;

    // Clear relevant caches
    cache.delete('admin_content_list');
    if (content?.slug) {
      cache.delete(`content_${content.slug}`);
    }

    logger.info('Content successfully deleted', { contentId });
    revalidatePath('/admin_area/content');
    if (content?.slug) {
      revalidatePath(`/${content.slug}`);
    }

    return { success: true, message: 'Content succesvol verwijderd.' };
  } catch (error: any) {
    logger.error('Failed to delete content', { contentId, error: error.message || error });
    return { success: false, message: 'Kon content niet verwijderen.' };
  }
}

// Interface uitgebreid met optionele profielafbeelding velden
export interface AboutContent {
  about_title?: string;
  about_intro?: string;
  about_focus?: string;
  about_projects?: string;
  about_contact?: string;
  linkedin_url?: string;
  github_url?: string;
  profileImageUrl?: string;
  profileImageAlt?: string;
}

/**
 * Haalt specifieke content keys en de profielafbeelding op
 * voor de 'Over Mij' pagina.
 * @returns Een object met de opgehaalde data, of een grotendeels leeg object bij fouten.
 */
export async function getAboutContent(): Promise<AboutContent> {
  logger.info('Fetching about page data (content & image)');
  const supabase = await createClient();

  // Definieer de keys voor tekstuele content
  const textKeysToFetch = [
    'about_title',
    'about_intro',
    'about_focus',
    'about_projects',
    'about_contact',
    'linkedin_url',
    'github_url'
  ];
  const profileImageKey = 'about_profile_picture';

  try {
    // Parallel ophalen van tekstuele content en afbeelding
    const [textContentResponse, imageResponse] = await Promise.all([
      supabase
        .from('SiteContent')
        .select('key, value')
        .in('key', textKeysToFetch),
      supabase
        .from('SiteImage')
        .select('url, altText')
        .eq('contentKey', profileImageKey)
        .order('order', { ascending: true })
        .limit(1)
        .maybeSingle() // Retourneert null ipv error als niks gevonden wordt
    ]);

    // Verwerk tekstuele content
    if (textContentResponse.error) {
      logger.error('Supabase error fetching SiteContent', { error: textContentResponse.error });
      // Gooi geen error, ga door en retourneer wat we hebben (of leeg object)
    }
    const content: AboutContent = (textContentResponse.data || []).reduce((acc, item) => {
      acc[item.key as keyof AboutContent] = item.value;
      return acc;
    }, {} as AboutContent);

    // Verwerk afbeelding
    if (imageResponse.error) {
      logger.error('Supabase error fetching SiteImage', { error: imageResponse.error });
      // Ga door, afbeelding zal leeg blijven in het resultaat
    }
    if (imageResponse.data) {
      content.profileImageUrl = imageResponse.data.url;
      content.profileImageAlt = imageResponse.data.altText;
    }

    logger.info('Successfully fetched about content and image', {
       keys: Object.keys(content).filter(k => !k.includes('Image')),
       imageFetched: !!content.profileImageUrl
    });
    return content;

  } catch (error: any) {
    logger.error('Failed to fetch about page data', { error: error.message || error });
    return {}; // Fallback naar leeg object
  }
}

/**
 * Haalt de profielafbeelding op uit de SiteImage tabel.
 * @returns Een object met url en alt, of een leeg object bij een fout of geen afbeelding.
 */
export async function getProfilePicture(): Promise<{ url?: string; alt?: string }> {
  logger.info('Fetching profile picture from SiteImage');
  const supabase = await createClient();
  const profileImageKey = 'about_profile_picture';

  try {
    const { data, error } = await supabase
      .from('SiteImage')
      .select('url, altText')
      .eq('contentKey', profileImageKey)
      .order('order', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      logger.error('Supabase error fetching profile picture', { error });
      throw error;
    }

    if (data) {
      logger.info('Profile picture fetched successfully');
      return { url: data.url, alt: data.altText };
    }

    logger.info('No profile picture found in SiteImage');
    return {}; // Geen afbeelding gevonden

  } catch (error: any) {
    logger.error('Failed to fetch profile picture', { error: error.message || error });
    return {}; // Fallback bij fout
  }
}

// Eventueel andere functies hier om andere site content op te halen...
// export async function getSiteConfigValue(key: string): Promise<string | null> { ... } 
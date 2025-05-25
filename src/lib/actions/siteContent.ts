'use server';

import { z } from 'zod';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { validateAdminSession } from './auth';

// Types
interface SiteContentItem {
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export type SiteContentType = SiteContentItem;

// About content structure
export interface AboutContentType {
  about_title: string;
  about_intro: string;
  about_focus: string;
  about_projects: string;
  about_contact: string;
  linkedin_url: string;
  github_url: string;
}

// Zod schema for about content validation
const AboutContentSchema = z.object({
  about_title: z.string().min(1, { message: 'Titel is verplicht.' }),
  about_intro: z.string().min(10, { message: 'Intro moet minimaal 10 tekens bevatten.' }),
  about_focus: z.string().min(10, { message: 'Focus sectie moet minimaal 10 tekens bevatten.' }),
  about_projects: z.string().min(10, { message: 'Projecten sectie moet minimaal 10 tekens bevatten.' }),
  about_contact: z.string().min(10, { message: 'Contact sectie moet minimaal 10 tekens bevatten.' }),
  linkedin_url: z.string().url({ message: 'LinkedIn URL moet een geldige URL zijn.' }),
  github_url: z.string().url({ message: 'GitHub URL moet een geldige URL zijn.' }),
});

export type AboutFormState = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof AboutContentType, string[]>> & { general?: string[] };
};

/**
 * Haalt alle site content op
 */
export async function getSiteContent(): Promise<SiteContentType[]> {
  logger.info('Fetching all site content');
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('SiteContent')
      .select('*')
      .order('key', { ascending: true });

    if (error) throw error;

    logger.info(`Fetched ${data?.length ?? 0} site content items`);
    return data || [];
  } catch (error: any) {
    logger.error('Failed to fetch site content', { error: error.message || error });
    throw new Error('Kon site content niet ophalen.');
  }
}

/**
 * Haalt about content op voor de admin
 */
export async function getAboutContentForAdmin(): Promise<AboutContentType> {
  logger.info('Fetching about content for admin');
  const supabase = await createClient();
  
  try {
    await validateAdminSession();
    logger.info('Admin session validated for getAboutContentForAdmin');

    const { data, error } = await supabase
      .from('SiteContent')
      .select('key, value')
      .in('key', [
        'about_title',
        'about_intro', 
        'about_focus',
        'about_projects',
        'about_contact',
        'linkedin_url',
        'github_url'
      ]);

    if (error) throw error;

    // Convert array to object
    const contentObj = data.reduce((acc, item) => {
      acc[item.key as keyof AboutContentType] = item.value;
      return acc;
    }, {} as AboutContentType);

    logger.info('About content fetched successfully for admin');
    return contentObj;
  } catch (error: any) {
    logger.error('Failed to fetch about content for admin', { error: error.message || error });
    throw new Error(error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? error.message : 'Kon about content niet ophalen.');
  }
}

/**
 * Update about content
 */
export async function updateAboutContent(prevState: AboutFormState | undefined, formData: FormData): Promise<AboutFormState> {
  logger.info('Updating about content');
  const supabase = await createClient();

  try {
    const session = await validateAdminSession();
    logger.info('Admin session validated for updateAboutContent', { userId: session.userId });

    // Validate form data
    const validatedFields = AboutContentSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
      logger.warn('About content validation failed', { errors: validatedFields.error.flatten().fieldErrors });
      return {
        success: false,
        message: 'Validatiefouten gevonden.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const contentData = validatedFields.data;
    const now = new Date().toISOString();

    // Update each content item
    const updates = Object.entries(contentData).map(([key, value]) => ({
      key,
      value,
      updatedAt: now,
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('SiteContent')
        .upsert(
          {
            key: update.key,
            value: update.value,
            updatedAt: update.updatedAt,
            createdAt: update.updatedAt, // For new items
          },
          {
            onConflict: 'key'
          }
        );

      if (error) {
        logger.error('Failed to update content item', { key: update.key, error: error.message });
        throw error;
      }
    }

    logger.info('About content updated successfully', { userId: session.userId });
    revalidatePath('/admin_area/about');
    revalidatePath('/about');
    
    return {
      success: true,
      message: 'About content succesvol bijgewerkt!',
    };
  } catch (error: any) {
    logger.error('Failed to update about content', { error: error.message || error });
    return {
      success: false,
      message: 'Er is een fout opgetreden bij het bijwerken van de content.',
      errors: { general: ['Server error'] }
    };
  }
} 
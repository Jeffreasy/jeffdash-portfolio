'use server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

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
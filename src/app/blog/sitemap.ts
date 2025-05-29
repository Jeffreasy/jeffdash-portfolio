import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';

export async function generateSitemaps() {
  const supabase = await createClient();
  
  // Haal het totale aantal posts op
  const { count } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('published', true);
    
  // Bereken het aantal sitemaps (50 posts per sitemap)
  const POSTS_PER_SITEMAP = 50;
  const totalSitemaps = Math.ceil((count || 0) / POSTS_PER_SITEMAP);
  
  return Array.from({ length: totalSitemaps }, (_, i) => ({ id: i }));
}

export default async function sitemap({ 
  id 
}: { 
  id: number 
}): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = SITE_CONFIG.url;
  
  // Bereken de range voor deze sitemap
  const POSTS_PER_SITEMAP = 50;
  const start = id * POSTS_PER_SITEMAP;
  
  // Haal posts op voor deze sitemap
  const { data: posts } = await supabase
    .from('Post')
    .select('slug, updatedAt')
    .eq('published', true)
    .range(start, start + POSTS_PER_SITEMAP - 1)
    .order('updatedAt', { ascending: false });
  
  if (!posts || posts.length === 0) {
    return [];
  }
  
  return posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
}
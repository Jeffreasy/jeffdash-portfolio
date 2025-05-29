import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/config'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Create a build-time safe client without cookies
function createBuildTimeClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const currentDate = new Date();
  const supabase = createBuildTimeClient();

  // Static routes met verbeterde prioriteiten en frequenties
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Fetch projects from Supabase
  const { data: projects, error: projectsError } = await supabase
    .from('Project')
    .select('slug, updatedAt, featured');
  
  if (projectsError) {
    console.error('Error fetching projects for sitemap:', projectsError);
  }

  // Create project routes with priority based on featured status
  const projectRoutes: MetadataRoute.Sitemap = projects?.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: project.featured ? 0.8 : 0.7,
  })) || [];

  // Fetch posts from Supabase
  const { data: posts, error: postsError } = await supabase
    .from('Post')
    .select('slug, updatedAt, published')
    .eq('published', true);
  
  if (postsError) {
    console.error('Error fetching posts for sitemap:', postsError);
  }

  // Create post routes with recency-based priority
  const postRoutes: MetadataRoute.Sitemap = posts?.map((post) => {
    // Calculate post age in days
    const postDate = new Date(post.updatedAt);
    const daysSinceUpdate = Math.floor((Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Higher priority for newer posts
    let priority = 0.7;
    if (daysSinceUpdate < 7) priority = 0.8;  // Less than a week old
    if (daysSinceUpdate < 30) priority = 0.75; // Less than a month old
    
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: postDate,
      changeFrequency: daysSinceUpdate < 30 ? 'weekly' : 'monthly' as const,
      priority,
    };
  }) || [];

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...postRoutes,
  ];
}

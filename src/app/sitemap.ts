import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/config'

// Import your data fetching functions for dynamic content
// import { getAllProjects } from '@/lib/actions/projects'
// import { getAllPosts } from '@/lib/actions/blog'

// Placeholder voor sitemap. Pas dit aan met je daadwerkelijke routes.
// Zie: https://nextjs.org/docs/app/api-reference/file-conventions/sitemap

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const currentDate = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly',
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
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  // TODO: Add dynamic routes when database is set up
  // const projects = await getAllProjects();
  // const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
  //   url: `${baseUrl}/projects/${project.slug}`,
  //   lastModified: new Date(project.updatedAt),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // }));

  // const posts = await getAllPosts();
  // const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: new Date(post.updatedAt),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }));

  return [
    ...staticRoutes,
    // ...projectRoutes,
    // ...postRoutes,
  ];
} 
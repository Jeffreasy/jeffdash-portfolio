import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/config'

// Zie: https://nextjs.org/docs/app/api-reference/file-conventions/robots

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/projects', '/blog', '/contact'],
        disallow: ['/admin_area/', '/login/', '/api/', '/_next/', '/admin'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/about', '/projects', '/blog', '/contact'],
        disallow: ['/admin_area/', '/login/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 
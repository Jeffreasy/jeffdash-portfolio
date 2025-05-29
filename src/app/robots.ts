import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/config'

// Zie: https://nextjs.org/docs/app/api-reference/file-conventions/robots

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin_area/',
          '/login/',
          '/api/',
          '/_next/',
          '/admin',
          '/private/',
          '/under-construction/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin_area/',
          '/login/',
          '/api/',
        ],
      },
      {
        userAgent: ['Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot'],
        allow: '/',
        disallow: [
          '/admin_area/',
          '/login/',
          '/api/',
          '/_next/',
          '/admin',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 

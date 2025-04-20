import { MetadataRoute } from 'next'

// Zie: https://nextjs.org/docs/app/api-reference/file-conventions/robots

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow admin sectie indien van toepassing
      // disallow: '/admin/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 
import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import BlogList from '@/components/features/blog/BlogList';
import { getPublishedPosts } from '@/lib/actions/blog';

// Force dynamic rendering to avoid static generation issues with Supabase
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Lees de laatste artikelen over web development, AI en design door Jeffrey Lavente',
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
  openGraph: {
    title: 'Blog - Jeffrey Lavente',
    description: 'Lees de laatste artikelen over web development, AI en design door Jeffrey Lavente',
    url: `${SITE_CONFIG.url}/blog`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Jeffrey Lavente',
    description: 'Lees de laatste artikelen over web development, AI en design door Jeffrey Lavente',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD component voor Blog overzichtspagina
function BlogListJsonLd({ totalPosts }: { totalPosts: number }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Blog - Jeffrey Lavente",
          "description": "Lees de laatste artikelen over web development, AI en design door Jeffrey Lavente",
          "url": `${SITE_CONFIG.url}/blog`,
          "isPartOf": {
            "@type": "WebSite",
            "name": SITE_CONFIG.name,
            "url": SITE_CONFIG.url
          },
          "about": {
            "@type": "Thing",
            "name": "Web Development, AI en Design"
          },
          "author": {
            "@type": "Person",
            "name": "Jeffrey Lavente"
          },
          "numberOfItems": totalPosts
        })
      }}
    />
  );
}

export default async function BlogPage() {
  // Load initial data for better performance
  const initialData = await getPublishedPosts(1, 12);
  
  return (
    <>
      <BlogListJsonLd totalPosts={initialData.pagination.totalItems} />
      <BlogList initialData={initialData} />
    </>
  );
} 

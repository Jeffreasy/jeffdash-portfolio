import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { getPublishedPosts } from '@/lib/actions/blog';
import BlogList from '@/components/features/blog/BlogList';

// --- SEO Metadata --- //
export const metadata: Metadata = {
  title: `Blog | ${SITE_CONFIG.name}`,
  description: 'Ontdek interessante artikelen over webontwikkeling, moderne technologieën zoals Next.js, React, TypeScript en meer. Tips, tutorials en inzichten van Jeffrey Lavente.',
  keywords: ['blog', 'webontwikkeling', 'Next.js', 'React', 'TypeScript', 'tutorials', 'programming', 'Jeffrey Lavente'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
  openGraph: {
    title: `Blog | ${SITE_CONFIG.name}`,
    description: 'Ontdek interessante artikelen over webontwikkeling, moderne technologieën en programming tips.',
    url: `${SITE_CONFIG.url}/blog`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary',
    title: `Blog | ${SITE_CONFIG.name}`,
    description: 'Ontdek interessante artikelen over webontwikkeling en moderne technologieën.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Mark the page as dynamic
export const dynamic = 'force-dynamic';

// Deze pagina is een Server Component
export default async function BlogPage() {
  // Haal de gepubliceerde blog posts op aan de server-kant
  const posts = await getPublishedPosts();

  // Geef de opgehaalde posts door aan de BlogList component
  return <BlogList posts={posts} />;
} 
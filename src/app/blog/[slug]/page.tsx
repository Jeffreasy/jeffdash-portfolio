import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';

// Import the construction component
import UnderConstruction from '../../underconstruction/construction';

// Define a specific type for this page's props
type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

// --- SEO Metadata --- //
export async function generateMetadata(
  props: BlogPageProps
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  return {
    title: `${SITE_CONFIG.name} - Onder Constructie`,
    description: 'Jeffrey Lavente Portfolio - Momenteel onder constructie. Ik werk hard aan iets geweldigs voor je! Kom binnenkort terug voor mijn volledige portfolio.',
    keywords: ['Jeffrey Lavente', 'webontwikkelaar', 'portfolio', 'onder constructie', 'Next.js', 'React', 'TypeScript', 'webontwikkeling'],
    alternates: {
      canonical: `${SITE_CONFIG.url}/blog/${slug}`,
    },
    openGraph: {
      title: `${SITE_CONFIG.name} - Onder Constructie`,
      description: 'Jeffrey Lavente Portfolio - Momenteel onder constructie. Kom binnenkort terug voor mijn volledige portfolio.',
      url: `${SITE_CONFIG.url}/blog/${slug}`,
      siteName: SITE_CONFIG.name,
      type: 'website',
      locale: 'nl_NL',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_CONFIG.name} - Onder Constructie`,
      description: 'Jeffrey Lavente Portfolio - Momenteel onder constructie. Kom binnenkort terug!',
    },
    robots: {
      index: false, // Don't index while under construction
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
    category: 'technology',
  };
}

// Mark the page as static since construction page doesn't need data fetching
export const dynamic = 'force-static';

// Simple page that shows construction component
export default function BlogPostPage() {
  return <UnderConstruction />;
}

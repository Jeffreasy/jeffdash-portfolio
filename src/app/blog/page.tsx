import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';

// Import the construction component
import UnderConstruction from '../underconstruction/construction';

// --- SEO Metadata --- //
export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - Onder Constructie`,
  description: 'Jeffrey Lavente Portfolio - Momenteel onder constructie. Ik werk hard aan iets geweldigs voor je! Kom binnenkort terug voor mijn volledige portfolio.',
  keywords: ['Jeffrey Lavente', 'webontwikkelaar', 'portfolio', 'onder constructie', 'Next.js', 'React', 'TypeScript', 'webontwikkeling'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} - Onder Constructie`,
    description: 'Jeffrey Lavente Portfolio - Momenteel onder constructie. Kom binnenkort terug voor mijn volledige portfolio.',
    url: `${SITE_CONFIG.url}/blog`,
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

// Mark the page as static since construction page doesn't need data fetching
export const dynamic = 'force-static';

// Simple page that shows construction component
export default function BlogPage() {
  return <UnderConstruction />;
} 
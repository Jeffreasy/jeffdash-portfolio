import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import AboutContent from '@/components/features/about/AboutContent';
import { getAboutContent } from '@/lib/actions/content';

// Force dynamic rendering to avoid static generation issues with Supabase
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Over Mij',
  description: 'Leer meer over Jeffrey Lavente - Full-Stack Developer & AI Explorer',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Over Mij',
    description: 'Leer meer over Jeffrey Lavente - Full-Stack Developer & AI Explorer',
    url: '/about',
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Over Mij',
    description: 'Leer meer over Jeffrey Lavente - Full-Stack Developer & AI Explorer',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function AboutPage() {
  // Haal about content op
  const aboutContent = await getAboutContent();

  return <AboutContent content={aboutContent} />;
} 
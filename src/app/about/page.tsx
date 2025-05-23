import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { getAboutContent } from '@/lib/actions/content';
import AboutContent from '@/components/features/about/AboutContent';

// --- SEO Metadata --- //
export const metadata: Metadata = {
  title: `Over Mij | ${SITE_CONFIG.name}`,
  description: `Leer meer over Jeffrey Lavente, een gepassioneerde webontwikkelaar gespecialiseerd in moderne technologieën zoals Next.js, React en TypeScript. Bekijk projecten en neem contact op.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: `Over Mij | ${SITE_CONFIG.name}`,
    description: `Leer meer over Jeffrey Lavente, een gepassioneerde webontwikkelaar gespecialiseerd in moderne technologieën zoals Next.js, React en TypeScript. Bekijk projecten en neem contact op.`,
    url: `${SITE_CONFIG.url}/about`,
    siteName: SITE_CONFIG.name,
    type: 'profile',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary',
    title: `Over Mij | ${SITE_CONFIG.name}`,
    description: `Leer meer over Jeffrey Lavente, een gepassioneerde webontwikkelaar...`,
  },
};

// Mark the page as dynamic
export const dynamic = 'force-dynamic';

// Server component
export default async function AboutPage() {
  // Haal content op
  const content = await getAboutContent();

  return <AboutContent content={content} />;
} 
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
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: 'Over Mij',
    description: 'Leer meer over Jeffrey Lavente - Full-Stack Developer & AI Explorer',
    url: `${SITE_CONFIG.url}/about`,
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

// JSON-LD component voor About page
function AboutJsonLd({ content }: { content: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "Over Jeffrey Lavente",
          "description": "Leer meer over Jeffrey Lavente - Full-Stack Developer & AI Explorer",
          "mainEntity": {
            "@type": "Person",
            "name": "Jeffrey Lavente",
            "jobTitle": "Full-Stack Developer & AI Explorer",
            "description": content.about_intro || "Full-Stack Developer & AI Explorer",
            "url": SITE_CONFIG.url,
            "sameAs": [
              content.linkedin_url || "",
              content.github_url || ""
            ].filter(Boolean)
          }
        })
      }}
    />
  );
}

export default async function AboutPage() {
  // Haal about content op
  const aboutContent = await getAboutContent();

  return (
    <>
      <AboutJsonLd content={aboutContent} />
      <AboutContent content={aboutContent} />
    </>
  );
} 

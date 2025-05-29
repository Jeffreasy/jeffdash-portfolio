import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import ProjectList from '@/components/features/projects/ProjectList';
import { getProjects } from '@/lib/actions/projects';

// Force dynamic rendering to avoid static generation issues with Supabase
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Bekijk mijn portfolio van webontwikkeling projecten',
  alternates: {
    canonical: `${SITE_CONFIG.url}/projects`,
  },
  openGraph: {
    title: 'Projects',
    description: 'Bekijk mijn portfolio van webontwikkeling projecten',
    url: `${SITE_CONFIG.url}/projects`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects',
    description: 'Bekijk mijn portfolio van webontwikkeling projecten',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD component voor Projecten overzichtspagina
function ProjectsListJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Projecten Portfolio - Jeffrey Lavente",
          "description": "Bekijk mijn portfolio van webontwikkeling projecten",
          "url": `${SITE_CONFIG.url}/projects`,
          "isPartOf": {
            "@type": "WebSite",
            "name": SITE_CONFIG.name,
            "url": SITE_CONFIG.url
          },
          "about": {
            "@type": "Thing",
            "name": "Web Development Projecten"
          },
          "creator": {
            "@type": "Person",
            "name": "Jeffrey Lavente",
            "jobTitle": "Full-Stack Developer & AI Explorer",
            "url": SITE_CONFIG.url
          }
        })
      }}
    />
  );
}

export default async function ProjectsPage() {
  // Haal alle projecten op
  const projects = await getProjects();

  return (
    <>
      <ProjectsListJsonLd />
      <ProjectList 
        projects={projects}
        title="Mijn Projecten"
        description="Een overzicht van alle projecten die ik heb gerealiseerd"
        showTitle={true}
      />
    </>
  );
} 

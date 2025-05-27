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
    canonical: '/projects',
  },
  openGraph: {
    title: 'Projects',
    description: 'Bekijk mijn portfolio van webontwikkeling projecten',
    url: '/projects',
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

export default async function ProjectsPage() {
  // Haal alle projecten op
  const projects = await getProjects();

  return (
    <ProjectList 
      projects={projects}
      title="Mijn Projecten"
      description="Een overzicht van alle projecten die ik heb gerealiseerd"
      showTitle={true}
    />
  );
} 
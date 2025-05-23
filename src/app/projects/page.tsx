import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { getProjects } from '@/lib/actions/projects';
import ProjectList from '@/components/features/projects/ProjectList';

// --- SEO Metadata --- //
export const metadata: Metadata = {
  title: `Projecten | ${SITE_CONFIG.name}`,
  description: 'Bekijk een overzicht van webontwikkeling projecten van Jeffrey Lavente. Van moderne websites tot complexe webapplicaties, gebouwd met Next.js, React en TypeScript.',
  keywords: ['projecten', 'portfolio', 'webontwikkeling', 'websites', 'webapplicaties', 'Next.js', 'React', 'Jeffrey Lavente'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/projects`,
  },
  openGraph: {
    title: `Projecten | ${SITE_CONFIG.name}`,
    description: 'Bekijk een overzicht van webontwikkeling projecten van Jeffrey Lavente. Van moderne websites tot complexe webapplicaties.',
    url: `${SITE_CONFIG.url}/projects`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary',
    title: `Projecten | ${SITE_CONFIG.name}`,
    description: 'Bekijk een overzicht van webontwikkeling projecten van Jeffrey Lavente.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Mark the page as dynamic
export const dynamic = 'force-dynamic';

// Deze pagina is een Server Component
export default async function ProjectsPage() {
  // Haal de projecten op aan de server-kant
  const projects = await getProjects();

  // Geef de opgehaalde projecten door aan de ProjectList component
  return <ProjectList projects={projects} />;
} 
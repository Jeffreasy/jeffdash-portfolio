import React from 'react';
import { getProjectBySlug } from '@/lib/actions/projects';
import ProjectDetailView from '@/components/features/projects/ProjectDetailView';
import { Metadata, ResolvingMetadata } from 'next';
import { SITE_CONFIG } from '@/lib/config'; // Importeer SITE_CONFIG
import { notFound } from 'next/navigation'; // Importeer notFound

// Definieer het type voor de props, inclusief params
interface ProjectDetailPageProps {
  params: { slug: string };
}

// Genereer dynamische metadata voor SEO
export async function generateMetadata(
  { params }: ProjectDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const project = await getProjectBySlug(slug);

  if (!project) {
    // Optioneel: fallback metadata als project niet gevonden wordt
    // Of laat het standaard gedrag toe (vaak een 404 titel)
    return {
      title: 'Project niet gevonden',
    };
  }

  // Gebruik project data voor metadata, met fallbacks
  const title = project.metaTitle || project.title;
  const description = project.metaDescription || project.shortDescription || (await parent).description || SITE_CONFIG.description;
  const ogImage = project.images?.[0]?.url; // Gebruik eerste afbeelding als OG image

  return {
    title: `${title} | ${SITE_CONFIG.name}`,
    description: description,
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description: description,
      url: `${SITE_CONFIG.url}/projects/${slug}`,
      images: ogImage ? [
        {
          url: ogImage,
          // Optioneel: voeg width/height toe indien bekend
        }
      ] : (await parent).openGraph?.images || [],
      type: 'article', // Type voor een project/artikel
      publishedTime: project.createdAt?.toISOString(),
      // Aangepast voor SEO
      siteName: SITE_CONFIG.name,
    },
    // Twitter Card Metadata (optioneel maar aanbevolen)
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: `${title} | ${SITE_CONFIG.name}`,
      description: description,
      images: ogImage ? [ogImage] : [],
      // site: '@jouwTwitterHandle', // Voeg je Twitter handle toe
      // creator: '@auteurTwitterHandle', // Indien van toepassing
    },
  };
}

// De pagina component zelf
export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // Haal de slug op (niet meer nodig om params te awaiten hier,
  // want we gebruiken het type ProjectDetailPageProps)
  const slug = params.slug;

  // Haal het project op aan de server-kant
  const project = await getProjectBySlug(slug);

  // Als project niet gevonden wordt, toon 404 pagina
  if (!project) {
    notFound();
  }

  // Geef het opgehaalde project door aan de view component
  return <ProjectDetailView project={project} />;
} 
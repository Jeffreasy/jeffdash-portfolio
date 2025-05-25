import React from 'react';
import { getProjectBySlug } from '@/lib/actions/projects';
import ProjectDetailView from '@/components/features/projects/ProjectDetailView';
import { Metadata, ResolvingMetadata } from 'next';
import { SITE_CONFIG } from '@/lib/config'; // Importeer SITE_CONFIG
import { notFound } from 'next/navigation'; // Importeer notFound

// Definieer het type voor de props, inclusief params
interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

// JSON-LD Structured Data Component voor projecten
function ProjectJsonLd({ project }: { project: any }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.shortDescription || project.metaDescription,
    "image": project.ProjectImage?.[0]?.url ? [project.ProjectImage[0].url] : [],
    "dateCreated": project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
    "dateModified": project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined,
    "creator": {
      "@type": "Person",
      "name": "Jeffrey Lavente",
      "url": SITE_CONFIG.url,
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "url": SITE_CONFIG.url,
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/projects/${project.slug}`,
    },
    "keywords": project.technologies || project.techStack || [],
    "genre": "Web Development",
    "inLanguage": "nl-NL",
    "url": project.liveUrl || `${SITE_CONFIG.url}/projects/${project.slug}`,
    "codeRepository": project.githubUrl,
    "applicationCategory": "WebApplication",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Genereer dynamische metadata voor SEO
export async function generateMetadata(props: ProjectDetailPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = (await props.params).slug;
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
  const ogImage = project.ProjectImage?.[0]?.url; // Change images to ProjectImage

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
      publishedTime: project.createdAt ? new Date(project.createdAt).toISOString() : undefined, // Wrap with new Date()
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

// Add ISR revalidation (1 hour)
export const revalidate = 3600;

// De pagina component zelf
export default async function ProjectDetailPage(props: ProjectDetailPageProps) {
  const slug = (await props.params).slug;

  // Haal het project op aan de server-kant
  const project = await getProjectBySlug(slug);

  // Als project niet gevonden wordt, toon 404 pagina
  if (!project) {
    notFound();
  }

  // Geef het opgehaalde project door aan de view component
  return (
    <>
      <ProjectJsonLd project={project} />
      <ProjectDetailView project={project} />
    </>
  );
} 
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/actions/projects';
import ProjectDetailView from '@/components/features/projects/ProjectDetailView';
import { SITE_CONFIG } from '@/lib/config';

// Force dynamic rendering to avoid static generation issues with Supabase
export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return {
      title: 'Project niet gevonden',
      description: 'Het gevraagde project kon niet worden gevonden',
    };
  }
  
  return {
    title: project.metaTitle || project.title,
    description: project.metaDescription || project.shortDescription || `Details over het ${project.title} project`,
    alternates: {
      canonical: `${SITE_CONFIG.url}/projects/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.shortDescription || `Details over het ${project.title} project`,
      url: `${SITE_CONFIG.url}/projects/${slug}`,
      type: 'article',
      images: project.ProjectImage?.[0]?.url ? [
        {
          url: project.ProjectImage[0].url,
          alt: project.ProjectImage[0].altText || project.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.shortDescription || `Details over het ${project.title} project`,
      images: project.ProjectImage?.[0]?.url ? [project.ProjectImage[0].url] : undefined,
    },
  };
}

// JSON-LD component voor Project detail
function ProjectJsonLd({ project }: { project: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": project.title,
          "description": project.shortDescription || project.metaDescription,
          "image": project.ProjectImage?.[0]?.url || "",
          "url": `${SITE_CONFIG.url}/projects/${project.slug}`,
          "applicationCategory": "WebApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/OnlineOnly"
          },
          "author": {
            "@type": "Person",
            "name": "Jeffrey Lavente",
            "url": SITE_CONFIG.url
          },
          "datePublished": project.createdAt,
          "dateModified": project.updatedAt,
          "keywords": project.technologies?.join(", ") || "web development, design",
          "sameAs": project.liveUrl || project.githubUrl || "",
          "screenshot": project.ProjectImage?.map((img: any) => ({
            "@type": "ImageObject",
            "url": img.url,
            "caption": img.altText || project.title
          })) || []
        })
      }}
    />
  );
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }
  
  return (
    <>
      <ProjectJsonLd project={project} />
      <ProjectDetailView project={project} />
    </>
  );
} 

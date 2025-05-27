import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/actions/projects';
import ProjectDetailView from '@/components/features/projects/ProjectDetailView';

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
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.shortDescription || `Details over het ${project.title} project`,
      url: `/projects/${slug}`,
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

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }
  
  return <ProjectDetailView project={project} />;
} 
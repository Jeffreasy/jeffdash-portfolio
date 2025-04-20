'use server';

import { prisma } from '@/lib/prisma';
// Gebruik de standaard import
import { Prisma, Project } from '@prisma/client';

// Definieer een type voor de   data die we nodig hebben in de findMany call
const featuredProjectSelect = {
  id: true,
  slug: true,
  title: true,
  shortDescription: true,
  technologies: true,
  images: {
    select: {
      url: true,
      altText: true,
    },
    orderBy: {
      order: 'asc' as const,
    },
    take: 1,
  },
} satisfies Prisma.ProjectSelect;

// Afgeleid type van de select query
type FetchedProjectType = Prisma.ProjectGetPayload<{ select: typeof featuredProjectSelect }>;

// Definieer het uiteindelijke type dat we teruggeven
export type FeaturedProjectType = FetchedProjectType & {
  featuredImageUrl?: string;
  featuredImageAlt?: string;
};

export async function getFeaturedProjects(): Promise<{
  featuredProjects: FeaturedProjectType[];
  totalProjectCount: number;
}> {
  try {
    const projectsData = await prisma.project.findMany({
      where: {
        isFeatured: true,
      },
      select: featuredProjectSelect,
      orderBy: {
         createdAt: 'desc' as const,
      },
      take: 3,
    });

    // Laat TypeScript het type van 'project' afleiden in de map
    const featuredProjects: FeaturedProjectType[] = projectsData.map(project => ({
      ...project,
      featuredImageUrl: project.images[0]?.url,
      featuredImageAlt: project.images[0]?.altText ?? project.title,
    }));

    const totalProjectCount = await prisma.project.count();

    return {
      featuredProjects,
      totalProjectCount,
    };
  } catch (error) {
    console.error("Failed to fetch featured projects:", error);
    return { featuredProjects: [], totalProjectCount: 0 };
  }
}

// Placeholder voor het ophalen van projecten
export async function getProjects() {
  // Voeg hier Prisma logica toe
  console.log('Fetching projects...');
  // Voorbeeld: return await prisma.project.findMany();
  return [];
}

// Placeholder voor het ophalen van een enkel project
export async function getProjectBySlug(slug: string) {
  // Voeg hier Prisma logica toe
  console.log(`Fetching project with slug: ${slug}`);
  // Voorbeeld: return await prisma.project.findUnique({ where: { slug } });
  return null;
} 
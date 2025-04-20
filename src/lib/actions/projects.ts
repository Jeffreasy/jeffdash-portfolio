'use server';

import { prisma } from '@/lib/prisma';

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
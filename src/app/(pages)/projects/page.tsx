import React from 'react';
import { getProjects } from '@/lib/actions/projects';
import ProjectList from '@/components/features/projects/ProjectList';

// Mark the page as dynamic
export const dynamic = 'force-dynamic';

// Deze pagina is een Server Component
export default async function ProjectsPage() {
  // Haal de projecten op aan de server-kant
  const projects = await getProjects();

  // Geef de opgehaalde projecten door aan de ProjectList component
  return <ProjectList projects={projects} />;
} 
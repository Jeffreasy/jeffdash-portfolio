import React from 'react';
import { SimpleGrid, Container, Title, Text } from '@mantine/core';
import ProjectCard from './ProjectCard'; // Zorg dat ProjectCard bestaat en de juiste props accepteert
// Importeer het ProjectPreviewType nu
import type { ProjectPreviewType } from '@/lib/actions/projects';
import ProjectErrorBoundary from './ProjectErrorBoundary';

// Definieer de props voor ProjectList
interface ProjectListProps {
  projects: ProjectPreviewType[]; // Accepteer nu ProjectPreviewType
}

export default function ProjectList({ projects }: ProjectListProps) {
  // Validate projects prop
  if (!Array.isArray(projects)) {
    throw new Error('Projects must be an array');
  }

  if (!projects || projects.length === 0) {
    return (
      <ProjectErrorBoundary>
        <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
          <Text ta="center" c="dimmed">Momenteel geen projecten om weer te geven.</Text>
        </Container>
      </ProjectErrorBoundary>
    );
  }

  return (
    <ProjectErrorBoundary>
      <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
        <Title order={2} ta="center" mb="xl">
          Alle Projecten
        </Title>
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3 }} // Responsive kolommen
          spacing="xl" // Ruimte tussen de kaarten
        >
          {projects.map((project) => {
            // Validate each project before rendering
            if (!project || typeof project !== 'object') {
              console.error('Invalid project data:', project);
              return null;
            }
            return (
              <ProjectCard 
                key={project.id} 
                project={project}
              />
            );
          })}
        </SimpleGrid>
      </Container>
    </ProjectErrorBoundary>
  );
} 
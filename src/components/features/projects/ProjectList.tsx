import React from 'react';
import { SimpleGrid, Container, Title, Text } from '@mantine/core';
import ProjectCard from './ProjectCard'; // Zorg dat ProjectCard bestaat en de juiste props accepteert
// Importeer het ProjectPreviewType nu
import type { ProjectPreviewType } from '@/lib/actions/projects';

// Definieer de props voor ProjectList
interface ProjectListProps {
  projects: ProjectPreviewType[]; // Accepteer nu ProjectPreviewType
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (!projects || projects.length === 0) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
        <Text ta="center" c="dimmed">Momenteel geen projecten om weer te geven.</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
      <Title order={2} ta="center" mb="xl">
        Alle Projecten
      </Title>
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }} // Responsive kolommen
        spacing="xl" // Ruimte tussen de kaarten
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </SimpleGrid>
    </Container>
  );
} 
import React from 'react';
import { SimpleGrid, Container, Title, Text } from '@mantine/core';
import ProjectCard from './ProjectCard'; // Zorg dat ProjectCard bestaat en de juiste props accepteert
// Importeer het type direct van de bron waar PrismaProject wordt gedefinieerd, waarschijnlijk actions
// We moeten het FeaturedProjectType gebruiken omdat ProjectCard dat verwacht
// Aanpassing: We halen *alle* projecten op, maar ProjectCard verwacht FeaturedProjectType.
// We moeten ofwel ProjectCard aanpassen, of hier de data transformeren,
// of getProjects zo aanpassen dat het FeaturedProjectType teruggeeft.
// Voor nu transformeren we de data hier, aangenomen dat PrismaProject de basisvelden bevat.
// Dit is niet ideaal, beter is getProjects aanpassen of een specifiek ListProjectType maken.
// import type { PrismaProject } from '../../../../node_modules/.prisma/client'; // Oude import
import type { PrismaProject, FeaturedProjectType } from '@/lib/actions/projects'; // Nieuwe import vanuit actions

// Definieer de props voor ProjectList
interface ProjectListProps {
  projects: PrismaProject[]; // Ontvangt de volledige project data van getProjects
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (!projects || projects.length === 0) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
        <Text ta="center" c="dimmed">Momenteel geen projecten om weer te geven.</Text>
      </Container>
    );
  }

  // Transformeer PrismaProject naar FeaturedProjectType voor ProjectCard
  // Dit is een aanname en moet mogelijk verfijnd worden op basis van exacte data
  const projectCardsData: FeaturedProjectType[] = projects.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    technologies: p.technologies,
    // ProjectCard verwacht featuredImageUrl/Alt, die halen we hier niet direct op.
    // We kunnen een default/placeholder gebruiken of ProjectCard aanpassen.
    // Voor nu: geen afbeelding data, ProjectCard moet fallback gebruiken.
    images: [], // Lege array omdat we geen afbeeldingen selecteren in getProjects
    featuredImageUrl: undefined, // Expliciet undefined maken
    featuredImageAlt: p.title, // Fallback alt text
  }));


  return (
    <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
      <Title order={2} ta="center" mb="xl">
        Alle Projecten
      </Title>
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }} // Responsive kolommen
        spacing="xl" // Ruimte tussen de kaarten
      >
        {projectCardsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </SimpleGrid>
    </Container>
  );
} 
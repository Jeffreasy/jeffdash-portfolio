// Dit is nu een Server Component
import React from 'react';
// Verwijder ProjectCard import hier, wordt nu gebruikt in AnimatedProjectGrid
import { Container, Title, Button, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import { getFeaturedProjects, FeaturedProjectType } from '@/lib/actions/projects';
// Verwijder motion import
// Importeer de nieuwe client component voor de animatie
import AnimatedProjectGrid from './AnimatedProjectGrid';

// Verwijder animatie varianten hier

// Component is async om data te kunnen awaiten
export default async function FeaturedProjects() {
  // --- Data Ophalen --- (Gebeurt op de server)
  const { featuredProjects, totalProjectCount } = await getFeaturedProjects();

  // --- Render Logic --- (Geen data? Toon bericht)
  if (!featuredProjects || featuredProjects.length === 0) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
        <Text ta="center" c="dimmed">Momenteel geen uitgelichte projecten om weer te geven.</Text>
      </Container>
    );
  }

  // --- Render Logic --- (Wel data? Toon titel, grid en knop)
  return (
    <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
      <Title order={2} ta="center" mb="xl">
        Uitgelichte Projecten
      </Title>

      {/* Render de Client Component met de project data */}
      <AnimatedProjectGrid projects={featuredProjects} />

      {/* Knop blijft hetzelfde */}
      {totalProjectCount > featuredProjects.length && (
        <Group justify="center" mt="xl">
          <Button
            component={Link}
            href="/projects"
            variant="outline"
            size="md"
            rightSection={<IconArrowRight size={16} />}
          >
            Bekijk alle projecten
          </Button>
        </Group>
      )}
    </Container>
  );
}
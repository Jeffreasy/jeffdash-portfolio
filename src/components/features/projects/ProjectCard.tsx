"use client"; // Image component vereist client-side rendering

import React from 'react';
import Link from 'next/link';
import { Card, Image, Text, Stack, Badge, Group, Button } from '@mantine/core';
import type { FeaturedProjectType } from '@/lib/actions/projects';

type ProjectCardProps = {
  project: FeaturedProjectType;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  // Stap 5: Voeg Knop toe (volledige kaart hersteld)
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      {/* NU ACTIEF: Afbeelding */}
      <Card.Section>
        <Image
          src={project.featuredImageUrl || 'https://via.placeholder.com/400x200/dee2e6/868e96.png?text=No+Image'}
          height={180}
          alt={project.featuredImageAlt || project.title}
        />
      </Card.Section>

      <Stack mt="md" mb="xs" gap="xs" style={{ flexGrow: 1 }}>
        <Text fw={600} size="lg" lineClamp={2}>{project.title}</Text>

        {project.shortDescription && (
          <Text size="sm" c="dimmed" lineClamp={3}>
            {project.shortDescription}
          </Text>
        )}

        {/* NU ACTIEF: Tags (Technologieën) */}
        <Group gap="xs" mt="auto">
          {project.technologies?.slice(0, 3).map((tag: string) => (
            <Badge key={tag} size="sm" variant="light">
              {tag}
            </Badge>
          ))}
          {project.technologies && project.technologies.length > 3 && (
             <Badge size="sm" variant="outline">+{project.technologies.length - 3}</Badge>
          )}
        </Group>
      </Stack>

      {/* NU ACTIEF: Knop naar detailpagina */}
      <Button
        component={Link}
        href={`/projects/${project.slug}`}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
      >
        Bekijk Details
      </Button>
    </Card>
  );
}

/*
// --- OORSPRONKELIJKE CODE HIERONDER (UITGECOMMENTEERD) ---
import Link from 'next/link';
import { Card, Image, Text, Badge, Group, Button, Stack } from '@mantine/core';
import type { FeaturedProjectType } from '@/lib/actions/projects';

type ProjectCardProps = {
  project: FeaturedProjectType;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section>
        <Image
          src={project.featuredImageUrl || 'https://via.placeholder.com/400x200/dee2e6/868e96.png?text=No+Image'}
          height={180}
          alt={project.featuredImageAlt || project.title}
        />
      </Card.Section>
      <Stack mt="md" mb="xs" gap="xs" style={{ flexGrow: 1 }}>
        <Text fw={600} size="lg" lineClamp={2}>{project.title}</Text>
        {project.shortDescription && (
          <Text size="sm" c="dimmed" lineClamp={3}>
            {project.shortDescription}
          </Text>
        )}
        <Group gap="xs" mt="auto">
          {project.technologies?.slice(0, 3).map((tag: string) => (
            <Badge key={tag} size="sm" variant="light">
              {tag}
            </Badge>
          ))}
          {project.technologies && project.technologies.length > 3 && (
             <Badge size="sm" variant="outline">+{project.technologies.length - 3}</Badge>
          )}
        </Group>
      </Stack>
      <Button
        component={Link}
        href={`/projects/${project.slug}`}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
      >
        Bekijk Details
      </Button>
    </Card>
  );
}
*/ 
import React from 'react';
import { Container, Title, Text, Paper, Group, Badge, Button, Stack, AspectRatio, Image as MantineImage } from '@mantine/core';
import Link from 'next/link';
import { IconExternalLink, IconBrandGithub } from '@tabler/icons-react';
import type { FullProjectType } from '@/lib/actions/projects';
import MarkdownRenderer from '@/components/shared/MarkdownRenderer';

interface ProjectDetailViewProps {
  project: FullProjectType | null; // Accepteer ook null voor niet gevonden projecten
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  // Toon bericht als project niet gevonden is
  if (!project) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder p="xl" radius="md" ta="center">
          <Title order={2} mb="md">Project niet gevonden</Title>
          <Text c="dimmed" mb="xl">
            Het project dat je zoekt kon niet worden geladen.
          </Text>
          <Button component={Link} href="/projects">
            Terug naar projecten
          </Button>
        </Paper>
      </Container>
    );
  }

  const mainImage = project.ProjectImage?.[0]; // Change images to ProjectImage

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* Optionele hoofdafbeelding bovenaan */}
        {mainImage && (
          <Paper shadow="md" radius="md">
            {/* Pas overflow en radius toe via style op AspectRatio */}
            <AspectRatio ratio={16 / 9} style={{ overflow: 'hidden', borderRadius: 'var(--mantine-radius-md)' }}>
              <MantineImage
                src={mainImage.url}
                alt={mainImage.altText || project.title}
                fallbackSrc="https://via.placeholder.com/800x450/dee2e6/868e96.png?text=Geen+Afbeelding"
              />
            </AspectRatio>
          </Paper>
        )}

        {/* Titel */}
        <Title order={1}>{project.title}</Title>

        {/* Korte beschrijving (optioneel) */}
        {project.shortDescription && (
          <Text size="lg" c="dimmed">
            {project.shortDescription}
          </Text>
        )}

        {/* Technologieën & Categorie */}
        <Group gap="xs">
          {project.category && (
            <Badge size="lg" variant="light" color="teal">{project.category}</Badge>
          )}
          <Group wrap="wrap" gap="xs" mt="sm">
            {project.technologies.map((tech: string) => (
              <Badge key={tech} variant="light" radius="sm">
                {tech}
              </Badge>
            ))}
          </Group>
        </Group>

        {/* Externe Links */}
        <Group>
          {project.liveUrl && (
            <Button
              component="a" // Gebruik anchor tag
              href={project.liveUrl}
              target="_blank" // Open in nieuw tabblad
              rel="noopener noreferrer" // Veiligheid
              variant="light"
              leftSection={<IconExternalLink size={16} />}
            >
              Bekijk Live
            </Button>
          )}
          {project.githubUrl && (
            <Button
              component="a" // Gebruik anchor tag
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle" // Minder opvallend dan live link
              color="gray"
              leftSection={<IconBrandGithub size={16} />}
            >
              Bekijk op GitHub
            </Button>
          )}
        </Group>

        {/* Gedetailleerde Content */}
        {project.detailedContent && (
          <Paper withBorder p="xl" radius="md">
            <Title order={3} mb="md">Over dit project</Title>
            <MarkdownRenderer>{project.detailedContent}</MarkdownRenderer>
          </Paper>
        )}

        {/* TODO: Afbeeldingengalerij als er meer afbeeldingen zijn */}
        {/* {project.images && project.images.length > 1 && (
          <ImageGallery images={project.images.slice(1).map(img => ({ url: img.url, alt: img.altText }))} />
        )} */}
        {project.ProjectImage && project.ProjectImage.length > 1 && (
          // TODO: Implement ImageGallery or similar
          <Text c="dimmed" mt="xl">Meer afbeeldingen komen hier...</Text>
          // Placeholder for ImageGallery call using ProjectImage
          // <ImageGallery images={project.ProjectImage.slice(1).map(img => ({ url: img.url, alt: img.altText }))} />
        )}

      </Stack>
    </Container>
  );
}
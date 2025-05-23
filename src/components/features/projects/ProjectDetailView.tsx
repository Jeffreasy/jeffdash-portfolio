import React from 'react';
import { Container, Title, Text, Paper, Group, Badge, Button, Stack, AspectRatio, Image as MantineImage } from '@mantine/core';
import Link from 'next/link';
import { IconExternalLink, IconBrandGithub } from '@tabler/icons-react';
import type { FullProjectType } from '@/lib/actions/projects';
import MarkdownRenderer from '@/components/shared/MarkdownRenderer';
import ProjectErrorBoundary from './ProjectErrorBoundary';

interface ProjectDetailViewProps {
  project: FullProjectType | null;
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  // Validate project prop
  if (project !== null && typeof project !== 'object') {
    throw new Error('Invalid project data provided to ProjectDetailView');
  }

  // Show message if project is not found
  if (!project) {
    return (
      <ProjectErrorBoundary>
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
      </ProjectErrorBoundary>
    );
  }

  const mainImage = project.ProjectImage?.[0];

  return (
    <ProjectErrorBoundary>
      <Container size="md" py="xl">
        <Stack gap="xl">
          {/* Optional main image at the top */}
          {mainImage && (
            <Paper shadow="md" radius="md">
              <AspectRatio ratio={16 / 9} style={{ overflow: 'hidden', borderRadius: 'var(--mantine-radius-md)' }}>
                <MantineImage
                  src={mainImage.url}
                  alt={mainImage.altText || project.title}
                  fallbackSrc="https://via.placeholder.com/800x450/dee2e6/868e96.png?text=Geen+Afbeelding"
                  onError={(e) => {
                    console.error('Error loading project image:', e);
                    e.currentTarget.src = 'https://via.placeholder.com/800x450/dee2e6/868e96.png?text=Image+Error';
                  }}
                />
              </AspectRatio>
            </Paper>
          )}

          {/* Title */}
          <Title order={1}>{project.title}</Title>

          {/* Short description (optional) */}
          {project.shortDescription && (
            <Text size="lg" c="dimmed">
              {project.shortDescription}
            </Text>
          )}

          {/* Technologies & Category */}
          <Group gap="xs">
            {project.category && (
              <Badge size="lg" variant="light" color="teal">{project.category}</Badge>
            )}
            <Group wrap="wrap" gap="xs" mt="sm">
              {project.technologies?.map((tech: string) => (
                <Badge key={tech} variant="light" radius="sm">
                  {tech}
                </Badge>
              ))}
            </Group>
          </Group>

          {/* External Links */}
          <Group>
            {project.liveUrl && (
              <Button
                component="a"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                leftSection={<IconExternalLink size={16} />}
                onClick={(e) => {
                  if (!project.liveUrl) {
                    e.preventDefault();
                    console.error('Invalid live URL');
                  }
                }}
              >
                Bekijk Live
              </Button>
            )}
            {project.githubUrl && (
              <Button
                component="a"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                color="gray"
                leftSection={<IconBrandGithub size={16} />}
                onClick={(e) => {
                  if (!project.githubUrl) {
                    e.preventDefault();
                    console.error('Invalid GitHub URL');
                  }
                }}
              >
                Bekijk op GitHub
              </Button>
            )}
          </Group>

          {/* Detailed Content */}
          {project.detailedContent && (
            <Paper withBorder p="xl" radius="md">
              <Title order={3} mb="md">Over dit project</Title>
              <MarkdownRenderer>{project.detailedContent}</MarkdownRenderer>
            </Paper>
          )}

          {/* Image Gallery Placeholder */}
          {project.ProjectImage && project.ProjectImage.length > 1 && (
            <Text c="dimmed" mt="xl">Meer afbeeldingen komen hier...</Text>
          )}
        </Stack>
      </Container>
    </ProjectErrorBoundary>
  );
}
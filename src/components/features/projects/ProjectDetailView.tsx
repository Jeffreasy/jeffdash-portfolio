'use client';

import React from 'react';
import { Container, Title, Text, Paper, Group, Badge, Button, Stack, AspectRatio, Box } from '@mantine/core';
import Link from 'next/link';
import NextImage from 'next/image';
import { IconExternalLink, IconBrandGithub, IconArrowLeft, IconCalendar, IconTag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { FullProjectType } from '@/lib/actions/projects';
import MarkdownRenderer from '@/components/shared/MarkdownRenderer';
import PageErrorBoundary from '../shared/PageErrorBoundary';
import ProgressiveLoader from '../shared/ProgressiveLoader';

interface ProjectDetailViewProps {
  project: FullProjectType | null;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
} as const;

/**
 * ProjectDetailView Component
 * Displays detailed information about a single project
 * Includes image gallery, description, technologies, and external links
 */
export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  // Validate project prop
  if (project !== null && typeof project !== 'object') {
    throw new Error('Invalid project data provided to ProjectDetailView');
  }

  // Show message if project is not found
  if (!project) {
    return (
      <PageErrorBoundary>
        <Container size="md" py="xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Paper 
              p="xl" 
              radius="lg" 
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
              }}
            >
              <Title order={2} mb="md" c="gray.2">
                Project niet gevonden
              </Title>
              <Text c="dimmed" mb="xl" size="lg">
                Het project dat je zoekt kon niet worden geladen.
              </Text>
              <Button 
                component={Link} 
                href="/projects"
                variant="gradient"
                gradient={{ from: 'blue.6', to: 'cyan.5' }}
                leftSection={<IconArrowLeft size={18} />}
              >
                Terug naar projecten
              </Button>
            </Paper>
          </motion.div>
        </Container>
      </PageErrorBoundary>
    );
  }

  const mainImage = project.ProjectImage?.[0];
  const additionalImages = project.ProjectImage?.slice(1) || [];

  return (
    <PageErrorBoundary>
      <section style={{ 
        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.01) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        <Container size="lg" py="xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Back Navigation */}
            <motion.div variants={itemVariants}>
              <Button
                component={Link}
                href="/projects"
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                mb="xl"
                style={{
                  color: 'var(--mantine-color-gray-6)',
                }}
              >
                Terug naar projecten
              </Button>
            </motion.div>

            <Stack gap="xl">
              {/* Hero Image */}
              {mainImage && (
                <motion.div variants={itemVariants}>
                  <ProgressiveLoader minHeight={400} threshold={0.3}>
                    <Paper
                      radius="lg"
                      style={{
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <AspectRatio ratio={16 / 9}>
                        <NextImage
                          src={mainImage.url}
                          alt={mainImage.altText || project.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          quality={90}
                          sizes="(max-width: 1200px) 100vw, 1200px"
                          priority
                        />
                      </AspectRatio>
                    </Paper>
                  </ProgressiveLoader>
                </motion.div>
              )}

              {/* Project Header */}
              <motion.div variants={itemVariants}>
                <Stack gap="md">
                  <Title 
                    order={1} 
                    size="h1"
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-cyan-5))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility',
                    }}
                  >
                    {project.title}
                  </Title>

                  {project.shortDescription && (
                    <Text 
                      size="xl" 
                      c="gray.3"
                      style={{ 
                        lineHeight: 1.6,
                        fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                      }}
                    >
                      {project.shortDescription}
                    </Text>
                  )}
                </Stack>
              </motion.div>

              {/* Project Meta Info */}
              <motion.div variants={itemVariants}>
                <Paper
                  p="lg"
                  radius="lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Stack gap="md">
                    {/* Category & Date */}
                    <Group>
                      {project.category && (
                        <Group gap="xs">
                          <IconTag size={16} style={{ color: 'var(--mantine-color-teal-4)' }} />
                          <Badge 
                            size="lg" 
                            variant="light" 
                            color="teal"
                            style={{
                              background: 'linear-gradient(135deg, var(--mantine-color-teal-1), var(--mantine-color-cyan-1))',
                              border: '1px solid var(--mantine-color-teal-3)',
                            }}
                          >
                            {project.category}
                          </Badge>
                        </Group>
                      )}
                      
                      {project.createdAt && (
                        <Group gap="xs">
                          <IconCalendar size={16} style={{ color: 'var(--mantine-color-gray-5)' }} />
                          <Text size="sm" c="dimmed">
                            {new Date(project.createdAt).toLocaleDateString('nl-NL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Text>
                        </Group>
                      )}
                    </Group>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <Stack gap="xs">
                        <Text fw={600} c="gray.2">Technologieën</Text>
                        <Group gap="xs">
                          {project.technologies.map((tech: string) => (
                            <Badge 
                              key={tech} 
                              variant="light" 
                              radius="sm"
                              style={{
                                background: 'linear-gradient(135deg, var(--mantine-color-blue-1), var(--mantine-color-cyan-1))',
                                border: '1px solid var(--mantine-color-blue-3)',
                                color: 'var(--mantine-color-blue-7)',
                              }}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </Group>
                      </Stack>
                    )}

                    {/* External Links */}
                    <Group>
                      {project.liveUrl && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            component="a"
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="gradient"
                            gradient={{ from: 'blue.6', to: 'cyan.5' }}
                            leftSection={<IconExternalLink size={18} />}
                            style={{
                              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                            }}
                          >
                            Live Demo
                          </Button>
                        </motion.div>
                      )}
                      
                      {project.githubUrl && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            component="a"
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outline"
                            color="gray"
                            leftSection={<IconBrandGithub size={18} />}
                            style={{
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: 'var(--mantine-color-gray-2)',
                            }}
                          >
                            GitHub Repository
                          </Button>
                        </motion.div>
                      )}
                    </Group>
                  </Stack>
                </Paper>
              </motion.div>

              {/* Detailed Content */}
              {project.detailedContent && (
                <motion.div variants={itemVariants}>
                  <ProgressiveLoader minHeight={200} threshold={0.2} rootMargin="100px">
                    <Paper 
                      p="xl" 
                      radius="lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <Title order={2} mb="lg" c="gray.2">
                        Over dit project
                      </Title>
                      <MarkdownRenderer>{project.detailedContent}</MarkdownRenderer>
                    </Paper>
                  </ProgressiveLoader>
                </motion.div>
              )}

              {/* Additional Images Preview */}
              {additionalImages.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Paper 
                    p="lg" 
                    radius="lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <Title order={3} mb="md" c="gray.2">
                      Meer afbeeldingen
                    </Title>
                    <Text c="dimmed" mb="lg">
                      {additionalImages.length} extra afbeelding{additionalImages.length !== 1 ? 'en' : ''} beschikbaar
                    </Text>
                    <Group gap="sm">
                      {additionalImages.slice(0, 3).map((image, index) => (
                        <Box
                          key={index}
                          style={{
                            width: '80px',
                            height: '60px',
                            borderRadius: 'var(--mantine-radius-sm)',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <NextImage
                            src={image.url}
                            alt={image.altText || `Project image ${index + 2}`}
                            width={80}
                            height={60}
                            style={{ objectFit: 'cover' }}
                            quality={60}
                          />
                        </Box>
                      ))}
                      {additionalImages.length > 3 && (
                        <Text size="sm" c="dimmed">
                          +{additionalImages.length - 3} meer
                        </Text>
                      )}
                    </Group>
                  </Paper>
                </motion.div>
              )}
            </Stack>
          </motion.div>
        </Container>
      </section>
    </PageErrorBoundary>
  );
}
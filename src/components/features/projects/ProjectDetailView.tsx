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
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          minHeight: '100vh',
        }}>
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
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center',
                }}
              >
                <Title order={2} mb="md" c="gray.2">
                  Project niet gevonden
                </Title>
                <Text c="gray.4" mb="xl" size="lg">
                  Het project dat je zoekt kon niet worden geladen.
                </Text>
                <Button 
                  component={Link} 
                  href="/projects"
                  variant="gradient"
                  gradient={{ from: 'blue.6', to: 'cyan.5' }}
                  leftSection={<IconArrowLeft size={18} />}
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  Terug naar projecten
                </Button>
              </Paper>
            </motion.div>
          </Container>
        </section>
      </PageErrorBoundary>
    );
  }

  const mainImage = project.ProjectImage?.[0];
  const additionalImages = project.ProjectImage?.slice(1) || [];

  return (
    <PageErrorBoundary>
      <section style={{ 
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        minHeight: '100vh',
      }}>
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '60%',
            left: '8%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <Container size="lg" py="xl" style={{ position: 'relative', zIndex: 1 }}>
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
                variant="outline"
                color="gray"
                leftSection={<IconArrowLeft size={16} />}
                mb="xl"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--mantine-color-gray-2)',
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
                        backdropFilter: 'blur(10px)',
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
                      background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
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

                  {/* Project Meta */}
                  <Group gap="md" wrap="wrap">
                    {project.createdAt && (
                      <Group gap="xs">
                        <IconCalendar size={16} style={{ color: 'var(--mantine-color-gray-4)' }} />
                        <Text size="sm" c="gray.4">
                          {new Date(project.createdAt).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </Text>
                      </Group>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <Group gap="xs">
                        <IconTag size={16} style={{ color: 'var(--mantine-color-gray-4)' }} />
                        <Text size="sm" c="gray.4">
                          {project.technologies.length} technologie{project.technologies.length !== 1 ? 'ën' : ''}
                        </Text>
                      </Group>
                    )}
                  </Group>
                </Stack>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants}>
                <Group gap="md" wrap="wrap">
                  {project.projectUrl && (
                    <Button
                      component="a"
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="gradient"
                      gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      size="lg"
                      radius="md"
                      leftSection={<IconExternalLink size={18} />}
                      style={{
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      Live Demo
                    </Button>
                  )}
                  
                  {project.githubUrl && (
                    <Button
                      component="a"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      color="gray"
                      size="lg"
                      radius="md"
                      leftSection={<IconBrandGithub size={18} />}
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'var(--mantine-color-gray-2)',
                      }}
                    >
                      GitHub
                    </Button>
                  )}
                </Group>
              </motion.div>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Paper
                    p="lg"
                    radius="lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Title order={3} size="h3" mb="md" c="gray.2">
                      Gebruikte Technologieën
                    </Title>
                    <Group gap="sm">
                      {project.technologies.map((tech) => (
                        <Badge 
                          key={tech} 
                          variant="light"
                          size="md"
                          style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: 'var(--mantine-color-blue-3)',
                          }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </Group>
                  </Paper>
                </motion.div>
              )}

              {/* Project Description */}
              {project.description && (
                <motion.div variants={itemVariants}>
                  <Paper
                    p="lg"
                    radius="lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Title order={3} size="h3" mb="md" c="gray.2">
                      Over dit project
                    </Title>
                    <Box style={{ color: 'var(--mantine-color-gray-3)' }}>
                      <MarkdownRenderer content={project.description} />
                    </Box>
                  </Paper>
                </motion.div>
              )}

              {/* Additional Images */}
              {additionalImages.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Stack gap="md">
                    <Title order={3} size="h3" c="gray.2">
                      Project Galerij
                    </Title>
                    <Group gap="md" wrap="wrap">
                      {additionalImages.map((image, index) => (
                        <motion.div 
                          key={image.id || index}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          style={{ flex: '1 1 300px', maxWidth: '400px' }}
                        >
                          <Paper
                            radius="md"
                            style={{
                              overflow: 'hidden',
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <AspectRatio ratio={16 / 9}>
                              <NextImage
                                src={image.url}
                                alt={image.altText || `${project.title} - Afbeelding ${index + 2}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                quality={85}
                                sizes="400px"
                              />
                            </AspectRatio>
                          </Paper>
                        </motion.div>
                      ))}
                    </Group>
                  </Stack>
                </motion.div>
              )}
            </Stack>
          </motion.div>
        </Container>
      </section>
    </PageErrorBoundary>
  );
}
"use client"; // Image component requires client-side rendering

import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Card, Text, Stack, Badge, Group, Button, Paper } from '@mantine/core';
import type { FeaturedProjectType, ProjectPreviewType } from '@/lib/actions/projects';
import { motion } from 'framer-motion';
import PageErrorBoundary from '../shared/PageErrorBoundary';

interface ProjectCardProps {
  project: FeaturedProjectType | ProjectPreviewType;
}

/**
 * ProjectCard Component
 * Displays a project card with image, details, and CTA button
 * Optimized animations without 3D transforms to prevent text blur
 * Accepts both FeaturedProjectType and ProjectPreviewType
 */
function ProjectCard({ project }: ProjectCardProps) {
  // Validate project prop
  if (!project || typeof project !== 'object') {
    throw new Error('Invalid project data provided to ProjectCard');
  }

  return (
    <PageErrorBoundary>
      <motion.div
        style={{ height: '100%' }}
        whileHover={{ 
          y: -8,
          transition: { 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.3
          }
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card
          shadow="md" 
          padding={0}
          radius="lg" 
          withBorder 
          h="100%"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          styles={{
            root: {
              '&:hover': {
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                borderColor: 'rgba(59, 130, 246, 0.4)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.08) 100%)',
              }
            }
          }}
        >
          {/* Image section */}
          <Card.Section>
            <motion.div 
              style={{ 
                margin: 'var(--mantine-spacing-md)',
                marginBottom: 0,
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Paper 
                radius="md" 
                style={{ 
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                }}
              >
                <NextImage
                  src={project.featuredImageUrl || 'https://via.placeholder.com/800x500/1f2937/9ca3af.png?text=No+Image'}
                  alt={project.featuredImageAlt || project.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={85}
                  style={{ 
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.3s ease',
                  }}
                  onError={(e) => {
                    console.error('Error loading project image:', e);
                    e.currentTarget.src = 'https://via.placeholder.com/800x500/1f2937/9ca3af.png?text=Image+Error';
                  }}
                />
                
                {/* Subtle gradient overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '30%',
                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.2))',
                  pointerEvents: 'none',
                }} />

                {/* Hover effect overlay */}
                <motion.div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
                    opacity: 0,
                    pointerEvents: 'none',
                  }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Paper>
            </motion.div>
          </Card.Section>

          {/* Content section - NO 3D transforms for sharp text */}
          <div style={{ 
            padding: 'var(--mantine-spacing-md) var(--mantine-spacing-lg) var(--mantine-spacing-md)',
          }}>
            <Stack gap="sm" style={{ flexGrow: 1, minHeight: 140 }}>
              <Text 
                fw={600} 
                size="lg" 
                lineClamp={2}
                style={{
                  lineHeight: 1.3,
                  color: 'var(--mantine-color-gray-1)',
                  minHeight: '2.6em',
                  // Optimal text rendering
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {project.title}
              </Text>
              
              {project.shortDescription && (
                <Text 
                  size="sm" 
                  c="gray.4" 
                  lineClamp={3}
                  style={{ 
                    lineHeight: 1.4,
                    minHeight: '3.6em',
                    // Optimal text rendering
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  {project.shortDescription}
                </Text>
              )}
              
              {/* Technology badges */}
              <Group gap="xs" mt="auto" style={{ flexWrap: 'wrap', minHeight: '2rem' }}>
                {project.technologies?.slice(0, 3).map((tag: string) => (
                  <Badge 
                    key={tag} 
                    size="sm" 
                    variant="light"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: 'var(--mantine-color-blue-3)',
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
                {project.technologies && project.technologies.length > 3 && (
                  <Badge 
                    size="sm" 
                    variant="outline"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'var(--mantine-color-gray-4)',
                    }}
                  >
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </Group>
            </Stack>
          </div>

          {/* CTA Section */}
          <div style={{ 
            padding: '0 var(--mantine-spacing-lg) var(--mantine-spacing-lg)',
          }}>
            <Button
              component={Link}
              href={`/projects/${project.slug}`}
              variant="gradient"
              gradient={{ from: 'blue.6', to: 'cyan.5' }}
              fullWidth
              size="sm"
              radius="md"
              style={{
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                fontWeight: 500,
              }}
            >
              Bekijk Project
            </Button>
          </div>

          {/* Subtle decorative element */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(10px)',
            pointerEvents: 'none',
          }} />
        </Card>
      </motion.div>
    </PageErrorBoundary>
  );
}

export default ProjectCard;

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
          {project.technologies?.slice(0, 3).map((tag) => (
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

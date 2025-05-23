'use client';

import React, { memo } from 'react';
import { SimpleGrid, Container, Title, Text, Box } from '@mantine/core';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import type { ProjectPreviewType } from '@/lib/actions/projects';
import PageErrorBoundary from '../shared/PageErrorBoundary';

// Animation variants for the container
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

// Animation variants for individual items
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

interface ProjectListProps {
  projects: ProjectPreviewType[];
  title?: string;
  description?: string;
  showTitle?: boolean;
}

/**
 * ProjectList Component
 * Displays a responsive grid of project cards with animations
 * Optimized for performance and user experience
 */
const ProjectList = memo<ProjectListProps>(({ 
  projects, 
  title = "Alle Projecten",
  description,
  showTitle = true
}) => {
  // Validate projects prop
  if (!Array.isArray(projects)) {
    throw new Error('Projects must be an array');
  }

  if (!projects || projects.length === 0) {
    return (
      <PageErrorBoundary>
        <section style={{ 
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          minHeight: '100vh',
        }}>
          <Container size="lg" py={{ base: 'xl', md: '3xl' }}>
            <Box style={{ textAlign: 'center' }}>
              <Title order={2} c="gray.2" mb="md">
                Geen projecten gevonden
              </Title>
              <Text c="gray.4" size="lg">
                Momenteel geen projecten om weer te geven.
              </Text>
            </Box>
          </Container>
        </section>
      </PageErrorBoundary>
    );
  }

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
            left: '5%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '60%',
            right: '10%',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        <Container size="lg" py={{ base: 'xl', md: '3xl' }} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Header Section */}
            {showTitle && (
              <motion.div
                variants={itemVariants}
                style={{ 
                  textAlign: 'center',
                  marginBottom: 'var(--mantine-spacing-3xl)',
                }}
              >
                <Title 
                  order={1} 
                  size="h1" 
                  mb="md"
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
                  {title}
                </Title>
                
                {description && (
                  <Text size="lg" c="gray.4" maw={600} mx="auto">
                    {description}
                  </Text>
                )}
                
                <Text size="sm" c="gray.5" mt="sm">
                  {projects.length} project{projects.length !== 1 ? 'en' : ''} gevonden
                </Text>
              </motion.div>
            )}

            {/* Projects Grid */}
            <motion.div variants={itemVariants}>
              <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 3 }}
                spacing={{ base: "lg", sm: "xl", lg: "xl" }}
                verticalSpacing={{ base: "xl", sm: "xl", lg: "2xl" }}
                style={{
                  gap: 'clamp(1.5rem, 4vw, 2.5rem)',
                }}
              >
                {projects.map((project, index) => {
                  // Validate each project before rendering
                  if (!project || typeof project !== 'object') {
                    console.error('Invalid project data:', project);
                    return null;
                  }
                  
                  return (
                    <motion.div 
                      key={project.id} 
                      variants={itemVariants}
                      style={{
                        height: '100%',
                        // Hardware acceleration without 3D transforms
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)',
                      }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  );
                })}
              </SimpleGrid>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </PageErrorBoundary>
  );
});

ProjectList.displayName = 'ProjectList';

export default ProjectList; 
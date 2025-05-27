'use client';

import React, { memo, useCallback } from 'react';
import { SimpleGrid, Container, Stack, Title, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import ProjectCard from '../projects/ProjectCard';
import type { FeaturedProjectType } from '@/lib/actions/projects';
import PageErrorBoundary from '../shared/PageErrorBoundary';
import ProgressiveLoader from '../shared/ProgressiveLoader';

// Optimized animation variants for performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

interface AnimatedProjectGridProps {
  projects: FeaturedProjectType[];
  className?: string;
  title?: string;
  description?: string;
  showTitle?: boolean;
}

/**
 * Optimized ProjectGridContent without 3D transforms to prevent text blur
 */
const ProjectGridContent = memo<{ 
  projects: FeaturedProjectType[];
  title?: string;
  description?: string;
  showTitle?: boolean;
}>(({ projects, title = "Featured Projects", description, showTitle = true }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
  >
    {showTitle && (
      <motion.div
        variants={itemVariants}
        style={{ 
          marginBottom: 'var(--mantine-spacing-xl)',
          textAlign: 'center' 
        }}
      >
        <Title order={2} size="h1" mb="md" style={{ 
          background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
        }}>
          {title}
        </Title>
        {description && (
          <Text size="lg" c="dimmed" maw={600} mx="auto">
            {description}
          </Text>
        )}
      </motion.div>
    )}

    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3 }}
      spacing={{ base: "lg", sm: "xl", lg: "xl" }}
      verticalSpacing={{ base: "xl", sm: "xl", lg: "2xl" }}
      style={{
        gap: 'clamp(1.5rem, 4vw, 2.5rem)',
        padding: 'var(--mantine-spacing-md)',
      }}
    >
      {projects.map((project, index) => (
        <motion.div 
          key={project.id} 
          variants={itemVariants}
          style={{
            height: '100%',
            // Hardware acceleration without 3D transforms
            willChange: 'transform, opacity',
            transform: 'translateZ(0)', // For GPU acceleration
          }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </SimpleGrid>
  </motion.div>
));

ProjectGridContent.displayName = 'ProjectGridContent';

/**
 * AnimatedProjectGrid Component
 * Displays a grid of projects with staggered animations
 * Optimized for performance and text clarity
 */
const AnimatedProjectGrid = memo<AnimatedProjectGridProps>(({ 
  projects, 
  className,
  title,
  description,
  showTitle = true,
}) => {
  // Input validation with clear error messaging
  const validateProjects = useCallback((projects: unknown): projects is FeaturedProjectType[] => {
    if (!Array.isArray(projects)) {
      console.error('AnimatedProjectGrid: Expected projects to be an array, received:', typeof projects);
      return false;
    }
    
    if (projects.length === 0) {
      console.warn('AnimatedProjectGrid: Received empty projects array');
      return true;
    }

    const isValid = projects.every((project, index) => {
      if (!project || typeof project !== 'object') {
        console.error(`AnimatedProjectGrid: Invalid project at index ${index}:`, project);
        return false;
      }
      if (!project.id) {
        console.error(`AnimatedProjectGrid: Project at index ${index} missing required id property`);
        return false;
      }
      return true;
    });

    return isValid;
  }, []);

  // Early return for invalid data
  if (!validateProjects(projects)) {
    throw new Error('AnimatedProjectGrid: Invalid projects data provided');
  }

  // Early return for empty projects with graceful fallback
  if (projects.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Text ta="center" size="lg" c="dimmed">
          No projects available to display.
        </Text>
      </Container>
    );
  }

  return (
    <PageErrorBoundary>
      <section className={className} style={{ 
        position: 'relative',
        overflow: 'hidden',
        background: `
          linear-gradient(180deg, 
            transparent 0%, 
            rgba(0, 0, 0, 0.2) 15%, 
            rgba(15, 23, 42, 0.95) 25%, 
            rgba(15, 23, 42, 0.95) 75%, 
            rgba(0, 0, 0, 0.2) 85%, 
            transparent 100%
          )
        `,
        paddingTop: 'clamp(4rem, 8vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
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
            x: [0, 25, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '70%',
            right: '10%',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        <Container size="lg" py={{ base: "xl", md: "2xl" }} style={{ position: 'relative', zIndex: 1 }}>
          <ProgressiveLoader 
            minHeight={400}
            threshold={0.1}
            rootMargin="100px"
          >
            <ProjectGridContent 
              projects={projects}
              title={title}
              description={description}
              showTitle={showTitle}
            />
          </ProgressiveLoader>
        </Container>
      </section>
    </PageErrorBoundary>
  );
});

AnimatedProjectGrid.displayName = 'AnimatedProjectGrid';

export default AnimatedProjectGrid; 
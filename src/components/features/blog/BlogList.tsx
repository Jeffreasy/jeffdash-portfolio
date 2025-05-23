'use client';

import React from 'react';
import { SimpleGrid, Container, Title, Text, Box } from '@mantine/core';
import { motion } from 'framer-motion';
import BlogPostCard from './BlogPostCard'; // Importeer de kaart component
import type { PublishedPostPreviewType } from '@/lib/actions/blog'; // Importeer het post preview type
import BlogErrorBoundary from './BlogErrorBoundary';

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

// Definieer de props voor BlogList
interface BlogListProps {
  posts: PublishedPostPreviewType[];
}

export default function BlogList({ posts }: BlogListProps) {
  // Valideer posts array
  if (!Array.isArray(posts)) {
    throw new Error('Posts must be an array');
  }

  // Toon een bericht als er geen posts zijn
  if (!posts || posts.length === 0) {
    return (
      <BlogErrorBoundary>
        <section style={{ 
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          minHeight: '100vh',
        }}>
          <Container size="lg" py={{ base: 'xl', md: '3xl' }}>
            <Box style={{ textAlign: 'center' }}>
              <Title order={2} c="gray.2" mb="md">
                Geen blog posts gevonden
              </Title>
              <Text c="gray.4" size="lg">
                Momenteel geen blog posts om weer te geven.
              </Text>
            </Box>
          </Container>
        </section>
      </BlogErrorBoundary>
    );
  }

  return (
    <BlogErrorBoundary>
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
            top: '15%',
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
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '65%',
            right: '8%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Optionele titel voor de blog sectie */}
            <motion.div
              variants={itemVariants}
              style={{ 
                textAlign: 'center',
                marginBottom: 'var(--mantine-spacing-3xl)',
              }}
            >
              <Title 
                order={2} 
                ta="center" 
                mb="xl"
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
                Recente Blog Posts
              </Title>
              
              <Text size="sm" c="gray.5">
                {posts.length} blog post{posts.length !== 1 ? 's' : ''} gevonden
              </Text>
            </motion.div>

            {/* Grid met Blog Post Kaarten */}
            <motion.div variants={itemVariants}>
              <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3 }} // Responsive kolommen
                spacing="xl" // Ruimte tussen de kaarten
                verticalSpacing={{ base: "xl", sm: "xl", lg: "2xl" }}
                style={{
                  gap: 'clamp(1.5rem, 4vw, 2.5rem)',
                }}
              >
                {posts.map((post, index) => {
                  // Validate each post before rendering
                  if (!post || typeof post !== 'object') {
                    console.error('Invalid post data:', post);
                    return null;
                  }

                  return (
                    <motion.div 
                      key={post.id} 
                      variants={itemVariants}
                      style={{
                        height: '100%',
                        // Hardware acceleration without 3D transforms
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)',
                      }}
                    >
                      <BlogPostCard post={post} />
                    </motion.div>
                  );
                })}
              </SimpleGrid>
            </motion.div>
          </motion.div>

          {/* TODO: Voeg hier eventueel paginering toe als er veel posts zijn */}
        </Container>
      </section>
    </BlogErrorBoundary>
  );
} 
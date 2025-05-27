'use client';

import React from 'react';
import { Container, Title, Text, Paper, Group, Badge, Stack, AspectRatio, Image as MantineImage, Button, Box } from '@mantine/core';
import Link from 'next/link';
import { IconCalendar, IconTag, IconCategory, IconArrowLeft } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { FullPostType } from '@/lib/actions/blog'; // Import het volledige type
import { formatDate } from '@/lib/utils';
import MarkdownRenderer from '@/components/shared/MarkdownRenderer'; // Importeer de renderer
import BlogErrorBoundary from './BlogErrorBoundary';

interface BlogPostDetailViewProps {
  post: FullPostType | null; // Accepteer ook null voor niet gevonden posts
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

export default function BlogPostDetailView({ post }: BlogPostDetailViewProps) {
  // Valideer post object als het niet null is
  if (post && typeof post !== 'object') {
    throw new Error('Invalid post data');
  }

  // Toon bericht als post niet gevonden is
  if (!post) {
    return (
      <BlogErrorBoundary>
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 'var(--mantine-spacing-xl)',
          paddingBottom: 'var(--mantine-spacing-xl)',
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
                  Blog Post niet gevonden
                </Title>
                <Text c="gray.4" mb="xl" size="lg">
                  De post die je zoekt kon niet worden geladen.
                </Text>
                <Button 
                  component={Link} 
                  href="/blog"
                  variant="gradient"
                  gradient={{ from: 'blue.6', to: 'cyan.5' }}
                  leftSection={<IconArrowLeft size={18} />}
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  Terug naar blog
                </Button>
              </Paper>
            </motion.div>
          </Container>
        </section>
      </BlogErrorBoundary>
    );
  }

  const fallbackImage = 'https://via.placeholder.com/800x450/1f2937/9ca3af.png?text=Blog+Post';

  return (
    <BlogErrorBoundary>
      <section style={{ 
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        minHeight: '100vh',
        paddingTop: 'var(--mantine-spacing-xl)',
        paddingBottom: 'var(--mantine-spacing-xl)',
      }}>
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '8%',
            right: '5%',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '55%',
            left: '3%',
            width: '220px',
            height: '220px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        <Container size="lg" py={{ base: 'xl', md: '3xl' }} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Back Navigation */}
            <motion.div variants={itemVariants}>
              <Button
                component={Link}
                href="/blog"
                variant="outline"
                color="gray"
                leftSection={<IconArrowLeft size={16} />}
                mb="xl"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'var(--mantine-color-gray-2)',
                }}
              >
                Terug naar blog
              </Button>
            </motion.div>

            <Stack gap="2xl">
              {/* Post Header */}
              <motion.div variants={itemVariants}>
                <Paper 
                  p={{ base: 'lg', md: 'xl' }}
                  radius="lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Stack gap="lg">
                    {/* Titel */}
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
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        lineHeight: 1.2,
                      }}
                    >
                      {post.title}
                    </Title>

                    {/* Metadata: Datum, Categorie */}
                    <Group gap="lg" wrap="wrap">
                      {post.publishedAt && (
                        <Group gap="xs">
                          <IconCalendar size={16} stroke={1.5} style={{ color: 'var(--mantine-color-gray-4)' }} />
                          <Text size="sm" c="gray.4" fw={500}>{formatDate(post.publishedAt)}</Text>
                        </Group>
                      )}
                      {post.category && (
                         <Group gap="xs">
                          <IconCategory size={16} stroke={1.5} style={{ color: 'var(--mantine-color-gray-4)' }} />
                          <Badge 
                            variant="light"
                            size="md"
                            style={{
                              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              color: 'var(--mantine-color-blue-3)',
                            }}
                          >
                            {post.category}
                          </Badge>
                        </Group>
                      )}
                    </Group>
                  </Stack>
                </Paper>
              </motion.div>

              {/* Featured Image */}
              {post.featuredImageUrl && (
                <motion.div variants={itemVariants}>
                  <Paper 
                    shadow="lg" 
                    radius="lg" 
                    style={{ 
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <AspectRatio ratio={16 / 9}>
                      <MantineImage
                        src={post.featuredImageUrl}
                        alt={post.featuredImageAltText || post.title}
                        fallbackSrc={fallbackImage}
                        onError={(e) => {
                          console.error(`Error loading featured image for post ${post.id}:`, e);
                        }}
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </AspectRatio>
                  </Paper>
                </motion.div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
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
                    <Group gap="xs" mb="md">
                      <IconTag size={16} stroke={1.5} style={{ color: 'var(--mantine-color-gray-4)' }} />
                      <Text size="sm" c="gray.3" fw={600}>Tags</Text>
                    </Group>
                    <Group gap="xs">
                      {post.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline"
                          size="md"
                          style={{
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: 'var(--mantine-color-gray-4)',
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  </Paper>
                </motion.div>
              )}

              {/* Blog Content */}
              {post.content && (
                <motion.div variants={itemVariants}>
                  <Paper 
                    p={{ base: 'lg', md: 'xl' }}
                    radius="lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Box 
                      style={{ 
                        color: 'var(--mantine-color-gray-2)',
                        lineHeight: 1.7,
                        fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                      }}
                    >
                      <MarkdownRenderer>{post.content}</MarkdownRenderer>
                    </Box>
                  </Paper>
                </motion.div>
              )}

              {/* Back to Blog CTA */}
              <motion.div variants={itemVariants}>
                <Paper
                  p="lg"
                  radius="lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center',
                  }}
                >
                  <Text c="gray.4" mb="md">
                    Bedankt voor het lezen!
                  </Text>
                  <Button
                    component={Link}
                    href="/blog"
                    variant="gradient"
                    gradient={{ from: 'blue.6', to: 'cyan.5' }}
                    leftSection={<IconArrowLeft size={18} />}
                    style={{
                      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    Meer blog posts
                  </Button>
                </Paper>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </section>
    </BlogErrorBoundary>
  );
} 
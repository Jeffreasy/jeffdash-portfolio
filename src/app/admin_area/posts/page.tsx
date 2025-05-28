'use client';

import React, { useEffect, useState } from 'react';
import { Title, Text, Button, Alert, Box, Group, ThemeIcon, Stack, Container, Loader, Center } from '@mantine/core';
import Link from 'next/link';
import { IconInfoCircle, IconPlus, IconFileText, IconEye, IconEdit } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import PostsTable from '@/components/admin/PostsTable';
import { getPosts, AdminPostListItemType } from '@/lib/actions/blog';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPostListItemType[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const postsData = await getPosts();
        setPosts(postsData);
        setFetchError(null);
      } catch (error) {
        console.error("Fout bij ophalen posts voor admin:", error);
        setFetchError((error instanceof Error) ? error.message : "Kon posts niet laden door een serverfout.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(post => post.published).length;
  const draftPosts = totalPosts - publishedPosts;

  if (isLoading) {
    return (
      <AdminErrorBoundary componentName="Posts Admin Page">
        <Box
          style={{
            position: 'relative',
            minHeight: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <Container size="lg">
            <Stack gap="xl" align="center">
              <Title 
                order={1}
                ta="center"
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-violet-4), var(--mantine-color-purple-4))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 900,
                }}
              >
                Blog Posts Beheer
              </Title>
              
              <Box
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(16px, 4vw, 24px)',
                  position: 'relative',
                  minHeight: 'clamp(300px, 40vh, 400px)',
                  width: '100%',
                  maxWidth: 'clamp(400px, 90vw, 600px)',
                }}
              >
                <Center h="100%">
                  <Stack align="center" gap="md">
                    <Loader size="lg" color="violet.4" type="dots" />
                    <Text 
                      c="gray.4" 
                      ta="center"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                      }}
                    >
                      Blog posts laden...
                    </Text>
                  </Stack>
                </Center>
              </Box>
            </Stack>
          </Container>
        </Box>
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary componentName="Posts Admin Page">
      <Box
        style={{
          position: 'relative',
          minHeight: '100%',
          width: '100%',
        }}
      >
        {/* Subtle background elements */}
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: 'clamp(200px, 30vw, 250px)',
          height: 'clamp(200px, 30vw, 250px)',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <Container 
          size="xl" 
          style={{ 
            position: 'relative', 
            zIndex: 1,
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Stack gap="xl">
              {/* Header */}
              <motion.div variants={itemVariants}>
                <Group justify="space-between" align="flex-start" wrap="wrap">
                  <Box style={{ flex: 1, minWidth: '250px' }}>
                    <Title 
                      order={1}
                      style={{
                        background: 'linear-gradient(135deg, var(--mantine-color-violet-4), var(--mantine-color-purple-4))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        fontWeight: 900,
                        marginBottom: 'clamp(8px, 2vw, 12px)',
                      }}
                    >
                      Blog Posts Beheer
                    </Title>
                    <Text 
                      size="lg" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                      }}
                    >
                      Schrijf, bewerk en publiceer je blog artikelen
                    </Text>
                  </Box>
                  
                  <Group gap="md" visibleFrom="sm" wrap="wrap">
                    <Box
                      style={{
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: 'clamp(6px, 1.5vw, 8px)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Group gap="xs">
                        <ThemeIcon
                          size="sm"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'violet.6', to: 'purple.5' }}
                          style={{
                            minHeight: '32px',
                            minWidth: '32px',
                          }}
                        >
                          <IconFileText size={14} />
                        </ThemeIcon>
                        <Text 
                          size="sm" 
                          fw={600} 
                          c="violet.3"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                          }}
                        >
                          {totalPosts} totaal
                        </Text>
                      </Group>
                    </Box>
                    
                    {publishedPosts > 0 && (
                      <Box
                        style={{
                          padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          borderRadius: 'clamp(6px, 1.5vw, 8px)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Group gap="xs">
                          <ThemeIcon
                            size="sm"
                            radius="md"
                            variant="gradient"
                            gradient={{ from: 'green.6', to: 'teal.5' }}
                            style={{
                              minHeight: '32px',
                              minWidth: '32px',
                            }}
                          >
                            <IconEye size={14} />
                          </ThemeIcon>
                          <Text 
                            size="sm" 
                            fw={600} 
                            c="green.3"
                            style={{
                              fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                            }}
                          >
                            {publishedPosts} gepubliceerd
                          </Text>
                        </Group>
                      </Box>
                    )}
                    
                    {draftPosts > 0 && (
                      <Box
                        style={{
                          padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                          background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                          border: '1px solid rgba(251, 146, 60, 0.2)',
                          borderRadius: 'clamp(6px, 1.5vw, 8px)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Group gap="xs">
                          <ThemeIcon
                            size="sm"
                            radius="md"
                            variant="gradient"
                            gradient={{ from: 'orange.6', to: 'yellow.5' }}
                            style={{
                              minHeight: '32px',
                              minWidth: '32px',
                            }}
                          >
                            <IconEdit size={14} />
                          </ThemeIcon>
                          <Text 
                            size="sm" 
                            fw={600} 
                            c="orange.3"
                            style={{
                              fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                            }}
                          >
                            {draftPosts} concept
                          </Text>
                        </Group>
                      </Box>
                    )}
                  </Group>
                </Group>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants}>
                <Group gap="md" wrap="wrap">
                  <Button
                    component={Link}
                    href="/admin_area/posts/new"
                    leftSection={<IconPlus size={18} />}
                    variant="gradient"
                    gradient={{ from: 'violet.6', to: 'purple.5' }}
                    size="md"
                    style={{
                      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      fontWeight: 600,
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      minHeight: '48px',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)',
                    }}
                    styles={{
                      root: {
                        '&:hover': {
                          boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0px)',
                        },
                      },
                    }}
                  >
                    Nieuwe Post
                  </Button>
                </Group>
              </motion.div>

              {/* Error Display */}
              {fetchError && (
                <motion.div variants={itemVariants}>
                  <Alert
                    icon={<IconInfoCircle size={16} />}
                    title="Fout bij laden van posts"
                    color="red"
                    radius="md"
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                    }}
                  >
                    {fetchError}
                  </Alert>
                </motion.div>
              )}

              {/* Posts Table */}
              <motion.div variants={itemVariants}>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'clamp(8px, 2vw, 12px)',
                    padding: 'clamp(16px, 4vw, 24px)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: 'clamp(80px, 20vw, 120px)',
                    height: 'clamp(80px, 20vw, 120px)',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(25px)',
                    pointerEvents: 'none',
                  }} />

                  <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
                    <Group gap="md" wrap="wrap">
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'violet.6', to: 'purple.5' }}
                        style={{
                          minHeight: '44px',
                          minWidth: '44px',
                        }}
                      >
                        <IconFileText size={20} />
                      </ThemeIcon>
                      <Box style={{ flex: 1, minWidth: '200px' }}>
                        <Title 
                          order={3} 
                          c="gray.1" 
                          size="h4"
                          style={{
                            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                            marginBottom: 'clamp(2px, 0.5vw, 4px)',
                          }}
                        >
                          Alle Blog Posts
                        </Title>
                        <Text 
                          size="sm" 
                          c="gray.4"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                          }}
                        >
                          {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} gevonden
                          {publishedPosts > 0 && ` • ${publishedPosts} gepubliceerd`}
                          {draftPosts > 0 && ` • ${draftPosts} concept`}
                        </Text>
                      </Box>
                    </Group>
                    
                    <PostsTable initialPosts={posts} />
                  </Stack>
                </Box>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </AdminErrorBoundary>
  );
} 
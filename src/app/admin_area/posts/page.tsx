'use client';

import React, { useEffect, useState } from 'react';
import { Title, Text, Button, Alert, Box, Group, ThemeIcon, Stack, Container, Loader, Center } from '@mantine/core';
import Link from 'next/link';
import { IconInfoCircle, IconPlus, IconFileText, IconEye, IconEdit } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import PostsTable from '@/components/admin/PostsTable';
import { getPosts, AdminPostListItemType } from '@/lib/actions/blog';

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
      <Box
        style={{
          position: 'relative',
          minHeight: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--mantine-spacing-xl)',
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
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
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
                borderRadius: '12px',
                padding: 'var(--mantine-spacing-xl)',
                position: 'relative',
                minHeight: '400px',
                width: '100%',
                maxWidth: '600px',
              }}
            >
              <Center h="100%">
                <Stack align="center" gap="md">
                  <Loader size="lg" color="violet.4" type="dots" />
                  <Text c="gray.4" ta="center">
                    Blog posts laden...
                  </Text>
                </Stack>
              </Center>
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
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
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack gap="xl">
            {/* Header */}
            <motion.div variants={itemVariants}>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Title 
                    order={1}
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-violet-4), var(--mantine-color-purple-4))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                      fontWeight: 900,
                      marginBottom: '0.5rem',
                    }}
                  >
                    Blog Posts Beheer
                  </Title>
                  <Text 
                    size="lg" 
                    c="gray.3"
                    style={{
                      fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                    }}
                  >
                    Schrijf, bewerk en publiceer je blog artikelen
                  </Text>
                </Box>
                
                <Group gap="md" visibleFrom="sm">
                  <Box
                    style={{
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Group gap="xs">
                      <ThemeIcon
                        size="sm"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'violet.6', to: 'purple.5' }}
                      >
                        <IconFileText size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="violet.3">
                        {totalPosts} totaal
                      </Text>
                    </Group>
                  </Box>
                  
                  <Box
                    style={{
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Group gap="xs">
                      <ThemeIcon
                        size="sm"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'green.6', to: 'teal.5' }}
                      >
                        <IconEye size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="green.3">
                        {publishedPosts} gepubliceerd
                      </Text>
                    </Group>
                  </Box>

                  {draftPosts > 0 && (
                    <Box
                      style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Group gap="xs">
                        <ThemeIcon
                          size="sm"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'orange.6', to: 'red.5' }}
                        >
                          <IconEdit size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={600} c="orange.3">
                          {draftPosts} concept
                        </Text>
                      </Group>
                    </Box>
                  )}
                </Group>
              </Group>
            </motion.div>

            {/* Add New Post Button */}
            <motion.div variants={itemVariants}>
              <Button 
                component={Link} 
                href="/admin_area/posts/new"
                size="lg"
                variant="gradient"
                gradient={{ from: 'violet.6', to: 'purple.5' }}
                leftSection={<IconPlus size={20} />}
                style={{
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  fontWeight: 600,
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
                Nieuwe Post Schrijven
              </Button>
            </motion.div>

            {/* Error Alert */}
            {fetchError && (
              <motion.div variants={itemVariants}>
                <Alert 
                  icon={<IconInfoCircle size="1rem" />} 
                  title="Fout bij laden" 
                  color="red"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                  styles={{
                    title: {
                      color: 'var(--mantine-color-red-4)',
                    },
                    message: {
                      color: 'var(--mantine-color-red-3)',
                    }
                  }}
                >
                  {fetchError}
                </Alert>
              </motion.div>
            )}

            {/* Empty State */}
            {!fetchError && posts.length === 0 && (
              <motion.div variants={itemVariants}>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: 'var(--mantine-spacing-xl)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(30px)',
                    pointerEvents: 'none',
                  }} />

                  <Stack gap="md" align="center" style={{ position: 'relative', zIndex: 1 }}>
                    <ThemeIcon
                      size="xl"
                      radius="md"
                      variant="gradient"
                      gradient={{ from: 'violet.6', to: 'purple.5' }}
                    >
                      <IconFileText size={32} />
                    </ThemeIcon>
                    <Text size="lg" fw={600} c="gray.2">
                      Nog geen blog posts gevonden
                    </Text>
                    <Text size="sm" c="gray.4">
                      Begin met schrijven en deel je kennis met de wereld
                    </Text>
                    <Button 
                      component={Link} 
                      href="/admin_area/posts/new"
                      variant="outline"
                      color="violet"
                      leftSection={<IconPlus size={16} />}
                    >
                      Eerste Post Schrijven
                    </Button>
                  </Stack>
                </Box>
              </motion.div>
            )}

            {/* Posts Table */}
            {!fetchError && posts.length > 0 && (
              <motion.div variants={itemVariants}>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: 'var(--mantine-spacing-lg)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    pointerEvents: 'none',
                  }} />

                  <PostsTable initialPosts={posts} />
                </Box>
              </motion.div>
            )}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
} 
'use client';

import React, { useEffect, useState } from 'react';
import { Container, Title, Alert, Text, Box, Group, ThemeIcon, Stack, Loader, Center, Card } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconAlertCircle, IconEdit, IconFileText, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import PostForm from '@/components/admin/PostForm';
import { getPostBySlugForAdmin, updatePostAction } from '@/lib/actions/blog';
import type { FullAdminPostType } from '@/lib/actions/blog';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Loading component for the edit page
function EditPostLoading() {
  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 24px)',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 'clamp(200px, 30vw, 250px)',
          height: 'clamp(200px, 30vw, 250px)',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
        animate={{
          x: [0, 25, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 'clamp(150px, 25vw, 180px)',
          height: 'clamp(150px, 25vw, 180px)',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(35px)',
          pointerEvents: 'none',
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stack gap="xl" align="center">
            <Box ta="center">
              <Title 
                order={1}
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-violet-4), var(--mantine-color-purple-4))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                  fontWeight: 900,
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                Blogpost Bewerken
              </Title>
              <Text 
                size="lg" 
                c="gray.3"
                style={{
                  fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                Post gegevens laden...
              </Text>
            </Box>
            
            <Card
              shadow="xl"
              padding="xl"
              radius="xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                minHeight: 'clamp(200px, 30vh, 250px)',
                width: '100%',
                maxWidth: 'clamp(300px, 90vw, 400px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Decorative loading element */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: 'clamp(40px, 10vw, 60px)',
                height: 'clamp(40px, 10vw, 60px)',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(15px)',
                pointerEvents: 'none',
              }} />

              <Stack align="center" gap="md">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: 'violet.6', to: 'purple.5' }}
                    style={{
                      minHeight: '48px',
                      minWidth: '48px',
                    }}
                  >
                    <IconEdit size={24} />
                  </ThemeIcon>
                </motion.div>
                <Loader size="md" color="violet.4" type="dots" />
                <Text 
                  c="gray.4" 
                  ta="center" 
                  fw={500} 
                  size="sm"
                  style={{
                    fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                  }}
                >
                  Post laden...
                </Text>
              </Stack>
            </Card>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}

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

// Client component wrapper for the edit page
function EditPostPageClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<FullAdminPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const postData = await getPostBySlugForAdmin(slug);
        
        if (!postData) {
          router.push('/404');
          return;
        }
        
        setPost(postData);
      } catch (err) {
        console.error('Error loading post:', err);
        setError(err instanceof Error ? err.message : 'Kon post niet laden');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug, router]);

  if (isLoading) {
    return <EditPostLoading />;
  }

  if (error) {
    return (
      <AdminErrorBoundary componentName="Edit Post Page">
        <Box
          style={{
            position: 'relative',
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <Container size="sm">
            <Stack gap="xl" align="center">
              <Title 
                order={1}
                ta="center"
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-red-4), var(--mantine-color-orange-4))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 900,
                }}
              >
                Post Niet Gevonden
              </Title>
              
              <Alert 
                icon={<IconAlertCircle size={16} />} 
                title="Fout bij laden van post" 
                color="red"
                radius="md"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                  maxWidth: 'clamp(300px, 90vw, 500px)',
                }}
              >
                {error}
              </Alert>
            </Stack>
          </Container>
        </Box>
      </AdminErrorBoundary>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '8%',
          left: '3%',
          width: 'clamp(250px, 35vw, 350px)',
          height: 'clamp(250px, 35vw, 350px)',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -25, 0],
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
          bottom: '12%',
          right: '8%',
          width: 'clamp(200px, 30vw, 280px)',
          height: 'clamp(200px, 30vw, 280px)',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(55px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        animate={{
          x: [0, -35, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      <Container 
        size="lg" 
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
          <Stack gap="xl" py="xl">
            {/* Enhanced Header */}
            <motion.div variants={itemVariants}>
              <Box
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'clamp(12px, 3vw, 16px)',
                  padding: 'clamp(16px, 4vw, 24px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Header decorative element */}
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  right: '-25px',
                  width: 'clamp(100px, 25vw, 130px)',
                  height: 'clamp(100px, 25vw, 130px)',
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(28px)',
                  pointerEvents: 'none',
                }} />

                <Group gap="lg" style={{ position: 'relative', zIndex: 1 }} wrap="wrap">
                  <motion.div
                    animate={{ 
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <ThemeIcon
                      size="xl"
                      radius="md"
                      variant="gradient"
                      gradient={{ from: 'violet.6', to: 'purple.5' }}
                      style={{
                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        minHeight: '48px',
                        minWidth: '48px',
                      }}
                    >
                      <IconEdit size={28} />
                    </ThemeIcon>
                  </motion.div>
                  
                  <Box style={{ flex: 1, minWidth: '250px' }}>
                    <Group gap="xs" mb="xs" wrap="wrap">
                      <Title 
                        order={1}
                        style={{
                          background: 'linear-gradient(135deg, var(--mantine-color-violet-4), var(--mantine-color-purple-4))',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                          fontWeight: 900,
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                        }}
                      >
                        Blogpost Bewerken
                      </Title>
                    </Group>
                    
                    <Text 
                      size="xl" 
                      fw={700}
                      c="gray.1"
                      mb="xs"
                      style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        lineHeight: 1.4,
                        wordBreak: 'break-word',
                      }}
                    >
                      {post.title}
                    </Text>
                    
                    <Text 
                      size="md" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        lineHeight: 1.6,
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                      }}
                    >
                      Bewerk de post details en sla de wijzigingen op om je blog bij te werken.
                    </Text>
                    
                    <Group gap="md" mt="sm" wrap="wrap">
                      <Box
                        style={{
                          padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px)',
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: 'clamp(4px, 1vw, 6px)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Group gap="xs">
                          <IconFileText size={14} style={{ color: 'var(--mantine-color-violet-4)' }} />
                          <Text 
                            size="xs" 
                            fw={600} 
                            c="violet.3"
                            style={{
                              fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                            }}
                          >
                            Blog Artikel
                          </Text>
                        </Group>
                      </Box>
                      
                      {post.published && (
                        <Box
                          style={{
                            padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px)',
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: 'clamp(4px, 1vw, 6px)',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Group gap="xs">
                            <Text 
                              size="xs" 
                              fw={600} 
                              c="green.3"
                              style={{
                                fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                              }}
                            >
                              ✓ Gepubliceerd
                            </Text>
                          </Group>
                        </Box>
                      )}
                      
                      <Box
                        style={{
                          padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px)',
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                          borderRadius: 'clamp(4px, 1vw, 6px)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Group gap="xs">
                          <IconEdit size={14} style={{ color: 'var(--mantine-color-orange-4)' }} />
                          <Text 
                            size="xs" 
                            fw={600} 
                            c="orange.3"
                            style={{
                              fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                            }}
                          >
                            Bewerken
                          </Text>
                        </Group>
                      </Box>
                    </Group>
                  </Box>
                </Group>
              </Box>
            </motion.div>

            {/* Post Form */}
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
                {/* Form decorative element */}
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: 'clamp(80px, 20vw, 120px)',
                  height: 'clamp(80px, 20vw, 120px)',
                  background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
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
                      gradient={{ from: 'purple.6', to: 'violet.5' }}
                      style={{
                        minHeight: '44px',
                        minWidth: '44px',
                      }}
                    >
                      <IconFileText size={20} />
                    </ThemeIcon>
                    <Box style={{ flex: 1, minWidth: '200px' }}>
                      <Title 
                        order={2} 
                        c="gray.1" 
                        size="h3"
                        style={{
                          fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                          marginBottom: 'clamp(4px, 1vw, 8px)',
                        }}
                      >
                        Post Details Bewerken
                      </Title>
                      <Text 
                        size="sm" 
                        c="gray.4"
                        style={{
                          fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                          lineHeight: 1.4,
                        }}
                      >
                        Update de inhoud en instellingen van je blogpost
                      </Text>
                    </Box>
                  </Group>
                  
                  <PostForm
                    action={updatePostAction}
                    initialData={post}
                    formTitle={`Blogpost Bewerken: ${post.title}`}
                  />
                </Stack>
              </Box>
            </motion.div>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}

export default function EditPostPage(props: EditPostPageProps) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const getSlug = async () => {
      const params = await props.params;
      setSlug(params.slug);
    };
    getSlug();
  }, [props.params]);

  if (!slug) {
    return <EditPostLoading />;
  }

  return (
    <AdminErrorBoundary componentName="Edit Post Page">
      <EditPostPageClient slug={slug} />
    </AdminErrorBoundary>
  );
} 
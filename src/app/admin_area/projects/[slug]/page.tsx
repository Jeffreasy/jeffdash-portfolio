'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Container, Title, Alert, Text, Box, Group, ThemeIcon, Stack, Loader, Center, Card } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconInfoCircle, IconEdit, IconFolder, IconAlertTriangle } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import ProjectForm from '@/components/admin/ProjectForm';
import { getProjectBySlug, updateProjectAction } from '@/lib/actions/projects';
import type { FullProjectType } from '@/lib/actions/projects';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

interface EditProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Loading component for the edit page
function EditProjectLoading() {
  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--mantine-spacing-xl)',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
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
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
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
                  background: 'linear-gradient(135deg, var(--mantine-color-orange-4), var(--mantine-color-yellow-4))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 900,
                  marginBottom: '0.5rem',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                Project Bewerken
              </Title>
              <Text 
                size="lg" 
                c="gray.3"
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                Project gegevens laden...
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
                minHeight: '250px',
                width: '100%',
                maxWidth: '400px',
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
                width: '60px',
                height: '60px',
                background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
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
                    gradient={{ from: 'orange.6', to: 'yellow.5' }}
                  >
                    <IconEdit size={24} />
                  </ThemeIcon>
                </motion.div>
                <Loader size="md" color="orange.4" type="dots" />
                <Text c="gray.4" ta="center" fw={500} size="sm">
                  Project laden...
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
function EditProjectPageClient({ slug }: { slug: string }) {
  const [project, setProject] = useState<FullProjectType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const projectData = await getProjectBySlug(slug);
        
        if (!projectData) {
          router.push('/404');
          return;
        }
        
        setProject(projectData);
      } catch (err) {
        console.error('Error loading project:', err);
        setError(err instanceof Error ? err.message : 'Kon project niet laden');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [slug, router]);

  if (isLoading) {
    return <EditProjectLoading />;
  }

  if (error) {
    return (
      <AdminErrorBoundary componentName="Edit Project Page">
        <Box
          style={{
            position: 'relative',
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--mantine-spacing-xl)',
          }}
        >
          <Container size="sm">
            <Alert 
              icon={<IconAlertTriangle size="1.2rem" />} 
              title="Fout bij laden van project" 
              color="red"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
              }}
            >
              {error}
            </Alert>
          </Container>
        </Box>
      </AdminErrorBoundary>
    );
  }

  if (!project) {
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
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.05) 0%, transparent 70%)',
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
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
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

      <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
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
                  borderRadius: '16px',
                  padding: 'var(--mantine-spacing-xl)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Header decorative element */}
                <div style={{
                  position: 'absolute',
                  top: '-25px',
                  right: '-25px',
                  width: '130px',
                  height: '130px',
                  background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(28px)',
                  pointerEvents: 'none',
                }} />

                <Group gap="lg" style={{ position: 'relative', zIndex: 1 }}>
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
                      gradient={{ from: 'orange.6', to: 'yellow.5' }}
                      style={{
                        boxShadow: '0 8px 32px rgba(251, 146, 60, 0.3)',
                        border: '1px solid rgba(251, 146, 60, 0.2)',
                      }}
                    >
                      <IconEdit size={28} />
                    </ThemeIcon>
                  </motion.div>
                  
                  <Box style={{ flex: 1 }}>
                    <Group gap="xs" mb="xs">
                      <Title 
                        order={1}
                        style={{
                          background: 'linear-gradient(135deg, var(--mantine-color-orange-4), var(--mantine-color-yellow-4))',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                          fontWeight: 900,
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                        }}
                      >
                        Project Bewerken
                      </Title>
                    </Group>
                    
                    <Text 
                      size="xl" 
                      fw={700}
                      c="gray.1"
                      mb="xs"
                      style={{
                        fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                      }}
                    >
                      {project.title}
                    </Text>
                    
                    <Text 
                      size="md" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        lineHeight: 1.6,
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                      }}
                    >
                      Bewerk de projectdetails en sla de wijzigingen op om je portfolio bij te werken.
                    </Text>
                    
                    <Group gap="md" mt="sm">
                      <Box
                        style={{
                          padding: '8px 12px',
                          background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                          border: '1px solid rgba(251, 146, 60, 0.2)',
                          borderRadius: '6px',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Group gap="xs">
                          <IconFolder size={14} style={{ color: 'var(--mantine-color-orange-4)' }} />
                          <Text size="xs" fw={600} c="orange.3">
                            {project.category || 'Geen categorie'}
                          </Text>
                        </Group>
                      </Box>
                      
                      {project.isFeatured && (
                        <Box
                          style={{
                            padding: '8px 12px',
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '6px',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Group gap="xs">
                            <Text size="xs" fw={600} c="green.3">
                              ⭐ Featured
                            </Text>
                          </Group>
                        </Box>
                      )}
                      
                      <Box
                        style={{
                          padding: '8px 12px',
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '6px',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Group gap="xs">
                          <IconEdit size={14} style={{ color: 'var(--mantine-color-violet-4)' }} />
                          <Text size="xs" fw={600} c="violet.3">
                            Bewerken
                          </Text>
                        </Group>
                      </Box>
                    </Group>
                  </Box>
                </Group>
              </Box>
            </motion.div>

            {/* Warning Alert for missing content */}
            {!project.detailedContent && (
              <motion.div variants={itemVariants}>
                <Alert 
                  icon={<IconAlertTriangle size="1.2rem" />} 
                  title="Ontbrekende Inhoud" 
                  color="yellow"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                  }}
                  styles={{
                    title: {
                      color: 'var(--mantine-color-yellow-4)',
                      fontWeight: 600,
                    },
                    message: {
                      color: 'var(--mantine-color-yellow-3)',
                    }
                  }}
                >
                  Dit project heeft nog geen gedetailleerde inhoud. Voeg een uitgebreide beschrijving toe om je project beter te presenteren.
                </Alert>
              </motion.div>
            )}

            {/* Project Form */}
            <motion.div variants={itemVariants}>
              <ProjectForm
                action={updateProjectAction}
                project={project}
                submitButtonLabel="Wijzigingen Opslaan"
              />
            </motion.div>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}

export default function EditProjectPage(props: EditProjectPageProps) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const getSlug = async () => {
      const params = await props.params;
      setSlug(params.slug);
    };
    getSlug();
  }, [props.params]);

  if (!slug) {
    return <EditProjectLoading />;
  }

  return (
    <AdminErrorBoundary componentName="Edit Project Page">
      <EditProjectPageClient slug={slug} />
    </AdminErrorBoundary>
  );
} 
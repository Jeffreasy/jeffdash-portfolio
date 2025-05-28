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
          width: 'clamp(150px, 25vw, 180px)',
          height: 'clamp(150px, 25vw, 180px)',
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
                  fontSize: 'clamp(1.5rem, 5vw, 3rem)',
                  fontWeight: 900,
                  marginBottom: 'clamp(8px, 2vw, 12px)',
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
                  fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
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
                    style={{
                      minHeight: '48px',
                      minWidth: '48px',
                    }}
                  >
                    <IconEdit size={24} />
                  </ThemeIcon>
                </motion.div>
                <Loader size="md" color="orange.4" type="dots" />
                <Text 
                  c="gray.4" 
                  ta="center" 
                  fw={500} 
                  size="sm"
                  style={{
                    fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                  }}
                >
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

function EditProjectPageClient({ slug }: { slug: string }) {
  const [project, setProject] = useState<FullProjectType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const projectData = await getProjectBySlug(slug);
        setProject(projectData);
        setError(null);
      } catch (err: any) {
        console.error("Error loading project:", err);
        setError(err.message || 'Kon project niet laden.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadProject();
    }
  }, [slug]);

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
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <Container size="lg">
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
                Project Niet Gevonden
              </Title>
              
              <Alert
                icon={<IconAlertTriangle size={16} />}
                title="Fout bij laden van project"
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

  if (!project) {
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
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <Container size="lg">
            <Stack gap="xl" align="center">
              <Title 
                order={1}
                ta="center"
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-gray-4), var(--mantine-color-gray-6))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 900,
                }}
              >
                Project Niet Gevonden
              </Title>
              
              <Text 
                size="lg" 
                c="gray.4" 
                ta="center"
                style={{
                  fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                  maxWidth: 'clamp(300px, 80vw, 500px)',
                }}
              >
                Het project met slug "{slug}" kon niet worden gevonden.
              </Text>
            </Stack>
          </Container>
        </Box>
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary componentName="Edit Project Page">
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
            top: '15%',
            left: '5%',
            width: 'clamp(200px, 30vw, 300px)',
            height: 'clamp(200px, 30vw, 300px)',
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
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
            bottom: '10%',
            right: '8%',
            width: 'clamp(150px, 25vw, 200px)',
            height: 'clamp(150px, 25vw, 200px)',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
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
                    top: '-20px',
                    right: '-20px',
                    width: 'clamp(80px, 20vw, 120px)',
                    height: 'clamp(80px, 20vw, 120px)',
                    background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(25px)',
                    pointerEvents: 'none',
                  }} />

                  <Group gap="lg" style={{ position: 'relative', zIndex: 1 }} wrap="wrap">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 3, 
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
                          minHeight: '48px',
                          minWidth: '48px',
                        }}
                      >
                        <IconEdit size={28} />
                      </ThemeIcon>
                    </motion.div>
                    
                    <Box style={{ flex: 1, minWidth: '250px' }}>
                      <Title 
                        order={1}
                        style={{
                          background: 'linear-gradient(135deg, var(--mantine-color-orange-4), var(--mantine-color-yellow-4))',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                          fontWeight: 900,
                          marginBottom: 'clamp(8px, 2vw, 12px)',
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
                          fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                          lineHeight: 1.6,
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                        }}
                      >
                        Bewerk de details van "{project.title}" en update je portfolio project.
                      </Text>
                    </Box>
                  </Group>
                </Box>
              </motion.div>

              {/* Project Form */}
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
                        <IconFolder size={20} />
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
                          Project Details Bewerken
                        </Title>
                        <Text 
                          size="sm" 
                          c="gray.4"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                            lineHeight: 1.4,
                          }}
                        >
                          Update de informatie en afbeeldingen van je project
                        </Text>
                      </Box>
                    </Group>
                    
                    <ProjectForm 
                      action={updateProjectAction}
                      project={project}
                      submitButtonLabel="Project Bijwerken"
                    />
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

export default function EditProjectPage(props: EditProjectPageProps) {
  const [slug, setSlug] = useState<string>('');

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
    <Suspense fallback={<EditProjectLoading />}>
      <EditProjectPageClient slug={slug} />
    </Suspense>
  );
} 
'use client';

import React, { useEffect, useState } from 'react';
import { 
  Title, 
  Text, 
  Button, 
  Alert, 
  Box, 
  Group, 
  ThemeIcon, 
  Stack, 
  Container, 
  Loader, 
  Center,
  Card,
  Badge,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import Link from 'next/link';
import { 
  IconInfoCircle, 
  IconClipboardList, 
  IconPlus, 
  IconFolder,
  IconStar,
  IconEye,
  IconCalendar,
  IconTrendingUp,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import ProjectsTable from '@/components/admin/ProjectsTable';
import { getProjectsForAdmin } from '@/lib/actions/projects';
import type { AdminProjectListItemType } from '@/lib/actions/projects';
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

const statsCardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
} as const;

const buttonVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.98 },
} as const;

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProjectListItemType[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const projectsData = await getProjectsForAdmin();
        setProjects(projectsData);
        setFetchError(null);
      } catch (error) {
        console.error("Fout bij ophalen projecten voor admin:", error);
        setFetchError((error instanceof Error) ? error.message : "Kon projecten niet laden door een serverfout.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const totalProjects = projects.length;
  const featuredProjects = projects.filter(project => project.isFeatured).length;
  const recentProjects = projects.filter(project => {
    const projectDate = new Date(project.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return projectDate > thirtyDaysAgo;
  }).length;

  if (isLoading) {
    return (
      <AdminErrorBoundary componentName="Admin Projects Page">
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
              width: 'clamp(200px, 30vw, 300px)',
              height: 'clamp(200px, 30vw, 300px)',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
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
              width: 'clamp(150px, 25vw, 200px)',
              height: 'clamp(150px, 25vw, 200px)',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              pointerEvents: 'none',
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
                      background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
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
                    Projecten Beheer
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
                    Projecten laden...
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
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
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
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                        style={{
                          minHeight: '48px',
                          minWidth: '48px',
                        }}
                      >
                        <IconFolder size={24} />
                      </ThemeIcon>
                    </motion.div>
                    <Loader size="md" color="blue.4" type="dots" />
                    <Text 
                      c="gray.4" 
                      ta="center" 
                      fw={500} 
                      size="sm"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                      }}
                    >
                      Projecten laden...
                    </Text>
                  </Stack>
                </Card>
              </Stack>
            </motion.div>
          </Container>
        </Box>
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary componentName="Admin Projects Page">
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
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
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
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%)',
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
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
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
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                        style={{
                          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          minHeight: '48px',
                          minWidth: '48px',
                        }}
                      >
                        <IconFolder size={28} />
                      </ThemeIcon>
                    </motion.div>
                    
                    <Box style={{ flex: 1, minWidth: '250px' }}>
                      <Title 
                        order={1}
                        style={{
                          background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
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
                        Projecten Beheer
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
                        Beheer je portfolio projecten, voeg nieuwe toe en bewerk bestaande projecten. 
                        Hier kun je alle details van je werk showcasen.
                      </Text>
                    </Box>
                  </Group>
                </Box>
              </motion.div>

              {/* Statistics Cards */}
              <motion.div variants={itemVariants}>
                <SimpleGrid 
                  cols={{ base: 1, sm: 2, md: 3 }} 
                  spacing="lg"
                >
                  <motion.div variants={statsCardVariants} whileHover="hover">
                    <Card
                      shadow="md"
                      padding="lg"
                      radius="md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.1) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        height: 'clamp(120px, 20vh, 140px)',
                        cursor: 'default',
                      }}
                    >
                      <Group justify="space-between" h="100%">
                        <Box>
                          <Text 
                            size="sm" 
                            c="blue.3" 
                            fw={600}
                            style={{
                              fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                            }}
                          >
                            Totaal Projecten
                          </Text>
                          <Text 
                            size="xl" 
                            fw={900} 
                            c="blue.2"
                            style={{
                              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            }}
                          >
                            {totalProjects}
                          </Text>
                        </Box>
                        <ThemeIcon
                          size="lg"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'blue.6', to: 'blue.4' }}
                          style={{
                            minHeight: '44px',
                            minWidth: '44px',
                          }}
                        >
                          <IconClipboardList size={20} />
                        </ThemeIcon>
                      </Group>
                    </Card>
                  </motion.div>

                  <motion.div variants={statsCardVariants} whileHover="hover">
                    <Card
                      shadow="md"
                      padding="lg"
                      radius="md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.05) 0%, rgba(251, 146, 60, 0.1) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(251, 146, 60, 0.2)',
                        height: 'clamp(120px, 20vh, 140px)',
                        cursor: 'default',
                      }}
                    >
                      <Group justify="space-between" h="100%">
                        <Box>
                          <Text 
                            size="sm" 
                            c="orange.3" 
                            fw={600}
                            style={{
                              fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                            }}
                          >
                            Featured
                          </Text>
                          <Text 
                            size="xl" 
                            fw={900} 
                            c="orange.2"
                            style={{
                              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            }}
                          >
                            {featuredProjects}
                          </Text>
                        </Box>
                        <ThemeIcon
                          size="lg"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'orange.6', to: 'orange.4' }}
                          style={{
                            minHeight: '44px',
                            minWidth: '44px',
                          }}
                        >
                          <IconStar size={20} />
                        </ThemeIcon>
                      </Group>
                    </Card>
                  </motion.div>

                  <motion.div variants={statsCardVariants} whileHover="hover">
                    <Card
                      shadow="md"
                      padding="lg"
                      radius="md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.1) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        height: 'clamp(120px, 20vh, 140px)',
                        cursor: 'default',
                      }}
                    >
                      <Group justify="space-between" h="100%">
                        <Box>
                          <Text 
                            size="sm" 
                            c="green.3" 
                            fw={600}
                            style={{
                              fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                            }}
                          >
                            Recent (30d)
                          </Text>
                          <Text 
                            size="xl" 
                            fw={900} 
                            c="green.2"
                            style={{
                              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            }}
                          >
                            {recentProjects}
                          </Text>
                        </Box>
                        <ThemeIcon
                          size="lg"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'green.6', to: 'green.4' }}
                          style={{
                            minHeight: '44px',
                            minWidth: '44px',
                          }}
                        >
                          <IconTrendingUp size={20} />
                        </ThemeIcon>
                      </Group>
                    </Card>
                  </motion.div>
                </SimpleGrid>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants}>
                <Group justify="space-between" align="center" wrap="wrap">
                  <Box>
                    <Title 
                      order={2} 
                      c="gray.1" 
                      size="h3"
                      style={{
                        fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                        marginBottom: 'clamp(4px, 1vw, 8px)',
                      }}
                    >
                      Alle Projecten
                    </Title>
                    <Text 
                      size="sm" 
                      c="gray.4"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                      }}
                    >
                      {totalProjects} {totalProjects === 1 ? 'project' : 'projecten'} gevonden
                    </Text>
                  </Box>
                  
                  <motion.div
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      component={Link}
                      href="/admin_area/projects/new"
                      leftSection={<IconPlus size={18} />}
                      variant="gradient"
                      gradient={{ from: 'green.6', to: 'teal.5' }}
                      size="md"
                      radius="md"
                      style={{
                        minHeight: '48px',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
                        boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      Nieuw Project
                    </Button>
                  </motion.div>
                </Group>
              </motion.div>

              {/* Error Display */}
              {fetchError && (
                <motion.div variants={itemVariants}>
                  <Alert
                    icon={<IconInfoCircle size={16} />}
                    title="Fout bij laden van projecten"
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

              {/* Projects Table */}
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
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(25px)',
                    pointerEvents: 'none',
                  }} />

                  <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
                    <Group gap="md">
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'cyan.6', to: 'blue.5' }}
                        style={{
                          minHeight: '44px',
                          minWidth: '44px',
                        }}
                      >
                        <IconEye size={20} />
                      </ThemeIcon>
                      <Box>
                        <Title 
                          order={3} 
                          c="gray.1" 
                          size="h4"
                          style={{
                            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                            marginBottom: 'clamp(2px, 0.5vw, 4px)',
                          }}
                        >
                          Projecten Overzicht
                        </Title>
                        <Text 
                          size="sm" 
                          c="gray.4"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                          }}
                        >
                          Bekijk, bewerk en beheer al je projecten
                        </Text>
                      </Box>
                    </Group>
                    
                    <Divider color="gray.7" />
                    
                    <ProjectsTable 
                      projects={projects} 
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
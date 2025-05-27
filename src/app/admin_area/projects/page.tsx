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
              width: '300px',
              height: '300px',
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
              width: '200px',
              height: '200px',
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
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      fontWeight: 900,
                      marginBottom: '0.5rem',
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
                      fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                    }}
                  >
                    Portfolio projecten laden...
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
                    minHeight: '300px',
                    width: '100%',
                    maxWidth: '500px',
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
                    width: '80px',
                    height: '80px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    pointerEvents: 'none',
                  }} />

                  <Stack align="center" gap="lg">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <ThemeIcon
                        size="xl"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      >
                        <IconFolder size={32} />
                      </ThemeIcon>
                    </motion.div>
                    <Loader size="lg" color="blue.4" type="dots" />
                    <Text c="gray.4" ta="center" fw={500}>
                      Projecten worden geladen...
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
        {/* Enhanced background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{
            x: [0, 50, 0],
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
            bottom: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Stack gap="xl" py="xl">
              {/* Enhanced Header */}
              <motion.div variants={itemVariants}>
                <Card
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
                    top: '-30px',
                    right: '-30px',
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(30px)',
                    pointerEvents: 'none',
                  }} />

                  <Group justify="space-between" align="flex-start" style={{ position: 'relative', zIndex: 1 }}>
                    <Box>
                      <Group gap="md" mb="sm">
                        <ThemeIcon
                          size="xl"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'blue.6', to: 'cyan.5' }}
                        >
                          <IconFolder size={28} />
                        </ThemeIcon>
                        <Box>
                          <Title 
                            order={1}
                            style={{
                              background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              color: 'transparent',
                              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                              fontWeight: 900,
                              marginBottom: '0.25rem',
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
                              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                              WebkitFontSmoothing: 'antialiased',
                              MozOsxFontSmoothing: 'grayscale',
                            }}
                          >
                            Beheer je portfolio projecten en voeg nieuwe toe
                          </Text>
                        </Box>
                      </Group>
                    </Box>
                    
                    {/* Action Button - Always visible */}
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button 
                        component={Link} 
                        href="/admin_area/projects/new"
                        size="lg"
                        variant="gradient"
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                        leftSection={<IconPlus size={20} />}
                        style={{
                          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          fontWeight: 600,
                        }}
                        styles={{
                          root: {
                            '&:hover': {
                              boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                              transform: 'translateY(-2px)',
                            },
                            '&:active': {
                              transform: 'translateY(0px)',
                            },
                          },
                        }}
                      >
                        Nieuw Project
                      </Button>
                    </motion.div>
                  </Group>
                </Card>
              </motion.div>

              {/* Enhanced Statistics Cards */}
              <motion.div variants={itemVariants}>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
                  <motion.div variants={statsCardVariants} whileHover="hover">
                    <Card
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        padding: 'var(--mantine-spacing-lg)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: '60px',
                        height: '60px',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(15px)',
                        pointerEvents: 'none',
                      }} />
                      
                      <Group gap="md" style={{ position: 'relative', zIndex: 1 }}>
                        <ThemeIcon
                          size="lg"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'blue.6', to: 'cyan.5' }}
                        >
                          <IconFolder size={20} />
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                          <Text size="xl" fw={900} c="blue.3">
                            {totalProjects}
                          </Text>
                          <Text size="sm" c="gray.4" fw={500}>
                            Totaal Projecten
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  </motion.div>

                  <motion.div variants={statsCardVariants} whileHover="hover">
                    <Card
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        padding: 'var(--mantine-spacing-lg)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: '60px',
                        height: '60px',
                        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(15px)',
                        pointerEvents: 'none',
                      }} />
                      
                      <Group gap="md" style={{ position: 'relative', zIndex: 1 }}>
                        <ThemeIcon
                          size="lg"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'green.6', to: 'teal.5' }}
                        >
                          <IconStar size={20} />
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                          <Text size="xl" fw={900} c="green.3">
                            {featuredProjects}
                          </Text>
                          <Text size="sm" c="gray.4" fw={500}>
                            Featured
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  </motion.div>

                  <motion.div variants={statsCardVariants} whileHover="hover">
                    <Card
                      style={{
                        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                        border: '1px solid rgba(251, 146, 60, 0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        padding: 'var(--mantine-spacing-lg)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: '60px',
                        height: '60px',
                        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(15px)',
                        pointerEvents: 'none',
                      }} />
                      
                      <Group gap="md" style={{ position: 'relative', zIndex: 1 }}>
                        <ThemeIcon
                          size="lg"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'orange.6', to: 'yellow.5' }}
                        >
                          <IconCalendar size={20} />
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                          <Text size="xl" fw={900} c="orange.3">
                            {recentProjects}
                          </Text>
                          <Text size="sm" c="gray.4" fw={500}>
                            Recent (30d)
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  </motion.div>

                  <motion.div variants={statsCardVariants} whileHover="hover">
                    <Card
                      style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        padding: 'var(--mantine-spacing-lg)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: '60px',
                        height: '60px',
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(15px)',
                        pointerEvents: 'none',
                      }} />
                      
                      <Group gap="md" style={{ position: 'relative', zIndex: 1 }}>
                        <ThemeIcon
                          size="lg"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'violet.6', to: 'purple.5' }}
                        >
                          <IconTrendingUp size={20} />
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                          <Text size="xl" fw={900} c="violet.3">
                            {Math.round((featuredProjects / Math.max(totalProjects, 1)) * 100)}%
                          </Text>
                          <Text size="sm" c="gray.4" fw={500}>
                            Featured Rate
                          </Text>
                        </Box>
                      </Group>
                    </Card>
                  </motion.div>
                </SimpleGrid>
              </motion.div>

              {/* Error Alert */}
              {fetchError && (
                <motion.div variants={itemVariants}>
                  <Alert 
                    icon={<IconInfoCircle size="1.2rem" />} 
                    title="Fout bij laden van projecten" 
                    color="red"
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                    }}
                    styles={{
                      title: {
                        color: 'var(--mantine-color-red-4)',
                        fontWeight: 600,
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
              {!fetchError && projects.length === 0 && (
                <motion.div variants={itemVariants}>
                  <Card
                    shadow="xl"
                    padding="3xl"
                    radius="xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Decorative elements */}
                    <div style={{
                      position: 'absolute',
                      top: '20%',
                      left: '20%',
                      width: '120px',
                      height: '120px',
                      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(30px)',
                      pointerEvents: 'none',
                    }} />

                    <div style={{
                      position: 'absolute',
                      bottom: '20%',
                      right: '20%',
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(25px)',
                      pointerEvents: 'none',
                    }} />

                    <Stack gap="xl" align="center" style={{ position: 'relative', zIndex: 1 }}>
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      >
                        <ThemeIcon
                          size={80}
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'blue.6', to: 'cyan.5' }}
                        >
                          <IconFolder size={48} />
                        </ThemeIcon>
                      </motion.div>
                      
                      <Box>
                        <Text 
                          size="xl" 
                          fw={700} 
                          c="gray.2" 
                          mb="sm"
                          style={{
                            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                          }}
                        >
                          Nog geen projecten gevonden
                        </Text>
                        <Text 
                          size="md" 
                          c="gray.4"
                          style={{
                            lineHeight: 1.6,
                            maxWidth: '400px',
                            margin: '0 auto',
                          }}
                        >
                          Begin met het toevoegen van je eerste project om je portfolio te bouwen en te beheren.
                        </Text>
                      </Box>
                      
                      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button 
                          component={Link} 
                          href="/admin_area/projects/new"
                          size="lg"
                          variant="gradient"
                          gradient={{ from: 'blue.6', to: 'cyan.5' }}
                          leftSection={<IconPlus size={20} />}
                          style={{
                            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            fontWeight: 600,
                          }}
                        >
                          Eerste Project Toevoegen
                        </Button>
                      </motion.div>
                    </Stack>
                  </Card>
                </motion.div>
              )}

              {/* Projects Table */}
              {!fetchError && projects.length > 0 && (
                <motion.div variants={itemVariants}>
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: 'var(--mantine-spacing-lg)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Table decorative elements */}
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      right: '-30px',
                      width: '120px',
                      height: '120px',
                      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(25px)',
                      pointerEvents: 'none',
                    }} />

                    <div style={{
                      position: 'absolute',
                      bottom: '-20px',
                      left: '-20px',
                      width: '80px',
                      height: '80px',
                      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(20px)',
                      pointerEvents: 'none',
                    }} />

                    <Box style={{ position: 'relative', zIndex: 1 }}>
                      <Group justify="space-between" mb="lg">
                        <Box>
                          <Text 
                            size="lg" 
                            fw={700} 
                            c="gray.1"
                            style={{
                              WebkitFontSmoothing: 'antialiased',
                              MozOsxFontSmoothing: 'grayscale',
                            }}
                          >
                            Alle Projecten
                          </Text>
                          <Text size="sm" c="gray.4">
                            Beheer en bewerk je portfolio projecten
                          </Text>
                        </Box>
                        
                        <Badge
                          variant="light"
                          color="blue"
                          size="lg"
                          style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            color: 'var(--mantine-color-blue-4)',
                            fontWeight: 600,
                          }}
                        >
                          {totalProjects} projecten
                        </Badge>
                      </Group>
                      
                      <Divider 
                        mb="lg" 
                        style={{ 
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        }} 
                      />
                      
                      <ProjectsTable projects={projects} />
                    </Box>
                  </Card>
                </motion.div>
              )}
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </AdminErrorBoundary>
  );
} 
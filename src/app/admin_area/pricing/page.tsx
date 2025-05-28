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
  SimpleGrid,
  Card,
  Badge,
} from '@mantine/core';
import { 
  IconCurrencyEuro, 
  IconPlus, 
  IconChartBar, 
  IconSettings,
  IconAlertCircle,
  IconPalette,
  IconServer,
  IconCode,
  IconStar,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { usePricingPlans } from '@/hooks/usePricingPlans';
import PricingPlansManager from '@/components/admin/PricingPlansManager';
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

export default function PricingPlansPage() {
  const { plans, isLoading, error } = usePricingPlans({ includeInactive: true });

  // Calculate statistics - handle both regular and admin plan types
  const totalPlans = plans.length;
  const activePlans = plans.filter((plan: any) => plan.is_active !== false).length; // Assume active if not specified
  const popularPlans = plans.filter(plan => plan.is_popular).length;
  const categoryStats = plans.reduce((acc, plan) => {
    acc[plan.category_name] = (acc[plan.category_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const iconMap = {
    'IconPalette': IconPalette,
    'IconServer': IconServer,
    'IconCode': IconCode,
    'IconSettings': IconSettings,
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || IconSettings;
  };

  if (isLoading) {
    return (
      <AdminErrorBoundary componentName="Pricing Plans Admin Page">
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
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
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
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
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
                      background: 'linear-gradient(135deg, var(--mantine-color-orange-4), var(--mantine-color-red-4))',
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
                    Pricing Plans Beheer
                  </Title>
                </Box>
                
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
                      <Loader size="lg" color="orange.4" type="dots" />
                      <Text 
                        c="gray.4" 
                        ta="center"
                        style={{
                          fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                        }}
                      >
                        Pricing plans laden...
                      </Text>
                    </Stack>
                  </Center>
                </Box>
              </Stack>
            </motion.div>
          </Container>
        </Box>
      </AdminErrorBoundary>
    );
  }

  if (error) {
    return (
      <AdminErrorBoundary componentName="Pricing Plans Admin Page">
        <Box
          style={{
            position: 'relative',
            minHeight: '100%',
            width: '100%',
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <Container size="xl">
            <Stack gap="xl" align="center">
              <Title 
                order={1}
                ta="center"
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-orange-4), var(--mantine-color-red-4))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 900,
                }}
              >
                Pricing Plans Beheer
              </Title>
              
              <Alert 
                icon={<IconAlertCircle size={16} />} 
                title="Fout bij laden" 
                color="red"
                style={{ maxWidth: '600px' }}
              >
                {error}
              </Alert>
            </Stack>
          </Container>
        </Box>
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary componentName="Pricing Plans Admin Page">
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
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 'clamp(150px, 25vw, 200px)',
          height: 'clamp(150px, 25vw, 200px)',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
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
              {/* Header with Stats */}
              <motion.div variants={itemVariants}>
                <Group justify="space-between" align="flex-start" wrap="wrap">
                  <Box style={{ flex: 1, minWidth: '250px' }}>
                    <Title 
                      order={1}
                      style={{
                        background: 'linear-gradient(135deg, var(--mantine-color-orange-4), var(--mantine-color-red-4))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        fontWeight: 900,
                        marginBottom: 'clamp(8px, 2vw, 12px)',
                      }}
                    >
                      Pricing Plans Beheer
                    </Title>
                    <Text 
                      size="lg" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                      }}
                    >
                      Beheer je pricing plans en bekijk analytics
                    </Text>
                  </Box>
                  
                  <Group gap="md" align="center">
                    <Button
                      leftSection={<IconPlus size={16} />}
                      variant="gradient"
                      gradient={{ from: 'orange.6', to: 'red.5' }}
                      style={{
                        minHeight: '44px',
                        fontSize: 'clamp(0.875rem, 2.2vw, 1rem)',
                      }}
                      onClick={() => {
                        // This will be handled by PricingPlansManager
                        const event = new CustomEvent('createPricingPlan');
                        window.dispatchEvent(event);
                      }}
                    >
                      Nieuw Plan
                    </Button>
                    
                    <ThemeIcon
                      size="xl"
                      radius="md"
                      variant="gradient"
                      gradient={{ from: 'orange.6', to: 'red.5' }}
                      visibleFrom="sm"
                    >
                      <IconCurrencyEuro size={24} />
                    </ThemeIcon>
                  </Group>
                </Group>
              </motion.div>

              {/* Stats Cards */}
              <motion.div variants={itemVariants}>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                  <motion.div variants={statsCardVariants}>
                    <Card
                      padding="lg"
                      radius="md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Group justify="space-between">
                        <div>
                          <Text c="dimmed" size="sm" fw={500}>
                            Totaal Plans
                          </Text>
                          <Text fw={700} size="xl" c="orange.4">
                            {totalPlans}
                          </Text>
                        </div>
                        <ThemeIcon color="orange" variant="light" size="lg">
                          <IconSettings size={20} />
                        </ThemeIcon>
                      </Group>
                    </Card>
                  </motion.div>

                  <motion.div variants={statsCardVariants}>
                    <Card
                      padding="lg"
                      radius="md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Group justify="space-between">
                        <div>
                          <Text c="dimmed" size="sm" fw={500}>
                            Actieve Plans
                          </Text>
                          <Text fw={700} size="xl" c="green.4">
                            {activePlans}
                          </Text>
                        </div>
                        <ThemeIcon color="green" variant="light" size="lg">
                          <IconChartBar size={20} />
                        </ThemeIcon>
                      </Group>
                    </Card>
                  </motion.div>

                  <motion.div variants={statsCardVariants}>
                    <Card
                      padding="lg"
                      radius="md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Group justify="space-between">
                        <div>
                          <Text c="dimmed" size="sm" fw={500}>
                            Populaire Plans
                          </Text>
                          <Text fw={700} size="xl" c="blue.4">
                            {popularPlans}
                          </Text>
                        </div>
                        <ThemeIcon color="blue" variant="light" size="lg">
                          <IconStar size={20} />
                        </ThemeIcon>
                      </Group>
                    </Card>
                  </motion.div>

                  <motion.div variants={statsCardVariants}>
                    <Card
                      padding="lg"
                      radius="md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Group justify="space-between">
                        <div>
                          <Text c="dimmed" size="sm" fw={500}>
                            Categorieën
                          </Text>
                          <Text fw={700} size="xl" c="violet.4">
                            {Object.keys(categoryStats).length}
                          </Text>
                        </div>
                        <ThemeIcon color="violet" variant="light" size="lg">
                          <IconPalette size={20} />
                        </ThemeIcon>
                      </Group>
                    </Card>
                  </motion.div>
                </SimpleGrid>
              </motion.div>

              {/* Main Content */}
              <motion.div variants={itemVariants}>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'clamp(8px, 2vw, 12px)',
                    overflow: 'hidden',
                  }}
                >
                  <PricingPlansManager />
                </Box>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </AdminErrorBoundary>
  );
} 
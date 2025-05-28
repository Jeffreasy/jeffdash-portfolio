'use client';

import React from 'react';
import { Title, Text, Card, SimpleGrid, Button, Stack, Box, Group, Badge, ThemeIcon, Container } from '@mantine/core';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IconClipboardList,
  IconFileText,
  IconMessages,
  IconMail,
  IconArrowRight,
  IconChartBar
} from '@tabler/icons-react';

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

const cardVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.98 },
} as const;

interface DashboardData {
  projectsCount: number;
  postsCount: number;
  contactsCount: number;
  unreadContactsCount: number;
  errors: string[];
  authInfo: string;
  debugInfo: any;
}

interface AdminDashboardClientProps {
  data: DashboardData;
}

export default function AdminDashboardClient({ data }: AdminDashboardClientProps) {
  const { projectsCount, postsCount, contactsCount, unreadContactsCount, errors, authInfo, debugInfo } = data;

  const dashboardCards = [
    {
      title: 'Projecten',
      count: projectsCount,
      href: '/admin_area/projects',
      icon: IconClipboardList,
      color: 'blue',
      gradient: { from: 'blue.6', to: 'cyan.5' },
      description: 'Beheer portfolio projecten',
    },
    {
      title: 'Blog Posts',
      count: postsCount,
      href: '/admin_area/posts',
      icon: IconFileText,
      color: 'violet',
      gradient: { from: 'violet.6', to: 'purple.5' },
      description: 'Schrijf en bewerk artikelen',
    },
    {
      title: 'Contact Berichten',
      count: contactsCount,
      href: '/admin_area/contacts',
      icon: IconMessages,
      color: 'green',
      gradient: { from: 'green.6', to: 'teal.5' },
      description: 'Bekijk inzendingen',
      badge: unreadContactsCount > 0 ? unreadContactsCount : undefined,
    },
    {
      title: 'Email Test',
      count: null,
      href: '/admin_area/email-test',
      icon: IconMail,
      color: 'orange',
      gradient: { from: 'orange.6', to: 'red.5' },
      description: 'Test Mailgun integratie',
    },
  ];

  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100%',
        width: '100%',
        padding: 'clamp(12px, 3vw, 24px)', // Responsive padding
      }}
    >
      {/* Subtle background elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: 'clamp(150px, 20vw, 200px)', // Responsive background element
        height: 'clamp(150px, 20vw, 200px)',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
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
          padding: 'clamp(16px, 4vw, 32px)', // Responsive container padding
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
              <Group justify="space-between" align="flex-start">
                <Box style={{ width: '100%' }}>
                  <Title 
                    order={1}
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                      fontWeight: 900,
                      marginBottom: 'clamp(8px, 2vw, 16px)',
                      lineHeight: 1.2,
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                    }}
                  >
                    Dashboard
                  </Title>
                  <Text 
                    size="lg" 
                    c="gray.3"
                    style={{
                      fontSize: 'clamp(0.9rem, 3vw, 1.125rem)',
                      lineHeight: 1.5,
                      maxWidth: '100%',
                    }}
                  >
                    Welkom bij het admin dashboard. Beheer je content en bekijk statistieken.
                  </Text>
                </Box>
                
                <ThemeIcon
                  size="xl"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: 'blue.6', to: 'cyan.5' }}
                  visibleFrom="sm"
                >
                  <IconChartBar size={24} />
                </ThemeIcon>
              </Group>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants}>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                {dashboardCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Card
                      component={Link}
                      href={card.href}
                      p="lg"
                      radius="lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100%',
                        minHeight: 'clamp(140px, 20vw, 180px)',
                        padding: 'clamp(16px, 4vw, 24px)',
                        borderRadius: 'clamp(12px, 3vw, 16px)',
                      }}
                      styles={{
                        root: {
                          '&:hover': {
                            borderColor: `rgba(${card.color === 'blue' ? '59, 130, 246' : card.color === 'violet' ? '139, 92, 246' : card.color === 'green' ? '34, 197, 94' : '249, 115, 22'}, 0.4)`,
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.08) 100%)',
                            boxShadow: `0 12px 32px rgba(${card.color === 'blue' ? '59, 130, 246' : card.color === 'violet' ? '139, 92, 246' : card.color === 'green' ? '34, 197, 94' : '249, 115, 22'}, 0.2)`,
                          },
                        }
                      }}
                    >
                      {/* Decorative element */}
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: 'clamp(60px, 10vw, 80px)',
                        height: 'clamp(60px, 10vw, 80px)',
                        background: `radial-gradient(circle, rgba(${card.color === 'blue' ? '59, 130, 246' : card.color === 'violet' ? '139, 92, 246' : card.color === 'green' ? '34, 197, 94' : '249, 115, 22'}, 0.1) 0%, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(15px)',
                        pointerEvents: 'none',
                      }} />

                      <Stack 
                        gap="md" 
                        style={{ 
                          position: 'relative', 
                          zIndex: 1,
                          height: '100%',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Group justify="space-between" align="flex-start">
                          <ThemeIcon
                            size="lg"
                            radius="md"
                            variant="gradient"
                            gradient={card.gradient}
                            style={{
                              minWidth: 'clamp(40px, 8vw, 48px)',
                              minHeight: 'clamp(40px, 8vw, 48px)',
                            }}
                          >
                            <card.icon size={20} />
                          </ThemeIcon>
                          
                          {card.badge && (
                            <Badge
                              variant="gradient"
                              gradient={{ from: 'red.6', to: 'orange.5' }}
                              size="sm"
                              style={{
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
                              }}
                            >
                              {card.badge}
                            </Badge>
                          )}
                        </Group>

                        <Box style={{ flex: 1 }}>
                          <Title 
                            order={4} 
                            c="gray.1" 
                            mb={4}
                            style={{
                              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                              lineHeight: 1.3,
                              WebkitFontSmoothing: 'antialiased',
                              MozOsxFontSmoothing: 'grayscale',
                            }}
                          >
                            {card.title}
                          </Title>
                          <Text 
                            size="sm" 
                            c="gray.4" 
                            mb="xs"
                            style={{
                              fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                              lineHeight: 1.4,
                            }}
                          >
                            {card.description}
                          </Text>
                          {card.count !== null && (
                            <Text 
                              size="xl" 
                              fw={700}
                              style={{
                                background: `linear-gradient(135deg, var(--mantine-color-${card.color}-4), var(--mantine-color-${card.color}-6))`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                lineHeight: 1.2,
                              }}
                            >
                              {card.count}
                            </Text>
                          )}
                        </Box>

                        <Group justify="space-between" align="center">
                          <Button
                            variant="subtle"
                            size="xs"
                            rightSection={<IconArrowRight size={14} />}
                            color={card.color}
                            style={{
                              minHeight: '32px',
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
                              borderRadius: 'clamp(6px, 1.5vw, 8px)',
                            }}
                          >
                            Beheren
                          </Button>
                        </Group>
                      </Stack>
                    </Card>
                  </motion.div>
                ))}
              </SimpleGrid>
            </motion.div>

            {/* Debug Info - Only show if there are errors or in development */}
            {(errors.length > 0 || process.env.NODE_ENV === 'development') && (
              <motion.div variants={itemVariants}>
                <Card
                  p="lg"
                  radius="lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    backdropFilter: 'blur(10px)',
                    padding: 'clamp(16px, 4vw, 24px)',
                    borderRadius: 'clamp(12px, 3vw, 16px)',
                  }}
                >
                  <Stack gap="md">
                    <Group>
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      >
                        <IconChartBar size={16} />
                      </ThemeIcon>
                      <Title 
                        order={4} 
                        c="blue.3"
                        style={{
                          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                        }}
                      >
                        Debug Informatie
                      </Title>
                    </Group>
                    
                    <Text 
                      size="sm" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      <strong>Auth Status:</strong> {authInfo}
                    </Text>
                    
                    {debugInfo.projects && (
                      <Text 
                        size="sm" 
                        c="gray.3"
                        style={{
                          fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        <strong>Direct Projects Query:</strong> {debugInfo.projects.error ? 
                          `Error: ${debugInfo.projects.error.message}` : 
                          `Found ${debugInfo.projects.data?.length || 0} projects`}
                      </Text>
                    )}
                    
                    {debugInfo.posts && (
                      <Text 
                        size="sm" 
                        c="gray.3"
                        style={{
                          fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        <strong>Direct Posts Query:</strong> {debugInfo.posts.error ? 
                          `Error: ${debugInfo.posts.error.message}` : 
                          `Found ${debugInfo.posts.data?.length || 0} posts`}
                      </Text>
                    )}
                    
                    {debugInfo.contacts && (
                      <Text 
                        size="sm" 
                        c="gray.3"
                        style={{
                          fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        <strong>Direct Contacts Query:</strong> {debugInfo.contacts.error ? 
                          `Error: ${debugInfo.contacts.error.message}` : 
                          `Found ${debugInfo.contacts.data?.length || 0} contacts`}
                      </Text>
                    )}
                    
                    {errors.length > 0 && (
                      <Box>
                        <Text 
                          size="sm" 
                          fw={600} 
                          c="red.4" 
                          mb="xs"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                          }}
                        >
                          Errors detected:
                        </Text>
                        {errors.map((error, index) => (
                          <Text 
                            key={index} 
                            c="red.4" 
                            size="sm"
                            style={{
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              lineHeight: 1.5,
                              wordBreak: 'break-word',
                            }}
                          >
                            • {error}
                          </Text>
                        ))}
                      </Box>
                    )}
                  </Stack>
                </Card>
              </motion.div>
            )}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
} 
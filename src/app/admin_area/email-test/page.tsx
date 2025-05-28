'use client';

import React, { Suspense } from 'react';
import { Container, Title, Text, Stack, Box, Group, ThemeIcon, Card, Loader, Center } from '@mantine/core';
import { IconMail, IconSettings, IconInfoCircle } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

// Dynamically import MailgunTest to avoid SSR issues
const MailgunTest = dynamic(() => import('@/components/admin/MailgunTest'), {
  loading: () => (
    <Center p="xl">
      <Stack align="center" gap="md">
        <Loader size="lg" color="blue.4" type="dots" />
        <Text 
          size="sm" 
          c="gray.4"
          style={{
            fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
          }}
        >
          Email test component laden...
        </Text>
      </Stack>
    </Center>
  ),
  ssr: false
});

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

export default function EmailTestPage() {
  return (
    <AdminErrorBoundary componentName="Email Test Page">
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
          right: '5%',
          width: 'clamp(200px, 30vw, 250px)',
          height: 'clamp(200px, 30vw, 250px)',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

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
            <Stack gap="xl">
              {/* Header */}
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
                      Email Test Center
                    </Title>
                    <Text 
                      size="lg" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                        maxWidth: 'clamp(400px, 80vw, 600px)',
                        lineHeight: 1.6,
                      }}
                    >
                      Test de Mailgun email integratie om te controleren of alle email functionaliteit correct werkt. 
                      Hier kun je zowel de basis test email als de volledige contact form flow testen.
                    </Text>
                  </Box>
                  
                  <ThemeIcon
                    size="xl"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: 'orange.6', to: 'red.5' }}
                    visibleFrom="sm"
                    style={{
                      minHeight: '48px',
                      minWidth: '48px',
                    }}
                  >
                    <IconMail size={24} />
                  </ThemeIcon>
                </Group>
              </motion.div>

              {/* Mailgun Test Component */}
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
                    top: '-20px',
                    right: '-20px',
                    width: 'clamp(60px, 15vw, 100px)',
                    height: 'clamp(60px, 15vw, 100px)',
                    background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    pointerEvents: 'none',
                  }} />

                  <Suspense fallback={
                    <Center p="xl">
                      <Stack align="center" gap="md">
                        <Loader size="lg" color="orange.4" type="dots" />
                        <Text 
                          size="sm" 
                          c="gray.4"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                          }}
                        >
                          Email test component laden...
                        </Text>
                      </Stack>
                    </Center>
                  }>
                    <MailgunTest />
                  </Suspense>
                </Box>
              </motion.div>

              {/* Email Configuration Info */}
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
                    top: '-20px',
                    left: '-20px',
                    width: 'clamp(60px, 15vw, 80px)',
                    height: 'clamp(60px, 15vw, 80px)',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(15px)',
                    pointerEvents: 'none',
                  }} />

                  <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
                    <Group gap="md" wrap="wrap">
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                        style={{
                          minHeight: '44px',
                          minWidth: '44px',
                        }}
                      >
                        <IconSettings size={20} />
                      </ThemeIcon>
                      <Box style={{ flex: 1, minWidth: '200px' }}>
                        <Title 
                          order={3} 
                          c="gray.1" 
                          size="h3"
                          style={{
                            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                            marginBottom: 'clamp(4px, 1vw, 8px)',
                          }}
                        >
                          Email Configuratie Info
                        </Title>
                        <Text 
                          size="sm" 
                          c="gray.4"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                            lineHeight: 1.4,
                          }}
                        >
                          Informatie over de huidige email configuratie en status
                        </Text>
                      </Box>
                    </Group>

                    <Card
                      padding="md"
                      radius="md"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.1)',
                        backdropFilter: 'blur(5px)',
                      }}
                    >
                      <Stack gap="sm">
                        <Group gap="xs">
                          <IconInfoCircle size={16} color="var(--mantine-color-blue-4)" />
                          <Text 
                            size="sm" 
                            fw={600} 
                            c="blue.3"
                            style={{
                              fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                            }}
                          >
                            Mailgun Configuratie
                          </Text>
                        </Group>
                        <Text 
                          size="sm" 
                          c="gray.4"
                          style={{
                            fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                            lineHeight: 1.5,
                          }}
                        >
                          • Domain: Geconfigureerd via environment variabelen{'\n'}
                          • API Key: Beveiligd opgeslagen in server environment{'\n'}
                          • Test Mode: Beschikbaar voor veilig testen{'\n'}
                          • Contact Form: Geïntegreerd met Mailgun API
                        </Text>
                      </Stack>
                    </Card>
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
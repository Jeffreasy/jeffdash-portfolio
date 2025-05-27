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
        <Text size="sm" c="gray.4">Email test component laden...</Text>
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
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
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
                        background: 'linear-gradient(135deg, var(--mantine-color-orange-4), var(--mantine-color-red-4))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                        fontWeight: 900,
                        marginBottom: '0.5rem',
                      }}
                    >
                      Email Test Center
                    </Title>
                    <Text 
                      size="lg" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        maxWidth: '600px',
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
                    borderRadius: '12px',
                    padding: 'var(--mantine-spacing-xl)',
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
                    background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    pointerEvents: 'none',
                  }} />

                  <Suspense fallback={
                    <Center p="xl">
                      <Stack align="center" gap="md">
                        <Loader size="lg" color="orange.4" type="dots" />
                        <Text size="sm" c="gray.4">Email test component laden...</Text>
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
                    borderRadius: '12px',
                    padding: 'var(--mantine-spacing-xl)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '-20px',
                    width: '80px',
                    height: '80px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(15px)',
                    pointerEvents: 'none',
                  }} />

                  <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
                    <Group gap="md">
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      >
                        <IconSettings size={20} />
                      </ThemeIcon>
                      <Box>
                        <Title order={3} c="gray.1" size="h3">
                          Email Configuratie Info
                        </Title>
                        <Text size="sm" c="gray.4">
                          Overzicht van de huidige email instellingen
                        </Text>
                      </Box>
                    </Group>

                    <Stack gap="md">
                      {/* Domain Info */}
                      <Box
                        style={{
                          padding: '16px',
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
                          border: '1px solid rgba(59, 130, 246, 0.1)',
                          borderRadius: '8px',
                        }}
                      >
                        <Text size="sm" fw={600} c="blue.3" mb="xs">
                          Mailgun Domain
                        </Text>
                        <Text size="sm" c="gray.3">
                          jeffdash.com (Custom Domain)
                        </Text>
                      </Box>

                      {/* Test Email */}
                      <Box
                        style={{
                          padding: '16px',
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
                          border: '1px solid rgba(34, 197, 94, 0.1)',
                          borderRadius: '8px',
                        }}
                      >
                        <Text size="sm" fw={600} c="green.3" mb="xs">
                          Test Email Route
                        </Text>
                        <Text size="sm" c="gray.3">
                          postmaster@jeffdash.com → jeffrey@jeffdash.com
                        </Text>
                      </Box>

                      {/* Contact Form Flow */}
                      <Box
                        style={{
                          padding: '16px',
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
                          border: '1px solid rgba(139, 92, 246, 0.1)',
                          borderRadius: '8px',
                        }}
                      >
                        <Text size="sm" fw={600} c="violet.3" mb="md">
                          Contact Form Email Flow
                        </Text>
                        <Stack gap="xs">
                          <Text size="sm" c="gray.3">
                            • <strong>User confirmation:</strong> no-reply@jeffdash.com → klant
                          </Text>
                          <Text size="sm" c="gray.3">
                            • <strong>Plan inquiry:</strong> sales@jeffdash.com → jeffrey@jeffdash.com
                          </Text>
                          <Text size="sm" c="gray.3">
                            • <strong>General contact:</strong> contact@jeffdash.com → jeffrey@jeffdash.com
                          </Text>
                        </Stack>
                      </Box>

                      {/* Environment Variables Note */}
                      <Box
                        style={{
                          padding: '16px',
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.05) 100%)',
                          border: '1px solid rgba(249, 115, 22, 0.1)',
                          borderRadius: '8px',
                        }}
                      >
                        <Group gap="xs" mb="xs">
                          <IconInfoCircle size={16} style={{ color: 'var(--mantine-color-orange-4)' }} />
                          <Text size="sm" fw={600} c="orange.3">
                            Environment Variables
                          </Text>
                        </Group>
                        <Text size="sm" c="gray.3">
                          Zorg ervoor dat je de juiste environment variables hebt ingesteld in je .env.local bestand:
                          MAILGUN_API_KEY, MAILGUN_DOMAIN, en MAILGUN_FROM_EMAIL.
                        </Text>
                      </Box>
                    </Stack>
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
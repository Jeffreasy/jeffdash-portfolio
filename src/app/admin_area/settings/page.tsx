'use client';

import React from 'react';
import { Container, Title, Text, Stack, Alert, Button, Group, Card, Box, ThemeIcon } from '@mantine/core';
import { IconInfoCircle, IconDatabase, IconUser, IconSettings, IconTestPipe } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

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
};

export default function AdminSettingsPage() {
  const handleTestConnection = async () => {
    try {
      // Test the site-status endpoint (public)
      const statusResponse = await fetch('/api/site-status');
      console.log('Site status response:', statusResponse.status, await statusResponse.text());
      
      // Test the admin endpoint
      const adminResponse = await fetch('/api/admin/site-settings');
      console.log('Admin settings response:', adminResponse.status, await adminResponse.text());
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  return (
    <AdminErrorBoundary componentName="Settings Admin Page">
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
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(35px)',
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
                      Site Instellingen
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
                      Beheer site-brede instellingen en configuratie opties.
                    </Text>
                  </Box>
                  
                  <ThemeIcon
                    size="xl"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: 'blue.6', to: 'cyan.5' }}
                    visibleFrom="sm"
                    style={{
                      minWidth: 'clamp(48px, 10vw, 64px)',
                      minHeight: 'clamp(48px, 10vw, 64px)',
                    }}
                  >
                    <IconSettings size={28} />
                  </ThemeIcon>
                </Group>
              </motion.div>

              {/* Diagnostic Section */}
              <motion.div variants={itemVariants}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(6, 182, 212, 0.02) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '60px',
                    height: '60px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(15px)',
                    pointerEvents: 'none',
                  }} />

                  <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
                    <Group>
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      >
                        <IconInfoCircle size={20} />
                      </ThemeIcon>
                      <Text 
                        fw={600} 
                        style={{
                          color: 'var(--mantine-color-blue-3)',
                          fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                        }}
                      >
                        Troubleshooting Tips
                      </Text>
                    </Group>
                    
                    <Text 
                      size="sm" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                        lineHeight: 1.5,
                      }}
                    >
                      Als je problemen hebt met het laden van instellingen, controleer dan:
                    </Text>
                    
                    <Stack gap="xs">
                      <Group gap="xs" align="flex-start">
                        <ThemeIcon size="sm" variant="light" color="blue" radius="sm">
                          <IconDatabase size={14} />
                        </ThemeIcon>
                        <Text 
                          size="sm" 
                          c="gray.4"
                          style={{
                            fontSize: 'clamp(0.75rem, 2.2vw, 0.8rem)',
                            lineHeight: 1.4,
                            flex: 1,
                          }}
                        >
                          Database migratie is uitgevoerd (V1_4_SiteSettings.sql en RLSV1.5_SiteSettings.sql)
                        </Text>
                      </Group>
                      
                      <Group gap="xs" align="flex-start">
                        <ThemeIcon size="sm" variant="light" color="cyan" radius="sm">
                          <IconUser size={14} />
                        </ThemeIcon>
                        <Text 
                          size="sm" 
                          c="gray.4"
                          style={{
                            fontSize: 'clamp(0.75rem, 2.2vw, 0.8rem)',
                            lineHeight: 1.4,
                            flex: 1,
                          }}
                        >
                          Je gebruiker heeft de rol 'ADMIN' in de User tabel
                        </Text>
                      </Group>
                      
                      <Group gap="xs" align="flex-start">
                        <ThemeIcon size="sm" variant="light" color="violet" radius="sm">
                          <IconSettings size={14} />
                        </ThemeIcon>
                        <Text 
                          size="sm" 
                          c="gray.4"
                          style={{
                            fontSize: 'clamp(0.75rem, 2.2vw, 0.8rem)',
                            lineHeight: 1.4,
                            flex: 1,
                          }}
                        >
                          Supabase environment variables zijn correct ingesteld
                        </Text>
                      </Group>
                    </Stack>
                    
                    <Button 
                      variant="light" 
                      size="sm" 
                      onClick={handleTestConnection}
                      leftSection={<IconTestPipe size={16} />}
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: 'var(--mantine-color-blue-3)',
                        fontSize: 'clamp(0.75rem, 2.2vw, 0.875rem)',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                      }}
                    >
                      Test Verbinding (Check Console)
                    </Button>
                  </Stack>
                </Card>
              </motion.div>

              {/* Settings Manager */}
              <motion.div variants={itemVariants}>
                <SiteSettingsManager />
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </AdminErrorBoundary>
  );
} 
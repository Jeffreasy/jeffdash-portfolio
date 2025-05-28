'use client';

import React, { useState } from 'react';
import { Button, Paper, Title, Text, Alert, Stack, Group, Box, ThemeIcon } from '@mantine/core';
import { IconMail, IconCheck, IconAlertCircle, IconTestPipe } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import AdminErrorBoundary from './AdminErrorBoundary';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
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

const MailgunTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const sendTestEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send test email'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendContactTestEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          name: 'Test Gebruiker',
          email: 'jeffrey@jeffdash.com',
          message: 'Dit is een test bericht vanuit de admin area om de email functionaliteit te testen.',
          selectedPlan: 'Full-Stack Development'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send contact test email'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminErrorBoundary componentName="Mailgun Test">
      <Box
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
          padding: 'clamp(12px, 3vw, 24px)',
        }}
      >
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 'clamp(100px, 20vw, 150px)',
          height: 'clamp(100px, 20vw, 150px)',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 'clamp(80px, 15vw, 120px)',
          height: 'clamp(80px, 15vw, 120px)',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(25px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <Paper 
          p="xl" 
          radius="lg" 
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            padding: 'clamp(16px, 4vw, 24px)',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {/* Inner decorative element */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: 'clamp(60px, 12vw, 80px)',
            height: 'clamp(60px, 12vw, 80px)',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Stack gap="lg">
              <motion.div variants={itemVariants}>
                <Group gap="md" mb="lg" wrap="nowrap">
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: 'blue.6', to: 'cyan.5' }}
                    style={{
                      width: 'clamp(48px, 8vw, 64px)',
                      height: 'clamp(48px, 8vw, 64px)',
                      flexShrink: 0,
                    }}
                  >
                    <IconTestPipe size={20} />
                  </ThemeIcon>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Title 
                      order={3} 
                      mb="xs" 
                      style={{
                        background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        wordBreak: 'break-word',
                        marginBottom: 'clamp(4px, 1vw, 8px)',
                      }}
                    >
                      Mailgun Email Test
                    </Title>
                    <Text 
                      c="gray.4"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
                        lineHeight: 1.4,
                      }}
                    >
                      Test de Mailgun email functionaliteit om te controleren of alles correct werkt.
                    </Text>
                  </Box>
                </Group>
              </motion.div>

              {result && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert
                    icon={result.success ? <IconCheck size="1rem" /> : <IconAlertCircle size="1rem" />}
                    title={result.success ? "Succes!" : "Fout!"}
                    color={result.success ? "green" : "red"}
                    variant="light"
                    style={{
                      background: result.success 
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                      border: `1px solid rgba(${result.success ? '34, 197, 94' : '239, 68, 68'}, 0.2)`,
                      borderRadius: 'clamp(6px, 1.5vw, 8px)',
                      padding: 'clamp(12px, 3vw, 16px)',
                    }}
                    styles={{
                      title: {
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        fontWeight: 600,
                      },
                      message: {
                        fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
                        lineHeight: 1.4,
                      }
                    }}
                  >
                    {result.message}
                  </Alert>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Group gap="md" style={{ flexWrap: 'wrap' }}>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    style={{ flex: '1 1 auto', minWidth: 'clamp(200px, 40vw, 250px)' }}
                  >
                    <Button
                      onClick={sendTestEmail}
                      loading={isLoading}
                      variant="gradient"
                      gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      leftSection={<IconMail size={16} />}
                      fullWidth
                      style={{
                        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        minHeight: '48px',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        borderRadius: 'clamp(6px, 1.5vw, 8px)',
                        padding: 'clamp(12px, 3vw, 16px)',
                        fontWeight: 600,
                      }}
                      styles={{
                        root: {
                          '&:hover': {
                            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                          '&:active': {
                            transform: 'translateY(0px)',
                          },
                        },
                      }}
                    >
                      Verstuur Test Email
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    style={{ flex: '1 1 auto', minWidth: 'clamp(200px, 40vw, 250px)' }}
                  >
                    <Button
                      onClick={sendContactTestEmail}
                      loading={isLoading}
                      variant="outline"
                      color="cyan"
                      leftSection={<IconMail size={16} />}
                      fullWidth
                      style={{
                        borderColor: 'rgba(6, 182, 212, 0.3)',
                        color: 'var(--mantine-color-cyan-4)',
                        minHeight: '48px',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        borderRadius: 'clamp(6px, 1.5vw, 8px)',
                        padding: 'clamp(12px, 3vw, 16px)',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)',
                      }}
                      styles={{
                        root: {
                          '&:hover': {
                            borderColor: 'rgba(6, 182, 212, 0.5)',
                            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
                            transform: 'translateY(-2px)',
                          },
                          '&:active': {
                            transform: 'translateY(0px)',
                          },
                        },
                      }}
                    >
                      Test Contact Email
                    </Button>
                  </motion.div>
                </Group>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'clamp(6px, 1.5vw, 8px)',
                    padding: 'clamp(12px, 3vw, 16px)',
                  }}
                >
                  <Text 
                    size="sm" 
                    c="gray.5"
                    style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                      lineHeight: 1.5,
                      marginBottom: 'clamp(6px, 1.5vw, 8px)',
                    }}
                  >
                    <strong style={{ color: 'var(--mantine-color-gray-3)' }}>Test Email:</strong> Verstuurt de standaard Mailgun test email naar jeffrey@jeffdash.com
                  </Text>
                  <Text 
                    size="sm" 
                    c="gray.5"
                    style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong style={{ color: 'var(--mantine-color-gray-3)' }}>Contact Email:</strong> Test de volledige contact form email flow (bevestiging + notificatie)
                  </Text>
                </Box>
              </motion.div>
            </Stack>
          </motion.div>
        </Paper>
      </Box>
    </AdminErrorBoundary>
  );
};

export default MailgunTest; 
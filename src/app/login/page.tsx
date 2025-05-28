'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Title, Paper, TextInput, PasswordInput, Button, Stack, Alert, Box, Text, Group, ThemeIcon, Container } from '@mantine/core';
import { IconInfoCircle, IconLogin, IconShield, IconSparkles, IconLock } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { loginUser, type LoginState } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';

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

const buttonVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.98 },
} as const;

export default function AdminLoginPage() {
  const [state, setState] = useState<LoginState>({ success: false });
  const [isPending, startTransition] = useTransition();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Prevent hydration mismatch by only rendering form on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await loginUser(undefined, formData);
        setState(result);
        
        if (result.success) {
          // Login successful, redirect will be handled by the server action
          router.push('/admin_area/dashboard');
        }
      } catch (error) {
        console.error('Login error:', error);
        setState({
          success: false,
          message: 'Er is een onverwachte fout opgetreden.',
          errors: { general: ['Client-side error'] }
        });
      }
    });
  };

  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--mantine-spacing-md)',
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
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
          bottom: '20%',
          right: '15%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
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

      <Container size="xs" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Paper
              shadow="xl"
              p="xl"
              radius="xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                maxWidth: '450px',
                margin: '0 auto',
              }}
            >
              {/* Decorative header element */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }} />

              <Stack gap="xl" style={{ position: 'relative' }}>
                {/* Enhanced Header */}
                <motion.div variants={itemVariants}>
                  <Box ta="center" mb="lg">
                    <Group justify="center" gap="md" mb="md">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
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
                          gradient={{ from: 'violet.6', to: 'blue.5' }}
                          style={{
                            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                          }}
                        >
                          <IconShield size={28} />
                        </ThemeIcon>
                      </motion.div>
                      
                      <motion.div
                        animate={{ 
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                      >
                        <IconSparkles 
                          size={20} 
                          style={{ 
                            color: 'var(--mantine-color-yellow-4)',
                            filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))'
                          }} 
                        />
                      </motion.div>
                    </Group>

                    <Title 
                      order={1}
                      ta="center"
                      style={{
                        background: 'linear-gradient(135deg, var(--mantine-color-violet-4), var(--mantine-color-blue-4))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: 'clamp(1.8rem, 4vw, 2.2rem)',
                        fontWeight: 900,
                        marginBottom: '0.5rem',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                      }}
                    >
                      Admin Login
                    </Title>
                    
                    <Text 
                      size="md" 
                      c="gray.3"
                      ta="center"
                      style={{
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        lineHeight: 1.6,
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                      }}
                    >
                      Toegang tot het administratiepaneel
                    </Text>

                    {/* Security badges */}
                    <Group justify="center" gap="xs" mt="md">
                      <Box
                        style={{
                          padding: '6px 10px',
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '6px',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Group gap="xs">
                          <IconLock size={12} style={{ color: 'var(--mantine-color-violet-4)' }} />
                          <Text size="xs" fw={600} c="violet.3">
                            Beveiligd
                          </Text>
                        </Group>
                      </Box>
                      
                      <Box
                        style={{
                          padding: '6px 10px',
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          borderRadius: '6px',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <Group gap="xs">
                          <IconShield size={12} style={{ color: 'var(--mantine-color-green-4)' }} />
                          <Text size="xs" fw={600} c="green.3">
                            Versleuteld
                          </Text>
                        </Group>
                      </Box>
                    </Group>
                  </Box>
                </motion.div>

                {/* Error Messages */}
                {state.message && (
                  <motion.div variants={itemVariants}>
                    <Alert 
                      icon={<IconInfoCircle size="1.2rem" />} 
                      title="Login Fout" 
                      color="red" 
                      variant="light"
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
                      {state.message}
                    </Alert>
                  </motion.div>
                )}

                {state.errors?.general && (
                  <motion.div variants={itemVariants}>
                    <Alert 
                      icon={<IconInfoCircle size="1.2rem" />} 
                      title="Fout" 
                      color="red" 
                      variant="light"
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
                      {state.errors.general.join(', ')}
                    </Alert>
                  </motion.div>
                )}

                {/* Login Form - Only render on client to prevent hydration mismatch */}
                {isClient && (
                  <motion.div variants={itemVariants}>
                    <form action={handleSubmit}>
                      <Stack gap="lg">
                        <motion.div variants={itemVariants}>
                          <TextInput
                            label="Email"
                            placeholder="admin@jeffdash.com"
                            required
                            name="email"
                            type="email"
                            size="md"
                            error={state?.errors?.email?.join(', ')}
                            disabled={isPending}
                            styles={{
                              label: {
                                color: 'var(--mantine-color-gray-2)',
                                fontWeight: 500,
                                marginBottom: '8px',
                                WebkitFontSmoothing: 'antialiased',
                                MozOsxFontSmoothing: 'grayscale',
                              },
                              input: {
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'var(--mantine-color-gray-1)',
                                backdropFilter: 'blur(10px)',
                                '&:focus': {
                                  borderColor: 'rgba(139, 92, 246, 0.5)',
                                  boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
                                },
                                '&::placeholder': {
                                  color: 'var(--mantine-color-gray-5)',
                                }
                              },
                              error: {
                                color: 'var(--mantine-color-red-4)',
                              }
                            }}
                          />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <PasswordInput
                            label="Wachtwoord"
                            placeholder="••••••••••••"
                            required
                            name="password"
                            size="md"
                            error={state?.errors?.password?.join(', ')}
                            disabled={isPending}
                            styles={{
                              label: {
                                color: 'var(--mantine-color-gray-2)',
                                fontWeight: 500,
                                marginBottom: '8px',
                                WebkitFontSmoothing: 'antialiased',
                                MozOsxFontSmoothing: 'grayscale',
                              },
                              input: {
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'var(--mantine-color-gray-1)',
                                backdropFilter: 'blur(10px)',
                                '&:focus': {
                                  borderColor: 'rgba(139, 92, 246, 0.5)',
                                  boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
                                },
                                '&::placeholder': {
                                  color: 'var(--mantine-color-gray-5)',
                                }
                              },
                              error: {
                                color: 'var(--mantine-color-red-4)',
                              }
                            }}
                          />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                            <Button 
                              type="submit" 
                              fullWidth 
                              size="md"
                              loading={isPending}
                              variant="gradient"
                              gradient={{ from: 'violet.6', to: 'blue.5' }}
                              rightSection={<IconLogin size={18} />}
                              style={{
                                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                                fontWeight: 600,
                                fontSize: '1rem',
                              }}
                            >
                              {isPending ? 'Bezig met inloggen...' : 'Inloggen'}
                            </Button>
                          </motion.div>
                        </motion.div>
                      </Stack>
                    </form>
                  </motion.div>
                )}

                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <motion.div variants={itemVariants}>
                    <Box
                      style={{
                        background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)',
                        border: '1px solid rgba(107, 114, 128, 0.2)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Text size="xs" c="gray.4" mb="xs" fw={600}>
                        Debug Info (Development Only):
                      </Text>
                      <Text 
                        component="pre" 
                        size="xs" 
                        c="gray.5"
                        style={{ 
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {JSON.stringify(state, null, 2)}
                      </Text>
                    </Box>
                  </motion.div>
                )}
              </Stack>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
} 
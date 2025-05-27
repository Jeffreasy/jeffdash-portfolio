'use client';

import React from 'react';
import { Card, Text, Button, Container, Alert, Box, Group, ThemeIcon, Stack } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  componentName: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Animation variants
const errorVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

class AdminErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Enhanced error logging for admin components
    console.error(`Admin Error in ${this.props.componentName}:`, {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      component: this.props.componentName,
      // Add any additional security-relevant information here
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          style={{
            position: 'relative',
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--mantine-spacing-xl)',
          }}
        >
          {/* Decorative error elements */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(25px)',
            pointerEvents: 'none',
          }} />

          <motion.div
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: '500px', width: '100%' }}
          >
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
                width: '80px',
                height: '80px',
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }} />

              <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
                {/* Error Icon and Title */}
                <Group justify="center">
                  <ThemeIcon
                    size="xl"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: 'red.6', to: 'orange.5' }}
                  >
                    <IconAlertCircle size={28} />
                  </ThemeIcon>
                </Group>

                <Box ta="center">
                  <Text 
                    size="xl" 
                    fw={700} 
                    mb="xs"
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-red-4), var(--mantine-color-orange-4))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    Administratieve Fout
                  </Text>
                  <Text size="lg" c="gray.2" fw={600} mb="sm">
                    Fout in {this.props.componentName}
                  </Text>
                </Box>

                {/* Error Message */}
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    padding: 'var(--mantine-spacing-md)',
                  }}
                >
                  <Text size="sm" c="gray.3" ta="center" mb="xs">
                    {this.state.error?.message || `Er is een onverwachte fout opgetreden in ${this.props.componentName}.`}
                  </Text>
                  <Text size="xs" c="gray.4" ta="center">
                    Deze fout is gelogd voor verdere analyse. Probeer de pagina te vernieuwen of neem contact op met de beheerder als het probleem aanhoudt.
                  </Text>
                </Box>

                {/* Action Button */}
                <Group justify="center">
                  <Button
                    onClick={() => {
                      this.setState({ hasError: false });
                      window.location.reload();
                    }}
                    variant="gradient"
                    gradient={{ from: 'red.6', to: 'orange.5' }}
                    leftSection={<IconRefresh size={16} />}
                    style={{
                      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      fontWeight: 500,
                    }}
                    styles={{
                      root: {
                        '&:hover': {
                          boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0px)',
                        },
                      },
                    }}
                  >
                    Probeer opnieuw
                  </Button>
                </Group>
              </Stack>
            </Box>
          </motion.div>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary; 
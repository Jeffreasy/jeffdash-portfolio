'use client';

import React from 'react';
import { Card, Text, Button, Container, Box } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ContactErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log de error naar een error reporting service
    console.error('Contact form error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          style={{
            position: 'relative',
            padding: 'var(--mantine-spacing-xl)',
            textAlign: 'center',
          }}
        >
          {/* Decorative error elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: '60px',
            height: '60px',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '20%',
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }} />

          <Card
            shadow="lg"
            padding="xl"
            radius="lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--mantine-spacing-md)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}>
                <IconAlertCircle size={32} style={{ color: 'var(--mantine-color-red-4)' }} />
              </div>

              <Text 
                size="xl" 
                fw={600} 
                mb="md" 
                c="red.4"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}
              >
                Contactformulier Fout
              </Text>
              
              <Text 
                mb="xl" 
                c="gray.3"
                ta="center"
                style={{
                  lineHeight: 1.6,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {this.state.error?.message || 'Er is een onverwachte fout opgetreden bij het laden van het contactformulier. Probeer de pagina te vernieuwen.'}
              </Text>
              
              <Button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                variant="gradient"
                gradient={{ from: 'red.6', to: 'orange.5' }}
                style={{
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  fontWeight: 500,
                }}
              >
                Probeer opnieuw
              </Button>
            </div>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ContactErrorBoundary; 
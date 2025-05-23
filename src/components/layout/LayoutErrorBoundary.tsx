'use client';

import React from 'react';
import { Container, Text, Button, Alert, Box } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface Props {
  children: React.ReactNode;
  componentName: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class LayoutErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Enhanced error logging for layout components
    console.error(`Layout Error in ${this.props.componentName}:`, {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      component: this.props.componentName,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          style={{
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative background elements */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />

          <Container size="sm" py="xl" style={{ position: 'relative', zIndex: 1 }}>
            <Box
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--mantine-radius-xl)',
                padding: 'var(--mantine-spacing-xl)',
                textAlign: 'center',
              }}
            >
              <Alert
                icon={<IconAlertCircle size="1.2rem" />}
                title="Layout Fout"
                color="red"
                variant="light"
                mb="md"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: 'var(--mantine-color-red-3)',
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
                Er is een fout opgetreden in de layout van de website.
              </Alert>
              
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
                Fout in {this.props.componentName}
              </Text>
              
              <Text 
                mb="xl" 
                c="gray.3"
                style={{
                  lineHeight: 1.6,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {this.state.error?.message || `Er is een onverwachte fout opgetreden in ${this.props.componentName}.`}
              </Text>
              
              <Text 
                size="sm" 
                c="gray.4" 
                mb="xl"
                style={{
                  lineHeight: 1.5,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}
              >
                Deze fout is gelogd voor verdere analyse. Probeer de pagina te vernieuwen of neem contact op met de beheerder als het probleem aanhoudt.
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
            </Box>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default LayoutErrorBoundary; 
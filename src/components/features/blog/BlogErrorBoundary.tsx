'use client';

import React from 'react';
import { Card, Text, Button, Container } from '@mantine/core';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class BlogErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log de error naar een error reporting service
    console.error('Blog component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Container size="md" py="xl">
            <Card 
              shadow="lg" 
              padding="xl" 
              radius="lg" 
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
              }}
            >
              <Text size="xl" fw={500} mb="md" c="red.4">
                Oeps! Er is iets misgegaan met het laden van de blog
              </Text>
              <Text mb="xl" c="gray.4">
                {this.state.error?.message || 'Er is een onverwachte fout opgetreden bij het laden van de blog content.'}
              </Text>
              <Button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                variant="gradient"
                gradient={{ from: 'blue.6', to: 'cyan.5' }}
                style={{
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                Probeer opnieuw
              </Button>
            </Card>
          </Container>
        </section>
      );
    }

    return this.props.children;
  }
}

export default BlogErrorBoundary; 
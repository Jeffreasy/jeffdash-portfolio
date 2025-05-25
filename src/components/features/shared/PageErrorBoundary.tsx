'use client';

import React, { Component, ReactNode } from 'react';
import { Container, Title, Text, Button, Stack, Alert, Paper } from '@mantine/core';
import { IconAlertTriangle, IconRefresh, IconHome } from '@tabler/icons-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PageErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Log to error reporting service (e.g., Sentry)
    // reportError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container size="md" py="xl">
          <Paper withBorder shadow="md" p="xl" radius="md">
            <Stack gap="lg" align="center">
              <IconAlertTriangle size={64} color="red" />
              
              <Title order={1} ta="center" c="red">
                Er is iets misgegaan
              </Title>
              
              <Text ta="center" size="lg" c="dimmed">
                Deze pagina kon niet worden geladen. We excuseren ons voor het ongemak.
              </Text>

              <Alert 
                icon={<IconAlertTriangle size={16} />} 
                title="Technische details" 
                color="red"
                variant="light"
                style={{ width: '100%' }}
              >
                <Text size="sm" c="dimmed">
                  {this.state.error?.message || 'Onbekende fout opgetreden'}
                </Text>
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details style={{ marginTop: '8px' }}>
                    <summary style={{ cursor: 'pointer', fontSize: '12px' }}>
                      Stack trace (alleen zichtbaar in development)
                    </summary>
                    <pre style={{ 
                      fontSize: '11px', 
                      overflow: 'auto', 
                      marginTop: '8px',
                      padding: '8px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px'
                    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </Alert>

              <Stack gap="md" align="center">
                <Button
                  onClick={this.handleRetry}
                  leftSection={<IconRefresh size={16} />}
                  variant="filled"
                  size="lg"
                >
                  Probeer Opnieuw
                </Button>
                
                <Button
                  onClick={this.handleReload}
                  variant="light"
                  size="md"
                >
                  Pagina Vernieuwen
                </Button>
                
                <Button
                  component={Link}
                  href="/"
                  variant="subtle"
                  leftSection={<IconHome size={16} />}
                  size="md"
                >
                  Terug naar Home
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary; 
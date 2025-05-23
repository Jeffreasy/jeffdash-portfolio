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

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state zodat de volgende render de fallback UI toont
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Je kunt hier de error loggen naar een error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Container size="md" py="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="xl" fw={500} mb="md" c="red">
              Oeps! Er is iets misgegaan
            </Text>
            <Text mb="xl" c="dimmed">
              {this.state.error?.message || 'Er is een onverwachte fout opgetreden.'}
            </Text>
            <Button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              variant="light"
            >
              Probeer opnieuw
            </Button>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
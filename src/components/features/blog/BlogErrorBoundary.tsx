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
        <Container size="md" py="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="xl" fw={500} mb="md" c="red">
              Oeps! Er is iets misgegaan met het laden van de blog
            </Text>
            <Text mb="xl" c="dimmed">
              {this.state.error?.message || 'Er is een onverwachte fout opgetreden bij het laden van de blog content.'}
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

export default BlogErrorBoundary; 
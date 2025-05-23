'use client';

import React from 'react';
import { Card, Text, Button, Container } from '@mantine/core';

interface Props {
  children: React.ReactNode;
  componentName: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class SharedErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error(`${this.props.componentName} error:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="xl" fw={500} mb="md" c="red">
              Oeps! Er is iets misgegaan bij het laden van {this.props.componentName}
            </Text>
            <Text mb="xl" c="dimmed">
              {this.state.error?.message || `Er is een onverwachte fout opgetreden bij het laden van ${this.props.componentName}.`}
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

export default SharedErrorBoundary; 
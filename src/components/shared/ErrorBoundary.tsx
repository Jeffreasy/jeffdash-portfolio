'use client';

import React from 'react';
import { Container, Text, Button, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface Props {
  children: React.ReactNode;
  componentName: string;
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
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Enhanced error logging
    console.error(`Error in ${this.props.componentName}:`, {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      component: this.props.componentName,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Fout"
            color="red"
            variant="filled"
            mb="md"
          >
            Er is een fout opgetreden in {this.props.componentName}.
          </Alert>
          
          <Text size="xl" fw={500} mb="md" c="red">
            Fout in {this.props.componentName}
          </Text>
          <Text mb="xl" c="dimmed">
            {this.state.error?.message || `Er is een onverwachte fout opgetreden in ${this.props.componentName}.`}
          </Text>
          <Text size="sm" c="dimmed" mb="xl">
            Deze fout is gelogd voor verdere analyse. Probeer de pagina te vernieuwen of neem contact op met de beheerder als het probleem aanhoudt.
          </Text>
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            variant="light"
            color="red"
          >
            Probeer opnieuw
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
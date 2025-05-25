'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Container, Title, Text, Button, Stack, Alert, Paper, Group } from '@mantine/core';
import { IconAlertTriangle, IconRefresh, IconHome } from '@tabler/icons-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <Container size="md" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Stack gap="lg" align="center">
          <IconAlertTriangle size={64} color="red" />
          
          <Title order={1} ta="center" c="red">
            Er is een onverwachte fout opgetreden
          </Title>
          
          <Text ta="center" size="lg" c="dimmed">
            Er ging iets mis tijdens het laden van deze pagina. We excuseren ons voor het ongemak.
          </Text>

          <Alert 
            icon={<IconAlertTriangle size={16} />} 
            title="Technische details" 
            color="red"
            variant="light"
            style={{ width: '100%' }}
          >
            <Text size="sm" c="dimmed">
              {error.message || 'Onbekende fout opgetreden'}
            </Text>
            {error.digest && (
              <Text size="xs" c="dimmed" mt="xs">
                Error ID: {error.digest}
              </Text>
            )}
          </Alert>

          <Group gap="md">
            <Button
              onClick={reset}
              leftSection={<IconRefresh size={16} />}
              variant="filled"
              size="lg"
            >
              Probeer Opnieuw
            </Button>
            
            <Button
              component={Link}
              href="/"
              variant="light"
              leftSection={<IconHome size={16} />}
              size="lg"
            >
              Terug naar Home
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
} 
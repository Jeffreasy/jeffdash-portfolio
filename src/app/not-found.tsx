'use client';

import Link from 'next/link';
import { Container, Title, Text, Button, Stack, Paper, Group } from '@mantine/core';
import { IconHome, IconArrowLeft, IconError404 } from '@tabler/icons-react';

export default function NotFound() {
  const handleGoBack = () => {
    // No need for typeof window check in client component click handler
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <Container size="md" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Stack gap="lg" align="center">
          <IconError404 size={80} color="gray" />
          
          <Title order={1} ta="center" size="3rem" c="dimmed">
            404
          </Title>
          
          <Title order={2} ta="center">
            Pagina niet gevonden
          </Title>
          
          <Text ta="center" size="lg" c="dimmed" maw={500}>
            De pagina die je zoekt bestaat niet of is verplaatst. 
            Controleer de URL of ga terug naar de homepage.
          </Text>

          <Group gap="md">
            <Button
              component={Link}
              href="/"
              leftSection={<IconHome size={16} />}
              variant="filled"
              size="lg"
            >
              Naar Homepage
            </Button>
            
            <Button
              onClick={handleGoBack}
              variant="light"
              leftSection={<IconArrowLeft size={16} />}
              size="lg"
            >
              Terug
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
} 
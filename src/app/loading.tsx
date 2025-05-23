import React from 'react';
import { Container, Skeleton, Stack, Center, Loader, Text } from '@mantine/core';
 
export default function Loading() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* Header skeleton */}
        <Center>
          <Stack gap="md" align="center">
            <Loader size="lg" color="blue" />
            <Text size="sm" c="dimmed">
              Pagina wordt geladen...
            </Text>
          </Stack>
        </Center>
        
        {/* Content skeleton */}
        <Stack gap="md">
          <Skeleton height={40} width="60%" radius="md" />
          <Skeleton height={200} radius="md" />
          <Stack gap="xs">
            <Skeleton height={20} width="90%" radius="sm" />
            <Skeleton height={20} width="70%" radius="sm" />
            <Skeleton height={20} width="85%" radius="sm" />
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
} 
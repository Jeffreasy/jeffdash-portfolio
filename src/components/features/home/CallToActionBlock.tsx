import React from 'react';
import { Title, Text, Button, Container, Group } from '@mantine/core';
import Link from 'next/link';

const CallToActionBlock: React.FC = () => {
  return (
    <Container size="md" py="xl" style={{ backgroundColor: 'var(--mantine-color-gray-1)', borderRadius: 'var(--mantine-radius-md)' }}>
      <Title order={2} ta="center">Klaar om samen te werken?</Title>
      <Text ta="center" mt="sm">Laten we bespreken hoe ik kan helpen met jouw volgende project.</Text>
      <Group justify="center" mt="xl">
        <Button component={Link} href="/contact" size="lg">
          Neem Contact Op
        </Button>
        <Button component={Link} href="/projects" size="lg" variant="outline">
          Bekijk Mijn Werk
        </Button>
      </Group>
    </Container>
  );
};

export default CallToActionBlock; 
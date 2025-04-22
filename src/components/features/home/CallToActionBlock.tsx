import React from 'react';
import { Title, Text, Button, Container, Group } from '@mantine/core';
import Link from 'next/link';

const CallToActionBlock: React.FC = () => {
  return (
    <Container 
      size="md" 
      py="xl" 
      style={{
         // Gebruik een donkerdere achtergrond voor dark mode
         backgroundColor: 'var(--mantine-color-dark-6)', // Gewijzigd van gray-1 naar dark-6
         borderRadius: 'var(--mantine-radius-md)' 
      }}
    >
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
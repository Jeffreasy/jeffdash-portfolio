import React from 'react';
import { Text, Button, Container, Title, Group } from '@mantine/core';
import Link from 'next/link'; // Gebruik Next.js Link voor navigatie

const ShortAboutBlurb: React.FC = () => {
  return (
    <Container size="md" py="xl">
      <Title order={2} ta="center" mb="xl">
        Over Mij (Kort)
      </Title>
      <Text ta="center">
        Naast mijn werk in de zorg als begeleider, duik ik in mijn vrije tijd vol passie in de wereld van web development. Ik focus op het volledige full-stack proces, vaak met hulp van AI-tools, om moderne applicaties te bouwen.
      </Text>
      <Group justify="center" mt="lg">
         <Button component={Link} href="/about" size="md">
            Lees Meer Over Mij
         </Button>
      </Group>
    </Container>
  );
};

export default ShortAboutBlurb; 
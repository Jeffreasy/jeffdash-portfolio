import React from 'react';
import { Text, Button, Container } from '@mantine/core';
import Link from 'next/link'; // Gebruik Next.js Link voor navigatie

const ShortAboutBlurb: React.FC = () => {
  return (
    <Container size="md" py="xl">
      <Text ta="center">
        Naast mijn werk in de zorg als begeleider, duik ik in mijn vrije tijd vol passie in de wereld van web development. Ik focus op het volledige full-stack proces, vaak met hulp van AI-tools, om moderne applicaties te bouwen.
      </Text>
      <Button component={Link} href="/about" size="md" mt="lg" fullWidth>
        Lees Meer Over Mij
      </Button>
    </Container>
  );
};

export default ShortAboutBlurb; 
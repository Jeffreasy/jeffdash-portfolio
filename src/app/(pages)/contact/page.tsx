import React from 'react';
import { Container, Title, Text, Paper } from '@mantine/core';
import ContactForm from '@/components/features/contact/ContactForm';

export default function ContactPage() {
  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg">
          Neem Contact Op
        </Title>
        <Text c="dimmed" ta="center" mb="xl">
          Heb je een vraag, opmerking of wil je samenwerken? Vul het onderstaande formulier in.
        </Text>
        <ContactForm />
      </Paper>
    </Container>
  );
} 
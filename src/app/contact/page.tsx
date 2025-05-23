import React from 'react';
import { Container, Title, Text, Paper } from '@mantine/core';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import ContactForm from '@/components/features/contact/ContactForm';

// --- SEO Metadata --- //
export const metadata: Metadata = {
  title: `Contact | ${SITE_CONFIG.name}`,
  description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen, vragen over webontwikkeling projecten, of om een offerte aan te vragen. Ik help graag!',
  keywords: ['contact', 'webontwikkelaar', 'samenwerking', 'offerte', 'Jeffrey Lavente'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
  openGraph: {
    title: `Contact | ${SITE_CONFIG.name}`,
    description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen, vragen over webontwikkeling projecten, of om een offerte aan te vragen.',
    url: `${SITE_CONFIG.url}/contact`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary',
    title: `Contact | ${SITE_CONFIG.name}`,
    description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen en webontwikkeling projecten.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={1} ta="center" mb="lg">
          Neem Contact Op
        </Title>
        <Text c="dimmed" ta="center" mb="xl" size="lg">
          Heb je een vraag, opmerking of wil je samenwerken? Vul het onderstaande formulier in en ik neem zo snel mogelijk contact met je op.
        </Text>
        <ContactForm />
      </Paper>
    </Container>
  );
} 
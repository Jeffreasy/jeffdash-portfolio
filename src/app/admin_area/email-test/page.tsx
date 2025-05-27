import React from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';
import MailgunTest from '@/components/admin/MailgunTest';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

export default function EmailTestPage() {
  return (
    <AdminErrorBoundary componentName="Email Test Page">
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Page Header */}
          <div>
            <Title 
              order={1} 
              mb="md"
              style={{
                background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                fontWeight: 900,
              }}
            >
              Email Test Center
            </Title>
            <Text size="lg" c="gray.4" maw={600}>
              Test de Mailgun email integratie om te controleren of alle email functionaliteit correct werkt. 
              Hier kun je zowel de basis test email als de volledige contact form flow testen.
            </Text>
          </div>

          {/* Mailgun Test Component */}
          <MailgunTest />

          {/* Additional Information */}
          <div>
            <Title order={3} mb="md" c="gray.2">
              Email Configuratie Info
            </Title>
            <Stack gap="sm">
              <Text size="sm" c="gray.4">
                <strong>Mailgun Domain:</strong> jeffdash.com (Custom Domain)
              </Text>
              <Text size="sm" c="gray.4">
                <strong>Test Email:</strong> postmaster@jeffdash.com → jeffrey@jeffdash.com
              </Text>
              <Text size="sm" c="gray.4">
                <strong>Contact Form Flow:</strong>
              </Text>
              <Text size="sm" c="gray.5" ml="md">
                • User confirmation: no-reply@jeffdash.com → klant
              </Text>
              <Text size="sm" c="gray.5" ml="md">
                • Plan inquiry: sales@jeffdash.com → jeffrey@jeffdash.com
              </Text>
              <Text size="sm" c="gray.5" ml="md">
                • General contact: contact@jeffdash.com → jeffrey@jeffdash.com
              </Text>
              <Text size="sm" c="gray.5" mt="md">
                <strong>Opmerking:</strong> Zorg ervoor dat je de juiste environment variables hebt ingesteld in je .env.local bestand:
                MAILGUN_API_KEY, MAILGUN_DOMAIN, en MAILGUN_FROM_EMAIL.
              </Text>
            </Stack>
          </div>
        </Stack>
      </Container>
    </AdminErrorBoundary>
  );
} 
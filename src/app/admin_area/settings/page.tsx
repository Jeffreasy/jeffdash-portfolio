'use client';

import React from 'react';
import { Container, Title, Text, Stack, Alert, Button, Group, Card } from '@mantine/core';
import { IconInfoCircle, IconDatabase, IconUser, IconSettings } from '@tabler/icons-react';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';

export default function AdminSettingsPage() {
  const handleTestConnection = async () => {
    try {
      // Test the site-status endpoint (public)
      const statusResponse = await fetch('/api/site-status');
      console.log('Site status response:', statusResponse.status, await statusResponse.text());
      
      // Test the admin endpoint
      const adminResponse = await fetch('/api/admin/site-settings');
      console.log('Admin settings response:', adminResponse.status, await adminResponse.text());
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="sm">
            Site Instellingen
          </Title>
          <Text c="dimmed" size="lg">
            Beheer site-brede instellingen en configuratie opties.
          </Text>
        </div>

        {/* Diagnostic Section */}
        <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light">
          <Stack gap="sm">
            <Text fw={600}>Troubleshooting Tips</Text>
            <Text size="sm">
              Als je problemen hebt met het laden van instellingen, controleer dan:
            </Text>
            <Stack gap="xs">
              <Group gap="xs">
                <IconDatabase size={16} />
                <Text size="sm">Database migratie is uitgevoerd (V1_4_SiteSettings.sql en RLSV1.5_SiteSettings.sql)</Text>
              </Group>
              <Group gap="xs">
                <IconUser size={16} />
                <Text size="sm">Je gebruiker heeft de rol 'ADMIN' in de User tabel</Text>
              </Group>
              <Group gap="xs">
                <IconSettings size={16} />
                <Text size="sm">Supabase environment variables zijn correct ingesteld</Text>
              </Group>
            </Stack>
            <Button 
              variant="light" 
              size="sm" 
              onClick={handleTestConnection}
            >
              Test Verbinding (Check Console)
            </Button>
          </Stack>
        </Alert>

        <SiteSettingsManager />
      </Stack>
    </Container>
  );
} 
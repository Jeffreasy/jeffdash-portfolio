import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Card, Title, Text, Stack } from '@mantine/core';

// Force dynamic rendering for pages that use cookies/auth
export const dynamic = 'force-dynamic';

export default async function TestAuthPage() {
  let authInfo = 'Onbekend';
  let connectionInfo = 'Onbekend';
  let envInfo: any = {};

  try {
    // Test environment variables
    envInfo = {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      keyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
    };

    // Test Supabase connection
    const supabase = await createClient();
    connectionInfo = 'Supabase client aangemaakt';

    // Test auth session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      authInfo = `Auth Error: ${error.message}`;
    } else if (session?.user) {
      authInfo = `Ingelogd als: ${session.user.email} (ID: ${session.user.id})`;
    } else {
      authInfo = 'Niet ingelogd';
    }
  } catch (error: any) {
    connectionInfo = `Connection Error: ${error.message}`;
  }

  return (
    <Stack gap="lg" p="md">
      <Title order={2}>Auth Test Page</Title>
      
      <Card withBorder p="md">
        <Title order={4}>Environment Variables</Title>
        <Text size="sm">Has URL: {envInfo.hasUrl ? 'Ja' : 'Nee'}</Text>
        <Text size="sm">Has Key: {envInfo.hasKey ? 'Ja' : 'Nee'}</Text>
        <Text size="sm">URL Preview: {envInfo.urlPrefix}</Text>
        <Text size="sm">Key Preview: {envInfo.keyPrefix}</Text>
      </Card>

      <Card withBorder p="md">
        <Title order={4}>Supabase Connection</Title>
        <Text size="sm">{connectionInfo}</Text>
      </Card>

      <Card withBorder p="md">
        <Title order={4}>Authentication Status</Title>
        <Text size="sm">{authInfo}</Text>
      </Card>
    </Stack>
  );
} 
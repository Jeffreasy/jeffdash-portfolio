'use client'; // Maak hier een Client Component van

import React, { useEffect, useState } from 'react';
import { AppShell, Group, Title, Text } from '@mantine/core';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminErrorBoundary from './AdminErrorBoundary';
// import { useDisclosure } from '@mantine/hooks'; // Kan hier gebruikt worden voor mobiele state indien nodig

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  // const [opened, { toggle }] = useDisclosure(); // Voor mobiele navbar toggle

  useEffect(() => {
    console.log('AdminLayoutClient mounted');
    setIsLoading(false);
  }, []);

  // Validate children prop
  if (children === undefined) {
    throw new Error('AdminLayoutClient requires children to be provided');
  }

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Text>Loading admin panel...</Text>
      </div>
    );
  }

  console.log('AdminLayoutClient rendering layout');

  return (
    <AdminErrorBoundary componentName="Admin Layout">
      <AppShell
        padding="md"
        navbar={{
          width: 250,
          breakpoint: 'sm',
          // collapsed: { mobile: !opened }, // Mobiele state
        }}
        header={{
          height: 60,
        }}
      >
        <AppShell.Header>
          {/* <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" /> */}
          <Group h="100%" px="md">
            <Title order={3}>Admin Panel</Title>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <AdminErrorBoundary componentName="Admin Navigation">
            <AdminNavbar />
          </AdminErrorBoundary>
        </AppShell.Navbar>

        <AppShell.Main>
          <AdminErrorBoundary componentName="Admin Content">
            {children}
          </AdminErrorBoundary>
        </AppShell.Main>
      </AppShell>
    </AdminErrorBoundary>
  );
} 
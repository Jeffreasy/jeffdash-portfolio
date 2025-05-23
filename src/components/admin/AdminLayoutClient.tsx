'use client'; // Maak hier een Client Component van

import React from 'react';
import { AppShell, Group, Title } from '@mantine/core';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminErrorBoundary from './AdminErrorBoundary';
// import { useDisclosure } from '@mantine/hooks'; // Kan hier gebruikt worden voor mobiele state indien nodig

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  // const [opened, { toggle }] = useDisclosure(); // Voor mobiele navbar toggle

  // Validate children prop
  if (children === undefined) {
    throw new Error('AdminLayoutClient requires children to be provided');
  }

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
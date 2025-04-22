'use client'; // Maak hier een Client Component van

import React from 'react';
import { AppShell, Group, Title } from '@mantine/core';
import AdminNavbar from '@/components/admin/AdminNavbar';
// import { useDisclosure } from '@mantine/hooks'; // Kan hier gebruikt worden voor mobiele state indien nodig

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  // const [opened, { toggle }] = useDisclosure(); // Voor mobiele navbar toggle

  return (
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
        <AdminNavbar />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
} 
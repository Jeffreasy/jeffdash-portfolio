'use client';

import React from 'react';
import { NavLink, Button, Stack } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconGauge,
  IconClipboardList,
  IconFileText,
  IconMessages,
  IconLogout,
} from '@tabler/icons-react';
import { logoutUser } from '@/lib/actions/auth'; // Importeer de logout action

const navLinks = [
  { icon: IconGauge, label: 'Dashboard', href: '/admin_area/dashboard' },
  { icon: IconClipboardList, label: 'Projecten', href: '/admin_area/projects' },
  { icon: IconFileText, label: 'Posts', href: '/admin_area/posts' },
  { icon: IconMessages, label: 'Contact Berichten', href: '/admin_area/contacts' },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <Stack justify="space-between" style={{ height: '100%' }}>
      {/* Navigatie Links */}
      <div>
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            href={link.href}
            label={link.label}
            leftSection={<link.icon size="1rem" stroke={1.5} />}
            active={pathname.startsWith(link.href)}
            component={Link} // Gebruik Next.js Link voor client-side navigatie
            variant="subtle" // Stijl van de links
            my="xs" // Marge boven/onder
          />
        ))}
      </div>

      {/* Logout Knop */}
      <form action={logoutUser as any}>
        <Button
          type="submit"
          variant="light"
          color="red"
          fullWidth
          leftSection={<IconLogout size="1rem" stroke={1.5} />}
        >
          Uitloggen
        </Button>
      </form>
    </Stack>
  );
} 
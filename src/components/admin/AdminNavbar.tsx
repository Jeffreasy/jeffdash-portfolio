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
  IconUser,
  IconLogout,
} from '@tabler/icons-react';
import { logoutUser } from '@/lib/actions/auth';
import AdminErrorBoundary from './AdminErrorBoundary';

const navLinks = [
  { icon: IconGauge, label: 'Dashboard', href: '/admin_area/dashboard' },
  { icon: IconClipboardList, label: 'Projecten', href: '/admin_area/projects' },
  { icon: IconFileText, label: 'Posts', href: '/admin_area/posts' },
  { icon: IconMessages, label: 'Contact Berichten', href: '/admin_area/contacts' },
  { icon: IconUser, label: 'About Content', href: '/admin_area/about' },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  // Validate pathname
  if (!pathname) {
    throw new Error('Pathname is required for navigation');
  }

  const handleLogout = async (formData: FormData) => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout. Please try again.');
    }
  };

  return (
    <AdminErrorBoundary componentName="Admin Navigation">
      <Stack justify="space-between" style={{ height: '100%' }}>
        {/* Navigation Links */}
        <div>
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              href={link.href}
              label={link.label}
              leftSection={<link.icon size="1rem" stroke={1.5} />}
              active={pathname.startsWith(link.href)}
              component={Link}
              variant="subtle"
              my="xs"
              onClick={(e) => {
                if (!link.href) {
                  e.preventDefault();
                  console.error('Invalid navigation link:', link);
                }
              }}
            />
          ))}
        </div>

        {/* Logout Button */}
        <form action={handleLogout}>
          <Button
            type="submit"
            variant="light"
            color="red"
            fullWidth
            leftSection={<IconLogout size="1rem" stroke={1.5} />}
            onClick={(e) => {
              if (!logoutUser) {
                e.preventDefault();
                console.error('Logout function not available');
              }
            }}
          >
            Uitloggen
          </Button>
        </form>
      </Stack>
    </AdminErrorBoundary>
  );
} 
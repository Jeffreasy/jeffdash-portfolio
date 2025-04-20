"use client"; // Deze component gebruikt client-side hooks

import React from 'react';
import Link from 'next/link';
import {
  Container,
  Group,
  Anchor,
  Box,
  Burger,
  Drawer,
  Stack,
  Button,
  ActionIcon,
} from '@mantine/core';
import {
  IconBrandLinkedin,
  IconBrandGithub,
} from '@/components/icons';
import { useDisclosure } from '@mantine/hooks';
import { usePathname } from 'next/navigation';

const mainLinks = [
  { link: '/projects', label: 'Projects' },
  { link: '/blog', label: 'Blog' },
  { link: '/about', label: 'About' },
];

const socialLinks = [
  { href: 'https://linkedin.com/in/jouwprofiel', label: 'LinkedIn', Icon: IconBrandLinkedin },
  { href: 'https://github.com/jouwprofiel', label: 'GitHub', Icon: IconBrandGithub },
];

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();

  const mainItems = mainLinks.map((link) => {
    const isActive = pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link));
    return (
      <Anchor
        component={Link}
        href={link.link}
        key={link.label}
        underline="hover"
        fw={isActive ? 700 : 500}
        c={isActive ? 'blue' : undefined}
        onClick={close}
      >
        {link.label}
      </Anchor>
    );
  });

  const socialItems = socialLinks.map((social) => (
    <ActionIcon
      key={social.label}
      component="a"
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      variant="default"
      aria-label={social.label}
      onClick={close}
    >
      <social.Icon size={18} />
    </ActionIcon>
  ));

  const ctaButton = (
    <Button component={Link} href="/contact" onClick={close} variant="filled">
      Neem Contact Op
    </Button>
  );

  return (
    <Box
      component="header"
      py="md"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--mantine-color-gray-1)',
      }}
    >
      <Container size="lg">
        <Group justify="space-between">
          <Anchor component={Link} href="/" fw={700} underline="never">
            Jeffdash Portfolio
          </Anchor>
          <Group gap="lg" visibleFrom="sm">
            <Group gap="md">
              {mainItems}
            </Group>
            <Group gap="xs">
              {socialItems}
              {ctaButton}
            </Group>
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </Container>
      <Drawer
        opened={opened}
        onClose={close}
        title="Navigatie"
        padding="md"
        size="md"
        hiddenFrom="sm"
      >
        <Stack gap="lg">
          {mainItems}
          <Group justify="center" grow mt="xl">
            {ctaButton}
          </Group>
          <Group justify="center" gap="md" mt="md">
            {socialItems}
          </Group>
        </Stack>
      </Drawer>
    </Box>
  );
} 
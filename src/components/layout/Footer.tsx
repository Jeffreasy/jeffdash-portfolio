'use client';

import React, { useEffect, useState } from 'react';
import { Container, Text, Group, Anchor } from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub } from '@/components/icons';
import LayoutErrorBoundary from './LayoutErrorBoundary';

const socialLinks = [
  { href: 'https://linkedin.com/in/jeffrey-lavente-026a41330', label: 'LinkedIn', Icon: IconBrandLinkedin },
  { href: 'https://github.com/Jeffreasy', label: 'GitHub', Icon: IconBrandGithub },
];

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025); // Static fallback for SSR
  
  // Update year on client mount to avoid hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  try {
    const socialItems = socialLinks.map((social) => {
      try {
        return (
          <Anchor
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            c="dimmed"
            size="sm"
          >
            <social.Icon size={18} />
          </Anchor>
        );
      } catch (err) {
        console.error('Error rendering social link:', err);
        return null;
      }
    }).filter(Boolean);

    return (
      <LayoutErrorBoundary componentName="Footer">
        <Container size="lg" py="xl">
          <Group justify="space-between" align="center">
            <Text size="sm" c="dimmed">
              &copy; {currentYear} Jeffdash Portfolio. All rights reserved.
            </Text>
            <Group gap="xs">
              {socialItems}
            </Group>
          </Group>
        </Container>
      </LayoutErrorBoundary>
    );
  } catch (err) {
    console.error('Error in Footer component:', err);
    throw err; // Let the error boundary handle it
  }
} 
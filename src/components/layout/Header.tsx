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
import { motion } from 'framer-motion';
import LayoutErrorBoundary from './LayoutErrorBoundary';

// During construction, all navigation links redirect to homepage
const mainLinks = [
  { link: '/', label: 'Projects' },
  { link: '/', label: 'Blog' },
  { link: '/', label: 'About' },
];

const socialLinks = [
  { href: 'https://linkedin.com/in/jeffrey-lavente-026a41330', label: 'LinkedIn', Icon: IconBrandLinkedin },
  { href: 'https://github.com/Jeffreasy', label: 'GitHub', Icon: IconBrandGithub },
];

// Animation variants
const headerVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const linkVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.95 },
} as const;

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();

  // Validate pathname
  if (!pathname) {
    throw new Error('Pathname is required for navigation');
  }

  const mainItems = mainLinks.map((link) => {
    try {
      const isActive = pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link));
      return (
        <motion.div key={link.label} variants={linkVariants} whileHover="hover" whileTap="tap">
          <Anchor
            component={Link}
            href={link.link}
            underline="never"
            fw={isActive ? 600 : 500}
            onClick={close}
            style={{
              color: isActive 
                ? 'var(--mantine-color-blue-4)' 
                : 'var(--mantine-color-gray-2)',
              transition: 'color 0.2s ease',
              position: 'relative',
              textDecoration: 'none',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
            styles={{
              root: {
                '&:hover': {
                  color: 'var(--mantine-color-blue-3)',
                },
                '&::after': isActive ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                  borderRadius: '1px',
                } : undefined
              }
            }}
          >
            {link.label}
          </Anchor>
        </motion.div>
      );
    } catch (err) {
      console.error('Error rendering main link:', err);
      return null;
    }
  }).filter(Boolean);

  const socialItems = socialLinks.map((social) => {
    try {
      return (
        <motion.div key={social.label} variants={linkVariants} whileHover="hover" whileTap="tap">
          <ActionIcon
            component="a"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            color="gray"
            aria-label={social.label}
            onClick={close}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--mantine-color-gray-3)',
              transition: 'all 0.2s ease',
            }}
            styles={{
              root: {
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  color: 'var(--mantine-color-blue-3)',
                }
              }
            }}
          >
            <social.Icon size={18} />
          </ActionIcon>
        </motion.div>
      );
    } catch (err) {
      console.error('Error rendering social link:', err);
      return null;
    }
  }).filter(Boolean);

  const ctaButton = (
    <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
      <Button 
        component={Link} 
        href="/" 
        onClick={close} 
        variant="gradient"
        gradient={{ from: 'blue.6', to: 'cyan.5' }}
        style={{
          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          fontWeight: 500,
        }}
      >
        Neem Contact Op
      </Button>
    </motion.div>
  );

  return (
    <LayoutErrorBoundary componentName="Header">
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box
          component="header"
          py="md"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            // Hardware acceleration
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        >
          <Container size="lg">
            <Group justify="space-between">
              <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                <Anchor 
                  component={Link} 
                  href="/" 
                  fw={700} 
                  underline="never"
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontSize: '1.2rem',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  Jeffdash Portfolio
                </Anchor>
              </motion.div>
              
              <Group gap="lg" visibleFrom="sm">
                <Group gap="md">
                  {mainItems}
                </Group>
                <Group gap="xs">
                  {socialItems}
                  {ctaButton}
                </Group>
              </Group>
              
              <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                <Burger 
                  opened={opened} 
                  onClick={toggle} 
                  hiddenFrom="sm" 
                  size="sm"
                  color="var(--mantine-color-gray-3)"
                />
              </motion.div>
            </Group>
          </Container>
          
          <Drawer
            opened={opened}
            onClose={close}
            title={
              <span style={{
                background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 600,
              }}>
                Navigatie
              </span>
            }
            padding="md"
            size="md"
            hiddenFrom="sm"
            styles={{
              content: {
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              header: {
                background: 'transparent',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              },
              close: {
                color: 'var(--mantine-color-gray-3)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                }
              }
            }}
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
      </motion.div>
    </LayoutErrorBoundary>
  );
} 
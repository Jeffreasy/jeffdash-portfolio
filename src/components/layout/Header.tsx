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
  Text,
  Divider,
  rem,
} from '@mantine/core';
import {
  IconBrandLinkedin,
  IconBrandGithub,
} from '@/components/icons';
import { useDisclosure } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LayoutErrorBoundary from './LayoutErrorBoundary';

const mainLinks = [
  { link: '/projects', label: 'Projects' },
  { link: '/blog', label: 'Blog' },
  { link: '/about', label: 'About' },
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

// Mobile-specific animation variants
const mobileDrawerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
} as const;

const mobileItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    x: -20,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
} as const;

const mobileTapVariants = {
  tap: { 
    scale: 0.98,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    transition: { duration: 0.1 }
  },
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

  // Mobile-optimized navigation items
  const mobileItems = mainLinks.map((link) => {
    try {
      const isActive = pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link));
      return (
        <motion.div 
          key={`mobile-${link.label}`} 
          variants={mobileItemVariants}
          whileTap="tap"
          style={{
            borderRadius: rem(12),
          }}
          {...mobileTapVariants}
        >
          <Box
            component={Link}
            href={link.link}
            onClick={close}
            style={{
              display: 'block',
              padding: `${rem(16)} ${rem(20)}`,
              borderRadius: rem(12),
              textDecoration: 'none',
              background: isActive 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)'
                : 'transparent',
              border: isActive 
                ? '1px solid rgba(59, 130, 246, 0.3)'
                : '1px solid transparent',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
            }}
          >
            <Text
              size="lg"
              fw={isActive ? 600 : 500}
              c={isActive ? 'blue.4' : 'gray.2'}
              style={{
                letterSpacing: '0.5px',
              }}
            >
              {link.label}
            </Text>
            {isActive && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                  borderRadius: '1px',
                  marginTop: rem(4),
                  transformOrigin: 'left',
                }}
              />
            )}
          </Box>
        </motion.div>
      );
    } catch (err) {
      console.error('Error rendering mobile link:', err);
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

  // Mobile-optimized social items
  const mobileSocialItems = socialLinks.map((social) => {
    try {
      return (
        <motion.div 
          key={`mobile-social-${social.label}`} 
          variants={mobileItemVariants}
          whileTap="tap"
          {...mobileTapVariants}
        >
          <ActionIcon
            component="a"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            size="xl"
            radius="md"
            aria-label={social.label}
            onClick={close}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.08) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'var(--mantine-color-gray-3)',
              transition: 'all 0.3s ease',
              minHeight: rem(48),
              minWidth: rem(48),
              WebkitTapHighlightColor: 'transparent',
            }}
            styles={{
              root: {
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  color: 'var(--mantine-color-blue-3)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                }
              }
            }}
          >
            <social.Icon size={20} />
          </ActionIcon>
        </motion.div>
      );
    } catch (err) {
      console.error('Error rendering mobile social link:', err);
      return null;
    }
  }).filter(Boolean);

  const ctaButton = (
    <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
      <Button 
        component={Link} 
        href="/contact" 
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

  // Mobile-optimized CTA button
  const mobileCTAButton = (
    <motion.div 
      variants={mobileItemVariants}
      whileTap="tap"
      {...mobileTapVariants}
    >
      <Button 
        component={Link} 
        href="/contact" 
        onClick={close} 
        variant="gradient"
        gradient={{ from: 'blue.6', to: 'cyan.5' }}
        size="lg"
        radius="md"
        fullWidth
        style={{
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          fontWeight: 600,
          fontSize: rem(16),
          height: rem(50),
          WebkitTapHighlightColor: 'transparent',
        }}
        styles={{
          root: {
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            }
          }
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
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                  }}
                />
              </motion.div>
            </Group>
          </Container>
          
          <AnimatePresence>
            {opened && (
              <Drawer
                opened={opened}
                onClose={close}
                title={
                  <Group justify="space-between" w="100%">
                    <Text
                      fw={600}
                      size="lg"
                      style={{
                        background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      Navigatie
                    </Text>
                  </Group>
                }
                padding="lg"
                size="xs"
                hiddenFrom="sm"
                position="right"
                transitionProps={{
                  transition: 'slide-left',
                  duration: 300,
                  timingFunction: 'ease-out',
                }}
                styles={{
                  content: {
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  },
                  header: {
                    background: 'transparent',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: `${rem(16)} ${rem(24)}`,
                  },
                  close: {
                    color: 'var(--mantine-color-gray-3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: rem(8),
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  },
                  body: {
                    padding: rem(24),
                  }
                }}
              >
                <motion.div
                  variants={mobileDrawerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Stack gap="md">
                    {/* Navigation Links */}
                    <Box>
                      <Text 
                        size="sm" 
                        c="dimmed" 
                        tt="uppercase" 
                        fw={600} 
                        lts={1}
                        mb="sm"
                        pl="sm"
                      >
                        Pagina's
                      </Text>
                      <Stack gap="xs">
                        {mobileItems}
                      </Stack>
                    </Box>

                    <Divider color="dark.4" />

                    {/* CTA Button */}
                    <Box>
                      <Text 
                        size="sm" 
                        c="dimmed" 
                        tt="uppercase" 
                        fw={600} 
                        lts={1}
                        mb="sm"
                        pl="sm"
                      >
                        Contact
                      </Text>
                      {mobileCTAButton}
                    </Box>

                    <Divider color="dark.4" />

                    {/* Social Links */}
                    <Box>
                      <Text 
                        size="sm" 
                        c="dimmed" 
                        tt="uppercase" 
                        fw={600} 
                        lts={1}
                        mb="sm"
                        pl="sm"
                      >
                        Volg mij
                      </Text>
                      <Group justify="center" gap="md">
                        {mobileSocialItems}
                      </Group>
                    </Box>
                  </Stack>
                </motion.div>
              </Drawer>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>
    </LayoutErrorBoundary>
  );
} 
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
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LayoutErrorBoundary from './LayoutErrorBoundary';
import { ContactModal, useContactModal } from '@/components/features/contact';

// Navigation links
const mainLinks = [
  { link: '/projects', label: 'Projects' },
  { link: '/blog', label: 'Blog' },
  { link: '/about', label: 'About' },
  { link: '/contact', label: 'Contact' },
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
} as const;

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();
  const contactModal = useContactModal();

  if (!pathname) {
    throw new Error('Pathname is required for navigation');
  }

  const mainItems = mainLinks.map((link) => {
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
          }}
        >
          {link.label}
          {isActive && (
            <Box
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                borderRadius: '1px',
              }}
            />
          )}
        </Anchor>
      </motion.div>
    );
  });

  const socialItems = socialLinks.map((social) => (
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
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'var(--mantine-color-gray-3)',
          transition: 'all 0.2s ease',
        }}
      >
        <social.Icon size={18} />
      </ActionIcon>
    </motion.div>
  ));

  const ctaButton = (
    <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
      <Button 
        onClick={() => {
          close();
          contactModal.openModal();
        }}
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
            zIndex: 600, // Verhoogd naar 600 om boven drawer overlay te komen
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
                    zIndex: 700, // Zorg dat burger button boven alles staat
                  }}
                />
              </motion.div>
            </Group>
          </Container>
          
          {/* Mobile Drawer met aangepaste z-index */}
          <Drawer
            opened={opened}
            onClose={close}
            title="Navigatie"
            padding="lg"
            size="xs"
            hiddenFrom="sm"
            position="right"
            zIndex={550} // Lager dan header maar hoger dan content
            overlayProps={{
              backgroundOpacity: 0.5,
              blur: 2,
            }}
            styles={{
              root: {
                zIndex: 550,
              },
              overlay: {
                zIndex: 540,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(2px)',
              },
              content: {
                zIndex: 550,
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              header: {
                background: 'transparent',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              },
              close: {
                color: 'var(--mantine-color-gray-3)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            }}
          >
            <Stack gap="lg">
              {/* Navigation Links */}
              <Box>
                <Text size="sm" c="dimmed" tt="uppercase" fw={600} mb="sm">
                  Pagina's
                </Text>
                <Stack gap="xs">
                  {mainLinks.map((link) => {
                    const isActive = pathname === link.link || (link.link !== '/' && pathname.startsWith(link.link));
                    return (
                      <Box
                        key={`mobile-${link.label}`}
                        component={Link}
                        href={link.link}
                        onClick={close}
                        style={{
                          display: 'block',
                          padding: rem(16),
                          borderRadius: rem(8),
                          textDecoration: 'none',
                          background: isActive 
                            ? 'rgba(59, 130, 246, 0.1)'
                            : 'transparent',
                          border: isActive 
                            ? '1px solid rgba(59, 130, 246, 0.3)'
                            : '1px solid transparent',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Text
                          size="lg"
                          fw={isActive ? 600 : 500}
                          c={isActive ? 'blue.4' : 'gray.2'}
                        >
                          {link.label}
                        </Text>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>

              <Divider />

              {/* CTA Button */}
              <Box>
                <Text size="sm" c="dimmed" tt="uppercase" fw={600} mb="sm">
                  Contact
                </Text>
                <Button 
                  onClick={() => {
                    close();
                    contactModal.openModal();
                  }}
                  variant="gradient"
                  gradient={{ from: 'blue.6', to: 'cyan.5' }}
                  size="lg"
                  fullWidth
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    fontWeight: 600,
                  }}
                >
                  Neem Contact Op
                </Button>
              </Box>

              <Divider />

              {/* Social Links */}
              <Box>
                <Text size="sm" c="dimmed" tt="uppercase" fw={600} mb="sm">
                  Volg mij
                </Text>
                <Group justify="center" gap="md">
                  {socialLinks.map((social) => (
                    <ActionIcon
                      key={`mobile-social-${social.label}`}
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="subtle"
                      size="xl"
                      aria-label={social.label}
                      onClick={close}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'var(--mantine-color-gray-3)',
                      }}
                    >
                      <social.Icon size={20} />
                    </ActionIcon>
                  ))}
                </Group>
              </Box>
            </Stack>
          </Drawer>
        </Box>
      </motion.div>

      {/* Contact Modal */}
      <ContactModal
        opened={contactModal.opened}
        onClose={contactModal.closeModal}
        selectedPlan={contactModal.selectedPlan}
        title="Neem Contact Op"
        description="Heb je een vraag, opmerking of wil je samenwerken? Vul het onderstaande formulier in en ik neem zo snel mogelijk contact met je op."
      />
    </LayoutErrorBoundary>
  );
} 
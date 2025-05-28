'use client';

import React from 'react';
import { NavLink, Button, Stack, Text, Box, Group } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  IconGauge,
  IconClipboardList,
  IconFileText,
  IconMessages,
  IconUser,
  IconLogout,
  IconMail,
  IconSettings,
} from '@tabler/icons-react';
import { logoutUser } from '@/lib/actions/auth';
import AdminErrorBoundary from './AdminErrorBoundary';

const navLinks = [
  { icon: IconGauge, label: 'Dashboard', href: '/admin_area/dashboard' },
  { icon: IconClipboardList, label: 'Projecten', href: '/admin_area/projects' },
  { icon: IconFileText, label: 'Posts', href: '/admin_area/posts' },
  { icon: IconMessages, label: 'Contact Berichten', href: '/admin_area/contacts' },
  { icon: IconUser, label: 'About Content', href: '/admin_area/about' },
  { icon: IconMail, label: 'Email Test', href: '/admin_area/email-test' },
  { icon: IconSettings, label: 'Site Instellingen', href: '/admin_area/settings' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
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

const linkVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.98 },
} as const;

interface AdminNavbarProps {
  onNavigate?: () => void;
}

export default function AdminNavbar({ onNavigate }: AdminNavbarProps) {
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

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <AdminErrorBoundary componentName="Admin Navigation">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ height: '100%' }}
      >
        <Stack justify="space-between" style={{ height: '100%' }}>
          {/* Navigation Links */}
          <Box>
            <motion.div variants={itemVariants}>
              <Text 
                size="sm" 
                c="gray.4" 
                tt="uppercase" 
                fw={600}
                style={{
                  letterSpacing: '0.5px',
                  WebkitFontSmoothing: 'antialiased',
                  fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                }}
              >
                Navigatie
              </Text>
            </motion.div>
            
            <Stack style={{ gap: 'clamp(4px, 1vw, 8px)' }}>
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <motion.div 
                    key={link.label} 
                    variants={itemVariants}
                  >
                    <Box
                      component={Link}
                      href={link.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
                        borderRadius: 'clamp(6px, 1.5vw, 8px)',
                        textDecoration: 'none',
                        background: isActive 
                          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)'
                          : 'transparent',
                        border: isActive 
                          ? '1px solid rgba(59, 130, 246, 0.3)'
                          : '1px solid transparent',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: 'clamp(44px, 8vw, 48px)', // Touch target
                      }}
                      onClick={(e) => {
                        if (!link.href) {
                          e.preventDefault();
                          console.error('Invalid navigation link:', link);
                        } else {
                          handleNavClick();
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'transparent';
                        }
                      }}
                    >
                      <Group gap="md" wrap="nowrap" style={{ gap: 'clamp(8px, 2vw, 12px)' }}>
                        <Box
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 'clamp(28px, 6vw, 32px)',
                            height: 'clamp(28px, 6vw, 32px)',
                            borderRadius: 'clamp(4px, 1vw, 6px)',
                            background: isActive 
                              ? 'linear-gradient(135deg, var(--mantine-color-blue-5), var(--mantine-color-cyan-5))'
                              : 'rgba(255, 255, 255, 0.05)',
                            color: isActive ? 'white' : 'var(--mantine-color-gray-4)',
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                          }}
                        >
                          <link.icon size={16} stroke={1.5} />
                        </Box>
                        <Text
                          size="sm"
                          fw={isActive ? 600 : 500}
                          c={isActive ? 'blue.3' : 'gray.2'}
                          style={{
                            transition: 'color 0.2s ease',
                            WebkitFontSmoothing: 'antialiased',
                            fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                            lineHeight: 1.4,
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          {link.label}
                        </Text>
                      </Group>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <Box
                          style={{
                            position: 'absolute',
                            right: 'clamp(6px, 1.5vw, 8px)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 'clamp(2px, 0.5vw, 3px)',
                            height: 'clamp(16px, 4vw, 20px)',
                            background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                            borderRadius: 'clamp(1px, 0.25vw, 2px)',
                          }}
                        />
                      )}
                    </Box>
                  </motion.div>
                );
              })}
            </Stack>
          </Box>

          {/* Logout Section */}
          <Box>
            <motion.div variants={itemVariants}>
              <Text 
                size="sm" 
                c="gray.4" 
                tt="uppercase" 
                fw={600}
                style={{
                  letterSpacing: '0.5px',
                  WebkitFontSmoothing: 'antialiased',
                  fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                }}
              >
                Account
              </Text>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <form action={handleLogout}>
                <Button
                  type="submit"
                  variant="gradient"
                  gradient={{ from: 'red.6', to: 'red.7' }}
                  fullWidth
                  leftSection={<IconLogout size={16} stroke={1.5} />}
                  style={{
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.25)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    minHeight: 'clamp(44px, 8vw, 48px)',
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                    borderRadius: 'clamp(6px, 1.5vw, 8px)',
                    padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 20px)',
                  }}
                  styles={{
                    root: {
                      '&:hover': {
                        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      },
                    },
                  }}
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
            </motion.div>
          </Box>
        </Stack>
      </motion.div>
    </AdminErrorBoundary>
  );
} 
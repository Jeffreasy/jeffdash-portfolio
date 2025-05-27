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
                mb="md"
                style={{
                  letterSpacing: '0.5px',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                Navigatie
              </Text>
            </motion.div>
            
            <Stack gap="xs">
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
                        display: 'block',
                        padding: '12px 16px',
                        borderRadius: '8px',
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
                      <Group gap="md" wrap="nowrap">
                        <Box
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: isActive 
                              ? 'linear-gradient(135deg, var(--mantine-color-blue-5), var(--mantine-color-cyan-5))'
                              : 'rgba(255, 255, 255, 0.05)',
                            color: isActive ? 'white' : 'var(--mantine-color-gray-4)',
                            transition: 'all 0.2s ease',
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
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '3px',
                            height: '20px',
                            background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                            borderRadius: '2px',
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
                mb="md"
                style={{
                  letterSpacing: '0.5px',
                  WebkitFontSmoothing: 'antialiased',
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
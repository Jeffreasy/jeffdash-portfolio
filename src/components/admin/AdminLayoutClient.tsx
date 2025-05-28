'use client'; // Maak hier een Client Component van

import React, { useEffect, useState } from 'react';
import { AppShell, Group, Title, Text, Box, Loader, Center, Burger } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useDisclosure } from '@mantine/hooks';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminErrorBoundary from './AdminErrorBoundary';

// Animation variants
const layoutVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const headerVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const contentVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [opened, { toggle, close }] = useDisclosure(); // Voor mobiele navbar toggle

  useEffect(() => {
    console.log('AdminLayoutClient mounted');
    // Simulate loading time for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Validate children prop
  if (children === undefined) {
    throw new Error('AdminLayoutClient requires children to be provided');
  }

  if (isLoading) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 25, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <Center>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(12px, 3vw, 16px)',
              padding: 'clamp(16px, 4vw, 32px)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              maxWidth: 'clamp(280px, 85vw, 400px)',
              width: '100%',
            }}
          >
            <Loader size="lg" color="blue.4" type="dots" />
            <Text 
              size="lg" 
              fw={600}
              style={{
                background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              Admin Panel Laden...
            </Text>
          </motion.div>
        </Center>
      </Box>
    );
  }

  console.log('AdminLayoutClient rendering layout');

  return (
    <AdminErrorBoundary componentName="Admin Layout">
      <motion.div
        variants={layoutVariants}
        initial="hidden"
        animate="visible"
      >
        <Box
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle background elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 'clamp(200px, 40vw, 300px)',
            height: 'clamp(200px, 40vw, 300px)',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: 'clamp(150px, 30vw, 250px)',
            height: 'clamp(150px, 30vw, 250px)',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }} />

          <AppShell
            navbar={{
              width: { base: 280, sm: 300 },
              breakpoint: 'sm',
              collapsed: { mobile: !opened },
            }}
            header={{
              height: { base: 60, sm: 70 },
            }}
            styles={{
              main: {
                background: 'transparent',
                minHeight: 'calc(100vh - 70px)',
                padding: 'clamp(12px, 3vw, 24px)',
              },
              navbar: {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: 'none',
                borderTop: 'none',
                borderBottom: 'none',
                padding: 'clamp(12px, 3vw, 24px)',
              },
              header: {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: 'none',
                borderRight: 'none',
                borderTop: 'none',
              },
            }}
          >
            <AppShell.Header>
              <motion.div variants={headerVariants}>
                <Group 
                  h="100%" 
                  justify="space-between"
                  style={{
                    padding: '0 clamp(12px, 3vw, 24px)',
                    height: '100%',
                  }}
                >
                  <Group style={{ gap: 'clamp(8px, 2vw, 12px)' }}>
                    <Burger
                      opened={opened}
                      onClick={toggle}
                      hiddenFrom="sm"
                      size="sm"
                      color="var(--mantine-color-gray-3)"
                      style={{
                        minWidth: 'clamp(32px, 6vw, 40px)',
                        minHeight: 'clamp(32px, 6vw, 40px)',
                      }}
                    />
                    <Title 
                      order={2}
                      style={{
                        background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                      }}
                    >
                      Admin Panel
                    </Title>
                  </Group>
                  
                  {/* Decorative element */}
                  <Box
                    style={{
                      width: 'clamp(32px, 6vw, 40px)',
                      height: 'clamp(32px, 6vw, 40px)',
                      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(10px)',
                    }}
                  />
                </Group>
              </motion.div>
            </AppShell.Header>

            <AppShell.Navbar>
              <AdminErrorBoundary componentName="Admin Navigation">
                <AdminNavbar onNavigate={close} />
              </AdminErrorBoundary>
            </AppShell.Navbar>

            <AppShell.Main>
              <motion.div variants={contentVariants}>
                <AdminErrorBoundary componentName="Admin Content">
                  <AnimatePresence mode="wait">
                    {children}
                  </AnimatePresence>
                </AdminErrorBoundary>
              </motion.div>
            </AppShell.Main>
          </AppShell>
        </Box>
      </motion.div>
    </AdminErrorBoundary>
  );
} 
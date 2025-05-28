'use client';

import React, { useEffect } from 'react';
import { Container, Title, Text, Box, Group, ThemeIcon, Stack, Button, Card } from '@mantine/core';
import { IconHammer, IconRocket, IconSparkles, IconArrowRight, IconClock } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Head from 'next/head';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const floatingAnimation = {
  y: [-10, 10, -10],
  rotate: [0, 5, -5, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export default function UnderConstructionPage() {
  // Disable right-click context menu during maintenance
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Website in Onderhoud - Jeffrey Lavente</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Website tijdelijk in onderhoud. Komt binnenkort terug online." />
      </Head>
      
      <Box
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--mantine-color-dark-8) 0%, var(--mantine-color-dark-7) 100%)',
          userSelect: 'none', // Prevent text selection
        }}
      >
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: 'clamp(200px, 30vw, 400px)',
            height: 'clamp(200px, 30vw, 400px)',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: 'clamp(150px, 25vw, 300px)',
            height: 'clamp(150px, 25vw, 300px)',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <Container 
          size="md" 
          style={{ 
            position: 'relative', 
            zIndex: 1,
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Stack gap="xl" align="center" ta="center">
              {/* Main Icon */}
              <motion.div variants={itemVariants}>
                <motion.div 
                  animate={floatingAnimation}
                >
                  <ThemeIcon
                    size="xl"
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'blue.6', to: 'cyan.5' }}
                    style={{
                      width: 'clamp(80px, 15vw, 120px)',
                      height: 'clamp(80px, 15vw, 120px)',
                      boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
                      border: '2px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <IconHammer size={50} />
                  </ThemeIcon>
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.div variants={itemVariants}>
                <Title
                  order={1}
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontSize: 'clamp(2rem, 6vw, 4rem)',
                    fontWeight: 900,
                    marginBottom: 'clamp(8px, 2vw, 16px)',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textAlign: 'center',
                  }}
                >
                  Website in Onderhoud
                </Title>
              </motion.div>

              {/* Subtitle */}
              <motion.div variants={itemVariants}>
                <Text
                  size="xl"
                  c="gray.3"
                  style={{
                    fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    margin: '0 auto',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  }}
                >
                  We werken hard aan het verbeteren van je ervaring. 
                  De website komt binnenkort terug online met geweldige nieuwe features!
                </Text>
              </motion.div>

              {/* Features Cards */}
              <motion.div variants={itemVariants}>
                <Group gap="lg" justify="center" style={{ marginTop: 'clamp(24px, 5vw, 48px)' }} wrap="wrap">
                  <Card
                    shadow="xl"
                    padding="lg"
                    radius="lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      minWidth: 'clamp(200px, 40vw, 250px)',
                      textAlign: 'center',
                    }}
                  >
                    <Stack gap="sm" align="center">
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'violet.6', to: 'purple.5' }}
                        style={{ minHeight: '48px', minWidth: '48px' }}
                      >
                        <IconRocket size={24} />
                      </ThemeIcon>
                      <Text fw={600} c="gray.1" size="sm">
                        Nieuwe Features
                      </Text>
                      <Text size="xs" c="gray.4">
                        Verbeterde functionaliteit
                      </Text>
                    </Stack>
                  </Card>

                  <Card
                    shadow="xl"
                    padding="lg"
                    radius="lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      minWidth: 'clamp(200px, 40vw, 250px)',
                      textAlign: 'center',
                    }}
                  >
                    <Stack gap="sm" align="center">
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'orange.6', to: 'yellow.5' }}
                        style={{ minHeight: '48px', minWidth: '48px' }}
                      >
                        <IconSparkles size={24} />
                      </ThemeIcon>
                      <Text fw={600} c="gray.1" size="sm">
                        Beter Design
                      </Text>
                      <Text size="xs" c="gray.4">
                        Moderne gebruikerservaring
                      </Text>
                    </Stack>
                  </Card>
                </Group>
              </motion.div>

              {/* Status */}
              <motion.div variants={itemVariants}>
                <Card
                  shadow="lg"
                  padding="md"
                  radius="md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    backdropFilter: 'blur(10px)',
                    marginTop: 'clamp(16px, 3vw, 32px)',
                  }}
                >
                  <Group gap="sm" justify="center" wrap="wrap">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <IconClock size={20} style={{ color: 'var(--mantine-color-green-4)' }} />
                    </motion.div>
                    <Text fw={600} c="green.3" size="sm">
                      Verwachte online tijd: Binnenkort
                    </Text>
                  </Group>
                </Card>
              </motion.div>

              {/* Contact Info */}
              <motion.div variants={itemVariants}>
                <Text
                  size="sm"
                  c="gray.5"
                  style={{
                    marginTop: 'clamp(24px, 4vw, 48px)',
                    fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                  }}
                >
                  Voor dringende zaken kun je contact opnemen via{' '}
                  <Text
                    component="a"
                    href="mailto:contact@jeffreylav.nl"
                    style={{
                      color: 'var(--mantine-color-blue-4)',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    contact@jeffdash.com
                  </Text>
                </Text>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </>
  );
} 
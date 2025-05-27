"use client"; // Behoud dit als je de Next.js App Router gebruikt

import React, { useState, useEffect } from 'react';
import { Title, Text, Button, Container, Box, Group, Stack } from '@mantine/core';
import { IconArrowRight, IconCode, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import PageErrorBoundary from '../shared/PageErrorBoundary';
// Optioneel: importeer een CSS-module voor meer geavanceerde stijlen of animaties
// import classes from './HeroSection.module.css';

// Animatie varianten voor de container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
} as const;

// Animatie varianten voor text elementen
const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

// Animatie varianten voor buttons
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
  },
} as const;

// Typing effect hook
const useTypingEffect = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
};

const HeroSection: React.FC = () => {
  const titleId = "hero-title";
  
  // Typing effect voor de naam
  const typedName = useTypingEffect("Jeffrey", 150);
  
  return (
    <PageErrorBoundary>
      <Box
        component="section"
        aria-labelledby={titleId}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: `
            linear-gradient(180deg, 
              transparent 0%, 
              rgba(0, 0, 0, 0.2) 15%, 
              rgba(15, 23, 42, 0.95) 25%, 
              rgba(15, 23, 42, 0.95) 75%, 
              rgba(0, 0, 0, 0.2) 85%, 
              transparent 100%
            )
          `,
        }}
      >
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Stack align="center" gap="xl">
              {/* Greeting */}
              <motion.div variants={textVariants}>
                <Group gap="xs" justify="center">
                  <IconSparkles size={20} style={{ color: 'var(--mantine-color-yellow-4)' }} />
                  <Text size="sm" c="dimmed" tt="uppercase" fw={600} lts={1}>
                    Welkom bij mijn portfolio
                  </Text>
                </Group>
              </motion.div>

              {/* Main Title with typing effect */}
              <motion.div variants={textVariants}>
                <Title
                  id={titleId}
                  order={1}
                  ta="center"
                  style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: 'var(--mantine-spacing-md)',
                  }}
                >
                  <Text
                    component="span"
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    {typedName}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ color: 'var(--mantine-color-blue-4)' }}
                    >
                      |
                    </motion.span>
                  </Text>
                </Title>
              </motion.div>

              {/* Subtitle */}
              <motion.div variants={textVariants}>
                <Stack align="center" gap="sm">
                  <Group gap="xs" justify="center">
                    <IconCode size={24} style={{ color: 'var(--mantine-color-blue-4)' }} />
                    <Title order={2} size="h1" c="gray.2" ta="center">
                      Full-Stack Developer & AI Explorer
                    </Title>
                  </Group>
                  
                  <Text
                    ta="center"
                    c="gray.4"
                    size="xl"
                    maw={600}
                    style={{
                      fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                      lineHeight: 1.6,
                    }}
                  >
                    Gepassioneerd door moderne webtechnologieën. Ik verken het volledige spectrum van 
                    <Text component="span" fw={600} c="cyan.4"> full-stack development</Text>, 
                    ondersteund door <Text component="span" fw={600} c="blue.4">AI (Vibecoding)</Text>, 
                    om innovatieve en complete webapplicaties te realiseren.
                  </Text>
                </Stack>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={textVariants}>
                <Group gap="lg" justify="center" mt="xl">
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <Button
                      component="a"
                      href="mailto:jeffrey@jeffdash.nl?subject=Portfolio Interesse&body=Hallo Jeffrey,%0D%0A%0D%0AIk ben geïnteresseerd in je werk en zou graag meer willen weten over je projecten.%0D%0A%0D%0AMet vriendelijke groet"
                      size="xl"
                      radius="md"
                      variant="gradient"
                      gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      rightSection={
                        <motion.div
                          animate={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <IconArrowRight size={20} />
                        </motion.div>
                      }
                      style={{
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        fontWeight: 600,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      styles={{
                        root: {
                          '&:hover': {
                            boxShadow: '0 12px 40px rgba(59, 130, 246, 0.5)',
                            transform: 'translateY(-2px)',
                            background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6)',
                            backgroundSize: '200% 200%',
                            animation: 'gradient-shift 2s ease infinite',
                            border: '1px solid rgba(139, 92, 246, 0.4)',
                          },
                          '&:active': {
                            transform: 'translateY(0px)',
                            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                            transition: 'left 0.5s ease',
                          },
                          '&:hover::before': {
                            left: '100%',
                          }
                        }
                      }}
                    >
                      Bekijk Mijn Werk
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <Button
                      component="a"
                      href="mailto:jeffrey@jeffdash.nl?subject=Contact Aanvraag&body=Hallo Jeffrey,%0D%0A%0D%0AIk zou graag contact met je opnemen.%0D%0A%0D%0AMet vriendelijke groet"
                      size="xl"
                      radius="md"
                      variant="outline"
                      color="gray"
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'var(--mantine-color-gray-2)',
                        fontWeight: 600,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      styles={{
                        root: {
                          '&:hover': {
                            borderColor: 'rgba(6, 182, 212, 0.4)',
                            color: 'var(--mantine-color-gray-1)',
                            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))',
                            boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
                            transform: 'translateY(-2px)',
                          },
                          '&:active': {
                            transform: 'translateY(0px)',
                            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.2)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                            transition: 'left 0.5s ease',
                          },
                          '&:hover::before': {
                            left: '100%',
                          }
                        }
                      }}
                    >
                      Neem Contact Op
                    </Button>
                  </motion.div>
                </Group>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                variants={textVariants}
                style={{ marginTop: 'var(--mantine-spacing-3xl)' }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Text size="sm" c="dimmed" ta="center">
                    Scroll naar beneden om meer te ontdekken
                  </Text>
                  <Box
                    style={{
                      width: '1px',
                      height: '40px',
                      background: 'linear-gradient(to bottom, var(--mantine-color-gray-6), transparent)',
                      margin: '0 auto',
                      marginTop: 'var(--mantine-spacing-xs)',
                    }}
                  />
                </motion.div>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </PageErrorBoundary>
  );
};

export default HeroSection;
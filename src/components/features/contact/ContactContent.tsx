'use client';

import React from 'react';
import { Container, Title, Text, Paper, Box, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';
import PageErrorBoundary from '../shared/PageErrorBoundary';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

export default function ContactContent() {
  return (
    <PageErrorBoundary>
      <Box
        component="section"
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 'var(--mantine-spacing-xl)',
          paddingBottom: 'var(--mantine-spacing-xl)',
        }}
      >
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '25%',
            left: '15%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 25, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '65%',
            right: '10%',
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
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        <Container size="sm" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div variants={itemVariants}>
              <Paper 
                shadow="xl" 
                p={{ base: "xl", md: "3xl" }}
                radius="xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle decorative element */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '60px',
                  height: '60px',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(15px)',
                  pointerEvents: 'none',
                }} />

                <Stack gap="xl">
                  <motion.div variants={itemVariants}>
                    <Title 
                      order={1} 
                      ta="center"
                      style={{
                        background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 900,
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility',
                      }}
                    >
                      Neem Contact Op
                    </Title>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Text 
                      c="gray.3" 
                      ta="center" 
                      size="lg"
                      style={{
                        lineHeight: 1.6,
                        fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility',
                      }}
                    >
                      Heb je een vraag, opmerking of wil je samenwerken? Vul het onderstaande formulier in en ik neem zo snel mogelijk contact met je op.
                    </Text>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <ContactForm />
                  </motion.div>
                </Stack>
              </Paper>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </PageErrorBoundary>
  );
} 
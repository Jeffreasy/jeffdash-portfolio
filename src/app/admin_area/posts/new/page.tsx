'use client';

import React from 'react';
import { Container, Title, Box, Group, ThemeIcon, Text, Stack } from '@mantine/core';
import { IconPlus, IconFileText, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import PostForm from '@/components/admin/PostForm';
import { createPostAction } from '@/lib/actions/blog';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

export default function NewPostPage() {
  return (
    <AdminErrorBoundary componentName="New Post Page">
      <Box
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 'clamp(200px, 30vw, 300px)',
            height: 'clamp(200px, 30vw, 300px)',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: 'clamp(150px, 25vw, 200px)',
            height: 'clamp(150px, 25vw, 200px)',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <Container 
          size="lg" 
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
            <Stack gap="xl" py="xl">
              {/* Enhanced Header */}
              <motion.div variants={itemVariants}>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'clamp(12px, 3vw, 16px)',
                    padding: 'clamp(16px, 4vw, 24px)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Header decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: 'clamp(80px, 20vw, 120px)',
                    height: 'clamp(80px, 20vw, 120px)',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(25px)',
                    pointerEvents: 'none',
                  }} />

                  <Group gap="lg" style={{ position: 'relative', zIndex: 1 }} wrap="wrap">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <ThemeIcon
                        size="xl"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'violet.6', to: 'purple.5' }}
                        style={{
                          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          minHeight: '48px',
                          minWidth: '48px',
                        }}
                      >
                        <IconPlus size={28} />
                      </ThemeIcon>
                    </motion.div>
                    
                    <Box style={{ flex: 1, minWidth: '250px' }}>
                      <Group gap="xs" mb="xs" wrap="wrap">
                        <Title 
                          order={1}
                          style={{
                            background: 'linear-gradient(135deg, var(--mantine-color-violet-4), var(--mantine-color-purple-4))',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                            fontWeight: 900,
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                          }}
                        >
                          Nieuwe Blogpost Schrijven
                        </Title>
                        <motion.div
                          animate={{ 
                            rotate: [0, 15, -15, 0],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            delay: 0.5
                          }}
                        >
                          <IconSparkles 
                            size={24} 
                            style={{ 
                              color: 'var(--mantine-color-yellow-4)',
                              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))'
                            }} 
                          />
                        </motion.div>
                      </Group>
                      
                      <Text 
                        size="lg" 
                        c="gray.3"
                        style={{
                          fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                          lineHeight: 1.6,
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                        }}
                      >
                        Deel je kennis en ervaringen met de wereld. Schrijf een nieuwe blogpost 
                        en inspireer anderen met je verhaal en expertise.
                      </Text>
                    </Box>
                  </Group>
                </Box>
              </motion.div>

              {/* Post Form */}
              <motion.div variants={itemVariants}>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'clamp(8px, 2vw, 12px)',
                    padding: 'clamp(16px, 4vw, 24px)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Form decorative element */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: 'clamp(80px, 20vw, 120px)',
                    height: 'clamp(80px, 20vw, 120px)',
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(25px)',
                    pointerEvents: 'none',
                  }} />

                  <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
                    <Group gap="md" wrap="wrap">
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'purple.6', to: 'violet.5' }}
                        style={{
                          minHeight: '44px',
                          minWidth: '44px',
                        }}
                      >
                        <IconFileText size={20} />
                      </ThemeIcon>
                      <Box style={{ flex: 1, minWidth: '200px' }}>
                        <Title 
                          order={2} 
                          c="gray.1" 
                          size="h3"
                          style={{
                            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                            marginBottom: 'clamp(4px, 1vw, 8px)',
                          }}
                        >
                          Blog Details
                        </Title>
                        <Text 
                          size="sm" 
                          c="gray.4"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                            lineHeight: 1.4,
                          }}
                        >
                          Vul alle vereiste informatie in voor je nieuwe blogpost
                        </Text>
                      </Box>
                    </Group>
                    
                    <PostForm 
                      action={createPostAction}
                      formTitle="Nieuwe Blogpost Aanmaken"
                    />
                  </Stack>
                </Box>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </AdminErrorBoundary>
  );
} 
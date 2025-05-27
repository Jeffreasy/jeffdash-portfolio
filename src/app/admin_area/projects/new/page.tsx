'use client';

import React from 'react';
import { Container, Title, Box, Group, ThemeIcon, Text, Stack } from '@mantine/core';
import { IconPlus, IconFolder, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import ProjectForm from '@/components/admin/ProjectForm';
import { createProjectAction } from '@/lib/actions/projects';
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

export default function NewProjectPage() {
  return (
    <AdminErrorBoundary componentName="New Project Page">
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
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
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
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%)',
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

        <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
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
                    borderRadius: '16px',
                    padding: 'var(--mantine-spacing-xl)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Header decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(25px)',
                    pointerEvents: 'none',
                  }} />

                  <Group gap="lg" style={{ position: 'relative', zIndex: 1 }}>
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
                        gradient={{ from: 'green.6', to: 'teal.5' }}
                        style={{
                          boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                        }}
                      >
                        <IconPlus size={28} />
                      </ThemeIcon>
                    </motion.div>
                    
                    <Box style={{ flex: 1 }}>
                      <Group gap="xs" mb="xs">
                        <Title 
                          order={1}
                          style={{
                            background: 'linear-gradient(135deg, var(--mantine-color-green-4), var(--mantine-color-teal-4))',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                            fontWeight: 900,
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                          }}
                        >
                          Nieuw Project Aanmaken
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
                          fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                          lineHeight: 1.6,
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                        }}
                      >
                        Voeg een nieuw project toe aan je portfolio. Vul alle vereiste velden in om je werk professioneel te presenteren.
                      </Text>
                      
                      <Group gap="md" mt="sm">
                        <Box
                          style={{
                            padding: '8px 12px',
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '6px',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Group gap="xs">
                            <IconFolder size={14} style={{ color: 'var(--mantine-color-green-4)' }} />
                            <Text size="xs" fw={600} c="green.3">
                              Portfolio Project
                            </Text>
                          </Group>
                        </Box>
                        
                        <Box
                          style={{
                            padding: '8px 12px',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '6px',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Group gap="xs">
                            <IconSparkles size={14} style={{ color: 'var(--mantine-color-blue-4)' }} />
                            <Text size="xs" fw={600} c="blue.3">
                              Nieuw
                            </Text>
                          </Group>
                        </Box>
                      </Group>
                    </Box>
                  </Group>
                </Box>
              </motion.div>

              {/* Project Form */}
              <motion.div variants={itemVariants}>
                <ProjectForm 
                  action={createProjectAction} 
                  submitButtonLabel="Project Aanmaken" 
                />
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </AdminErrorBoundary>
  );
} 
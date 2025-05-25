'use client';

import React from 'react';
import { Container, Stack, Center, Loader, Text, Box } from '@mantine/core';
import { motion } from 'framer-motion';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Custom loading bar component
const LoadingBar = ({ width = "100%", height = 50, delay = 0 }: { width?: string; height?: number; delay?: number }) => (
  <motion.div
    style={{
      width,
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 'var(--mantine-radius-md)',
      position: 'relative',
      overflow: 'hidden',
    }}
    animate={{ opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3), transparent)',
        borderRadius: 'inherit',
      }}
      animate={{
        left: ['−100%', '100%'],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay + 0.5,
      }}
    />
  </motion.div>
);

export default function Loading() {
  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
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
          top: '60%',
          right: '15%',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '25%',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(35px)',
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <Container size="sm" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--mantine-radius-lg)',
              padding: 'var(--mantine-spacing-xl)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            <Stack gap="xl" align="center">
              {/* Main loader with glassmorphism effect */}
              <motion.div variants={itemVariants}>
                <Center>
                  <Stack gap="md" align="center">
                    <motion.div
                      variants={pulseVariants}
                      animate="pulse"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
                        border: '2px solid rgba(59, 130, 246, 0.3)',
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      <Loader 
                        size="lg" 
                        color="blue.4"
                        type="dots"
                      />
                    </motion.div>
                    
                    <Text 
                      size="lg" 
                      fw={600}
                      ta="center"
                      style={{
                        background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility',
                      }}
                    >
                      Portfolio wordt geladen...
                    </Text>
                    
                    <Text 
                      size="xs" 
                      c="gray.4"
                      ta="center"
                      style={{
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                      }}
                    >
                      Ervaar de kracht van moderne webtechnologie
                    </Text>
                  </Stack>
                </Center>
              </motion.div>
              
              {/* Custom loading bars with glassmorphism */}
              <Stack gap="sm" style={{ width: '100%' }}>
                <motion.div variants={itemVariants}>
                  <LoadingBar width="75%" height={40} delay={0} />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <LoadingBar width="100%" height={120} delay={0.3} />
                </motion.div>
                
                <Stack gap="xs">
                  {[
                    { width: "90%", delay: 0.6 },
                    { width: "80%", delay: 0.8 },
                    { width: "85%", delay: 1.0 }
                  ].map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <LoadingBar 
                        width={item.width} 
                        height={20} 
                        delay={item.delay} 
                      />
                    </motion.div>
                  ))}
                </Stack>
                
                {/* Progress dots */}
                <motion.div variants={itemVariants}>
                  <Center style={{ marginTop: 'var(--mantine-spacing-sm)' }}>
                    <Stack gap="xs" align="center">
                      <motion.div
                        style={{
                          display: 'flex',
                          gap: '6px',
                        }}
                      >
                        {[0, 1, 2].map((index) => (
                          <motion.div
                            key={index}
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                            }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: index * 0.2,
                            }}
                          />
                        ))}
                      </motion.div>
                      <Text size="xs" c="gray.5" ta="center">
                        Optimale prestaties worden geladen...
                      </Text>
                    </Stack>
                  </Center>
                </motion.div>
              </Stack>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
} 
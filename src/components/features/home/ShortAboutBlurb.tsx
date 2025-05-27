'use client'; // Markeer als Client Component

import React, { memo } from 'react';
import { Text, Button, Container, Title, Group, Grid, Paper, Stack, Box } from '@mantine/core';
import Link from 'next/link'; // Gebruik Next.js Link voor navigatie
import NextImage from 'next/image'; // Importeer next/image
import { motion } from 'framer-motion';
import { IconArrowRight, IconUser } from '@tabler/icons-react';
import PageErrorBoundary from '../shared/PageErrorBoundary';

// Definieer de props interface
interface ShortAboutBlurbProps {
  profileImageUrl?: string;
  profileImageAlt?: string;
}

// Animatie varianten voor de container
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
} as const;

// Animatie varianten voor child elementen
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

// Animatie varianten voor de afbeelding
const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
} as const;

// Geoptimaliseerde ShortAboutContent zonder memo problemen
const ShortAboutContent = memo<{
  profileImageUrl?: string;
  profileImageAlt?: string;
}>(({ profileImageUrl, profileImageAlt }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <Container size="lg" py={{ base: "xl", md: "3xl" }}>
      {/* Titel sectie */}
      <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 'var(--mantine-spacing-3xl)' }}>
        <Title 
          order={2} 
          size="h1"
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: 'var(--mantine-spacing-md)',
            fontWeight: 700,
          }}
        >
          Over Mij
        </Title>
        <Text size="lg" c="gray.4" maw={600} mx="auto">
          Een korte kennismaking met mijn passie voor development
        </Text>
      </motion.div>

      {/* Content Grid */}
      <Grid gutter="3xl" align="center">
        {/* Afbeelding Kolom */}
        {profileImageUrl && (
          <Grid.Col span={{ base: 12, md: 5 }}>
            <motion.div variants={itemVariants}>
              <Box 
                style={{ 
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Decoratieve achtergrond */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '280px',
                    height: '280px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))',
                    borderRadius: '50%',
                    zIndex: 0,
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                {/* Profiel afbeelding */}
                <motion.div
                  variants={imageVariants}
                  whileHover="hover"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid rgba(255, 255, 255, 0.1)',
                    background: 'var(--mantine-color-dark-6)',
                    cursor: 'pointer',
                  }}
                >
                  <NextImage
                    src={profileImageUrl}
                    alt={profileImageAlt || 'Profielfoto van Jeffrey'}
                    width={200}
                    height={200}
                    quality={90}
                    loading="lazy"
                    sizes="(max-width: 768px) 150px, 200px"
                    style={{
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </motion.div>
              </Box>
            </motion.div>
          </Grid.Col>
        )}

        {/* Tekst Kolom */}
        <Grid.Col span={{ base: 12, md: profileImageUrl ? 7 : 12 }}>
          <motion.div variants={itemVariants}>
            <Paper
              p="xl"
              radius="lg"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Stack gap="lg">
                <motion.div variants={itemVariants}>
                  <Text 
                    size="lg" 
                    lh={1.6}
                    style={{
                      fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                      color: 'var(--mantine-color-gray-2)',
                    }}
                  >
                    Naast mijn werk in de <Text component="span" fw={600} c="blue.4">zorg als begeleider</Text>, 
                    duik ik in mijn vrije tijd vol passie in de wereld van{' '}
                    <Text component="span" fw={600} c="cyan.4">web development</Text>. 
                    Ik focus op het volledige full-stack proces, vaak met hulp van AI-tools, 
                    om moderne applicaties te bouwen.
                  </Text>
                </motion.div>

                {/* Highlight items */}
                <motion.div variants={itemVariants}>
                  <Group gap="md" wrap="wrap">
                    {['React & Next.js', 'TypeScript', 'Full-Stack', 'AI Integration'].map((skill) => (
                      <motion.div
                        key={skill}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box
                          style={{
                            padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-sm)',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: 'var(--mantine-radius-md)',
                          }}
                        >
                          <Text size="sm" fw={500} c="blue.3">
                            {skill}
                          </Text>
                        </Box>
                      </motion.div>
                    ))}
                  </Group>
                </motion.div>

                {/* CTA */}
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
                    component={Link}
                    href="/about"
                    variant="gradient"
                    gradient={{ from: 'blue.6', to: 'cyan.5' }}
                    size="lg"
                    radius="md"
                    rightSection={
                      <motion.div
                        animate={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconArrowRight size={18} />
                      </motion.div>
                    }
                    style={{
                      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      marginTop: 'var(--mantine-spacing-md)',
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
                    Meer Over Mij
                  </Button>
                </motion.div>
              </Stack>
            </Paper>
          </motion.div>
        </Grid.Col>
      </Grid>
    </Container>
  </motion.div>
));

ShortAboutContent.displayName = 'ShortAboutContent';

/**
 * ShortAboutBlurb Component
 * Toont een beknopte introductie over Jeffrey
 * Met optionele profielfoto en call-to-action
 */
const ShortAboutBlurb: React.FC<ShortAboutBlurbProps> = ({ 
  profileImageUrl, 
  profileImageAlt 
}) => {
  return (
    <PageErrorBoundary>
      <section style={{
        position: 'relative',
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
        paddingTop: 'clamp(4rem, 8vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
      }}>
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '25%',
            left: '8%',
            width: '220px',
            height: '220px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 25, 0],
            y: [0, -25, 0],
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
            top: '65%',
            right: '12%',
            width: '160px',
            height: '160px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <ShortAboutContent 
            profileImageUrl={profileImageUrl}
            profileImageAlt={profileImageAlt}
          />
        </div>
      </section>
    </PageErrorBoundary>
  );
};

export default ShortAboutBlurb; 
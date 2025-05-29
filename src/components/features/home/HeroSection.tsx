"use client"; // Behoud dit als je de Next.js App Router gebruikt

import React, { useState, useEffect } from 'react';
import { Title, Text, Button, Container, Box, Group, Stack } from '@mantine/core';
import { IconArrowRight, IconCode, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PageErrorBoundary from '../shared/PageErrorBoundary';
import { ContactModal, useContactModal } from '@/components/features/contact';
import { useAnalytics } from '@/hooks/useAnalytics';
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
  const contactModal = useContactModal();
  const { trackEvent, trackPageView } = useAnalytics();
  
  // Typing effect voor de naam
  const typedName = useTypingEffect("Jeffrey", 150);
  
  // Track hero section view
  useEffect(() => {
    trackPageView('hero_section', {
      section: 'landing_page',
      typing_effect: 'enabled'
    });
  }, [trackPageView]);

  // Handle CTA button clicks
  const handleCtaClick = (buttonType: 'primary' | 'secondary') => {
    trackEvent('hero_cta_clicked', {
      button_type: buttonType,
      button_text: buttonType === 'primary' ? 'Bekijk Mijn Werk' : 'Neem Contact Op',
      section: 'hero'
    });
  };

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

        <Container size="lg" style={{ position: 'relative', zIndex: 1, padding: 'clamp(1rem, 3vw, 2rem)' }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Stack align="center" gap="clamp(1rem, 3vw, 3rem)">
              {/* Greeting */}
              <motion.div variants={textVariants}>
                <Group gap="xs" justify="center">
                  <IconSparkles size={20} style={{ color: 'var(--mantine-color-yellow-4)' }} />
                  <Text size="sm" c="dimmed" tt="uppercase" fw={600} lts={1}>
                    Welkom bij mijn portfolio
                  </Text>
                </Group>
              </motion.div>

              {/* Logo with professional styling */}
              <motion.div variants={textVariants}>
                <motion.div 
                  animate={{
                    y: [-3, 3, -3],
                    rotate: [0, 0.5, -0.5, 0],
                  }}
                  whileHover={{
                    scale: 1.08,
                    rotate: 2,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    filter: 'drop-shadow(0 15px 35px rgba(59, 130, 246, 0.3))',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    style={{
                      position: 'relative',
                      width: 'clamp(120px, 18vw, 200px)',
                      height: 'clamp(120px, 18vw, 200px)',
                      borderRadius: '50%',
                      background: `
                        linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.15) 0%, 
                          rgba(255, 255, 255, 0.08) 100%
                        )
                      `,
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(59, 130, 246, 0.2)',
                      boxShadow: `
                        0 25px 80px rgba(59, 130, 246, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `
                        linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.25) 0%, 
                          rgba(255, 255, 255, 0.15) 100%
                        )
                      `;
                      e.currentTarget.style.border = '2px solid rgba(59, 130, 246, 0.4)';
                      e.currentTarget.style.boxShadow = `
                        0 30px 100px rgba(59, 130, 246, 0.4),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        0 0 40px rgba(59, 130, 246, 0.3)
                      `;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `
                        linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.15) 0%, 
                          rgba(255, 255, 255, 0.08) 100%
                        )
                      `;
                      e.currentTarget.style.border = '2px solid rgba(59, 130, 246, 0.2)';
                      e.currentTarget.style.boxShadow = `
                        0 25px 80px rgba(59, 130, 246, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `;
                    }}
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        src="/logo.png"
                        alt="Jeffrey Lavente Portfolio Logo"
                        width={340}
                        height={340}
                        style={{
                          width: 'clamp(140px, 20vw, 245px)',
                          height: 'clamp(140px, 20vw, 245px)',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))',
                          transition: 'filter 0.3s ease',
                          transform: 'scale(1.0)',
                        }}
                        priority
                        onError={(e) => {
                          // Fallback to text if logo fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div style="
                                background: linear-gradient(135deg, #3b82f6, #06b6d4);
                                background-clip: text;
                                -webkit-background-clip: text;
                                color: transparent;
                                font-size: clamp(2.8rem, 6vw, 4.6rem);
                                font-weight: 900;
                                text-align: center;
                                line-height: 1;
                                letter-spacing: -0.02em;
                                transition: all 0.3s ease;
                              ">
                                JL
                              </div>
                            `;
                          }
                        }}
                      />
                    </motion.div>
                  </Box>
                </motion.div>
              </motion.div>

              {/* Main Title with typing effect */}
              <motion.div variants={textVariants}>
                <Title
                  id={titleId}
                  order={1}
                  ta="center"
                  style={{
                    fontSize: 'clamp(2.5rem, 7vw, 6rem)',
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
                    <Title order={2} size="h1" c="gray.2" ta="center" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                      Full-Stack Developer & AI Explorer
                    </Title>
                  </Group>
                  
                  <Text
                    ta="center"
                    c="gray.4"
                    size="xl"
                    maw={600}
                    style={{
                      fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                      lineHeight: 1.6,
                      padding: '0 1rem',
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
                <Group gap="lg" justify="center" mt="xl" style={{ flexWrap: 'wrap', padding: '0 1rem' }}>
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                    style={{ minWidth: '160px' }}
                  >
                    <Button
                      onClick={() => {
                        handleCtaClick('primary');
                        contactModal.openModal();
                      }}
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
                        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                        padding: 'clamp(12px, 2vw, 16px) clamp(20px, 4vw, 24px)',
                        height: 'auto',
                        minHeight: '48px',
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
                    style={{ minWidth: '160px' }}
                  >
                    <Button
                      onClick={() => {
                        handleCtaClick('secondary');
                        contactModal.openModal();
                      }}
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
                        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                        padding: 'clamp(12px, 2vw, 16px) clamp(20px, 4vw, 24px)',
                        height: 'auto',
                        minHeight: '48px',
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

      {/* Contact Modal */}
      <ContactModal
        opened={contactModal.opened}
        onClose={contactModal.closeModal}
        selectedPlan={contactModal.selectedPlan}
        title="Laten we samenwerken!"
        description="Geïnteresseerd in mijn werk? Vertel me meer over je project en laten we kijken hoe ik je kan helpen."
      />
    </PageErrorBoundary>
  );
};

export default HeroSection;
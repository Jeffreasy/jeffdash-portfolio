'use client';

import React, { useEffect } from 'react';
import { Container, Title, Text, Paper, Group, Button, Stack, Box } from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub, IconArrowRight, IconMail } from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PageErrorBoundary from '../shared/PageErrorBoundary';
import { useAnalytics } from '@/hooks/useAnalytics';

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



interface AboutContentProps {
  content: {
    about_title?: string;
    about_intro?: string;
    about_focus?: string;
    about_projects?: string;
    about_contact?: string;
    linkedin_url?: string;
    github_url?: string;
    profileImageUrl?: string;
    profileImageAlt?: string;
  };
}

export default function AboutContent({ content }: AboutContentProps) {
  const { trackEvent, trackPageView } = useAnalytics();
  
  const pageTitle = content.about_title || 'Over Mij';
  const introText = content.about_intro || 'Introductietekst niet gevonden.';
  const focusText = content.about_focus || '';
  const projectsText = content.about_projects || '';
  const contactText = content.about_contact || '';
  const linkedInUrl = content.linkedin_url || '#';
  const githubUrl = content.github_url || '#';
  const profileImageUrl = content.profileImageUrl;
  const profileImageAlt = content.profileImageAlt || 'Profielfoto';

  // Track page view
  useEffect(() => {
    trackPageView('page_load_complete', {
      page: 'about',
      page_title: pageTitle,
      has_profile_image: !!profileImageUrl,
      has_linkedin: linkedInUrl !== '#',
      has_github: githubUrl !== '#',
      has_intro_section: !!introText,
      has_focus_section: !!focusText,
      has_projects_section: !!projectsText,
      has_contact_section: !!contactText
    });
  }, [trackPageView, pageTitle, profileImageUrl, linkedInUrl, githubUrl, introText, focusText, projectsText, contactText]);

  // Handle profile image click
  const handleProfileImageClick = () => {
    trackEvent('navigation_clicked', {
      action: 'profile_image_click',
      element: 'about_profile_image',
      section: 'about_page',
      page: 'about'
    });
  };

  // Handle LinkedIn button click
  const handleLinkedInClick = () => {
    trackEvent('social_link_clicked', {
      platform: 'linkedin',
      element: 'about_linkedin_button',
      destination: linkedInUrl,
      section: 'about_page',
      page: 'about'
    });
  };

  // Handle GitHub button click
  const handleGitHubClick = () => {
    trackEvent('social_link_clicked', {
      platform: 'github',
      element: 'about_github_button',
      destination: githubUrl,
      section: 'about_page',
      page: 'about'
    });
  };

  // Handle contact button click
  const handleContactClick = () => {
    trackEvent('navigation_clicked', {
      action: 'contact_cta_click',
      element: 'about_contact_button',
      destination: '/contact',
      section: 'about_page',
      page: 'about'
    });
  };

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
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <Container size="md" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
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
                      {pageTitle}
                    </Title>
                  </motion.div>

                  {profileImageUrl && (
                    <motion.div variants={itemVariants}>
                      <Group justify="center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          onClick={handleProfileImageClick}
                          style={{
                            borderRadius: '50%',
                            padding: '4px',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3))',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{
                            borderRadius: '50%',
                            padding: '4px',
                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(15, 23, 42, 0.8))',
                          }}>
                            <Image
                              src={profileImageUrl}
                              alt={profileImageAlt}
                              width={150}
                              height={150}
                              quality={85}
                              priority
                              style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                        </motion.div>
                      </Group>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <Stack gap="lg">
                      <Text 
                        size="lg" 
                        c="gray.2"
                        ta="center"
                        style={{
                          lineHeight: 1.6,
                          fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale',
                          textRendering: 'optimizeLegibility',
                        }}
                      >
                        {introText}
                      </Text>
                      {focusText && (
                        <Text 
                          c="gray.3"
                          ta="center"
                          style={{
                            lineHeight: 1.6,
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                            textRendering: 'optimizeLegibility',
                          }}
                        >
                          {focusText}
                        </Text>
                      )}
                      {projectsText && (
                        <Text 
                          c="gray.3"
                          ta="center"
                          style={{
                            lineHeight: 1.6,
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                            textRendering: 'optimizeLegibility',
                          }}
                        >
                          {projectsText}
                        </Text>
                      )}
                      {contactText && (
                        <Text 
                          c="gray.3"
                          ta="center"
                          style={{
                            lineHeight: 1.6,
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                            textRendering: 'optimizeLegibility',
                          }}
                        >
                          {contactText}
                        </Text>
                      )}
                    </Stack>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Group justify="center" gap="lg" mt="md" wrap="wrap">
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
                          href={linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleLinkedInClick}
                          variant="gradient"
                          gradient={{ from: 'blue.6', to: 'cyan.5' }}
                          leftSection={<IconBrandLinkedin size={18} />}
                          rightSection={
                            <motion.div
                              animate={{ x: 0 }}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <IconArrowRight size={16} />
                            </motion.div>
                          }
                          disabled={linkedInUrl === '#'}
                          size="lg"
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
                          LinkedIn
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
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleGitHubClick}
                          variant="outline"
                          color="gray"
                          leftSection={<IconBrandGithub size={18} />}
                          rightSection={
                            <motion.div
                              animate={{ x: 0 }}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <IconArrowRight size={16} />
                            </motion.div>
                          }
                          disabled={githubUrl === '#'}
                          size="lg"
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
                                borderColor: 'rgba(139, 92, 246, 0.4)',
                                color: 'var(--mantine-color-gray-1)',
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                                transform: 'translateY(-2px)',
                              },
                              '&:active': {
                                transform: 'translateY(0px)',
                                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.2)',
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
                          GitHub
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
                          component={Link}
                          href="/contact"
                          onClick={handleContactClick}
                          variant="outline"
                          color="gray"
                          leftSection={<IconMail size={18} />}
                          rightSection={
                            <motion.div
                              animate={{ x: 0 }}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <IconArrowRight size={16} />
                            </motion.div>
                          }
                          size="lg"
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
                </Stack>
              </Paper>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </PageErrorBoundary>
  );
} 
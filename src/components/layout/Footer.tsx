'use client';

import React, { useEffect, useState } from 'react';
import { Container, Text, Group, Anchor, Box } from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub } from '@/components/icons';
import { motion } from 'framer-motion';
import LayoutErrorBoundary from './LayoutErrorBoundary';
import { useAnalytics } from '@/hooks/useAnalytics';

const socialLinks = [
  { href: 'https://linkedin.com/in/jeffrey-lavente-026a41330', label: 'LinkedIn', Icon: IconBrandLinkedin },
  { href: 'https://github.com/Jeffreasy', label: 'GitHub', Icon: IconBrandGithub },
];

// Animation variants
const footerVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const socialVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.95 },
} as const;

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025); // Static fallback for SSR
  const { trackEvent, trackPageView } = useAnalytics();
  
  // Update year on client mount to avoid hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Track footer section view
  useEffect(() => {
    trackPageView('page_load_complete', {
      section: 'footer',
      current_year: currentYear,
      social_links_count: socialLinks.length,
      social_platforms: socialLinks.map(link => link.label).join(',')
    });
  }, [trackPageView, currentYear]);

  // Handle social link clicks
  const handleSocialClick = (social: typeof socialLinks[0]) => {
    trackEvent('social_link_clicked', {
      platform: social.label.toLowerCase(),
      url: social.href,
      element: 'footer_social_link',
      section: 'footer',
      link_position: socialLinks.findIndex(link => link.label === social.label) + 1
    });
  };

  try {
    const socialItems = socialLinks.map((social) => {
      try {
        return (
          <motion.div key={social.label} variants={socialVariants} whileHover="hover" whileTap="tap">
            <Anchor
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSocialClick(social)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--mantine-color-gray-3)',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
              }}
              styles={{
                root: {
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                    borderColor: 'rgba(59, 130, 246, 0.3)',
                    color: 'var(--mantine-color-blue-3)',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                  }
                }
              }}
            >
              <social.Icon size={20} />
            </Anchor>
          </motion.div>
        );
      } catch (err) {
        console.error('Error rendering social link:', err);
        trackEvent('navigation_clicked', {
          action: 'footer_social_render_error',
          element: 'footer_social_link',
          platform: social.label.toLowerCase(),
          error_message: err instanceof Error ? err.message : 'unknown_error'
        });
        return null;
      }
    }).filter(Boolean);

    return (
      <LayoutErrorBoundary componentName="Footer">
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Box
            component="footer"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle decorative elements */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '10%',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }} />
            
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '15%',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }} />

            <Container size="lg" py="xl" style={{ position: 'relative', zIndex: 1 }}>
              <Group justify="space-between" align="center">
                <Text 
                  size="sm" 
                  c="gray.4"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  &copy; {currentYear}{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 500,
                  }}>
                    Jeffdash Portfolio
                  </span>
                  . All rights reserved.
                </Text>
                <Group gap="xs">
                  {socialItems}
                </Group>
              </Group>
            </Container>
          </Box>
        </motion.div>
      </LayoutErrorBoundary>
    );
  } catch (err) {
    console.error('Error in Footer component:', err);
    trackEvent('navigation_clicked', {
      action: 'footer_render_error',
      element: 'footer',
      error_message: err instanceof Error ? err.message : 'unknown_error'
    });
    throw err; // Let the error boundary handle it
  }
} 
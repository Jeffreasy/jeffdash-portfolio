'use client';

import React, { useEffect } from 'react';
import { Container, Paper, Title, Text, Group, Button } from '@mantine/core';
import { IconMail, IconEye } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import PageErrorBoundary from '../shared/PageErrorBoundary';
import { ContactModal, useContactModal } from '@/components/features/contact';
import { useAnalytics } from '@/hooks/useAnalytics';

const CallToActionBlock: React.FC = () => {
  const contactModal = useContactModal();
  const { trackEvent, trackPageView } = useAnalytics();

  // Track section view
  useEffect(() => {
    trackPageView('cta_section', {
      section: 'call_to_action_block',
      cta_type: 'bottom_page'
    });
  }, [trackPageView]);

  // Handle CTA button clicks
  const handleContactClick = () => {
    trackEvent('hero_cta_clicked', {
      button_type: 'contact',
      button_text: 'Neem Contact Op',
      section: 'cta_block',
      cta_position: 'primary',
      current_page: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });
    contactModal.openModal();
  };

  const handleWorkClick = () => {
    trackEvent('hero_cta_clicked', {
      button_type: 'external_link',
      button_text: 'Bekijk Mijn Werk',
      section: 'cta_block',
      cta_position: 'secondary',
      destination: 'https://github.com/Jeffreasy',
      current_page: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });
  };

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
            top: '30%',
            left: '15%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
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
            right: '20%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        <Container size="lg" py={{ base: "xl", md: "3xl" }} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Paper
              shadow="lg"
              radius="xl"
              p={{ base: "xl", md: "3xl" }}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Background decoration */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <Title 
                  order={2} 
                  size="h1" 
                  mb="md"
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  }}
                >
                  Klaar om samen te werken?
                </Title>
                
                <Text 
                  size="lg" 
                  c="gray.4" 
                  mb="2xl" 
                  maw={600} 
                  mx="auto"
                  style={{
                    lineHeight: 1.6,
                  }}
                >
                  Laten we bespreken hoe ik kan helpen met jouw volgende project. 
                  Van concept tot realisatie, ik help je graag verder.
                </Text>
                
                <Group justify="center" gap="lg" wrap="wrap">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      onClick={handleContactClick}
                      size="lg"
                      variant="gradient"
                      gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      leftSection={<IconMail size={20} />}
                      style={{
                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        fontWeight: 600,
                        minWidth: '180px',
                      }}
                    >
                      Neem Contact Op
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      component="a"
                      href="https://github.com/Jeffreasy"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWorkClick}
                      size="lg"
                      variant="outline"
                      color="gray"
                      leftSection={<IconEye size={20} />}
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'var(--mantine-color-gray-2)',
                        fontWeight: 600,
                        minWidth: '180px',
                      }}
                    >
                      Bekijk Mijn Werk
                    </Button>
                  </motion.div>
                </Group>
              </div>
            </Paper>
          </motion.div>
        </Container>
      </section>

      {/* Contact Modal */}
      <ContactModal
        opened={contactModal.opened}
        onClose={contactModal.closeModal}
        selectedPlan={contactModal.selectedPlan}
        title="Laten we samenwerken!"
        description="Vertel me meer over je project en laten we bespreken hoe ik je kan helpen om je ideeën tot leven te brengen."
      />
    </PageErrorBoundary>
  );
};

export default CallToActionBlock; 
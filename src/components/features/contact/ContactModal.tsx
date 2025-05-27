'use client';

import React from 'react';
import { Modal, Title, Text, Stack, Box, Group, ThemeIcon, List, Badge, Paper } from '@mantine/core';
import { IconCheck, IconStar } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';
import ContactErrorBoundary from './ContactErrorBoundary';
import { PricingPlan } from '../home/PricingSection/data';

interface ContactModalProps {
  opened: boolean;
  onClose: () => void;
  selectedPlan?: PricingPlan | null;
  title?: string;
  description?: string;
}

// Animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

// Helper function to get color RGB values
function getColorRGB(color: string): string {
  const colorMap: Record<string, string> = {
    cyan: '6, 182, 212',
    violet: '139, 92, 246',
    blue: '59, 130, 246',
    orange: '249, 115, 22',
  };
  return colorMap[color] || '59, 130, 246'; // Default to blue
}

// Plan Details Component
interface PlanDetailsProps {
  plan: PricingPlan;
}

function PlanDetails({ plan }: PlanDetailsProps) {
  const colorRGB = getColorRGB(plan.color);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Paper 
        p="lg" 
        mb="xl" 
        radius="lg"
        style={{
          background: `linear-gradient(135deg, rgba(${colorRGB}, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)`,
          border: `1px solid rgba(${colorRGB}, 0.2)`,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative element */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          background: `radial-gradient(circle, rgba(${colorRGB}, 0.1) 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(15px)',
          pointerEvents: 'none',
        }} />

        <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
          {/* Plan Header */}
          <Group>
            <ThemeIcon 
              size="xl" 
              radius="md" 
              variant="gradient" 
              gradient={plan.gradient}
            >
              <plan.icon size={24} />
            </ThemeIcon>
            <Box flex={1}>
              <Group gap="xs">
                <Title order={3} c="gray.1" size="h4">
                  {plan.name}
                </Title>
                {plan.popular && (
                  <Badge
                    variant="gradient"
                    gradient={plan.gradient}
                    size="sm"
                    leftSection={<IconStar size={10} />}
                  >
                    Populair
                  </Badge>
                )}
              </Group>
              <Text size="sm" c="gray.4" mt={2}>
                {plan.description}
              </Text>
            </Box>
          </Group>

          {/* Pricing */}
          <Box
            style={{
              padding: 'var(--mantine-spacing-md)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--mantine-radius-md)',
            }}
          >
            <Group align="baseline" gap="xs" mb="xs">
              <Text 
                fw={900} 
                lh={1}
                style={{
                  fontSize: '1.75rem',
                  background: `linear-gradient(135deg, var(--mantine-color-${plan.color}-4), var(--mantine-color-${plan.color}-6))`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {plan.price}
              </Text>
              {plan.originalPrice && (
                <Text size="md" c="dimmed" td="line-through">
                  {plan.originalPrice}
                </Text>
              )}
            </Group>
            <Text size="sm" c="dimmed">
              {plan.period}
            </Text>
          </Box>

          {/* Features */}
          <Box>
            <Title order={4} size="h6" mb="md" c="gray.2">
              Wat is inbegrepen:
            </Title>
            <List 
              spacing="sm" 
              size="sm" 
              icon={
                <ThemeIcon 
                  size="sm" 
                  radius="xl" 
                  color={plan.color} 
                  variant="light"
                >
                  <IconCheck size={12} />
                </ThemeIcon>
              }
            >
              {plan.features.map((feature, index) => (
                <List.Item key={index}>
                  <Text size="sm" c="gray.3">
                    {feature}
                  </Text>
                </List.Item>
              ))}
            </List>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
}

export default function ContactModal({
  opened,
  onClose,
  selectedPlan,
  title = "Neem Contact Op",
  description = "Vertel ons over je project en we nemen zo snel mogelijk contact met je op.",
}: ContactModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null} // We'll handle the title ourselves for better styling
      size={selectedPlan ? "xl" : "lg"}
      centered
      radius="lg"
      padding={0}
      styles={{
        content: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          maxHeight: '90vh',
        },
        header: {
          display: 'none', // Hide default header since we're using title={null}
        },
        body: {
          padding: 0,
          maxHeight: '90vh',
          overflowY: 'auto',
        },
      }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      transitionProps={{
        transition: 'fade',
        duration: 300,
        timingFunction: 'ease',
      }}
    >
      <ContactErrorBoundary>
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Box p={{ base: "xl", md: "2xl" }}>
            {/* Decorative background elements */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }} />
            
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              width: '60px',
              height: '60px',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }} />

            <Stack gap="xl" style={{ position: 'relative', zIndex: 1 }}>
              {/* Modal Header */}
              <Stack gap="md" align="center">
                <Title 
                  order={2} 
                  ta="center"
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: 900,
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  {selectedPlan ? `Interesse in ${selectedPlan.name}?` : title}
                </Title>
                
                <Text 
                  c="gray.3" 
                  ta="center" 
                  size="md"
                  style={{
                    lineHeight: 1.6,
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  {selectedPlan 
                    ? `Bekijk hieronder wat ${selectedPlan.name} inhoudt en vul het formulier in voor meer informatie.`
                    : description
                  }
                </Text>
              </Stack>

              {/* Plan Details (if plan is selected) */}
              {selectedPlan && <PlanDetails plan={selectedPlan} />}

              {/* Contact Form with Plan Context */}
              <ContactFormWrapper selectedPlan={selectedPlan} />
            </Stack>
          </Box>
        </motion.div>
      </ContactErrorBoundary>
    </Modal>
  );
}

// Wrapper component to provide plan context to ContactForm
interface ContactFormWrapperProps {
  selectedPlan?: PricingPlan | null;
}

function ContactFormWrapper({ selectedPlan }: ContactFormWrapperProps) {
  // Create a mock URLSearchParams if a plan is selected
  React.useEffect(() => {
    if (selectedPlan && typeof window !== 'undefined') {
      // Temporarily modify the URL search params for the form
      const url = new URL(window.location.href);
      url.searchParams.set('plan', selectedPlan.id);
      window.history.replaceState({}, '', url.toString());
      
      // Cleanup function to restore original URL
      return () => {
        const originalUrl = new URL(window.location.href);
        originalUrl.searchParams.delete('plan');
        window.history.replaceState({}, '', originalUrl.toString());
      };
    }
  }, [selectedPlan]);

  return <ContactForm />;
} 
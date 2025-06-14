"use client";

import React, { useEffect } from 'react';
import { Container, Grid, Title, Text, Button, Box, Group, Stack, List, ThemeIcon, Badge, Alert, Loader } from '@mantine/core';
import { IconBolt, IconStar, IconArrowRight, IconCheck, IconEye, IconPlus, IconPalette, IconServer, IconCode, IconSettings, IconAlertCircle } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import PageErrorBoundary from '../../shared/PageErrorBoundary';
import ContactModal from '@/components/features/contact/ContactModal';
import { useContactModal } from '@/hooks/useContactModal';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePricingPlans } from '@/hooks/usePricingPlans';
import { PricingPlan } from '@/app/api/pricing-plans/route';

// Icon mapping for dynamic icon rendering
const iconMap = {
  'IconPalette': IconPalette,
  'IconServer': IconServer,
  'IconCode': IconCode,
  'IconSettings': IconSettings,
};

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
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Function to open contact modal with plan
const openContactModalWithPlan = (plan: PricingPlan, contactModal: any, trackEvent: any, pricingTrackEvent: any) => {
  // Track plan selection with both analytics systems
  trackEvent('plan_selected', {
    plan_name: plan.name,
    plan_price: plan.price,
    plan_color: plan.category_color,
    is_popular: plan.is_popular || false,
    selection_method: 'card_click'
  });
  
  // Track in pricing analytics
  pricingTrackEvent(plan.id, 'inquiry', {
    selection_method: 'card_click',
    plan_name: plan.name,
    plan_price: plan.price
  });
  
  contactModal.openWithPlan(plan);
};

const PricingSection: React.FC = () => {
  const contactModal = useContactModal();
  const { trackEvent, trackPageView } = useAnalytics();
  const { 
    plans, 
    isLoading, 
    error, 
    trackEvent: pricingTrackEvent, 
    metadata 
  } = usePricingPlans();

  // Track section view when component mounts and comes into view
  useEffect(() => {
    trackPageView('pricing_section', {
      total_plans: metadata.totalPlans,
      popular_plan: metadata.popularPlan || 'none'
    });
  }, [trackPageView, metadata]);

  // Handle plan card view tracking
  const handlePlanView = (plan: PricingPlan) => {
    trackEvent('plan_viewed', {
      plan_name: plan.name,
      plan_price: plan.price,
      plan_color: plan.category_color,
      is_popular: plan.is_popular || false,
      view_method: 'card_hover'
    });
    
    pricingTrackEvent(plan.id, 'hover', {
      plan_name: plan.name,
      view_method: 'card_hover'
    });
  };

  // Handle CTA button clicks
  const handleCtaClick = (plan: PricingPlan, method: 'button' | 'general_inquiry') => {
    if (method === 'button') {
      trackEvent('plan_selected', {
        plan_name: plan.name,
        plan_price: plan.price,
        plan_color: plan.category_color,
        is_popular: plan.is_popular || false,
        selection_method: 'cta_button'
      });
      
      pricingTrackEvent(plan.id, 'click', {
        selection_method: 'cta_button',
        plan_name: plan.name
      });
    } else {
      trackEvent('plan_viewed', {
        plan_name: 'general_inquiry',
        plan_price: 'custom',
        selection_method: 'general_cta'
      });
    }
  };

  // Get icon component from string
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || IconCode;
  };

  // Loading state
  if (isLoading) {
    return (
      <PageErrorBoundary>
        <Box
          component="section"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: `
              linear-gradient(180deg, 
                transparent 0%, 
                rgba(0, 0, 0, 0.3) 10%, 
                rgba(15, 23, 42, 0.95) 20%, 
                rgba(15, 23, 42, 0.95) 80%, 
                rgba(0, 0, 0, 0.3) 90%, 
                transparent 100%
              )
            `,
            paddingTop: 'clamp(6rem, 10vw, 10rem)',
            paddingBottom: 'clamp(6rem, 10vw, 10rem)',
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          <Container size="lg" py={{ base: "xl", md: "2xl" }}>
            <Stack align="center" gap="xl">
              <Loader size="xl" color="blue" />
              <Text c="gray.4" size="lg">
                Prijzen worden geladen...
              </Text>
            </Stack>
          </Container>
        </Box>
      </PageErrorBoundary>
    );
  }

  // Error state
  if (error) {
    return (
      <PageErrorBoundary>
        <Box
          component="section"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: `
              linear-gradient(180deg, 
                transparent 0%, 
                rgba(0, 0, 0, 0.3) 10%, 
                rgba(15, 23, 42, 0.95) 20%, 
                rgba(15, 23, 42, 0.95) 80%, 
                rgba(0, 0, 0, 0.3) 90%, 
                transparent 100%
              )
            `,
            paddingTop: 'clamp(6rem, 10vw, 10rem)',
            paddingBottom: 'clamp(6rem, 10vw, 10rem)',
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          <Container size="lg" py={{ base: "xl", md: "2xl" }}>
            <Stack align="center" gap="xl">
              <Alert 
                icon={<IconAlertCircle size={16} />} 
                title="Fout bij laden van prijzen" 
                color="red"
                variant="light"
              >
                {error}
              </Alert>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                color="blue"
              >
                Probeer opnieuw
              </Button>
            </Stack>
          </Container>
        </Box>
      </PageErrorBoundary>
    );
  }

  // No plans available
  if (!plans || plans.length === 0) {
    return (
      <PageErrorBoundary>
        <Box
          component="section"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: `
              linear-gradient(180deg, 
                transparent 0%, 
                rgba(0, 0, 0, 0.3) 10%, 
                rgba(15, 23, 42, 0.95) 20%, 
                rgba(15, 23, 42, 0.95) 80%, 
                rgba(0, 0, 0, 0.3) 90%, 
                transparent 100%
              )
            `,
            paddingTop: 'clamp(6rem, 10vw, 10rem)',
            paddingBottom: 'clamp(6rem, 10vw, 10rem)',
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          <Container size="lg" py={{ base: "xl", md: "2xl" }}>
            <Stack align="center" gap="xl">
              <Text c="gray.4" size="lg">
                Geen prijsplannen beschikbaar op dit moment.
              </Text>
              <Button 
                onClick={() => contactModal.openModal()} 
                variant="outline" 
                color="blue"
              >
                Neem contact op voor een offerte
              </Button>
            </Stack>
          </Container>
        </Box>
      </PageErrorBoundary>
    );
  }

  return (
    <PageErrorBoundary>
      <Box
        component="section"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: `
            linear-gradient(180deg, 
              transparent 0%, 
              rgba(0, 0, 0, 0.3) 10%, 
              rgba(15, 23, 42, 0.95) 20%, 
              rgba(15, 23, 42, 0.95) 80%, 
              rgba(0, 0, 0, 0.3) 90%, 
              transparent 100%
            )
          `,
          paddingTop: 'clamp(6rem, 10vw, 10rem)',
          paddingBottom: 'clamp(6rem, 10vw, 10rem)',
          marginTop: 0,
          marginBottom: 0,
        }}
      >
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            width: '250px',
            height: '250px',
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
            top: '70%',
            right: '10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <Container size="lg" py={{ base: "xl", md: "2xl" }} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section Header */}
            <Stack align="center" gap="xl" mb={{ base: 40, md: 60, lg: 80 }}>
              <motion.div variants={cardVariants}>
                <Group gap="xs" justify="center">
                  <IconBolt size={20} style={{ color: 'var(--mantine-color-yellow-4)' }} />
                  <Text size="sm" c="dimmed" tt="uppercase" fw={600} lts={1}>
                    Transparante Prijzen
                  </Text>
                </Group>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Title 
                  order={2} 
                  ta="center" 
                  size="h1"
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 900,
                    lineHeight: 1.2,
                  }}
                >
                  Kies Het Perfecte Plan
                </Title>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Text 
                  ta="center" 
                  c="gray.4" 
                  size="lg" 
                  maw={600}
                  style={{ 
                    lineHeight: 1.6,
                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                  }}
                >
                  Van eenvoudige frontend websites tot complexe full-stack applicaties. 
                  Kwaliteit en transparantie staan voorop.
                </Text>
              </motion.div>
            </Stack>

            {/* Pricing Cards Grid */}
            <Grid gutter={{ base: "md", md: "lg" }}>
              {plans.map((plan, index) => {
                const IconComponent = getIconComponent(plan.category_icon);
                const gradient = { from: plan.gradient_from, to: plan.gradient_to };
                
                return (
                  <Grid.Col key={plan.id} span={{ base: 12, md: 6, lg: 6 }}>
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      onHoverStart={() => handlePlanView(plan)}
                      style={{ height: '100%' }}
                    >
                      <Box
                        onClick={() => openContactModalWithPlan(plan, contactModal, trackEvent, pricingTrackEvent)}
                        style={{
                          position: 'relative',
                          background: plan.is_popular 
                            ? 'rgba(59, 130, 246, 0.08)' 
                            : 'rgba(255, 255, 255, 0.02)',
                          border: plan.is_popular 
                            ? '2px solid rgba(59, 130, 246, 0.3)' 
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 16,
                          padding: 24,
                          minHeight: 420,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                      >
                        {/* Popular Badge */}
                        {plan.is_popular && (
                          <Badge 
                            variant="gradient" 
                            gradient={gradient} 
                            size="sm" 
                            leftSection={<IconStar size={12} />}
                            style={{ 
                              position: 'absolute', 
                              top: 12, 
                              right: 12, 
                              zIndex: 1 
                            }}
                          >
                            Populair
                          </Badge>
                        )}

                        <Stack gap="md">
                          {/* Plan Header */}
                          <Group>
                            <ThemeIcon 
                              size="lg" 
                              radius="md" 
                              variant="gradient" 
                              gradient={gradient}
                            >
                              <IconComponent size={20} />
                            </ThemeIcon>
                            <Box flex={1}>
                              <Text size="lg" fw={700} c="gray.1" lh={1.2}>
                                {plan.name}
                              </Text>
                              <Text size="sm" c="dimmed" mt={2}>
                                {plan.description}
                              </Text>
                            </Box>
                          </Group>

                          {/* Pricing */}
                          <Box>
                            <Group align="baseline" gap="xs">
                              <Text 
                                fw={900} 
                                lh={1}
                                style={{
                                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                  background: `linear-gradient(135deg, var(--mantine-color-${plan.category_color}-4), var(--mantine-color-${plan.category_color}-6))`,
                                  backgroundClip: 'text',
                                  WebkitBackgroundClip: 'text',
                                  color: 'transparent',
                                }}
                              >
                                {plan.price}
                              </Text>
                              {plan.original_price && (
                                <Text size="sm" c="dimmed" td="line-through">
                                  {plan.original_price}
                                </Text>
                              )}
                            </Group>
                            <Text size="xs" c="dimmed" mt={-2}>
                              {plan.period}
                            </Text>
                          </Box>

                          {/* Features Preview (First 4) */}
                          <Box>
                            <List 
                              spacing="xs" 
                              size="sm" 
                              icon={
                                <ThemeIcon 
                                  size="xs" 
                                  radius="xl" 
                                  color={plan.category_color} 
                                  variant="light"
                                >
                                  <IconCheck size={10} />
                                </ThemeIcon>
                              }
                            >
                              {plan.features.slice(0, 4).map((feature, featureIndex) => (
                                <List.Item key={feature.id}>
                                  <Text size="sm" c="gray.4">
                                    {feature.text}
                                  </Text>
                                </List.Item>
                              ))}
                            </List>
                            
                            {/* Show more indicator if there are more than 4 features */}
                            {plan.features.length > 4 && (
                              <Group gap="xs" mt="xs">
                                <IconPlus size={14} style={{ color: 'var(--mantine-color-blue-4)' }} />
                                <Text size="xs" c="blue.4" fw={500}>
                                  +{plan.features.length - 4} meer features - klik voor details
                                </Text>
                              </Group>
                            )}
                          </Box>
                        </Stack>

                        {/* CTA Button */}
                        <Button
                          variant={plan.cta_variant}
                          gradient={plan.cta_variant === 'gradient' ? gradient : undefined}
                          color={plan.category_color}
                          fullWidth
                          size="md"
                          radius="md"
                          rightSection={<IconArrowRight size={16} />}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent modal opening when clicking CTA
                            handleCtaClick(plan, 'button');
                            contactModal.openWithPlan(plan);
                          }}
                          style={{
                            fontWeight: 600,
                            marginTop: 'var(--mantine-spacing-md)',
                            ...(plan.is_popular && { 
                              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)' 
                            }),
                          }}
                        >
                          {plan.cta_text}
                        </Button>
                      </Box>
                    </motion.div>
                  </Grid.Col>
                );
              })}
            </Grid>

            {/* Bottom CTA */}
            <motion.div variants={cardVariants}>
              <Stack align="center" gap="md" mt={{ base: 40, md: 60, lg: 80 }}>
                <Text ta="center" c="gray.4" size="md">
                  Niet zeker welk plan het beste bij je past?
                </Text>
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
                    onClick={() => {
                      handleCtaClick({} as PricingPlan, 'general_inquiry');
                      contactModal.openModal();
                    }}
                    variant="outline"
                    color="gray"
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
                          borderColor: 'rgba(255, 255, 255, 0.4)',
                          color: 'var(--mantine-color-gray-1)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0px)',
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
                    Vraag Gratis Advies
                  </Button>
                </motion.div>
              </Stack>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Modal */}
      <ContactModal
        opened={contactModal.opened}
        onClose={contactModal.closeModal}
        selectedPlan={contactModal.selectedPlan}
      />
    </PageErrorBoundary>
  );
};

export default PricingSection; 
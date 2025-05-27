"use client";

import React from 'react';
import { Container, Grid, Title, Text, Button, Box, Group, Stack, List, ThemeIcon, Badge } from '@mantine/core';
import { IconBolt, IconStar, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import PageErrorBoundary from '../../shared/PageErrorBoundary';
import { pricingPlans } from './data';

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

const PricingSection: React.FC = () => {
  return (
    <PageErrorBoundary>
      <Box
        component="section"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          paddingTop: 'var(--mantine-spacing-3xl)',
          paddingBottom: 'var(--mantine-spacing-3xl)',
        }}
      >
        <Container size="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section Header */}
            <Stack align="center" gap="lg" mb={60}>
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
              {pricingPlans.map((plan, index) => (
                <Grid.Col key={plan.id} span={{ base: 12, md: 6, lg: 6 }}>
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    style={{ height: '100%' }}
                  >
                    <Box
                      style={{
                        position: 'relative',
                        background: plan.popular 
                          ? 'rgba(59, 130, 246, 0.08)' 
                          : 'rgba(255, 255, 255, 0.02)',
                        border: plan.popular 
                          ? '2px solid rgba(59, 130, 246, 0.3)' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 16,
                        padding: 24,
                        minHeight: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <Badge 
                          variant="gradient" 
                          gradient={plan.gradient} 
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
                            gradient={plan.gradient}
                          >
                            <plan.icon size={20} />
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
                                background: `linear-gradient(135deg, var(--mantine-color-${plan.color}-4), var(--mantine-color-${plan.color}-6))`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                              }}
                            >
                              {plan.price}
                            </Text>
                            {plan.originalPrice && (
                              <Text size="sm" c="dimmed" td="line-through">
                                {plan.originalPrice}
                              </Text>
                            )}
                          </Group>
                          <Text size="xs" c="dimmed" mt={-2}>
                            {plan.period}
                          </Text>
                        </Box>

                        {/* Features List */}
                        <Box>
                          <List 
                            spacing="xs" 
                            size="sm" 
                            icon={
                              <ThemeIcon 
                                size="xs" 
                                radius="xl" 
                                color={plan.color} 
                                variant="light"
                              >
                                <IconCheck size={10} />
                              </ThemeIcon>
                            }
                          >
                            {plan.features.map((feature, featureIndex) => (
                              <List.Item key={featureIndex}>
                                <Text size="sm" c="gray.4">
                                  {feature}
                                </Text>
                              </List.Item>
                            ))}
                          </List>
                        </Box>
                      </Stack>

                      {/* CTA Button */}
                      <Button
                        component="a"
                        href={`mailto:jeffrey@jeffdash.nl?subject=Interesse in ${plan.name}&body=Hallo Jeffrey,%0D%0A%0D%0AIk ben geïnteresseerd in het ${plan.name} plan.%0D%0A%0D%0AKun je me meer informatie geven?%0D%0A%0D%0AMet vriendelijke groet`}
                        variant={plan.ctaVariant}
                        gradient={plan.ctaVariant === 'gradient' ? plan.gradient : undefined}
                        color={plan.color}
                        fullWidth
                        size="md"
                        radius="md"
                        rightSection={<IconArrowRight size={16} />}
                        style={{
                          fontWeight: 600,
                          marginTop: 'var(--mantine-spacing-md)',
                          ...(plan.popular && { 
                            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)' 
                          }),
                        }}
                      >
                        {plan.ctaText}
                      </Button>
                    </Box>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>

            {/* Bottom CTA */}
            <motion.div variants={cardVariants}>
              <Stack align="center" gap="md" mt={60}>
                <Text ta="center" c="gray.4" size="md">
                  Niet zeker welk plan het beste bij je past?
                </Text>
                <Button
                  component="a"
                  href="mailto:jeffrey@jeffdash.nl?subject=Gratis Advies Aanvraag&body=Hallo Jeffrey,%0D%0A%0D%0AIk zou graag gratis advies willen over welk plan het beste bij mij past.%0D%0A%0D%0AKun je me helpen?%0D%0A%0D%0AMet vriendelijke groet"
                  variant="outline"
                  color="gray"
                  size="lg"
                  radius="md"
                  rightSection={<IconArrowRight size={18} />}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'var(--mantine-color-gray-2)',
                  }}
                >
                  Vraag Gratis Advies
                </Button>
              </Stack>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </PageErrorBoundary>
  );
};

export default PricingSection; 
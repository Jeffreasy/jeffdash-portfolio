"use client";

import React, { useState } from 'react';
import { Container, Grid, Title, Text, Button, Box, Group, Stack, rem, Card, List, ThemeIcon, Badge } from '@mantine/core';
import { IconBolt, IconArrowRight, IconCheck, IconStar, IconEye } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PageErrorBoundary from '../shared/PageErrorBoundary';
import { pricingPlans, PricingPlan } from './PricingSection/data';
import PricingDetailModal from './PricingSection/PricingDetailModal';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
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

const PricingSection: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const handleViewDetails = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setTimeout(() => setSelectedPlan(null), 200); // Delay to allow exit animation
  };

  return (
    <PageErrorBoundary>
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      }}>
        {/* Background decoration - simplified */}
        <Box
          style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            opacity: 0.7,
          }}
        />

        <Container size="lg" py={{ base: "xl", md: "3xl" }} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Section Header */}
            <Stack align="center" gap="lg" mb={{ base: rem(40), md: rem(60) }}>
              <motion.div variants={itemVariants}>
                <Group gap="xs" justify="center">
                  <IconBolt size={20} style={{ color: 'var(--mantine-color-yellow-4)' }} />
                  <Text size="sm" c="dimmed" tt="uppercase" fw={600} lts={1}>
                    Transparante Prijzen
                  </Text>
                </Group>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Title
                  order={2}
                  ta="center"
                  size="h1"
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: 'var(--mantine-spacing-md)',
                  }}
                >
                  Kies Het Perfecte Plan
                </Title>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Text
                  ta="center"
                  c="gray.4"
                  size="lg"
                  maw={500}
                  style={{ lineHeight: 1.5 }}
                >
                  Van eenvoudige frontend websites tot complexe full-stack applicaties. 
                  Kwaliteit en transparantie staan voorop.
                </Text>
              </motion.div>
            </Stack>

            {/* Pricing Cards */}
            <Grid gutter={{ base: "md", md: "lg" }} mb={{ base: rem(40), md: rem(60) }}>
              {pricingPlans.map((plan, index) => (
                <Grid.Col key={plan.id} span={{ base: 12, md: 6, lg: 6 }}>
                  <motion.div variants={itemVariants}>
                    <Card
                      shadow="xl"
                      radius="lg"
                      h="100%"
                      p={{ base: "md", md: "lg" }}
                      style={{
                        background: plan.popular 
                          ? 'rgba(59, 130, 246, 0.08)'
                          : 'rgba(255, 255, 255, 0.02)',
                        border: plan.popular 
                          ? '2px solid rgba(59, 130, 246, 0.2)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        position: 'relative',
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
                            top: rem(12),
                            right: rem(12),
                            zIndex: 1,
                          }}
                        >
                          Populair
                        </Badge>
                      )}

                      <Stack gap="sm" h="100%">
                        {/* Header */}
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
                            <Text size="xs" c="dimmed" mt={2}>
                              {plan.description}
                            </Text>
                          </Box>
                        </Group>

                        {/* Pricing */}
                        <Box>
                          <Group align="baseline" gap="xs">
                            <Text
                              size="xl"
                              fw={900}
                              lh={1}
                              style={{
                                background: `linear-gradient(135deg, var(--mantine-color-${plan.color}-4), var(--mantine-color-${plan.color}-6))`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                WebkitTextFillColor: 'transparent',
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

                                                 {/* Features */}
                         <Box flex={1}>
                           <List
                             spacing="xs"
                             size="sm"
                             icon={
                               <ThemeIcon size="xs" radius="xl" color={plan.color} variant="light">
                                 <IconCheck size={10} />
                               </ThemeIcon>
                             }
                           >
                             {plan.features.slice(0, 5).map((feature, featureIndex) => (
                               <List.Item key={featureIndex}>
                                 <Text size="xs" c="gray.4">
                                   {feature}
                                 </Text>
                               </List.Item>
                             ))}
                             {plan.features.length > 5 && (
                               <List.Item>
                                 <Text size="xs" c="dimmed" fs="italic">
                                   +{plan.features.length - 5} meer features
                                 </Text>
                               </List.Item>
                             )}
                           </List>

                           {/* View Details Button */}
                           {plan.features.length > 5 && (
                             <Button
                               variant="subtle"
                               color={plan.color}
                               size="xs"
                               leftSection={<IconEye size={14} />}
                               onClick={() => handleViewDetails(plan)}
                               fullWidth
                               mt="sm"
                               style={{
                                 fontWeight: 500,
                                 fontSize: rem(11),
                               }}
                             >
                               Bekijk alle {plan.features.length} features
                             </Button>
                           )}
                         </Box>

                        {/* CTA Button */}
                        <Button
                          component={Link}
                          href={`/contact?plan=${plan.id}`}
                          variant={plan.ctaVariant}
                          gradient={plan.ctaVariant === 'gradient' ? plan.gradient : undefined}
                          color={plan.color}
                          fullWidth
                          size="md"
                          radius="md"
                          rightSection={<IconArrowRight size={16} />}
                          style={{
                            fontWeight: 600,
                            ...(plan.popular && {
                              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.25)',
                            })
                          }}
                        >
                          {plan.ctaText}
                        </Button>
                      </Stack>
                    </Card>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>

            {/* Bottom CTA */}
            <motion.div variants={itemVariants}>
              <Box ta="center">
                <Stack align="center" gap="sm">
                  <Text size="sm" c="dimmed" tt="uppercase" fw={600} lts={1}>
                    Niet zeker welk plan te kiezen?
                  </Text>
                  <Text c="gray.3" size="md" maw={400} ta="center">
                    Laten we samen kijken wat het beste bij jouw project past. 
                    Een vrijblijvend gesprek helpt ons beiden.
                  </Text>
                  <Button
                    component={Link}
                    href="/contact"
                    variant="outline"
                    color="gray"
                    size="md"
                    radius="md"
                    mt="xs"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'var(--mantine-color-gray-2)',
                      fontWeight: 500,
                    }}
                  >
                    Plan een Gratis Consultatie
                  </Button>
                </Stack>
              </Box>
            </motion.div>
                      </motion.div>
          </Container>

          {/* Pricing Detail Modal */}
          <PricingDetailModal
            opened={modalOpened}
            onClose={handleCloseModal}
            plan={selectedPlan}
          />
        </section>
      </PageErrorBoundary>
    );
  };
  
  export default PricingSection; 
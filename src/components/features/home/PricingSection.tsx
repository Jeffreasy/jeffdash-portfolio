"use client";

import React, { useState } from 'react';
import { Container, Grid, Title, Text, Button, Box, Group, Stack, rem } from '@mantine/core';
import { IconBolt, IconInfinity } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import PageErrorBoundary from '../shared/PageErrorBoundary';
import PricingCard from './PricingSection/PricingCard';
import PricingDetailModal from './PricingSection/PricingDetailModal';
import { pricingPlans, PricingPlan } from './PricingSection/data';

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
      <Box
        component="section"
        py={rem(80)}
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.97) 0%, rgba(15, 23, 42, 0.97) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Section Header */}
            <Stack align="center" gap="lg" mb={rem(50)}>
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
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    fontWeight: 900,
                    lineHeight: 1.2,
                  }}
                >
                  <Text
                    component="span"
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    Kies Het Perfecte Plan
                  </Text>
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
            <Grid gutter="lg" mb={rem(60)}>
              {pricingPlans.map((plan, index) => (
                <Grid.Col key={plan.id} span={{ base: 12, sm: 6, lg: 3 }}>
                  <PricingCard 
                    plan={plan} 
                    index={index} 
                    onViewDetails={handleViewDetails}
                  />
                </Grid.Col>
              ))}
            </Grid>

            {/* Bottom CTA */}
            <motion.div variants={itemVariants}>
              <Box ta="center">
                <Stack align="center" gap="sm">
                  <Group gap="xs">
                    <IconInfinity size={18} style={{ color: 'var(--mantine-color-blue-4)' }} />
                    <Text size="sm" c="dimmed" tt="uppercase" fw={600} lts={1}>
                      Niet zeker welk plan te kiezen?
                    </Text>
                  </Group>
                  <Text c="gray.3" size="md" maw={400} ta="center">
                    Laten we samen kijken wat het beste bij jouw project past. 
                    Een vrijblijvend gesprek helpt ons beiden.
                  </Text>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
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
                  </motion.div>
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
      </Box>
    </PageErrorBoundary>
  );
};

export default PricingSection; 
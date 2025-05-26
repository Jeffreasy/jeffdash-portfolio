"use client";

import React from 'react';
import {
  Card,
  Text,
  Button,
  Badge,
  List,
  ThemeIcon,
  Box,
  Group,
  Stack,
  rem,
} from '@mantine/core';
import { IconCheck, IconStar, IconEye, IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PricingPlan } from './data';

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
  onViewDetails?: (plan: PricingPlan) => void;
}

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
} as const;

const PricingCard: React.FC<PricingCardProps> = ({ plan, index, onViewDetails }) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      style={{ height: '100%' }}
    >
      <Card
        shadow="xl"
        radius="lg"
        h="100%"
        p={{ base: "md", md: "lg" }}
        style={{
          background: plan.popular 
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(6, 182, 212, 0.03) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.04) 100%)',
          border: plan.popular 
            ? '2px solid rgba(59, 130, 246, 0.2)'
            : '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
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
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: 900,
                  lineHeight: 1,
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
              {plan.features.slice(0, 6).map((feature, featureIndex) => (
                <List.Item key={featureIndex}>
                  <Text size="xs" c="gray.4">
                    {feature}
                  </Text>
                </List.Item>
              ))}
              {plan.features.length > 6 && (
                <List.Item>
                  <Text size="xs" c="dimmed" fs="italic">
                    +{plan.features.length - 6} meer features
                  </Text>
                </List.Item>
              )}
            </List>

            {/* View Details Button */}
            {plan.features.length > 6 && onViewDetails && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: rem(12) }}
              >
                <Button
                  variant="subtle"
                  color={plan.color}
                  size="xs"
                  leftSection={<IconEye size={14} />}
                  onClick={() => onViewDetails(plan)}
                  fullWidth
                  style={{
                    fontWeight: 500,
                    fontSize: rem(11),
                  }}
                >
                  Bekijk alle {plan.features.length} features
                </Button>
              </motion.div>
            )}
          </Box>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
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
          </motion.div>
        </Stack>
      </Card>
    </motion.div>
  );
};

export default PricingCard; 
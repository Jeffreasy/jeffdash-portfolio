"use client";

import React from 'react';
import {
  Modal,
  Title,
  Text,
  Button,
  List,
  ThemeIcon,
  Group,
  Stack,
  Badge,
  Box,
  rem,
} from '@mantine/core';
import { IconCheck, IconStar, IconArrowRight } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PricingPlan } from './data';

interface PricingDetailModalProps {
  opened: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
} as const;

const PricingDetailModal: React.FC<PricingDetailModalProps> = ({
  opened,
  onClose,
  plan,
}) => {
  if (!plan) return null;

  return (
    <AnimatePresence>
      {opened && (
        <Modal
          opened={opened}
          onClose={onClose}
          title={
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon
                size="md"
                radius="md"
                variant="gradient"
                gradient={plan.gradient}
              >
                <plan.icon size={16} />
              </ThemeIcon>
              <Box flex={1}>
                <Text size="lg" fw={700} c="gray.1" lineClamp={1}>
                  {plan.name}
                </Text>
              </Box>
              {plan.popular && (
                <Badge
                  variant="gradient"
                  gradient={plan.gradient}
                  size="sm"
                  leftSection={<IconStar size={10} />}
                  style={{ flexShrink: 0 }}
                >
                  Populair
                </Badge>
              )}
            </Group>
          }
          size="lg"
          radius="md"
          centered={true}
          closeOnEscape={true}
          trapFocus={true}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          styles={{
            content: {
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              margin: 0,
              maxHeight: '90vh',
              overflow: 'auto',
              '@media (max-width: 768px)': {
                width: 'calc(100vw - 2rem)',
                maxWidth: '480px',
                maxHeight: '80vh',
                margin: '0 auto',
              },
            },
            inner: {
              padding: '2rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              '@media (max-width: 768px)': {
                padding: '1rem',
                alignItems: 'center',
                justifyContent: 'center',
              },
            },
            header: {
              background: 'transparent',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: rem(16),
              '@media (max-width: 768px)': {
                paddingTop: rem(20),
              },
            },
            title: {
              width: '100%',
            },
            close: {
              color: 'var(--mantine-color-gray-4)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            },
            body: {
              '@media (max-width: 768px)': {
                paddingBottom: rem(20),
              },
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Stack gap="lg">
              {/* Description & Pricing */}
              <Box>
                <Text c="gray.4" size="md" mb="xs">
                  {plan.description}
                </Text>
                <Group align="baseline" gap="xs">
                  <Text
                    fw={900}
                    lh={1}
                    style={{
                      fontSize: 'var(--modal-price-size, 1.4rem)',
                      background: `linear-gradient(135deg, var(--mantine-color-${plan.color}-4), var(--mantine-color-${plan.color}-6))`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      WebkitTextFillColor: 'transparent',
                      '--modal-price-size': '1.4rem',
                    }}
                    styles={{
                      root: {
                        '@media (min-width: 768px)': {
                          '--modal-price-size': '1.8rem',
                        }
                      }
                    }}
                  >
                    {plan.price}
                  </Text>
                  {plan.originalPrice && (
                    <Text size="sm" c="dimmed" td="line-through">
                      {plan.originalPrice}
                    </Text>
                  )}
                  <Text size="sm" c="gray.5">
                    {plan.period}
                  </Text>
                </Group>
              </Box>

              {/* Complete Features List */}
              <Box>
                <Title order={4} size="h5" c="gray.2" mb="md">
                  Alle inbegrepen features:
                </Title>
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <List
                    spacing="sm"
                    size="sm"
                    icon={
                      <ThemeIcon size="sm" radius="xl" color={plan.color} variant="light">
                        <IconCheck size={12} />
                      </ThemeIcon>
                    }
                  >
                    {plan.features.map((feature, index) => (
                      <motion.div key={index} variants={itemVariants}>
                        <List.Item>
                          <Text size="sm" c="gray.3">
                            {feature}
                          </Text>
                        </List.Item>
                      </motion.div>
                    ))}
                  </List>
                </motion.div>
              </Box>

              {/* CTA Buttons */}
              <Group gap="sm" mt="md">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1 }}
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
                <Button
                  variant="subtle"
                  color="gray"
                  size="md"
                  onClick={onClose}
                >
                  Sluiten
                </Button>
              </Group>
            </Stack>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default PricingDetailModal; 
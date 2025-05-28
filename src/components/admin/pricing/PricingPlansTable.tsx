'use client';

import React, { useMemo, useCallback } from 'react';
import {
  Table,
  Group,
  Text,
  Badge,
  Button,
  ThemeIcon,
  Box,
  ScrollArea,
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconStar,
  IconPalette,
  IconServer,
  IconCode,
  IconSettings,
  IconCurrencyEuro,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { PricingPlan } from '@/app/api/pricing-plans/route';

interface PricingPlansTableProps {
  plans: PricingPlan[];
  onEdit: (plan: PricingPlan) => void;
  onDelete: (plan: PricingPlan) => void;
}

// Animation variants
const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
} as const;

const PricingPlansTable: React.FC<PricingPlansTableProps> = ({
  plans,
  onEdit,
  onDelete,
}) => {
  // Memoized icon mapping for performance
  const iconMap = useMemo(() => ({
    'IconPalette': IconPalette,
    'IconServer': IconServer,
    'IconCode': IconCode,
    'IconSettings': IconSettings,
  }), []);

  const getIconComponent = useCallback((iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || IconCode;
  }, [iconMap]);

  const rows = plans.map((plan, index) => {
    if (!plan.id || !plan.name) {
      return null;
    }

    const IconComponent = getIconComponent(plan.category_icon);

    return (
      <motion.tr
        key={plan.id}
        variants={rowVariants}
        custom={index}
        style={{
          background: plan.is_popular 
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)'
            : 'transparent',
        }}
      >
        <Table.Td style={{ minWidth: 'clamp(200px, 25vw, 280px)' }}>
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon
              size="sm"
              radius="md"
              color={plan.category_color}
              variant="light"
              style={{ flexShrink: 0 }}
            >
              <IconComponent size={16} />
            </ThemeIcon>
            <div style={{ minWidth: 0, flex: 1 }}>
              <Text fw={600} size="sm" lineClamp={1} c="gray.2">
                {plan.name}
              </Text>
              <Text size="xs" c="dimmed" lineClamp={1}>
                {plan.category_name}
              </Text>
            </div>
          </Group>
        </Table.Td>
        <Table.Td style={{ minWidth: 'clamp(140px, 20vw, 200px)' }}>
          <Text size="sm" c="gray.3" lineClamp={2}>
            {plan.description}
          </Text>
        </Table.Td>
        <Table.Td style={{ minWidth: 'clamp(100px, 15vw, 140px)' }}>
          <Group gap="xs" align="baseline">
            <Text size="lg" fw={700} c={plan.category_color}>
              {plan.price}
            </Text>
            {plan.original_price && (
              <Text size="xs" c="dimmed" td="line-through">
                {plan.original_price}
              </Text>
            )}
          </Group>
          <Text size="xs" c="dimmed">
            {plan.period}
          </Text>
        </Table.Td>
        <Table.Td style={{ minWidth: 'clamp(100px, 15vw, 140px)' }}>
          <Badge
            variant="light"
            color={plan.is_popular ? 'violet' : 'gray'}
            size="sm"
            leftSection={plan.is_popular ? <IconStar size={12} /> : null}
            style={{
              background: plan.is_popular 
                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)',
              border: `1px solid rgba(${plan.is_popular ? '139, 92, 246' : '107, 114, 128'}, 0.2)`,
              color: plan.is_popular ? 'var(--mantine-color-violet-4)' : 'var(--mantine-color-gray-4)',
              fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
              padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 10px)',
              borderRadius: 'clamp(4px, 1vw, 6px)',
            }}
          >
            {plan.is_popular ? 'Populair' : 'Standaard'}
          </Badge>
        </Table.Td>
        <Table.Td style={{ minWidth: 'clamp(80px, 12vw, 100px)' }}>
          <Text size="sm" c="gray.3" ta="center">
            {plan.features.length}
          </Text>
        </Table.Td>
        <Table.Td style={{ minWidth: 'clamp(100px, 15vw, 140px)' }}>
          <Badge
            variant="light"
            color={plan.category_color}
            size="sm"
            style={{
              background: `linear-gradient(135deg, rgba(var(--mantine-color-${plan.category_color}-6-rgb), 0.1) 0%, rgba(var(--mantine-color-${plan.category_color}-5-rgb), 0.1) 100%)`,
              border: `1px solid rgba(var(--mantine-color-${plan.category_color}-6-rgb), 0.2)`,
              fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
              padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 10px)',
              borderRadius: 'clamp(4px, 1vw, 6px)',
            }}
          >
            {plan.cta_variant}
          </Badge>
        </Table.Td>
        <Table.Td style={{ minWidth: 'clamp(160px, 25vw, 200px)' }}>
          <Group gap="xs" wrap="nowrap">
            <Button 
              variant="subtle"
              color="violet"
              size="xs"
              leftSection={<IconEdit size={14} />}
              onClick={() => onEdit(plan)}
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                minHeight: '36px',
                fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                borderRadius: 'clamp(4px, 1vw, 6px)',
                padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)',
                flexShrink: 0,
              }}
              styles={{
                root: {
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
                    transform: 'translateY(-1px)',
                  },
                },
              }}
            >
              Bewerken
            </Button>
            <Button 
              variant="subtle"
              color="red" 
              size="xs" 
              onClick={() => onDelete(plan)}
              leftSection={<IconTrash size={14} />}
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                minHeight: '36px',
                fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                borderRadius: 'clamp(4px, 1vw, 6px)',
                padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)',
                flexShrink: 0,
              }}
              styles={{
                root: {
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
                    transform: 'translateY(-1px)',
                  },
                },
              }}
            >
              Verwijderen
            </Button>
          </Group>
        </Table.Td>
      </motion.tr>
    );
  }).filter(Boolean);

  if (plans.length === 0) {
    return (
      <Box
        style={{
          textAlign: 'center',
          padding: 'clamp(1.5rem, 4vw, 2rem)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          margin: 'clamp(8px, 2vw, 16px)',
        }}
      >
        <ThemeIcon
          size="xl"
          radius="md"
          variant="gradient"
          gradient={{ from: 'orange.6', to: 'red.5' }}
          mb="md"
          mx="auto"
          style={{
            width: 'clamp(48px, 8vw, 64px)',
            height: 'clamp(48px, 8vw, 64px)',
          }}
        >
          <IconCurrencyEuro size={24} />
        </ThemeIcon>
        <Text 
          c="gray.4" 
          size="lg" 
          fw={500}
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            marginBottom: 'clamp(4px, 1vw, 8px)',
          }}
        >
          Geen pricing plans gevonden
        </Text>
        <Text 
          c="gray.5" 
          size="sm" 
          mt="xs"
          style={{
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          }}
        >
          Voeg je eerste pricing plan toe om te beginnen
        </Text>
      </Box>
    );
  }

  return (
    <Box
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'clamp(8px, 2vw, 12px)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <motion.div
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <ScrollArea 
          type="auto" 
          scrollbarSize={8}
          style={{ 
            width: '100%',
          }}
        >
          <Table
            striped
            highlightOnHover
            style={{ 
              minWidth: 'clamp(900px, 100vw, 1400px)',
            }}
            styles={{
              table: {
                background: 'transparent',
              },
              thead: {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.08) 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              },
              th: {
                color: 'var(--mantine-color-gray-2)',
                fontWeight: 600,
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                padding: 'clamp(8px, 2vw, 16px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                whiteSpace: 'nowrap',
                position: 'sticky',
                top: 0,
                zIndex: 1,
              },
              td: {
                color: 'var(--mantine-color-gray-2)',
                padding: 'clamp(8px, 2vw, 16px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                verticalAlign: 'middle',
              },
              tr: {
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                },
              },
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Plan</Table.Th>
                <Table.Th>Beschrijving</Table.Th>
                <Table.Th>Prijs</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Features</Table.Th>
                <Table.Th>CTA Type</Table.Th>
                <Table.Th>Acties</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </motion.div>
    </Box>
  );
};

export default PricingPlansTable; 
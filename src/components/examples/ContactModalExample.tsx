'use client';

import React from 'react';
import { Button, Group, Stack, Title, Text, Paper, Loader, Alert } from '@mantine/core';
import { IconMail, IconStar, IconCode, IconServer, IconAlertCircle } from '@tabler/icons-react';
import { ContactModal, useContactModal } from '../features/contact';
import { usePricingPlans } from '@/hooks/usePricingPlans';

/**
 * Example component showing how to use the ContactModal
 * This demonstrates various ways to open the contact modal:
 * 1. Basic contact modal without plan
 * 2. Contact modal with specific plan pre-selected
 * 3. Contact modal with custom title and description
 */
export default function ContactModalExample() {
  const contactModal = useContactModal();
  const { plans, isLoading, error } = usePricingPlans();

  if (isLoading) {
    return (
      <Paper p="xl" radius="lg" withBorder>
        <Stack align="center" gap="md">
          <Loader size="md" />
          <Text c="dimmed">Pricing plans laden...</Text>
        </Stack>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper p="xl" radius="lg" withBorder>
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Fout bij het laden van pricing plans: {error}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper p="xl" radius="lg" withBorder>
      <Stack gap="xl">
        <div>
          <Title order={3} mb="md">Contact Modal Examples</Title>
          <Text c="dimmed" mb="lg">
            Verschillende manieren om de ContactModal te gebruiken in je componenten.
          </Text>
        </div>

        <Group gap="md" wrap="wrap">
          {/* Basic Contact Modal */}
          <Button
            leftSection={<IconMail size={16} />}
            onClick={() => contactModal.openModal()}
            variant="outline"
          >
            Algemeen Contact
          </Button>

          {/* Contact Modal with plans - only show if plans are available */}
          {plans && plans.length >= 3 && (
            <>
              <Button
                leftSection={<IconCode size={16} />}
                onClick={() => contactModal.openWithPlan(plans[0] as any)}
                variant="filled"
                color="cyan"
              >
                {plans[0]?.name || 'Frontend Plan'}
              </Button>

              <Button
                leftSection={<IconServer size={16} />}
                onClick={() => contactModal.openWithPlan(plans[1] as any)}
                variant="filled"
                color="violet"
              >
                {plans[1]?.name || 'Backend Plan'}
              </Button>

              <Button
                leftSection={<IconStar size={16} />}
                onClick={() => contactModal.openWithPlan(plans[2] as any)}
                variant="gradient"
                gradient={{ from: 'blue.6', to: 'cyan.5' }}
              >
                {plans[2]?.name || 'Full-Stack Plan'} {plans[2]?.is_popular && '(Populair)'}
              </Button>
            </>
          )}
        </Group>

        {/* Code Examples */}
        <div>
          <Title order={4} mb="md">Gebruik in je code:</Title>
          <Stack gap="md">
            <Paper p="md" bg="dark.8" radius="md">
              <Text size="sm" ff="monospace" c="gray.3">
                {`// 1. Import de hook en modal
import { ContactModal, useContactModal } from '@/components/features/contact';

// 2. Gebruik de hook in je component
const contactModal = useContactModal();

// 3. Render de modal
<ContactModal
  opened={contactModal.opened}
  onClose={contactModal.closeModal}
  selectedPlan={contactModal.selectedPlan}
/>

// 4. Open de modal
contactModal.openModal(); // Algemeen
contactModal.openWithPlan(plan); // Met specifiek plan`}
              </Text>
            </Paper>
          </Stack>
        </div>

        {/* The actual ContactModal */}
        <ContactModal
          opened={contactModal.opened}
          onClose={contactModal.closeModal}
          selectedPlan={contactModal.selectedPlan as any}
        />
      </Stack>
    </Paper>
  );
} 
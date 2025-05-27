'use client';

import React from 'react';
import { Button, Group, Stack, Title, Text, Paper } from '@mantine/core';
import { IconMail, IconStar, IconCode, IconServer } from '@tabler/icons-react';
import { ContactModal, useContactModal } from '../features/contact';
import { pricingPlans } from '../features/home/PricingSection/data';

/**
 * Example component showing how to use the ContactModal
 * This demonstrates various ways to open the contact modal:
 * 1. Basic contact modal without plan
 * 2. Contact modal with specific plan pre-selected
 * 3. Contact modal with custom title and description
 */
export default function ContactModalExample() {
  const contactModal = useContactModal();

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

          {/* Contact Modal with Frontend Plan */}
          <Button
            leftSection={<IconCode size={16} />}
            onClick={() => contactModal.openWithPlan(pricingPlans[0])}
            variant="filled"
            color="cyan"
          >
            Frontend Plan
          </Button>

          {/* Contact Modal with Backend Plan */}
          <Button
            leftSection={<IconServer size={16} />}
            onClick={() => contactModal.openWithPlan(pricingPlans[1])}
            variant="filled"
            color="violet"
          >
            Backend Plan
          </Button>

          {/* Contact Modal with Full-Stack Plan (Popular) */}
          <Button
            leftSection={<IconStar size={16} />}
            onClick={() => contactModal.openWithPlan(pricingPlans[2])}
            variant="gradient"
            gradient={{ from: 'blue.6', to: 'cyan.5' }}
          >
            Full-Stack Plan (Populair)
          </Button>
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
          selectedPlan={contactModal.selectedPlan}
        />
      </Stack>
    </Paper>
  );
} 
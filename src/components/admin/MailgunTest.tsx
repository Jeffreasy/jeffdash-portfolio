'use client';

import React, { useState } from 'react';
import { Button, Paper, Title, Text, Alert, Stack, Group } from '@mantine/core';
import { IconMail, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const MailgunTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const sendTestEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send test email'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendContactTestEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          name: 'Test Gebruiker',
          email: 'jeffrey@jeffdash.com',
          message: 'Dit is een test bericht vanuit de admin area om de email functionaliteit te testen.',
          selectedPlan: 'Full-Stack Development'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send contact test email'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper p="xl" radius="lg" style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
    }}>
      <Stack gap="lg">
        <div>
          <Title order={3} mb="xs" style={{
            background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}>
            Mailgun Email Test
          </Title>
          <Text c="gray.4">
            Test de Mailgun email functionaliteit om te controleren of alles correct werkt.
          </Text>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              icon={result.success ? <IconCheck size="1rem" /> : <IconAlertCircle size="1rem" />}
              title={result.success ? "Succes!" : "Fout!"}
              color={result.success ? "green" : "red"}
              variant="light"
              style={{
                background: result.success 
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: `1px solid rgba(${result.success ? '34, 197, 94' : '239, 68, 68'}, 0.2)`,
              }}
            >
              {result.message}
            </Alert>
          </motion.div>
        )}

        <Group gap="md">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={sendTestEmail}
              loading={isLoading}
              variant="gradient"
              gradient={{ from: 'blue.6', to: 'cyan.5' }}
              leftSection={<IconMail size={16} />}
              style={{
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              Verstuur Test Email
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={sendContactTestEmail}
              loading={isLoading}
              variant="outline"
              color="cyan"
              leftSection={<IconMail size={16} />}
              style={{
                borderColor: 'rgba(6, 182, 212, 0.3)',
                color: 'var(--mantine-color-cyan-4)',
              }}
            >
              Test Contact Email
            </Button>
          </motion.div>
        </Group>

        <div>
          <Text size="sm" c="gray.5">
            <strong>Test Email:</strong> Verstuurt de standaard Mailgun test email naar jeffrey@jeffdash.com
          </Text>
          <Text size="sm" c="gray.5">
            <strong>Contact Email:</strong> Test de volledige contact form email flow (bevestiging + notificatie)
          </Text>
        </div>
      </Stack>
    </Paper>
  );
};

export default MailgunTest; 
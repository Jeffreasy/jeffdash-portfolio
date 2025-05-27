'use client';

import React, { useEffect, useState } from 'react';
import { getContactSubmissions, ContactSubmissionType } from '@/lib/actions/contact';
import { Container, Title, Alert, Box, Text, Group, ThemeIcon, Stack, Loader, Center } from '@mantine/core';
import { IconAlertCircle, IconMessages, IconMail } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

export default function ContactsAdminPage() {
  const [submissions, setSubmissions] = useState<ContactSubmissionType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setIsLoading(true);
        const submissionsData = await getContactSubmissions();
        setSubmissions(submissionsData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching contact submissions:", err);
        setError(err.message || 'Kon de contactinzendingen niet laden.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  const unreadCount = submissions.filter(submission => !submission.isRead).length;
  const totalCount = submissions.length;

  if (isLoading) {
    return (
      <Box
        style={{
          position: 'relative',
          minHeight: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--mantine-spacing-xl)',
        }}
      >
        <Container size="lg">
          <Stack gap="xl" align="center">
            <Title 
              order={1}
              ta="center"
              style={{
                background: 'linear-gradient(135deg, var(--mantine-color-green-4), var(--mantine-color-teal-4))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 900,
              }}
            >
              Contact Berichten
            </Title>
            
            <Box
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: 'var(--mantine-spacing-xl)',
                position: 'relative',
                minHeight: '400px',
                width: '100%',
                maxWidth: '600px',
              }}
            >
              <Center h="100%">
                <Stack align="center" gap="md">
                  <Loader size="lg" color="green.4" type="dots" />
                  <Text c="gray.4" ta="center">
                    Contact berichten laden...
                  </Text>
                </Stack>
              </Center>
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100%',
        width: '100%',
      }}
    >
      {/* Subtle background elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '5%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack gap="xl">
            {/* Header */}
            <motion.div variants={itemVariants}>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Title 
                    order={1}
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-green-4), var(--mantine-color-teal-4))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                      fontWeight: 900,
                      marginBottom: '0.5rem',
                    }}
                  >
                    Contact Berichten
                  </Title>
                  <Text 
                    size="lg" 
                    c="gray.3"
                    style={{
                      fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                    }}
                  >
                    Beheer en beantwoord contactformulier inzendingen
                  </Text>
                </Box>
                
                <Group gap="md" visibleFrom="sm">
                  <Box
                    style={{
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Group gap="xs">
                      <ThemeIcon
                        size="sm"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'green.6', to: 'teal.5' }}
                      >
                        <IconMessages size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600} c="green.3">
                        {totalCount} totaal
                      </Text>
                    </Group>
                  </Box>
                  
                  {unreadCount > 0 && (
                    <Box
                      style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Group gap="xs">
                        <ThemeIcon
                          size="sm"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'blue.6', to: 'cyan.5' }}
                        >
                          <IconMail size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={600} c="blue.3">
                          {unreadCount} nieuw
                        </Text>
                      </Group>
                    </Box>
                  )}
                </Group>
              </Group>
            </motion.div>

            {/* Error Alert */}
            {error && (
              <motion.div variants={itemVariants}>
                <Alert 
                  title="Fout bij laden" 
                  color="red" 
                  icon={<IconAlertCircle />}
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                  styles={{
                    title: {
                      color: 'var(--mantine-color-red-4)',
                    },
                    message: {
                      color: 'var(--mantine-color-red-3)',
                    }
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* Empty State */}
            {!error && submissions.length === 0 && (
              <motion.div variants={itemVariants}>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: 'var(--mantine-spacing-xl)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(30px)',
                    pointerEvents: 'none',
                  }} />

                  <Stack gap="md" align="center" style={{ position: 'relative', zIndex: 1 }}>
                    <ThemeIcon
                      size="xl"
                      radius="md"
                      variant="gradient"
                      gradient={{ from: 'green.6', to: 'teal.5' }}
                    >
                      <IconMessages size={32} />
                    </ThemeIcon>
                    <Text size="lg" fw={600} c="gray.2">
                      Nog geen contact berichten
                    </Text>
                    <Text size="sm" c="gray.4">
                      Wanneer bezoekers het contactformulier invullen, verschijnen hun berichten hier
                    </Text>
                  </Stack>
                </Box>
              </motion.div>
            )}

            {/* Contact Submissions Table */}
            {!error && submissions.length > 0 && (
              <motion.div variants={itemVariants}>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: 'var(--mantine-spacing-lg)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    pointerEvents: 'none',
                  }} />

                  <ContactSubmissionsTable initialSubmissions={submissions} />
                </Box>
              </motion.div>
            )}
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
} 
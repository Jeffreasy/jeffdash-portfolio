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
          padding: 'clamp(16px, 4vw, 24px)',
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
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
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
                borderRadius: 'clamp(8px, 2vw, 12px)',
                padding: 'clamp(16px, 4vw, 24px)',
                position: 'relative',
                minHeight: 'clamp(300px, 50vh, 400px)',
                width: '100%',
                maxWidth: 'clamp(300px, 90vw, 600px)',
              }}
            >
              <Center h="100%">
                <Stack align="center" gap="md">
                  <Loader size="lg" color="green.4" type="dots" />
                  <Text 
                    c="gray.4" 
                    ta="center"
                    style={{
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                    }}
                  >
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
        width: 'clamp(200px, 30vw, 250px)',
        height: 'clamp(200px, 30vw, 250px)',
        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <Container 
        size="xl" 
        style={{ 
          position: 'relative', 
          zIndex: 1,
          padding: 'clamp(16px, 4vw, 24px)',
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack gap="xl">
            {/* Header */}
            <motion.div variants={itemVariants}>
              <Group justify="space-between" align="flex-start" wrap="wrap">
                <Box style={{ flex: 1, minWidth: '250px' }}>
                  <Title 
                    order={1}
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-green-4), var(--mantine-color-teal-4))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                      fontWeight: 900,
                      marginBottom: 'clamp(8px, 2vw, 12px)',
                    }}
                  >
                    Contact Berichten
                  </Title>
                  <Text 
                    size="lg" 
                    c="gray.3"
                    style={{
                      fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                      lineHeight: 1.5,
                    }}
                  >
                    Beheer en beantwoord contactformulier inzendingen
                  </Text>
                </Box>
                
                <Group gap="md" visibleFrom="sm" wrap="wrap">
                  <Box
                    style={{
                      padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      borderRadius: 'clamp(6px, 1.5vw, 8px)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Group gap="xs">
                      <ThemeIcon
                        size="sm"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'green.6', to: 'teal.5' }}
                        style={{
                          minHeight: '32px',
                          minWidth: '32px',
                        }}
                      >
                        <IconMessages size={14} />
                      </ThemeIcon>
                      <Text 
                        size="sm" 
                        fw={600} 
                        c="green.3"
                        style={{
                          fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                        }}
                      >
                        {totalCount} totaal
                      </Text>
                    </Group>
                  </Box>
                  
                  {unreadCount > 0 && (
                    <Box
                      style={{
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                        border: '1px solid rgba(251, 146, 60, 0.2)',
                        borderRadius: 'clamp(6px, 1.5vw, 8px)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Group gap="xs">
                        <ThemeIcon
                          size="sm"
                          radius="md"
                          variant="gradient"
                          gradient={{ from: 'orange.6', to: 'yellow.5' }}
                          style={{
                            minHeight: '32px',
                            minWidth: '32px',
                          }}
                        >
                          <IconMail size={14} />
                        </ThemeIcon>
                        <Text 
                          size="sm" 
                          fw={600} 
                          c="orange.3"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                          }}
                        >
                          {unreadCount} ongelezen
                        </Text>
                      </Group>
                    </Box>
                  )}
                </Group>
              </Group>
            </motion.div>

            {/* Error Display */}
            {error && (
              <motion.div variants={itemVariants}>
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Fout bij laden van contactberichten"
                  color="red"
                  radius="md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* Contact Submissions Table */}
            <motion.div variants={itemVariants}>
              <Box
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(16px, 4vw, 24px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative element */}
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: 'clamp(80px, 20vw, 120px)',
                  height: 'clamp(80px, 20vw, 120px)',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(25px)',
                  pointerEvents: 'none',
                }} />

                <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
                  <Group gap="md">
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      variant="gradient"
                      gradient={{ from: 'teal.6', to: 'green.5' }}
                      style={{
                        minHeight: '44px',
                        minWidth: '44px',
                      }}
                    >
                      <IconMessages size={20} />
                    </ThemeIcon>
                    <Box>
                      <Title 
                        order={3} 
                        c="gray.1" 
                        size="h4"
                        style={{
                          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                          marginBottom: 'clamp(2px, 0.5vw, 4px)',
                        }}
                      >
                        Alle Contactberichten
                      </Title>
                      <Text 
                        size="sm" 
                        c="gray.4"
                        style={{
                          fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                        }}
                      >
                        {totalCount} {totalCount === 1 ? 'bericht' : 'berichten'} ontvangen
                        {unreadCount > 0 && ` • ${unreadCount} ongelezen`}
                      </Text>
                    </Box>
                  </Group>
                  
                  <ContactSubmissionsTable 
                    initialSubmissions={submissions} 
                  />
                </Stack>
              </Box>
            </motion.div>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
} 
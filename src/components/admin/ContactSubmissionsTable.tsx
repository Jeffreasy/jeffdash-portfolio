'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Group,
  Text,
  ActionIcon,
  Tooltip,
  Badge,
  Modal,
  Alert,
  Anchor,
  Box,
  Stack,
  ScrollArea,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCheck,
  IconEyeCheck,
  IconEyeOff,
  IconTrash,
  IconAlertCircle,
  IconX,
  IconMail,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import {
  ContactSubmissionType,
  toggleSubmissionReadStatus,
  deleteContactSubmission,
} from '@/lib/actions/contact';
import { notifications } from '@mantine/notifications';
import AdminErrorBoundary from './AdminErrorBoundary';

interface ContactSubmissionsTableProps {
  initialSubmissions: ContactSubmissionType[];
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

export default function ContactSubmissionsTable({
  initialSubmissions,
}: ContactSubmissionsTableProps) {
  // Validate initialSubmissions prop
  if (!Array.isArray(initialSubmissions)) {
    throw new Error('Initial submissions must be an array');
  }

  const [submissions, setSubmissions] = useState<ContactSubmissionType[]>(initialSubmissions);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmissionType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleRead = async (submission: ContactSubmissionType) => {
    if (!submission.id) {
      throw new Error('Invalid submission ID');
    }

    setIsToggling(submission.id);
    try {
      const result = await toggleSubmissionReadStatus(submission.id);
      if (result.success && typeof result.newState === 'boolean') {
        setSubmissions(currentSubmissions =>
          currentSubmissions.map(sub =>
            sub.id === submission.id ? { ...sub, isRead: result.newState! } : sub
          )
        );
        notifications.show({
          title: 'Status Gewijzigd',
          message: result.message,
          color: 'blue',
          icon: result.newState ? <IconEyeCheck size={16} /> : <IconEyeOff size={16} />,
          styles: {
            root: {
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              backdropFilter: 'blur(10px)',
              maxWidth: 'clamp(280px, 85vw, 400px)',
            },
            title: {
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            },
            description: {
              fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
            }
          },
        });
      } else {
        throw new Error(result.message || 'Kon status niet wijzigen.');
      }
    } catch (err: any) {
      console.error('Error toggling read status:', err);
      notifications.show({
        title: 'Fout',
        message: err.message || 'Kon de status niet wijzigen.',
        color: 'red',
        icon: <IconAlertCircle />,
        styles: {
          root: {
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(10px)',
            maxWidth: 'clamp(280px, 85vw, 400px)',
          },
          title: {
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          },
          description: {
            fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
          }
        },
      });
    } finally {
      setIsToggling(null);
    }
  };

  const openDeleteModal = (submission: ContactSubmissionType) => {
    if (!submission.id) {
      throw new Error('Invalid submission ID');
    }
    setSubmissionToDelete(submission);
    setError(null);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSubmissionToDelete(null);
    setShowDeleteModal(false);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!submissionToDelete?.id) {
      throw new Error('Invalid submission ID');
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteContactSubmission(submissionToDelete.id);
      if (result.success) {
        setSubmissions(currentSubmissions =>
          currentSubmissions.filter(sub => sub.id !== submissionToDelete.id)
        );
        notifications.show({
          title: 'Succes',
          message: result.message,
          color: 'green',
          icon: <IconCheck size={16} />,
          styles: {
            root: {
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              backdropFilter: 'blur(10px)',
              maxWidth: 'clamp(280px, 85vw, 400px)',
            },
            title: {
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            },
            description: {
              fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
            }
          },
        });
        closeDeleteModal();
      } else {
        throw new Error(result.message || 'Kon inzending niet verwijderen.');
      }
    } catch (err: any) {
      console.error('Error deleting submission:', err);
      setError(err.message || 'Kon de inzending niet verwijderen.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: Date) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Ongeldige datum';
    }
  };

  return (
    <AdminErrorBoundary componentName="Contact Submissions Table">
      <Box
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(12px, 3vw, 24px)',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {/* Decorative background element */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 'clamp(80px, 15vw, 120px)',
          height: 'clamp(80px, 15vw, 120px)',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <ScrollArea>
              <Table
                striped
                highlightOnHover
                style={{
                  minWidth: '800px', // Ensure table doesn't get too cramped
                }}
                styles={{
                  table: {
                    backgroundColor: 'transparent',
                  },
                  thead: {
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  },
                  th: {
                    color: 'var(--mantine-color-gray-2)',
                    fontWeight: 600,
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    padding: 'clamp(8px, 2vw, 16px)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    minWidth: 'clamp(100px, 15vw, 150px)',
                  },
                  td: {
                    color: 'var(--mantine-color-gray-3)',
                    padding: 'clamp(8px, 2vw, 16px)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: 'transparent',
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                  },
                  tr: {
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    },
                  },
                }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ minWidth: 'clamp(120px, 20vw, 150px)' }}>Naam</Table.Th>
                    <Table.Th style={{ minWidth: 'clamp(150px, 25vw, 200px)' }}>Email</Table.Th>
                    <Table.Th style={{ minWidth: 'clamp(200px, 35vw, 300px)' }}>Bericht (preview)</Table.Th>
                    <Table.Th style={{ minWidth: 'clamp(140px, 22vw, 180px)' }}>Ontvangen op</Table.Th>
                    <Table.Th style={{ minWidth: 'clamp(80px, 15vw, 100px)' }}>Status</Table.Th>
                    <Table.Th style={{ minWidth: 'clamp(100px, 18vw, 120px)' }}>Acties</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {submissions.length > 0 ? (
                    submissions.map((submission, index) => (
                      <motion.tr
                        key={submission.id}
                        variants={rowVariants}
                        custom={index}
                        style={{
                          backgroundColor: !submission.isRead 
                            ? 'rgba(59, 130, 246, 0.05)' 
                            : 'transparent',
                          borderLeft: !submission.isRead 
                            ? '3px solid var(--mantine-color-blue-4)' 
                            : 'none',
                        }}
                      >
                        <Table.Td>
                          <Text 
                            fw={submission.isRead ? 400 : 700} 
                            c={submission.isRead ? 'gray.3' : 'gray.1'}
                            style={{
                              WebkitFontSmoothing: 'antialiased',
                              MozOsxFontSmoothing: 'grayscale',
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              lineHeight: 1.4,
                            }}
                          >
                            {submission.name}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Anchor 
                            href={`mailto:${submission.email}`} 
                            size="sm"
                            style={{
                              color: 'var(--mantine-color-blue-4)',
                              textDecoration: 'none',
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              wordBreak: 'break-all',
                              '&:hover': {
                                color: 'var(--mantine-color-blue-3)',
                                textDecoration: 'underline',
                              }
                            }}
                          >
                            {submission.email}
                          </Anchor>
                        </Table.Td>
                        <Table.Td>
                          <Text 
                            size="sm" 
                            lineClamp={2}
                            c="gray.4"
                            style={{
                              lineHeight: 1.4,
                              WebkitFontSmoothing: 'antialiased',
                              MozOsxFontSmoothing: 'grayscale',
                              fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                              maxWidth: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {submission.message}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text 
                            size="sm" 
                            c="gray.4"
                            style={{
                              fontFamily: 'monospace',
                              fontSize: 'clamp(0.65rem, 1.6vw, 0.75rem)',
                              lineHeight: 1.3,
                              wordBreak: 'break-word',
                            }}
                          >
                            {formatDate(new Date(submission.createdAt))}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={submission.isRead ? 'gray' : 'blue'} 
                            variant="light"
                            style={{
                              background: submission.isRead 
                                ? 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)'
                                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                              border: `1px solid ${submission.isRead 
                                ? 'rgba(107, 114, 128, 0.2)' 
                                : 'rgba(59, 130, 246, 0.2)'}`,
                              color: submission.isRead 
                                ? 'var(--mantine-color-gray-4)' 
                                : 'var(--mantine-color-blue-3)',
                              fontWeight: 500,
                              fontSize: 'clamp(0.65rem, 1.6vw, 0.75rem)',
                              padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
                              borderRadius: 'clamp(4px, 1vw, 6px)',
                            }}
                          >
                            {submission.isRead ? 'Gelezen' : 'Nieuw'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Tooltip 
                              label={submission.isRead ? 'Markeer als ongelezen' : 'Markeer als gelezen'}
                              styles={{
                                tooltip: {
                                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(31, 41, 55, 0.8) 100%)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  color: 'var(--mantine-color-gray-2)',
                                  fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                                  borderRadius: 'clamp(4px, 1vw, 6px)',
                                },
                              }}
                            >
                              <ActionIcon
                                variant="subtle"
                                color={submission.isRead ? 'gray' : 'blue'}
                                onClick={() => handleToggleRead(submission)}
                                loading={isToggling === submission.id}
                                aria-label={submission.isRead ? 'Markeer als ongelezen' : 'Markeer als gelezen'}
                                style={{
                                  background: submission.isRead 
                                    ? 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)'
                                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                                  border: `1px solid ${submission.isRead 
                                    ? 'rgba(107, 114, 128, 0.2)' 
                                    : 'rgba(59, 130, 246, 0.2)'}`,
                                  minWidth: 'clamp(36px, 8vw, 44px)',
                                  minHeight: 'clamp(36px, 8vw, 44px)',
                                  borderRadius: 'clamp(4px, 1vw, 6px)',
                                  '&:hover': {
                                    background: submission.isRead 
                                      ? 'linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(75, 85, 99, 0.15) 100%)'
                                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
                                    transform: 'translateY(-1px)',
                                  },
                                }}
                              >
                                {submission.isRead ? <IconEyeOff size={16} /> : <IconEyeCheck size={16} />}
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip 
                              label="Verwijder inzending"
                              styles={{
                                tooltip: {
                                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(31, 41, 55, 0.8) 100%)',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  color: 'var(--mantine-color-gray-2)',
                                  fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                                  borderRadius: 'clamp(4px, 1vw, 6px)',
                                },
                              }}
                            >
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                onClick={() => openDeleteModal(submission)}
                                aria-label={`Verwijder inzending van ${submission.name}`}
                                style={{
                                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                                  border: '1px solid rgba(239, 68, 68, 0.2)',
                                  minWidth: 'clamp(36px, 8vw, 44px)',
                                  minHeight: 'clamp(36px, 8vw, 44px)',
                                  borderRadius: 'clamp(4px, 1vw, 6px)',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
                                    transform: 'translateY(-1px)',
                                  },
                                }}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </motion.tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Box
                          style={{
                            textAlign: 'center',
                            padding: 'clamp(24px, 6vw, 48px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 'clamp(12px, 3vw, 16px)',
                          }}
                        >
                          <ThemeIcon
                            size="xl"
                            radius="md"
                            variant="light"
                            color="gray"
                            style={{
                              width: 'clamp(48px, 10vw, 64px)',
                              height: 'clamp(48px, 10vw, 64px)',
                              background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)',
                              border: '1px solid rgba(107, 114, 128, 0.2)',
                            }}
                          >
                            <IconMail size={24} />
                          </ThemeIcon>
                          <Text 
                            c="gray.5" 
                            size="sm"
                            style={{
                              fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
                              lineHeight: 1.4,
                            }}
                          >
                            Geen contactinzendingen gevonden.
                          </Text>
                        </Box>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Box>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={showDeleteModal}
          onClose={closeDeleteModal}
          title="Inzending Verwijderen"
          centered
          size="sm"
          styles={{
            content: {
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              maxWidth: 'clamp(320px, 85vw, 500px)',
              width: '100%',
            },
            header: {
              background: 'transparent',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              padding: 'clamp(16px, 4vw, 24px)',
            },
            title: {
              color: 'var(--mantine-color-gray-1)',
              fontWeight: 600,
              fontSize: 'clamp(1rem, 3vw, 1.125rem)',
            },
            close: {
              color: 'var(--mantine-color-gray-3)',
              minWidth: 'clamp(32px, 6vw, 40px)',
              minHeight: 'clamp(32px, 6vw, 40px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
            body: {
              padding: 'clamp(16px, 4vw, 24px)',
            },
          }}
        >
          <Stack gap="md">
            {submissionToDelete && (
              <Text 
                c="gray.3" 
                size="sm" 
                style={{ 
                  lineHeight: 1.5,
                  fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
                }}
              >
                Weet je zeker dat je de inzending van{' '}
                <Text 
                  component="span" 
                  fw={600} 
                  c="gray.1"
                  style={{
                    fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
                  }}
                >
                  {submissionToDelete.name}
                </Text>{' '}
                ({submissionToDelete.email}) permanent wilt verwijderen?
                <br />
                <Text 
                  component="span" 
                  c="gray.4" 
                  size="xs"
                  style={{
                    fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                  }}
                >
                  Deze actie kan niet ongedaan worden gemaakt.
                </Text>
              </Text>
            )}
            
            {error && (
              <Alert 
                title="Fout bij verwijderen" 
                color="red" 
                icon={<IconAlertCircle />}
                styles={{
                  root: {
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 'clamp(6px, 1.5vw, 8px)',
                  },
                  title: {
                    color: 'var(--mantine-color-red-4)',
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  },
                  message: {
                    color: 'var(--mantine-color-red-3)',
                    fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
                  }
                }}
              >
                {error}
              </Alert>
            )}
            
            <Group justify="flex-end" gap="sm" style={{ flexWrap: 'wrap' }}>
              <Button 
                variant="subtle" 
                color="gray"
                onClick={closeDeleteModal} 
                disabled={isDeleting}
                style={{
                  background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)',
                  border: '1px solid rgba(107, 114, 128, 0.2)',
                  color: 'var(--mantine-color-gray-3)',
                  minHeight: '44px',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
                  borderRadius: 'clamp(6px, 1.5vw, 8px)',
                  flex: '1 1 auto',
                  minWidth: 'clamp(100px, 25vw, 120px)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(75, 85, 99, 0.15) 100%)',
                  },
                }}
              >
                Annuleren
              </Button>
              <Button 
                color="red" 
                onClick={handleDeleteConfirm} 
                loading={isDeleting}
                variant="gradient"
                gradient={{ from: 'red.6', to: 'red.7' }}
                style={{
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  fontWeight: 500,
                  minHeight: '44px',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
                  borderRadius: 'clamp(6px, 1.5vw, 8px)',
                  flex: '1 1 auto',
                  minWidth: 'clamp(120px, 30vw, 140px)',
                }}
              >
                {isDeleting ? 'Verwijderen...' : 'Verwijderen'}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Box>
    </AdminErrorBoundary>
  );
} 
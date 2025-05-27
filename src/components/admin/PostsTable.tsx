'use client';

import React from 'react';
import { Table, Button, Group, Text, Anchor, Badge, Box, ThemeIcon } from '@mantine/core';
import { IconPencil, IconTrash, IconCheck, IconX, IconEye, IconEyeOff } from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { deletePostAction } from '@/lib/actions/blog';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import type { AdminPostListItemType } from '@/lib/actions/blog';
import AdminErrorBoundary from './AdminErrorBoundary';

interface PostsTableProps {
  initialPosts: AdminPostListItemType[];
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

export default function PostsTable({ initialPosts }: PostsTableProps) {
  // Validate props
  if (!Array.isArray(initialPosts)) {
    throw new Error('Posts must be an array');
  }

  const openDeleteModal = (id: string, title: string) => {
    if (!id || !title) {
      throw new Error('Invalid post ID or title');
    }

    modals.openConfirmModal({
      title: 'Post Verwijderen',
      centered: true,
      styles: {
        content: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        header: {
          background: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        title: {
          color: 'var(--mantine-color-gray-1)',
          fontWeight: 600,
        },
      },
      children: (
        <Text size="sm" c="gray.3">
          Weet je zeker dat je de post <strong style={{ color: 'var(--mantine-color-gray-1)' }}>{title}</strong> permanent wilt verwijderen?
          Deze actie kan niet ongedaan worden gemaakt.
        </Text>
      ),
      labels: { confirm: 'Verwijderen', cancel: 'Annuleren' },
      confirmProps: { 
        color: 'red',
        variant: 'gradient',
        gradient: { from: 'red.6', to: 'red.7' },
      },
      cancelProps: {
        variant: 'subtle',
        color: 'gray',
      },
      onCancel: () => {
        try {
          console.log('Verwijderen geannuleerd');
        } catch (err) {
          console.error('Error in cancel handler:', err);
        }
      },
      onConfirm: () => {
        try {
          console.log('Start verwijderen post met ID:', id);
          const notificationId = notifications.show({
            loading: true,
            title: 'Post Verwijderen',
            message: `Post "${title}" wordt verwijderd...`,
            autoClose: false,
            withCloseButton: false,
            styles: {
              root: {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              },
            },
          });

          deletePostAction(id)
            .then(result => {
              try {
                if (result.success) {
                  notifications.update({
                    id: notificationId,
                    color: 'teal',
                    title: 'Succes!',
                    message: result.message || 'Post succesvol verwijderd.',
                    icon: <IconCheck size={16} />,
                    loading: false,
                    autoClose: 5000,
                    withCloseButton: true,
                    styles: {
                      root: {
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        backdropFilter: 'blur(10px)',
                      },
                    },
                  });
                  // Reload page to refresh data
                  window.location.reload();
                } else {
                  notifications.update({
                    id: notificationId,
                    color: 'red',
                    title: 'Fout!',
                    message: result.message || 'Kon post niet verwijderen.',
                    icon: <IconX size={16} />,
                    loading: false,
                    autoClose: 7000,
                    withCloseButton: true,
                    styles: {
                      root: {
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        backdropFilter: 'blur(10px)',
                      },
                    },
                  });
                }
              } catch (err) {
                console.error('Error handling delete result:', err);
                notifications.update({
                  id: notificationId,
                  color: 'red',
                  title: 'Fout!',
                  message: 'Er is een fout opgetreden bij het verwerken van het resultaat.',
                  icon: <IconX size={16} />,
                  loading: false,
                  autoClose: 7000,
                  withCloseButton: true,
                });
              }
            })
            .catch(error => {
              console.error('Onverwachte fout bij aanroepen delete action:', error);
              notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Onverwachte Fout!',
                message: 'Er is een onverwachte serverfout opgetreden.',
                icon: <IconX size={16} />,
                loading: false,
                autoClose: 7000,
                withCloseButton: true,
              });
            });
        } catch (err) {
          console.error('Error in confirm handler:', err);
          notifications.show({
            title: 'Fout!',
            message: 'Er is een onverwachte fout opgetreden.',
            color: 'red',
            icon: <IconX size={16} />,
          });
        }
      },
    });
  };

  const formatDate = (dateString: string | null): string => {
    try {
      if (!dateString) return 'Ongeldige datum';
      
      const date = new Date(dateString);
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return 'Ongeldige datum';
      }

      return date.toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Ongeldige datum';
    }
  };

  const rows = initialPosts.map((post, index) => {
    try {
      if (!post.id || !post.title || !post.slug) {
        throw new Error('Invalid post data');
      }

      return (
        <motion.tr
          key={post.id}
          variants={rowVariants}
          custom={index}
          style={{
            background: post.published 
              ? 'transparent' 
              : 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.05) 100%)',
          }}
        >
          <Table.Td>
            <Group gap="xs">
              <ThemeIcon
                size="sm"
                radius="md"
                variant="gradient"
                gradient={post.published 
                  ? { from: 'green.6', to: 'teal.5' }
                  : { from: 'orange.6', to: 'red.5' }
                }
              >
                {post.published ? <IconEye size={12} /> : <IconEyeOff size={12} />}
              </ThemeIcon>
              <Anchor 
                component={Link} 
                href={`/admin_area/posts/${post.slug}`}
                style={{
                  color: 'var(--mantine-color-blue-4)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--mantine-color-blue-3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--mantine-color-blue-4)';
                }}
              >
                {post.title}
              </Anchor>
            </Group>
          </Table.Td>
          <Table.Td>
            <Text size="sm" c="gray.4" ff="monospace">
              {post.slug}
            </Text>
          </Table.Td>
          <Table.Td>
            {post.category ? (
              <Badge
                variant="light"
                color="violet"
                size="sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: 'var(--mantine-color-violet-4)',
                }}
              >
                {post.category}
              </Badge>
            ) : (
              <Text size="sm" c="gray.5">-</Text>
            )}
          </Table.Td>
          <Table.Td>
            <Badge
              variant="light"
              color={post.published ? 'green' : 'orange'}
              size="sm"
              style={{
                background: post.published 
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
                border: `1px solid rgba(${post.published ? '34, 197, 94' : '249, 115, 22'}, 0.2)`,
                color: post.published ? 'var(--mantine-color-green-4)' : 'var(--mantine-color-orange-4)',
              }}
            >
              {post.published ? 'Gepubliceerd' : 'Concept'}
            </Badge>
          </Table.Td>
          <Table.Td>
            <Text size="sm" c="gray.3">
              {formatDate(post.createdAt)}
            </Text>
          </Table.Td>
          <Table.Td>
            <Group gap="xs">
              <Button 
                component={Link} 
                href={`/admin_area/posts/${post.slug}`} 
                variant="subtle"
                color="blue"
                size="xs"
                leftSection={<IconPencil size={14} />}
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
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
                onClick={() => openDeleteModal(post.id, post.title)}
                leftSection={<IconTrash size={14} />}
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
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
    } catch (err) {
      console.error('Error rendering post row:', err);
      return null;
    }
  }).filter(Boolean);

  return (
    <AdminErrorBoundary componentName="Posts Table">
      <Box
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          <Table
            striped
            highlightOnHover
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
                fontSize: '0.875rem',
                padding: '1rem',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
              },
              td: {
                color: 'var(--mantine-color-gray-2)',
                padding: '1rem',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
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
                <Table.Th>Post</Table.Th>
                <Table.Th>Slug</Table.Th>
                <Table.Th>Categorie</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Aangemaakt</Table.Th>
                <Table.Th>Acties</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Box
                      style={{
                        textAlign: 'center',
                        padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                        borderRadius: '8px',
                        margin: '1rem',
                      }}
                    >
                      <ThemeIcon
                        size="xl"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'gray.6', to: 'gray.7' }}
                        mb="md"
                        mx="auto"
                      >
                        <IconEyeOff size={24} />
                      </ThemeIcon>
                      <Text c="gray.4" size="lg" fw={500}>
                        Geen posts gevonden
                      </Text>
                      <Text c="gray.5" size="sm" mt="xs">
                        Begin met schrijven om je eerste post te maken
                      </Text>
                    </Box>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </motion.div>
      </Box>
    </AdminErrorBoundary>
  );
} 
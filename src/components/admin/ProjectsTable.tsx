'use client';

import React from 'react';
import { Table, Button, Group, Text, Anchor, Badge, Box, ThemeIcon } from '@mantine/core';
import { IconPencil, IconTrash, IconCheck, IconX, IconStar, IconStarOff, IconFolder } from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { deleteProjectAction } from '@/lib/actions/projects';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
// Importeer het AdminProjectListItemType
import type { AdminProjectListItemType } from '@/lib/actions/projects';
import AdminErrorBoundary from './AdminErrorBoundary';

interface ProjectsTableProps {
  projects: AdminProjectListItemType[]; // Gebruik het nieuwe type
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

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  // Validate props
  if (!Array.isArray(projects)) {
    throw new Error('Projects must be an array');
  }

  const openDeleteModal = (id: string, title: string) => {
    if (!id || !title) {
      throw new Error('Invalid project ID or title');
    }

    modals.openConfirmModal({
      title: 'Project Verwijderen',
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
          Weet je zeker dat je het project <strong style={{ color: 'var(--mantine-color-gray-1)' }}>{title}</strong> permanent wilt verwijderen?
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
          console.log('Start verwijderen project met ID:', id);
          const notificationId = notifications.show({
            loading: true,
            title: 'Project Verwijderen',
            message: `Project "${title}" wordt verwijderd...`,
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

          deleteProjectAction(id)
            .then(result => {
              try {
                if (result.success) {
                  notifications.update({
                    id: notificationId,
                    color: 'teal',
                    title: 'Succes!',
                    message: result.message || 'Project succesvol verwijderd.',
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
                } else {
                  notifications.update({
                    id: notificationId,
                    color: 'red',
                    title: 'Fout!',
                    message: result.message || 'Kon project niet verwijderen.',
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

  const rows = projects.map((project, index) => {
    try {
      if (!project.id || !project.title || !project.slug) {
        throw new Error('Invalid project data');
      }

      return (
        <motion.tr
          key={project.id}
          variants={rowVariants}
          custom={index}
          style={{
            background: project.isFeatured 
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)'
              : 'transparent',
          }}
        >
          <Table.Td>
            <Group gap="xs">
              <ThemeIcon
                size="sm"
                radius="md"
                variant="gradient"
                gradient={project.isFeatured 
                  ? { from: 'yellow.6', to: 'orange.5' }
                  : { from: 'gray.6', to: 'gray.7' }
                }
              >
                {project.isFeatured ? <IconStar size={12} /> : <IconStarOff size={12} />}
              </ThemeIcon>
              <Anchor 
                component={Link} 
                href={`/admin_area/projects/${project.slug}`}
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
                {project.title}
              </Anchor>
            </Group>
          </Table.Td>
          <Table.Td>
            <Text size="sm" c="gray.4" ff="monospace">
              {project.slug}
            </Text>
          </Table.Td>
          <Table.Td>
            {project.category ? (
              <Badge
                variant="light"
                color="blue"
                size="sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: 'var(--mantine-color-blue-4)',
                }}
              >
                {project.category}
              </Badge>
            ) : (
              <Text size="sm" c="gray.5">-</Text>
            )}
          </Table.Td>
          <Table.Td>
            <Badge
              variant="light"
              color={project.isFeatured ? 'yellow' : 'gray'}
              size="sm"
              style={{
                background: project.isFeatured 
                  ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)',
                border: `1px solid rgba(${project.isFeatured ? '251, 191, 36' : '107, 114, 128'}, 0.2)`,
                color: project.isFeatured ? 'var(--mantine-color-yellow-4)' : 'var(--mantine-color-gray-4)',
              }}
            >
              {project.isFeatured ? 'Featured' : 'Standaard'}
            </Badge>
          </Table.Td>
          <Table.Td>
            <Text size="sm" c="gray.3">
              {formatDate(project.createdAt)}
            </Text>
          </Table.Td>
          <Table.Td>
            <Group gap="xs">
              <Button 
                component={Link} 
                href={`/admin_area/projects/${project.slug}`} 
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
                onClick={() => openDeleteModal(project.id, project.title)}
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
      console.error('Error rendering project row:', err);
      return null;
    }
  }).filter(Boolean);

  return (
    <AdminErrorBoundary componentName="Projects Table">
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
                <Table.Th>Project</Table.Th>
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
                        <IconFolder size={24} />
                      </ThemeIcon>
                      <Text c="gray.4" size="lg" fw={500}>
                        Geen projecten gevonden
                      </Text>
                      <Text c="gray.5" size="sm" mt="xs">
                        Voeg je eerste project toe om te beginnen
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
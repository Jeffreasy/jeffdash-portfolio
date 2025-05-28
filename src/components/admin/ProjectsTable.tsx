'use client';

import React from 'react';
import { Table, Button, Group, Text, Anchor, Badge, Box, ThemeIcon, ScrollArea } from '@mantine/core';
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
          maxWidth: 'clamp(300px, 90vw, 500px)',
          margin: 'clamp(12px, 3vw, 24px)',
        },
        header: {
          background: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 'clamp(12px, 3vw, 20px)',
        },
        title: {
          color: 'var(--mantine-color-gray-1)',
          fontWeight: 600,
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
        },
        body: {
          padding: 'clamp(12px, 3vw, 20px)',
        },
      },
      children: (
        <Text 
          size="sm" 
          c="gray.3"
          style={{
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            lineHeight: 1.5,
          }}
        >
          Weet je zeker dat je het project <strong style={{ color: 'var(--mantine-color-gray-1)' }}>{title}</strong> permanent wilt verwijderen?
          Deze actie kan niet ongedaan worden gemaakt.
        </Text>
      ),
      labels: { confirm: 'Verwijderen', cancel: 'Annuleren' },
      confirmProps: { 
        color: 'red',
        variant: 'gradient',
        gradient: { from: 'red.6', to: 'red.7' },
        style: {
          minHeight: '44px',
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
        }
      },
      cancelProps: {
        variant: 'subtle',
        color: 'gray',
        style: {
          minHeight: '44px',
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
        }
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
          <Table.Td style={{ minWidth: 'clamp(180px, 25vw, 250px)' }}>
            <Group gap="xs" wrap="nowrap">
              <ThemeIcon
                size="sm"
                radius="md"
                variant="gradient"
                gradient={project.isFeatured 
                  ? { from: 'yellow.6', to: 'orange.5' }
                  : { from: 'gray.6', to: 'gray.7' }
                }
                style={{ flexShrink: 0 }}
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
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
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
          <Table.Td style={{ minWidth: 'clamp(120px, 20vw, 180px)' }}>
            <Text 
              size="sm" 
              c="gray.4" 
              ff="monospace"
              style={{
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                wordBreak: 'break-all',
                lineHeight: 1.4,
              }}
            >
              {project.slug}
            </Text>
          </Table.Td>
          <Table.Td style={{ minWidth: 'clamp(100px, 15vw, 140px)' }}>
            {project.category ? (
              <Badge
                variant="light"
                color="blue"
                size="sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: 'var(--mantine-color-blue-4)',
                  fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                  padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 12px)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {project.category}
              </Badge>
            ) : (
              <Text 
                size="sm" 
                c="gray.5"
                style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                }}
              >
                -
              </Text>
            )}
          </Table.Td>
          <Table.Td style={{ minWidth: 'clamp(100px, 15vw, 140px)' }}>
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
                fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 12px)',
                whiteSpace: 'nowrap',
              }}
            >
              {project.isFeatured ? 'Featured' : 'Standaard'}
            </Badge>
          </Table.Td>
          <Table.Td style={{ minWidth: 'clamp(100px, 15vw, 140px)' }}>
            <Text 
              size="sm" 
              c="gray.3"
              style={{
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                whiteSpace: 'nowrap',
              }}
            >
              {formatDate(project.createdAt)}
            </Text>
          </Table.Td>
          <Table.Td style={{ minWidth: 'clamp(160px, 25vw, 200px)' }}>
            <Group gap="xs" wrap="nowrap">
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
                  minHeight: '36px',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)',
                  flexShrink: 0,
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
                  minHeight: '36px',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
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
                minWidth: 'clamp(800px, 100vw, 1200px)',
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
                          gradient={{ from: 'gray.6', to: 'gray.7' }}
                          mb="md"
                          mx="auto"
                          style={{
                            width: 'clamp(48px, 8vw, 64px)',
                            height: 'clamp(48px, 8vw, 64px)',
                          }}
                        >
                          <IconFolder size={24} />
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
                          Geen projecten gevonden
                        </Text>
                        <Text 
                          c="gray.5" 
                          size="sm" 
                          mt="xs"
                          style={{
                            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                          }}
                        >
                          Voeg je eerste project toe om te beginnen
                        </Text>
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </motion.div>
      </Box>
    </AdminErrorBoundary>
  );
} 
'use client';

import React from 'react';
import { Table, Button, Group, Text, Anchor } from '@mantine/core';
import { IconPencil, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { deleteProjectAction } from '@/lib/actions/projects';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
// Importeer het AdminProjectListItemType
import type { AdminProjectListItemType } from '@/lib/actions/projects';

interface ProjectsTableProps {
  projects: AdminProjectListItemType[]; // Gebruik het nieuwe type
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {

  const openDeleteModal = (id: string, title: string) =>
    modals.openConfirmModal({
      title: 'Project Verwijderen',
      centered: true,
      children: (
        <Text size="sm">
          Weet je zeker dat je het project <strong>{title}</strong> permanent wilt verwijderen?
          Deze actie kan niet ongedaan worden gemaakt.
        </Text>
      ),
      labels: { confirm: 'Verwijderen', cancel: 'Annuleren' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Verwijderen geannuleerd'),
      onConfirm: () => {
        console.log('Start verwijderen project met ID:', id);
        const notificationId = notifications.show({
          loading: true,
          title: 'Project Verwijderen',
          message: `Project "${title}" wordt verwijderd...`,
          autoClose: false,
          withCloseButton: false,
        });

        deleteProjectAction(id)
          .then(result => {
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
      },
    });

  const rows = projects.map((project) => {
    // Controleer of createdAt een geldige datumstring is
    const createdAtDate = project.createdAt ? new Date(project.createdAt) : null;
    const formattedDate = createdAtDate instanceof Date && !isNaN(createdAtDate.getTime())
      ? createdAtDate.toLocaleDateString('nl-NL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      : 'Ongeldige datum';

    return (
      <Table.Tr key={project.id}>
        <Table.Td>
          <Anchor component={Link} href={`/admin_area/projects/${project.slug}`}>
            {project.title}
          </Anchor>
        </Table.Td>
        <Table.Td>{project.slug}</Table.Td>
        <Table.Td>{project.category || '-'}</Table.Td>
        <Table.Td>{project.isFeatured ? 'Ja' : 'Nee'}</Table.Td>
        <Table.Td>{formattedDate}</Table.Td>
        <Table.Td>
          <Group gap="xs">
            <Button 
              component={Link} 
              href={`/admin_area/projects/${project.slug}`} 
              variant="light" 
              size="xs"
              leftSection={<IconPencil size={14} />}
            >
              Bewerken
            </Button>
            <Button 
              variant="light" 
              color="red" 
              size="xs" 
              onClick={() => openDeleteModal(project.id, project.title)}
              leftSection={<IconTrash size={14} />}
            >
              Verwijderen
            </Button>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Titel</Table.Th>
          <Table.Th>Slug</Table.Th>
          <Table.Th>Categorie</Table.Th>
          <Table.Th>Featured</Table.Th>
          <Table.Th>Aangemaakt</Table.Th>
          <Table.Th>Acties</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
} 
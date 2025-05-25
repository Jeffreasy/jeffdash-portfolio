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
  Paper,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconCheck,
  IconEyeCheck,
  IconEyeOff,
  IconTrash,
  IconAlertCircle,
} from '@tabler/icons-react';
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

export default function ContactSubmissionsTable({
  initialSubmissions,
}: ContactSubmissionsTableProps) {
  // Validate initialSubmissions prop
  if (!Array.isArray(initialSubmissions)) {
    throw new Error('Initial submissions must be an array');
  }

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
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
          icon: <IconTrash size={16} />,
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
      <Paper shadow="md" p="md" withBorder>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Naam</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th style={{ minWidth: '250px' }}>Bericht (preview)</Table.Th>
              <Table.Th>Ontvangen op</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Acties</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <Table.Tr 
                  key={submission.id} 
                  bg={submission.isRead ? undefined : (colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0])}
                >
                  <Table.Td>
                    <Text fw={submission.isRead ? 400 : 700}>{submission.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Anchor href={`mailto:${submission.email}`} size="sm">
                      {submission.email}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={2}>{submission.message}</Text>
                  </Table.Td>
                  <Table.Td>{formatDate(new Date(submission.createdAt))}</Table.Td>
                  <Table.Td>
                    <Badge color={submission.isRead ? 'gray' : 'blue'} variant="light">
                      {submission.isRead ? 'Gelezen' : 'Nieuw'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Tooltip label={submission.isRead ? 'Markeer als ongelezen' : 'Markeer als gelezen'}>
                        <ActionIcon
                          variant="subtle"
                          color={submission.isRead ? 'gray' : 'blue'}
                          onClick={() => handleToggleRead(submission)}
                          loading={isToggling === submission.id}
                          aria-label={submission.isRead ? 'Markeer als ongelezen' : 'Markeer als gelezen'}
                        >
                          {submission.isRead ? <IconEyeOff size={16} /> : <IconEyeCheck size={16} />}
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Verwijder inzending">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => openDeleteModal(submission)}
                          aria-label={`Verwijder inzending van ${submission.name}`}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" c="dimmed">
                    Geen contactinzendingen gevonden.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>

        <Modal
          opened={showDeleteModal}
          onClose={closeDeleteModal}
          title="Inzending Verwijderen Bevestigen"
          centered
          size="sm"
        >
          {submissionToDelete && (
            <Text mb="md">
              Weet je zeker dat je de inzending van "{submissionToDelete.name}" ({submissionToDelete.email}) wilt verwijderen?
              Deze actie kan niet ongedaan worden gemaakt.
            </Text>
          )}
          {error && (
            <Alert title="Fout bij verwijderen" color="red" icon={<IconAlertCircle />} mb="md">
              {error}
            </Alert>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal} disabled={isDeleting}>
              Annuleren
            </Button>
            <Button color="red" onClick={handleDeleteConfirm} loading={isDeleting}>
              Verwijderen
            </Button>
          </Group>
        </Modal>
      </Paper>
    </AdminErrorBoundary>
  );
} 
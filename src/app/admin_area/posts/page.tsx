'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Group,
  Title,
  Anchor,
  Text,
  LoadingOverlay,
  ActionIcon,
  useMantineTheme,
  Modal,
  Alert,
} from '@mantine/core';
import { IconPencil, IconTrash, IconPlus, IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';
import {
  getPosts, // Haalt alle posts op
  deletePostAction, // Voor verwijderen
  AdminPostListItemType, // Type voor de post in de lijst
} from '@/lib/actions/blog';
import { notifications } from '@mantine/notifications'; // Importeer notifications

export default function PostsAdminPage() {
  const theme = useMantineTheme();
  const [posts, setPosts] = useState<AdminPostListItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<AdminPostListItemType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Haal posts op bij het laden van de component
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError('Kon de blogposts niet laden.');
        notifications.show({
          title: 'Fout bij laden',
          message: 'Kon de blogposts niet ophalen.',
          color: 'red',
          icon: <IconAlertCircle />,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Functie om het verwijder modal te openen
  const openDeleteModal = (post: AdminPostListItemType) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  // Functie om het verwijder modal te sluiten
  const closeDeleteModal = () => {
    setPostToDelete(null);
    setShowDeleteModal(false);
  };

  // Functie om de post daadwerkelijk te verwijderen
  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deletePostAction(postToDelete.id);
      if (result.success) {
        setPosts(posts.filter((p) => p.id !== postToDelete.id)); // Verwijder uit state
        notifications.show({
          title: 'Succes',
          message: 'Blogpost succesvol verwijderd.',
          color: 'green',
        });
        closeDeleteModal();
      } else {
        throw new Error(result.message || 'Kon de post niet verwijderen.');
      }
    } catch (err: any) {
      console.error("Error deleting post:", err);
      setError(err.message || 'Er is een fout opgetreden bij het verwijderen.');
      notifications.show({
        title: 'Verwijderen Mislukt',
        message: err.message || 'Kon de post niet verwijderen.',
        color: 'red',
        icon: <IconAlertCircle />,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const rows = posts.map((post) => (
    <Table.Tr key={post.id}>
      <Table.Td>
        <Anchor component={Link} href={`/admin_area/posts/${post.slug}`}>
          {post.title}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">{post.slug}</Text>
      </Table.Td>
      <Table.Td>{post.category || '-'}</Table.Td>
      <Table.Td>{post.published ? 'Ja' : 'Nee'}</Table.Td>
      <Table.Td>
        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '-'}
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="blue"
            component={Link}
            href={`/admin_area/posts/${post.slug}`}
            aria-label={`Bewerk post ${post.title}`}
          >
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => openDeleteModal(post)}
            aria-label={`Verwijder post ${post.title}`}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Blogposts Beheren</Title>
        <Button
          component={Link}
          href="/admin_area/posts/new"
          leftSection={<IconPlus size={14} />}
        >
          Nieuwe Post
        </Button>
      </Group>

      {error && (
        <Alert title="Fout" color="red" icon={<IconAlertCircle />} mb="md">
          {error}
        </Alert>
      )}

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Titel</Table.Th>
              <Table.Th>Slug</Table.Th>
              <Table.Th>Categorie</Table.Th>
              <Table.Th>Gepubliceerd</Table.Th>
              <Table.Th>Aangemaakt op</Table.Th>
              <Table.Th>Acties</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text ta="center" c="dimmed">
                    {loading ? 'Bezig met laden...' : 'Geen posts gevonden.'}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={showDeleteModal}
        onClose={closeDeleteModal}
        title="Post Verwijderen Bevestigen"
        centered
        size="sm"
      >
        {postToDelete && (
          <Text mb="md">
            Weet je zeker dat je de post "{postToDelete.title}" wilt verwijderen?
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
    </div>
  );
} 
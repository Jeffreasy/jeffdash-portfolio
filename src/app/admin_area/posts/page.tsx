import React from 'react';
import { Title, Text, Button, Alert } from '@mantine/core';
import Link from 'next/link';
import { IconInfoCircle, IconPlus } from '@tabler/icons-react';
import PostsTable from '@/components/admin/PostsTable'; // Importeer de client tabel component
import { getPosts, AdminPostListItemType } from '@/lib/actions/blog';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const AdminPostsPage = async () => {
  let posts: AdminPostListItemType[] = [];
  let fetchError = null;

  try {
    posts = await getPosts();
  } catch (error) {
    console.error("Fout bij ophalen posts voor admin:", error);
    fetchError = (error instanceof Error) ? error.message : "Kon posts niet laden door een serverfout.";
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Title order={2}>Blogposts Beheren</Title>
        <Button
          component={Link}
          href="/admin_area/posts/new"
          leftSection={<IconPlus size={14} />}
        >
          Nieuwe Post
        </Button>
      </div>

      {/* Toon foutmelding indien ophalen mislukt */}
      {fetchError && (
        <Alert icon={<IconInfoCircle size="1rem" />} title="Fout" color="red" mb="xl">
          {fetchError}
        </Alert>
      )}

      {/* Toon posts in een tabel */}
      {!fetchError && posts.length === 0 && (
        <Text>Nog geen posts gevonden.</Text>
      )}
      {!fetchError && posts.length > 0 && (
        <PostsTable initialPosts={posts} /> 
      )}
    </div>
  );
};

export default AdminPostsPage; 
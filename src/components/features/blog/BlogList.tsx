import React from 'react';
import { SimpleGrid, Container, Title, Text } from '@mantine/core';
import BlogPostCard from './BlogPostCard'; // Importeer de kaart component
import type { PublishedPostPreviewType } from '@/lib/actions/blog'; // Importeer het post preview type

// Definieer de props voor BlogList
interface BlogListProps {
  posts: PublishedPostPreviewType[];
}

export default function BlogList({ posts }: BlogListProps) {
  // Toon een bericht als er geen posts zijn
  if (!posts || posts.length === 0) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
        <Text ta="center" c="dimmed">Momenteel geen blog posts om weer te geven.</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
      {/* Optionele titel voor de blog sectie */}
      <Title order={2} ta="center" mb="xl">
        Recente Blog Posts
      </Title>

      {/* Grid met Blog Post Kaarten */}
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }} // Responsive kolommen
        spacing="xl" // Ruimte tussen de kaarten
      >
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </SimpleGrid>

      {/* TODO: Voeg hier eventueel paginering toe als er veel posts zijn */}
    </Container>
  );
} 
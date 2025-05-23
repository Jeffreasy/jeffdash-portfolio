'use client';

import React from 'react';
import { Container, Title, Text, Paper, Group, Badge, Stack, AspectRatio, Image as MantineImage, Button } from '@mantine/core';
import Link from 'next/link';
import { IconCalendar, IconTag, IconCategory } from '@tabler/icons-react';
import type { FullPostType } from '@/lib/actions/blog'; // Import het volledige type
import { formatDate } from '@/lib/utils';
import MarkdownRenderer from '@/components/shared/MarkdownRenderer'; // Importeer de renderer
import BlogErrorBoundary from './BlogErrorBoundary';

interface BlogPostDetailViewProps {
  post: FullPostType | null; // Accepteer ook null voor niet gevonden posts
}

export default function BlogPostDetailView({ post }: BlogPostDetailViewProps) {
  // Valideer post object als het niet null is
  if (post && typeof post !== 'object') {
    throw new Error('Invalid post data');
  }

  // Toon bericht als post niet gevonden is
  if (!post) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder p="xl" radius="md" ta="center">
          <Title order={2} mb="md">Blog Post niet gevonden</Title>
          <Text c="dimmed" mb="xl">
            De post die je zoekt kon niet worden geladen.
          </Text>
          <Button component={Link} href="/blog">
            Terug naar blog
          </Button>
        </Paper>
      </Container>
    );
  }

  const fallbackImage = 'https://via.placeholder.com/800x450/dee2e6/868e96.png?text=Blog+Post';

  return (
    <BlogErrorBoundary>
      <Container size="md" py="xl">
        <Stack gap="xl">
          {/* Optionele hoofdafbeelding bovenaan */}
          {post.featuredImageUrl && (
            <Paper shadow="md" radius="md" style={{ overflow: 'hidden'}} >
              <AspectRatio ratio={16 / 9}>
                <MantineImage
                  src={post.featuredImageUrl}
                  alt={post.featuredImageAltText || post.title}
                  fallbackSrc={fallbackImage}
                  onError={(e) => {
                    console.error(`Error loading featured image for post ${post.id}:`, e);
                  }}
                />
              </AspectRatio>
            </Paper>
          )}

          {/* Titel */}
          <Title order={1}>{post.title}</Title>

          {/* Metadata: Datum, Categorie, Tags */}
          <Group gap="lg">
            {post.publishedAt && (
              <Group gap="xs">
                <IconCalendar size={16} stroke={1.5} />
                <Text size="sm" c="dimmed">{formatDate(post.publishedAt)}</Text>
              </Group>
            )}
            {post.category && (
               <Group gap="xs">
                <IconCategory size={16} stroke={1.5} />
                <Badge variant="light" color="blue">{post.category}</Badge>
              </Group>
            )}
          </Group>
          {post.tags && post.tags.length > 0 && (
              <Group gap="xs">
                  <IconTag size={16} stroke={1.5} style={{ alignSelf: 'flex-start' }}/>
                  <Stack gap={4} style={{ flexWrap: 'wrap' }}>
                    {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                        {tag}
                        </Badge>
                    ))}
                  </Stack>
              </Group>
          )}

          {/* Inhoud van de blogpost */}
          {post.content && (
            <Paper p="md" radius="md">
              <MarkdownRenderer>{post.content}</MarkdownRenderer>
            </Paper>
          )}
        </Stack>
      </Container>
    </BlogErrorBoundary>
  );
} 
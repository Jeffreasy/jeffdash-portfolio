'use client'; // Image, Link etc. vereisen client-side

import React from 'react';
import Link from 'next/link';
import { Card, Image, Text, Stack, Badge, Group, Button, AspectRatio } from '@mantine/core';
import type { PublishedPostPreviewType } from '@/lib/actions/blog';
import { formatDate } from '@/lib/utils'; // Utility functie om datum te formatteren (moet mogelijk aangemaakt worden)
import BlogErrorBoundary from './BlogErrorBoundary';

type BlogPostCardProps = {
  post: PublishedPostPreviewType;
};

export default function BlogPostCard({ post }: BlogPostCardProps) {
  // Valideer post object
  if (!post || typeof post !== 'object') {
    throw new Error('Invalid post data');
  }

  const fallbackImage = 'https://via.placeholder.com/400x200/dee2e6/868e96.png?text=Blog+Post';

  return (
    <BlogErrorBoundary>
      <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
        <Card.Section>
          <AspectRatio ratio={16 / 9}>
            <Image
              src={post.featuredImageUrl || fallbackImage}
              alt={post.featuredImageAltText || post.title}
              fallbackSrc={fallbackImage} // Fallback voor als src laden mislukt
              onError={(e) => {
                console.error(`Error loading image for post ${post.id}:`, e);
              }}
            />
          </AspectRatio>
        </Card.Section>

        <Stack mt="md" mb="xs" gap="xs" style={{ flexGrow: 1 }}>
          {/* Categorie en Datum */}
          <Group justify="space-between">
              {post.category && (
                  <Badge size="sm" variant="light" color="blue">{post.category}</Badge>
              )}
              {post.publishedAt && (
                  <Text size="xs" c="dimmed">
                      {formatDate(post.publishedAt)} {/* Gebruik formatDate utility */}
                  </Text>
              )}
          </Group>

          {/* Titel */}
          <Text fw={600} size="lg" lineClamp={2} component={Link} href={`/blog/${post.slug}`} td="none">
            {post.title}
          </Text>

          {/* Excerpt */}
          {post.excerpt && (
            <Text size="sm" c="dimmed" lineClamp={3}>
              {post.excerpt}
            </Text>
          )}

          {/* Tags */}
          <Group gap="xs" mt="auto">
            {post.tags?.slice(0, 3).map((tag: string) => (
              <Badge key={tag} size="sm" variant="outline">
                {tag}
              </Badge>
            ))}
            {post.tags && post.tags.length > 3 && (
               <Badge size="sm" variant="transparent">+{post.tags.length - 3}</Badge>
            )}
          </Group>
        </Stack>

        {/* Knop naar detailpagina (optioneel, titel is al een link) */}
        {/* Kan vervangen/aangevuld worden met bv. een 'Lees Meer' link */}
        {/* <Button
          component={Link}
          href={`/blog/${post.slug}`}
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
        >
          Lees Meer
        </Button> */}
      </Card>
    </BlogErrorBoundary>
  );
} 
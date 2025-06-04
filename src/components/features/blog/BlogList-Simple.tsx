'use client';

import React, { useState, useEffect } from 'react';
import { SimpleGrid, Container, Title, Text, Box, Stack, Center, Loader } from '@mantine/core';
import BlogPostCard from './BlogPostCard';
import type { PaginatedPostsResult } from '@/lib/actions/blog';

interface BlogListSimpleProps {
  initialData?: PaginatedPostsResult;
}

export default function BlogListSimple({ initialData }: BlogListSimpleProps) {
  const [data, setData] = useState<PaginatedPostsResult | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);

  // SUPER SIMPLE - no useCallback, no complex logic
  useEffect(() => {
    console.log('🟢 Simple BlogList mounted');
    
    // Only run if we don't have initial data
    if (!initialData) {
      console.log('🟢 Loading initial data...');
      // We'll manually call the API here instead of using the action
      // to avoid any complex dependency issues
    }
  }, []); // EMPTY ARRAY - only run once

  return (
    <Container size="lg" py="xl">
      <Title order={2} ta="center" mb="xl">
        Blog Posts (Simple Version)
      </Title>

      {isLoading && !data && (
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="lg" color="blue.4" type="dots" />
            <Text c="dimmed">Blog posts laden...</Text>
          </Stack>
        </Center>
      )}

      {data && data.posts.length > 0 && (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3 }}
          spacing="xl"
        >
          {data.posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </SimpleGrid>
      )}

      {data && data.posts.length === 0 && (
        <Box ta="center" py="xl">
          <Text c="gray.4" size="lg">
            Geen blog posts gevonden
          </Text>
        </Box>
      )}
    </Container>
  );
} 
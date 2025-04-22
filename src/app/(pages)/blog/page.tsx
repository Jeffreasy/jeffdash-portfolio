import React from 'react';
import { getPublishedPosts } from '@/lib/actions/blog';
import BlogList from '@/components/features/blog/BlogList';

// Deze pagina is een Server Component
export default async function BlogPage() {
  // Haal de gepubliceerde blog posts op aan de server-kant
  const posts = await getPublishedPosts();

  // Geef de opgehaalde posts door aan de BlogList component
  return <BlogList posts={posts} />;
} 
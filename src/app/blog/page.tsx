import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import BlogList from '@/components/features/blog/BlogList';
import { getPublishedPosts } from '@/lib/actions/blog';

// Force dynamic rendering to avoid static generation issues with Supabase
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Lees mijn blog posts over webontwikkeling en technologie',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog',
    description: 'Lees mijn blog posts over webontwikkeling en technologie',
    url: '/blog',
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog',
    description: 'Lees mijn blog posts over webontwikkeling en technologie',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function BlogPage() {
  // Haal alle gepubliceerde blog posts op
  const posts = await getPublishedPosts();

  return <BlogList posts={posts} />;
} 
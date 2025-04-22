import React from 'react';
import { getPostBySlug } from '@/lib/actions/blog';
import BlogPostDetailView from '@/components/features/blog/BlogPostDetailView';
import { Metadata, ResolvingMetadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: `Post niet gevonden | ${SITE_CONFIG.name}`,
      description: 'Deze blog post kon niet worden gevonden.',
    };
  }

  const metaTitle = post.metaTitle || post.title;
  const metaDescription =
    post.metaDescription || post.excerpt || SITE_CONFIG.description;
  const featuredImageUrl = post.featuredImageUrl;
  const canonicalUrl = `${SITE_CONFIG.url}/blog/${slug}`;

  return {
    title: `${metaTitle} | ${SITE_CONFIG.name}`,
    description: metaDescription,
    keywords: post.tags || [],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${metaTitle} | ${SITE_CONFIG.name}`,
      description: metaDescription,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: featuredImageUrl
        ? [
            {
              url: featuredImageUrl,
              alt: post.featuredImageAltText || metaTitle,
            },
          ]
        : (await parent).openGraph?.images || [],
      locale: 'nl_NL',
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [SITE_CONFIG.url],
      tags: post.tags || [],
    },
    twitter: {
      card: featuredImageUrl ? 'summary_large_image' : 'summary',
      title: `${metaTitle} | ${SITE_CONFIG.name}`,
      description: metaDescription,
      images: featuredImageUrl ? [featuredImageUrl] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostDetailView post={post} />;
}

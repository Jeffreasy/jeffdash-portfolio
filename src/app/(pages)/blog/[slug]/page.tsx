import React from 'react';
import { getPostBySlug } from '@/lib/actions/blog';
import BlogPostDetailView from '@/components/features/blog/BlogPostDetailView';
import { Metadata, ResolvingMetadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { notFound } from 'next/navigation';

// Define the expected resolved type for params
type PageParams = {
  slug: string;
};

// Define the expected resolved type for searchParams
type PageSearchParams = {
  [key: string]: string | string[] | undefined;
};

// Define the type for the component props, including Promises for both params and searchParams
type Props = {
  params: Promise<PageParams>;
  searchParams?: Promise<PageSearchParams>; // Wrap searchParams in a Promise
};

export const revalidate = 3600;

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params; // Await the params promise
  // const searchParams = await props.searchParams; // Await searchParams if needed
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

export default async function BlogPostPage(props: Props) {
  const params = await props.params; // Await the params promise
  // const searchParams = await props.searchParams; // Await searchParams if needed
  const slug = params.slug; // Access slug from the resolved object

  const post = await getPostBySlug(slug); // Use the resolved slug

  if (!post) {
    notFound();
  }

  return <BlogPostDetailView post={post} />;
}

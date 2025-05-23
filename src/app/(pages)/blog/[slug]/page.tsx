import React from 'react';
import { getPostBySlug } from '@/lib/actions/blog';
import BlogPostDetailView from '@/components/features/blog/BlogPostDetailView';
import { Metadata, ResolvingMetadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { notFound } from 'next/navigation';

// Define a specific type for this page's props
// Only include params since searchParams are not used
type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

// JSON-LD Structured Data Component
function BlogPostJsonLd({ post }: { post: any }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.metaDescription,
    "image": post.featuredImageUrl ? [post.featuredImageUrl] : [],
    "datePublished": post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    "author": {
      "@type": "Person",
      "name": "Jeffrey Lavente",
      "url": SITE_CONFIG.url,
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "url": SITE_CONFIG.url,
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    "keywords": post.tags ? post.tags.join(", ") : undefined,
    "wordCount": post.content ? post.content.length : undefined,
    "articleSection": "Technology",
    "inLanguage": "nl-NL",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Use the specific BlogPageProps type for generateMetadata
export async function generateMetadata(
  props: BlogPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params; // Await the params promise
  const slug = params.slug; // Access slug from the resolved object

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
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
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

// Use the specific BlogPageProps type for BlogPostPage
export default async function BlogPostPage(props: BlogPageProps) {
  const params = await props.params; // Await the params promise
  const slug = params.slug; // Access slug from the resolved object

  const post = await getPostBySlug(slug); // Use the resolved slug

  if (!post) {
    notFound();
  }

  return (
    <>
      <BlogPostJsonLd post={post} />
      <BlogPostDetailView post={post} />
    </>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/actions/blog';
import BlogPostDetailView from '@/components/features/blog/BlogPostDetailView';
import { SITE_CONFIG } from '@/lib/config';

// Force dynamic rendering to avoid static generation issues with Supabase
export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Blog post niet gevonden',
      description: 'De gevraagde blog post kon niet worden gevonden',
    };
  }
  
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || `Lees de blog post: ${post.title}`,
    alternates: {
      canonical: `${SITE_CONFIG.url}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || `Lees de blog post: ${post.title}`,
      url: `${SITE_CONFIG.url}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt,
      authors: ['Jeffrey Lavente'],
      images: post.featuredImageUrl ? [
        {
          url: post.featuredImageUrl,
          alt: post.featuredImageAltText || post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Lees de blog post: ${post.title}`,
      images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
    },
  };
}

// JSON-LD component voor Blog post
function BlogPostJsonLd({ post }: { post: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt || post.metaDescription,
          "image": post.featuredImageUrl ? [post.featuredImageUrl] : [],
          "datePublished": post.publishedAt,
          "dateModified": post.updatedAt,
          "author": {
            "@type": "Person",
            "name": "Jeffrey Lavente"
          },
          "publisher": {
            "@type": "Organization",
            "name": SITE_CONFIG.name,
            "logo": {
              "@type": "ImageObject",
              "url": `${SITE_CONFIG.url}/logo.png`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${SITE_CONFIG.url}/blog/${post.slug}`
          },
          "keywords": post.tags?.join(", ") || "web development, design, AI",
          "articleBody": post.content
        })
      }}
    />
  );
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
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

// BlogPost.tsx

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { BlogPost as BlogPostType } from '@/types/blog';

interface BlogPostProps {
  post: BlogPostType;
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {post.image_url && (
        <div className="relative h-48 md:h-64">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.avatar_url && (
                <Image
                  src={post.author.avatar_url}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="text-sm">{post.author.name}</span>
            </div>
          )}
          <span>•</span>
          <time>{formatDate(post.created_at)}</time>
          {post.reading_time && (
            <>
              <span>•</span>
              <span>{post.reading_time} min leestijd</span>
            </>
          )}
        </div>
        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <span>Lees meer</span>
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}

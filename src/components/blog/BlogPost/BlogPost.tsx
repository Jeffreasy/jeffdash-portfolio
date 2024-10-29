// BlogPost.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types/blog';

interface BlogPostProps {
  post: BlogPost;
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="rounded-lg border bg-background overflow-hidden">
      <div className="relative h-48 md:h-64">
        <Image
          src={post.image_url}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            {post.author?.[0]?.avatar_url && (
              <Image
                src={post.author[0].avatar_url}
                alt={post.author[0].name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{post.author?.[0]?.name}</span>
          </div>
          <span>•</span>
          <time>{formatDate(post.created_at)}</time>
        </div>
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-muted-foreground mb-4">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tagItem) => (
              <span
                key={tagItem.tag[0].id}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {tagItem.tag[0].name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

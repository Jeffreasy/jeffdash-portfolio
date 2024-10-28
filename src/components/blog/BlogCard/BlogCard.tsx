'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types/blog'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-background border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 md:h-64 overflow-hidden">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {post.category && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-primary-foreground text-sm rounded-full">
              {post.category.name}
            </span>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
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
              <span>{post.author.name}</span>
            </div>
            <span>•</span>
            <time>{formatDate(post.created_at)}</time>
            <span>•</span>
            <span>{post.reading_time} min leestijd</span>
          </div>
          <p className="text-muted-foreground mb-4">
            {post.excerpt}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  )
}

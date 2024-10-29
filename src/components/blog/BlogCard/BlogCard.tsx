'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'
import type { BlogCardProps } from '@/types/blog'
import { cn } from '@/lib/utils'

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article 
        className={cn("group relative rounded-lg overflow-hidden border bg-background hover:shadow-lg transition-shadow", 
          className
        )}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative h-48 md:h-64">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
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
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground">
            {post.excerpt}
          </p>
        </div>
      </motion.article>
    </Link>
  )
}

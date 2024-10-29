// blog.ts

import type { Database } from './supabase'

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'] & {
  author: {
    id: string
    name: string
    avatar_url?: string
    bio?: string
    created_at: string
  }[]
  category: {
    id: string
    name: string
    slug: string
    description: string | null
    created_at: string
  }[]
  tags: {
    tag: {
      id: string
      name: string
      slug: string
      created_at: string
    }[]
  }[]
}

// Update de BlogCard component om de array types te gebruiken
export interface BlogCardProps {
  post: BlogPost
  className?: string
}

// Update de BlogPost component om de array types te gebruiken
export interface BlogPostProps {
  post: BlogPost
}

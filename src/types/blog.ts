// blog.ts

import type { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']

export type BlogCategory = Tables['blog_categories']['Row']
export type BlogTag = Tables['blog_tags']['Row']
export type BlogPostBase = Tables['blog_posts']['Row']

// Deze interface beschrijft hoe een blog post eruit ziet met zijn relaties
export interface BlogPost extends BlogPostBase {
  category: BlogCategory
  tags: BlogTag[]
}

// Deze interface is voor de junction table
export interface BlogPostTag {
  post_id: string
  tag_id: string
}

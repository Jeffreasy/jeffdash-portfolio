// useBlogPosts.ts

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/types/blog'

export function useBlogPosts(categoryId?: string | null, tagIds?: string[]) {
  const [data, setData] = useState<BlogPost[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:authors(*),
        category:blog_categories(*),
        tags:blog_posts_tags(tag:blog_tags(*))
      `)
      .order('created_at', { ascending: false })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (tagIds && tagIds.length > 0) {
      query = query.in('tags.tag_id', tagIds)
    }

    async function fetchPosts() {
      try {
        const { data: posts, error } = await query

        if (error) throw error

        setData(posts as unknown as BlogPost[])
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'))
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [categoryId, tagIds])

  return { data, isLoading, error }
}

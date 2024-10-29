'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BlogPost } from '@/components/blog/BlogPost/BlogPost'
import { BlogFilter } from '@/components/blog/BlogFilter/BlogFilter'
import { useBlogPosts } from '@/hooks/useBlogPosts'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export default function BlogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const categoryId = searchParams?.get('category') ?? null
  const tagIds = searchParams?.get('tags')?.split(',').filter(Boolean) || []

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId)
  const [selectedTags, setSelectedTags] = useState<string[]>(tagIds)

  const { data: categories } = useSupabaseQuery<'blog_categories'>('blog_categories')
  const { data: tags } = useSupabaseQuery<'blog_tags'>('blog_tags')
  const { data: posts, isLoading, error } = useBlogPosts(selectedCategory, selectedTags)

  function handleCategoryChange(categoryId: string | null) {
    setSelectedCategory(categoryId)
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }
    router.push(`/blog?${params.toString()}`)
  }

  function handleTagChange(tagId: string) {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId]
    
    setSelectedTags(newTags)
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (newTags.length > 0) {
      params.set('tags', newTags.join(','))
    } else {
      params.delete('tags')
    }
    router.push(`/blog?${params.toString()}`)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <BlogFilter
            categories={categories as Category[]}
            tags={tags || []}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            onCategoryChange={handleCategoryChange}
            onTagChange={handleTagChange}
          />
        </aside>

        <div className="lg:col-span-3">
          <div className="grid gap-8">
            {posts?.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

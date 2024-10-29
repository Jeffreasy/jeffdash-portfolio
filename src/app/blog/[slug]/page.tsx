import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { Database } from '@/types/supabase'

type BlogPostResponse = Database['public']['Tables']['blog_posts']['Row'] & {
  author: Database['public']['Tables']['authors']['Row'][]
  category: Database['public']['Tables']['blog_categories']['Row'][]
  tags: {
    tag: Database['public']['Tables']['blog_tags']['Row'][]
  }[]
}

async function createClient() {
  const cookieStore = await cookies()
  return createServerComponentClient<Database>({ 
    cookies: () => cookieStore 
  })
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:authors(*),
      category:blog_categories(*),
      tags:blog_posts_tags(tag:blog_tags(*))
    `)
    .eq('slug', params.slug)
    .single()

  if (!post) {
    notFound()
  }

  const blogPost = post as unknown as BlogPostResponse

  return (
    <article className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={blogPost.image_url}
            alt={blogPost.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
        <div className="text-muted-foreground mb-8">
          <div className="flex items-center gap-4">
            {blogPost.author?.[0]?.avatar_url && (
              <Image
                src={blogPost.author[0].avatar_url}
                alt={blogPost.author[0].name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <span className="font-medium">{blogPost.author?.[0]?.name}</span>
              <div className="text-sm">
                <time>{formatDate(blogPost.created_at)}</time>
                {blogPost.category?.[0] && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{blogPost.category[0].name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {blogPost.content}
        </div>
      </div>
    </article>
  )
}

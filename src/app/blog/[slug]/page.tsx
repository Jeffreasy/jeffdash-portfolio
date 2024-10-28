import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export default async function BlogPostPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <article className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-muted-foreground mb-8">
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <time>{formatDate(post.created_at)}</time>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          {post.content}
        </div>
      </div>
    </article>
  )
}

// useBlogPosts.ts

import { useSupabaseQuery } from './useSupabaseQuery';
import { useAuth } from '@/components/providers/AuthProvider';
import type { BlogPost } from '@/types/blog';
import type { Database } from '@/types/supabase';
import type { PostgrestResponse } from '@supabase/supabase-js';

type Tables = Database['public']['Tables'];
type BlogPostResponse = Tables['blog_posts']['Row'] & {
  category: Tables['blog_categories']['Row'];
  tags: {
    blog_tags: Tables['blog_tags']['Row'];
  }[];
};

export function useBlogPosts(categoryId: string | null, tagIds: string[]) {
  const { user } = useAuth();

  const { data: rawData, isLoading, error } = useSupabaseQuery<'blog_posts', BlogPostResponse>(
    'blog_posts',
    async (query) => {
      const result = await query
        .select(`
          *,
          category:blog_categories!inner(*),
          tags:blog_posts_tags!inner(blog_tags(*))
        `)
        .eq(user ? '' : 'published', true)
        .eq(categoryId ? 'category_id' : '', categoryId || '')
        .in(tagIds.length ? 'tags.blog_tags.id' : '', tagIds)
        .order('created_at', { ascending: false });

      return result as PostgrestResponse<BlogPostResponse[]>;
    }
  );

  const data = rawData?.map(post => ({
    ...post,
    tags: post.tags.map(t => t.blog_tags)
  })) as BlogPost[] | null;

  return { data, isLoading, error };
}

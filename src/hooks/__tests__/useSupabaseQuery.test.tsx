import { renderHook, waitFor } from '@testing-library/react';
import { useSupabaseQuery } from '../useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

// Mock de Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({
          data: [mockBlogPost],
          error: null
        }))
      }))
    }))
  }
}));

// Mock data die overeenkomt met de database structuur
const mockBlogPost: Database['public']['Tables']['blog_posts']['Row'] = {
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'Test excerpt',
  content: 'Test content',
  image_url: 'https://test.com/image.jpg',
  author_id: 'author-1',
  category_id: 'category-1',
  created_at: '2024-03-20T12:00:00Z',
  updated_at: '2024-03-20T12:00:00Z'
};

describe('useSupabaseQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useSupabaseQuery<'blog_posts'>('blog_posts'));

    await waitFor(() => {
      expect(result.current.data).toEqual([mockBlogPost]);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBeFalsy();
    });

    expect(supabase.from).toHaveBeenCalledWith('blog_posts');
  });

  it('should handle errors', async () => {
    const error = new Error('Test error');
    ;(supabase.from as jest.Mock).mockImplementationOnce(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({
          data: null,
          error
        }))
      }))
    }));

    const { result } = renderHook(() => useSupabaseQuery<'blog_posts'>('blog_posts'));

    await waitFor(() => {
      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(error);
      expect(result.current.isLoading).toBeFalsy();
    });
  });
});

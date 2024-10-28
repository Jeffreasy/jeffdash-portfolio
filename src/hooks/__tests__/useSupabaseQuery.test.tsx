import { renderHook, waitFor } from '@testing-library/react';
import { useSupabaseQuery } from '../useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import type { PostgrestResponse } from '@supabase/supabase-js';
import type { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];

// Mock types met specifieke types
interface MockQueryBuilder<T extends Tables[keyof Tables]> {
  select: jest.MockedFunction<(query?: string) => Promise<PostgrestResponse<T['Row']>> | MockQueryBuilder<T>>;
  eq: jest.MockedFunction<(column: string, value: unknown) => MockQueryBuilder<T>>;
  in: jest.MockedFunction<(column: string, values: unknown[]) => MockQueryBuilder<T>>;
  order: jest.MockedFunction<(column: string, options: { ascending: boolean }) => Promise<PostgrestResponse<T['Row']>>>;
}

// Helper functie voor type casting
function createMockQueryBuilder<T extends Tables[keyof Tables]>(
  builder: MockQueryBuilder<T>
): PostgrestQueryBuilder<Database['public'], T, T['Row']> {
  return {
    ...builder,
    url: new URL('http://localhost'),
    headers: {},
    insert: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    maybeSingle: jest.fn(),
    single: jest.fn(),
    filter: jest.fn(),
    match: jest.fn(),
    neq: jest.fn(),
    gt: jest.fn(),
    gte: jest.fn(),
    lt: jest.fn(),
    lte: jest.fn(),
    like: jest.fn(),
    ilike: jest.fn(),
    is: jest.fn(),
    in: jest.fn(),
    contains: jest.fn(),
    containedBy: jest.fn(),
    range: jest.fn(),
    textSearch: jest.fn(),
    not: jest.fn(),
    or: jest.fn(),
    limit: jest.fn(),
    offset: jest.fn(),
  } as unknown as PostgrestQueryBuilder<Database['public'], T, T['Row']>;
}

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('useSupabaseQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should start with loading state', async () => {
      // Mock een langzame query om loading state te testen
      const mockQueryBuilder: MockQueryBuilder<Tables['blog_posts']> = {
        select: jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
      };

      mockSupabase.from.mockReturnValue(createMockQueryBuilder(mockQueryBuilder));

      const { result } = renderHook(() => useSupabaseQuery('blog_posts'));
      
      // Direct na render moet loading true zijn
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should fetch data successfully', async () => {
      const mockData = [{
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        excerpt: 'Test Excerpt',
        content: 'Test Content',
        image_url: 'test.jpg',
        author: {
          name: 'Test Author',
          avatar_url: 'avatar.jpg',
          bio: 'Test Bio'
        },
        category_id: '1',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }] satisfies Tables['blog_posts']['Row'][];

      const mockQueryBuilder: MockQueryBuilder<Tables['blog_posts']> = {
        select: jest.fn().mockResolvedValue({
          data: mockData,
          error: null,
          count: null,
          status: 200,
          statusText: 'OK'
        }),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
      };

      mockSupabase.from.mockReturnValue(createMockQueryBuilder(mockQueryBuilder));

      const { result } = renderHook(() => useSupabaseQuery('blog_posts'));

      // Wacht tot de loading state false is
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Controleer de data
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    it('should handle errors', async () => {
      const mockError = {
        name: 'PostgrestError',
        code: 'TEST_ERROR',
        message: 'Test error message',
        details: 'Error details',
        hint: 'Error hint',
      };

      const mockQueryBuilder: MockQueryBuilder<Tables['blog_posts']> = {
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
          count: null,
          status: 400,
          statusText: 'Bad Request'
        }),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
      };

      mockSupabase.from.mockReturnValue(createMockQueryBuilder(mockQueryBuilder));

      const { result } = renderHook(() => useSupabaseQuery('blog_posts'));

      // Wacht tot de loading state false is
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Controleer de error state
      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('Effect Dependencies', () => {
    it('should refetch when table changes', async () => {
      const mockQueryBuilder: MockQueryBuilder<Tables['blog_posts']> = {
        select: jest.fn().mockResolvedValue({
          data: [],
          error: null,
          count: null,
          status: 200,
          statusText: 'OK'
        }),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
      };

      mockSupabase.from.mockReturnValue(createMockQueryBuilder(mockQueryBuilder));

      const { rerender } = renderHook(
        ({ table }: { table: keyof Tables }) => useSupabaseQuery(table),
        { initialProps: { table: 'blog_posts' } }
      );

      // Wacht tot de eerste query klaar is
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledTimes(1);
      });

      // Rerender met nieuwe props
      rerender({ table: 'projects' });

      // Wacht tot de tweede query klaar is
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledTimes(2);
      });

      expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'projects');
    });
  });
});

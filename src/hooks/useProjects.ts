import type { Database } from '@/types/supabase';
import type { PostgrestResponse, PostgrestError } from '@supabase/supabase-js';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';

type ProjectResponse = Database['public']['Tables']['projects']['Row'];

export function useProjects() {
  const { data: projects, isLoading, error } = useSupabaseQuery<'projects', ProjectResponse>(
    'projects',
    async (query) => {
      try {
        console.log('Fetching projects...'); // Debug log
        
        if (!query) {
          throw new Error('Query builder is undefined');
        }

        // Direct query uitvoeren met is_featured filter
        const result = await query
          .select()
          .eq('is_featured', true)
          .order('created_at', { ascending: false });

        console.log('Projects result:', result); // Debug log

        // Return het volledige response object
        return {
          data: result.data || [],
          error: result.error,
          count: result.count,
          status: result.status,
          statusText: result.statusText,
        } as unknown as PostgrestResponse<ProjectResponse[]>;

      } catch (e) {
        console.error('Projects catch error:', e); // Debug log
        
        const errorResponse = {
          data: [],
          error: e as PostgrestError,
          count: null,
          status: 400,
          statusText: 'Bad Request',
        } as unknown as PostgrestResponse<ProjectResponse[]>;

        return errorResponse;
      }
    }
  );

  return { projects, isLoading, error };
}

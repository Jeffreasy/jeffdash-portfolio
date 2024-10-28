// useSupabaseQuery.ts

import { useEffect, useState } from 'react';
import type { PostgrestResponse, PostgrestError } from '@supabase/supabase-js';
import type { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type TableName = keyof Tables;

type SupabaseTable<T extends TableName> = Tables[T];
type QueryFn<T extends TableName> = PostgrestQueryBuilder<
  Database['public'],
  SupabaseTable<T>,
  SupabaseTable<T>['Row']
>;

type QueryModifier<T extends TableName, R> = (
  query: QueryFn<T>
) => Promise<PostgrestResponse<R[]>>;

export function useSupabaseQuery<T extends TableName, R = SupabaseTable<T>['Row']>(
  table: T,
  modifier?: QueryModifier<T, R>
) {
  const [data, setData] = useState<R[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseQuery = supabase.from(table);
        const result = modifier 
          ? await modifier(baseQuery)
          : await baseQuery.select();

        if (result.error) throw result.error;
        
        // Zorg ervoor dat we altijd een enkele array hebben
        const responseData = result.data as R[];
        setData(responseData);
        setError(null);
      } catch (e) {
        const isPostgrestError = e && typeof e === 'object' && 'code' in e && 'message' in e;
        setError(isPostgrestError ? e as PostgrestError : null);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [table, modifier]);

  return { data, isLoading, error };
}

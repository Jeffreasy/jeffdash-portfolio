import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project, ProjectDB } from '@/types/project'

export function useProjects() {
  const [data, setData] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchProjects() {
      try {
        const { data: projectsData, error: err } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (err) throw err

        if (isMounted && projectsData) {
          // Transform database data to Project type
          const transformedData: Project[] = projectsData.map((dbProject: ProjectDB) => ({
            ...dbProject,
            tech_stack: [], // Deze worden later gevuld
            features: [],   // Deze worden later gevuld
            challenges: [], // Deze worden later gevuld
          }))
          setData(transformedData)
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e : new Error('An error occurred'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProjects()

    // Cleanup
    return () => {
      isMounted = false
    }
  }, [])

  return { data, isLoading, error }
}

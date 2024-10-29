'use client'

import { useProjects } from '@/hooks/useProjects'
import { ProjectCard } from '@/components/common/ProjectCard/ProjectCard'
import type { Project } from '@/types/project'

export function Projects() {
  const { data, isLoading, error } = useProjects()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <section className="py-12">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project, ProjectResponse, ProjectDB, ProjectFormData } from '@/types/project'
import { ProjectForm } from './ProjectForm'

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // Fetch projects alleen bij mount
  useEffect(() => {
    let isMounted = true

    async function fetchProjects() {
      try {
        console.log('Fetching projects...')
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        
        if (isMounted) {
          const transformedData: Project[] = (data || []).map((project: ProjectResponse) => ({
            ...project,
            tech_stack: project.tech_stack || [],
            features: project.features || [],
            challenges: project.challenges || [],
          }))
          
          setProjects(transformedData)
          setLoading(false)
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : 'Er is een fout opgetreden')
          setLoading(false)
        }
      }
    }

    fetchProjects()

    // Cleanup functie
    return () => {
      isMounted = false
    }
  }, []) // Lege dependency array

  // Add new project
  async function addProject(project: ProjectFormData) {
    try {
      // Converteer naar database formaat
      const dbProject: Omit<ProjectDB, 'id' | 'created_at' | 'updated_at'> = {
        title: project.title,
        slug: project.slug,
        description: project.description,
        short_description: project.short_description,
        image_url: project.image_url,
        technologies: project.technologies,
        is_featured: project.is_featured,
        github_url: project.github_url,
        demo_url: project.demo_url
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([dbProject])
        .select()

      if (error) throw error
      
      // Converteer terug naar UI formaat
      if (data) {
        const newProject: Project = {
          ...data[0],
          tech_stack: project.tech_stack,
          features: project.features,
          challenges: project.challenges
        }
        setProjects([newProject, ...projects])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er is een fout opgetreden')
    }
  }

  // Update project
  async function updateProject(id: string, updates: Partial<Project>) {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)

      if (error) throw error
      setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p))
      setEditingProject(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er is een fout opgetreden')
    }
  }

  // Delete project
  async function deleteProject(id: string) {
    if (!window.confirm('Weet je zeker dat je dit project wilt verwijderen?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProjects(projects.filter(p => p.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er is een fout opgetreden')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-6">Nieuw Project</h2>
        <ProjectForm onSubmit={addProject} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Projecten</h2>
        <div className="grid gap-4">
          {projects.map(project => (
            <div key={project.id} className="p-4 rounded-lg bg-secondary/50">
              {editingProject?.id === project.id ? (
                <>
                  <ProjectForm
                    initialData={project}
                    onSubmit={data => updateProject(project.id, data)}
                    buttonText="Project Bijwerken"
                  />
                  <button
                    onClick={() => setEditingProject(null)}
                    className="mt-4 px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md"
                  >
                    Annuleren
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.short_description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech, index) => (
                      <span
                        key={`${tech.name}-${index}`}
                        className="px-2 py-1 text-sm bg-secondary rounded-full"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Bewerken
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Verwijderen
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

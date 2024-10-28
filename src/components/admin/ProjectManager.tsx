'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types/project'
import { ProjectForm } from './ProjectForm'

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Er is een fout opgetreden')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Add new project
  async function addProject(project: Omit<Project, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()

      if (error) throw error
      if (data) setProjects([data[0], ...projects])
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

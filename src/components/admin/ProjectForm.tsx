'use client'

import { useState } from 'react'
import type { Project, TechStack } from '@/types/project'

type ProjectFormData = Omit<Project, 'id' | 'created_at'>

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void>
  initialData?: ProjectFormData
  buttonText?: string
}

const emptyProject: ProjectFormData = {
  title: '',
  description: '',
  short_description: '',
  image_url: '',
  tech_stack: [],
  live_url: '',
  github_url: '',
  updated_at: new Date().toISOString(),
  features: [],
  challenges: []
}

export function ProjectForm({ onSubmit, initialData, buttonText = 'Project Toevoegen' }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>(initialData || emptyProject)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      if (!initialData) {
        setFormData(emptyProject)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Titel
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border bg-background"
          required
        />
      </div>

      <div>
        <label htmlFor="short_description" className="block text-sm font-medium mb-2">
          Korte Beschrijving
        </label>
        <input
          type="text"
          id="short_description"
          value={formData.short_description}
          onChange={e => setFormData({ ...formData, short_description: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border bg-background"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Volledige Beschrijving
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border bg-background"
          rows={4}
          required
        />
      </div>

      <div>
        <label htmlFor="image_url" className="block text-sm font-medium mb-2">
          Afbeelding URL
        </label>
        <input
          type="url"
          id="image_url"
          value={formData.image_url}
          onChange={e => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border bg-background"
          required
        />
      </div>

      <div>
        <label htmlFor="tech_stack" className="block text-sm font-medium mb-2">
          Tech Stack (naam,icon;naam,icon)
        </label>
        <input
          type="text"
          id="tech_stack"
          value={formData.tech_stack.map(tech => `${tech.name},${tech.icon}`).join(';')}
          onChange={e => {
            const techStack: TechStack[] = e.target.value.split(';')
              .filter(Boolean)
              .map(item => {
                const [name, icon] = item.split(',')
                return { name: name?.trim() || '', icon: icon?.trim() || '' }
              })
            setFormData({ ...formData, tech_stack: techStack })
          }}
          className="w-full px-4 py-2 rounded-lg border bg-background"
          required
        />
      </div>

      <div>
        <label htmlFor="live_url" className="block text-sm font-medium mb-2">
          Live URL
        </label>
        <input
          type="url"
          id="live_url"
          value={formData.live_url}
          onChange={e => setFormData({ ...formData, live_url: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border bg-background"
          required
        />
      </div>

      <div>
        <label htmlFor="github_url" className="block text-sm font-medium mb-2">
          GitHub URL (optioneel)
        </label>
        <input
          type="url"
          id="github_url"
          value={formData.github_url || ''}
          onChange={e => setFormData({ ...formData, github_url: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border bg-background"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Bezig...' : buttonText}
      </button>
    </form>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectManager } from '@/components/admin/ProjectManager'
import { useAuth } from '@/components/providers/AuthProvider'

export default function AdminPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Project Management</h2>
          <ProjectManager />
        </section>
        {/* Hier kunnen we later meer admin secties toevoegen */}
      </div>
    </div>
  )
}

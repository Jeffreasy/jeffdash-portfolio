import { Suspense } from 'react'
import { Hero } from '@/components/sections/Hero/Hero'
import { Projects } from '@/components/sections/Projects/Projects'
import { About } from '@/components/sections/About/About'
import { ProjectDetails } from '@/components/sections/ProjectDetails/ProjectDetails'

// Loading component voor Suspense
function LoadingSection() {
  return <div className="h-screen animate-pulse bg-secondary/20" />
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<LoadingSection />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <About />
      </Suspense>
      <Suspense fallback={<LoadingSection />}>
        <ProjectDetails />
      </Suspense>
    </main>
  )
}

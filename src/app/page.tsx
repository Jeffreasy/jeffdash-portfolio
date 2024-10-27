import { Hero } from '@/components/sections/Hero/Hero'
import { Projects } from '@/components/sections/Projects/Projects'
import { About } from '@/components/sections/About/About'
import { ProjectDetails } from '@/components/sections/ProjectDetails/ProjectDetails'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Projects />
      <About />
      <ProjectDetails />
    </main>
  )
}

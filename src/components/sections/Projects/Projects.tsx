'use client'

import { ProjectCard } from "@/components/common/ProjectCard/ProjectCard"
import { motion } from "framer-motion"
import { PROJECTS_DATA } from "@/config/projects.config"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function Projects() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="max-w-2xl mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Projecten
            </h2>
            <p className="text-muted-foreground text-lg">
              Een selectie van mijn meest recente projecten. 
              Elk project is gebouwd met een focus op gebruiksvriendelijkheid en schaalbaarheid.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {PROJECTS_DATA.map((project) => (
              <motion.div
                key={project.title}
                variants={itemVariants}
                className="group"
              >
                <ProjectCard
                  title={project.title}
                  description={project.shortDescription || project.description}
                  image={project.image}
                  link={project.link}
                  className="h-full transition-transform duration-300 group-hover:-translate-y-2"
                  tags={project.tags}
                />
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-12 text-center"
            variants={itemVariants}
          >
            <a 
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Bekijk meer op GitHub</span>
              <svg 
                className="ml-2 w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { PROJECTS_DATA } from "@/config/projects.config"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function ProjectDetails() {
  const [activeTab, setActiveTab] = useState<'features' | 'challenges'>('features')

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 md:mb-8"
          >
            Project Details
          </motion.h2>

          <div className="grid gap-12">
            {PROJECTS_DATA.map((project) => (
              <motion.div
                key={project.title}
                variants={itemVariants}
                className="group rounded-xl overflow-hidden bg-background border shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Project Header */}
                <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-white/90">{project.description}</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 space-y-8">
                  {/* Tech Stack */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Technologieën</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <motion.span 
                          key={tech.name}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-secondary rounded-full text-sm font-medium inline-flex items-center gap-2 hover:bg-secondary/80 transition-colors"
                        >
                          <Image
                            src={tech.icon}
                            alt={tech.name}
                            width={16}
                            height={16}
                          />
                          {tech.name}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div>
                    <div className="flex gap-4 border-b mb-6">
                      <button
                        onClick={() => setActiveTab('features')}
                        className={`pb-2 font-medium transition-colors ${
                          activeTab === 'features'
                            ? 'text-foreground border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Features
                      </button>
                      <button
                        onClick={() => setActiveTab('challenges')}
                        className={`pb-2 font-medium transition-colors ${
                          activeTab === 'challenges'
                            ? 'text-foreground border-b-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Uitdagingen
                      </button>
                    </div>

                    {/* Tab Content */}
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === 'features' ? (
                        <div className="grid gap-4">
                          {project.features.map((feature) => (
                            <div key={feature.title} className="p-4 rounded-lg bg-secondary/50">
                              <h5 className="font-medium text-base mb-2">{feature.title}</h5>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {project.challenges.map((challenge) => (
                            <div key={challenge.problem} className="p-4 rounded-lg bg-secondary/50">
                              <h5 className="font-medium text-base mb-2">{challenge.problem}</h5>
                              <p className="text-sm text-muted-foreground">{challenge.solution}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Project Links */}
                  <div className="flex gap-4">
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <span>Bekijk Project</span>
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                        />
                      </svg>
                    </a>
                    {project.githubLink && (
                      <a 
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                      >
                        <span>GitHub</span>
                        <svg 
                          className="w-4 h-4" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

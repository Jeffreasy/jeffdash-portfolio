'use client'

import { Projects } from "@/components/sections/Projects/Projects"
import { ProjectDetails } from "@/components/sections/ProjectDetails/ProjectDetails"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export default function ProjectsPage() {
  return (
    <motion.main 
      className="min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Projects />
      <ProjectDetails />
    </motion.main>
  )
}

'use client'

import { About } from "@/components/sections/About/About"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export default function AboutPage() {
  return (
    <motion.main 
      className="min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <About />
    </motion.main>
  )
}

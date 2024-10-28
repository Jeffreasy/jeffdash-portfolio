'use client'

import { Contact } from "@/components/sections/Contact/Contact"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export default function ContactPage() {
  return (
    <motion.main 
      className="min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Contact />
    </motion.main>
  )
}

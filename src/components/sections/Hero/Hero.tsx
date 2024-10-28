'use client'  // Add this at the top

import { Button } from "@/components/common/Button/Button"
import Link from "next/link"
import { siteConfig } from "@/config/site.config"
import { motion } from "framer-motion"

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

export function Hero() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Decoratieve achtergrond elementen */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            {siteConfig.name}
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 text-muted-foreground"
            variants={itemVariants}
          >
            {siteConfig.description}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={itemVariants}
          >
            <Link href="/projects">
              <Button className="w-full sm:w-auto hover-lift">
                Bekijk projecten
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto hover-lift"
              >
                Neem contact op
              </Button>
            </Link>
          </motion.div>

          {/* Toevoegen van sociale media links */}
          <motion.div 
            className="mt-12 flex gap-6"
            variants={itemVariants}
          >
            <a 
              href={siteConfig.links.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a 
              href={siteConfig.links.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

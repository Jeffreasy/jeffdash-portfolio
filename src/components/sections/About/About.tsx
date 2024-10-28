'use client'

import { Button } from "@/components/common/Button/Button"
import Link from "next/link"
import { motion } from "framer-motion"

const SKILLS = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Prisma"] },
  { category: "Tools", items: ["Git", "Docker", "AWS", "Vercel"] },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function About() {
  return (
    <section className="py-12 md:py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 md:mb-8"
            variants={itemVariants}
          >
            Over Mij
          </motion.h2>
          
          <motion.p 
            className="text-base md:text-lg mb-8 text-muted-foreground"
            variants={itemVariants}
          >
            Als ervaren full-stack developer combineer ik technische expertise met een scherp oog voor design. 
            Mijn focus ligt op het bouwen van schaalbare, gebruiksvriendelijke web applicaties die echte problemen oplossen.
          </motion.p>

          {/* Skills Section */}
          <motion.div 
            className="mb-12"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold mb-6">Technische Vaardigheden</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SKILLS.map((skillGroup) => (
                <div key={skillGroup.category}>
                  <h4 className="font-medium mb-3">{skillGroup.category}</h4>
                  <ul className="space-y-2">
                    {skillGroup.items.map((skill) => (
                      <li 
                        key={skill}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={itemVariants}
          >
            <Link href="/about">
              <Button className="w-full sm:w-auto hover-lift">
                Meer over mij
              </Button>
            </Link>
            <Link 
              href="https://github.com/yourusername" 
              target="_blank"
            >
              <Button 
                variant="outline" 
                className="w-full sm:w-auto hover-lift group"
              >
                <span>GitHub</span>
                <svg 
                  className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
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
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

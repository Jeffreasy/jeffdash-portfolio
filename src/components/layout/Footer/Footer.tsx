'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site.config'

const FOOTER_LINKS = [
  {
    title: 'Links',
    items: [
      { name: 'Home', href: '/' },
      { name: 'Projecten', href: '/projects' },
      { name: 'Over Mij', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Socials',
    items: [
      { name: 'GitHub', href: siteConfig.links.github },
      { name: 'LinkedIn', href: siteConfig.links.linkedin },
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-secondary/10">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Branding Section */}
          <motion.div variants={itemVariants}>
            <Link href="/">
              <h3 className="text-lg font-bold hover:text-primary transition-colors">
                {siteConfig.name}
              </h3>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Full-stack developer met passie voor het bouwen van moderne, 
              gebruiksvriendelijke web applicaties.
            </p>
          </motion.div>

          {/* Links Sections */}
          {FOOTER_LINKS.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
          variants={itemVariants}
        >
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteConfig.name}. Alle rechten voorbehouden.
          </p>

          {/* Contact Button */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm transition-colors"
          >
            <span>Neem contact op</span>
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </footer>
  )
}

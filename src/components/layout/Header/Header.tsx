'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site.config'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        isScrolled ? 'shadow-sm' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <motion.span 
              className="font-bold text-lg hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {siteConfig.name}
            </motion.span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {siteConfig.mainNav.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative transition-colors hover:text-foreground/80 ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.title}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Menu Button - alleen zichtbaar op mobiel */}
        <div className="flex-1 flex justify-end md:hidden">
          <button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  )
}

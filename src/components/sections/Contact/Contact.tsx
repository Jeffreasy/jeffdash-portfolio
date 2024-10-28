'use client'

import { Button } from "@/components/common/Button/Button"
import { motion } from "framer-motion"
import { useState } from "react"

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

interface FormData {
  name: string
  email: string
  message: string
}

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contact
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Heeft u een vraag of wilt u samenwerken? Neem gerust contact met mij op.
            </p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={itemVariants}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Naam
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border bg-background hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border bg-background hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Bericht
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={5}
                className="w-full px-4 py-2 rounded-lg border bg-background hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                required
              />
            </div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full hover-lift"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Versturen...' : 'Verstuur Bericht'}
              </Button>
            </motion.div>

            {submitStatus === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 dark:text-green-400 text-sm"
              >
                Bedankt voor uw bericht! Ik neem zo snel mogelijk contact met u op.
              </motion.p>
            )}

            {submitStatus === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 dark:text-red-400 text-sm"
              >
                Er is iets misgegaan. Probeer het later opnieuw.
              </motion.p>
            )}
          </motion.form>

          {/* Alternative Contact Methods */}
          <motion.div 
            className="mt-12 pt-8 border-t"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold mb-4">
              Of neem direct contact op via:
            </h3>
            <div className="flex flex-col space-y-2">
              <a 
                href="mailto:your@email.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                your@email.com
              </a>
              <a 
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

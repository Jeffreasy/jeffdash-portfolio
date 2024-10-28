'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/common/Button/Button'

interface FormData {
  name: string
  email: string
  message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Er is iets misgegaan')

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Naam
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border bg-background"
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border bg-background"
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
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={5}
          className="w-full px-4 py-2 rounded-lg border bg-background"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full"
      >
        {status === 'loading' ? 'Versturen...' : 'Verstuur Bericht'}
      </Button>

      {status === 'success' && (
        <p className="text-green-600 dark:text-green-400">
          Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.
        </p>
      )}

      {status === 'error' && (
        <p className="text-red-600 dark:text-red-400">
          Er is iets misgegaan. Probeer het later opnieuw.
        </p>
      )}
    </motion.form>
  )
}

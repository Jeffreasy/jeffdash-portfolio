import { createBrowserClient } from '@supabase/ssr'
import { logger } from '../logger'

// Required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
] as const

// Validate environment variables
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingEnvVars.length > 0) {
  const errorMessage = `Missing required Supabase environment variables: ${missingEnvVars.join(', ')}`
  logger.error(errorMessage)
  throw new Error(errorMessage)
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
}

/**
 * Exponential backoff delay calculator
 */
function getRetryDelay(retryCount: number): number {
  const delay = Math.min(
    RETRY_CONFIG.initialDelay * Math.pow(2, retryCount),
    RETRY_CONFIG.maxDelay
  )
  return delay + Math.random() * 1000 // Add jitter
}

/**
 * Creates a Supabase client with retry logic
 */
export function createClient() {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      logger.info('Supabase client created successfully')
      return client
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      logger.warn('Failed to create Supabase client', {
        attempt: attempt + 1,
        error: lastError.message
      })
      
      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const delay = getRetryDelay(attempt)
        // Wait before retrying
        new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw new Error(`Failed to create Supabase client after ${RETRY_CONFIG.maxRetries} attempts: ${lastError?.message}`)
} 
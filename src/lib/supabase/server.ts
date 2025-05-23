import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
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
 * Creates a Supabase server client with retry logic
 */
export async function createClient() {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const cookieStore = await cookies()
      
      const client = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              try {
                return cookieStore.get(name)?.value
              } catch (error) {
                logger.error('Error getting cookie', { name, error })
                return undefined
              }
            },
            set(name: string, value: string, options: CookieOptions) {
              try {
                cookieStore.set({ name, value, ...options })
              } catch (error) {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                logger.warn('Error setting cookie in Server Component', { name, error })
              }
            },
            remove(name: string, options: CookieOptions) {
              try {
                cookieStore.set({ name, value: '', ...options })
              } catch (error) {
                // The `delete` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                logger.warn('Error removing cookie in Server Component', { name, error })
              }
            },
          },
        }
      )
      
      logger.info('Supabase server client created successfully')
      return client
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      logger.warn('Failed to create Supabase server client', {
        attempt: attempt + 1,
        error: lastError.message
      })
      
      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const delay = getRetryDelay(attempt)
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw new Error(`Failed to create Supabase server client after ${RETRY_CONFIG.maxRetries} attempts: ${lastError?.message}`)
} 
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers'; // Niet meer direct nodig voor sessie
// import { prisma } from '@/lib/prisma'; // Verwijderd
// import bcrypt from 'bcrypt'; // Verwijderd
// import jwt from 'jsonwebtoken'; // Verwijderd
import { createClient } from '@/lib/supabase/server'; // Importeer Supabase server client
import { logger } from '@/lib/logger';

// Rate limiting configuration
const RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

// In-memory store for rate limiting (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

// Zod schema voor login formulier validatie
const LoginSchema = z.object({
  email: z.string().email({ message: 'Ongeldig e-mailadres.' }),
  password: z.string().min(1, { message: 'Wachtwoord is vereist.' }),
});

// Verwijderd: Interface JwtPayload
// Verwijderd: SESSION_COOKIE_NAME
// Verwijderd: JWT_EXPIRATION

export type LoginState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[]; // Voor algemene fouten
  };
};

/**
 * Check rate limit for an IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt) {
    loginAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (now > attempt.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (attempt.count >= RATE_LIMIT.maxAttempts) {
    return false;
  }

  attempt.count++;
  return true;
}

/**
 * Get remaining attempts for an IP address
 */
function getRemainingAttempts(ip: string): number {
  const attempt = loginAttempts.get(ip);
  if (!attempt) return RATE_LIMIT.maxAttempts;
  if (Date.now() > attempt.resetTime) return RATE_LIMIT.maxAttempts;
  return Math.max(0, RATE_LIMIT.maxAttempts - attempt.count);
}

export async function loginUser(prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  logger.info('Login attempt initiated');
  const supabase = await createClient();

  // Get client IP (in production, use proper IP detection)
  const ip = '127.0.0.1'; // Placeholder, replace with actual IP detection

  // Check rate limit
  if (!checkRateLimit(ip)) {
    const remainingTime = Math.ceil((loginAttempts.get(ip)?.resetTime || 0 - Date.now()) / 1000 / 60);
    logger.warn('Rate limit exceeded', { ip, remainingTime });
    return {
      success: false,
      message: `Te veel inlogpogingen. Probeer het over ${remainingTime} minuten opnieuw.`,
      errors: { general: ['Rate limit exceeded'] },
    };
  }

  // Validate form data
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    logger.warn('Login validation failed', { errors: validatedFields.error.flatten().fieldErrors });
    return {
      success: false,
      message: 'Validatiefout',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  logger.info('Attempting login', { email });

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error('Login failed', { error: error.message });
      const remainingAttempts = getRemainingAttempts(ip);
      return {
        success: false,
        message: `Ongeldige inloggegevens. Nog ${remainingAttempts} pogingen over.`,
        errors: { general: ['Ongeldige inloggegevens'] },
      };
    }

    logger.info('Login successful', { email });
    redirect('/admin_area/dashboard');
  } catch (error) {
    logger.error('Unexpected error during login', { error });
    return {
      success: false,
      message: 'Er is een onverwachte fout opgetreden.',
      errors: { general: ['Server error'] },
    };
  }
}

// Actie om de gebruiker uit te loggen
export async function logoutUser() {
  logger.info('Logout initiated');
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.error('Logout error', { error: error.message });
      // Continue with redirect even if there's an error
    } else {
      logger.info('Logout successful');
    }
  } catch (error) {
    logger.error('Unexpected error during logout', { error });
    // Continue with redirect even if there's an error
  }

  // Verwijderd: oude try/catch en cookie.delete

  // Redirect naar de homepage
  redirect('/');
}

// --- Validatie van Admin Sessie (Nieuwe versie met Supabase) ---
// Deze functie kan nu in andere actions gebruikt worden om te checken of een
// ingelogde gebruiker de rol 'ADMIN' heeft.
// Noot: Dit vereist dat de 'role' informatie beschikbaar is.
// Manier 1: Via user_metadata in Supabase Auth (aanbevolen)
// Manier 2: Door de User tabel te queryen na het ophalen van de sessie user ID.

// Voorbeeld met Manier 2 (queryen User tabel):
export async function validateAdminSession(): Promise<{ userId: string; role: string }> {
  logger.info('Validating admin session');
  const supabase = await createClient();

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      logger.error('Session validation failed', { error: sessionError });
      throw new Error('Unauthorized: Not logged in or session error.');
    }

    const userId = session.user.id;
    logger.info('Session found', { userId });

    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      logger.error('User role fetch failed', { userId, error: userError });
      throw new Error('Unauthorized: Could not verify user role.');
    }

    const userRole = userData.role;

    if (userRole !== 'ADMIN') {
      logger.warn('Insufficient role', { userId, role: userRole });
      throw new Error('Forbidden: Insufficient role.');
    }

    logger.info('Admin session validated', { userId, role: userRole });
    return { userId, role: userRole };
  } catch (error) {
    logger.error('Session validation error', { error });
    throw error;
  }
} 
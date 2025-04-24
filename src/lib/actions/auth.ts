'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers'; // Niet meer direct nodig voor sessie
// import { prisma } from '@/lib/prisma'; // Verwijderd
// import bcrypt from 'bcrypt'; // Verwijderd
// import jwt from 'jsonwebtoken'; // Verwijderd
import { createClient } from '@/lib/supabase/server'; // Importeer Supabase server client

// Zod schema voor login formulier validatie
const LoginSchema = z.object({
  email: z.string().email({ message: 'Ongeldig e-mailadres.' }),
  password: z.string().min(1, { message: 'Wachtwoord is vereist.' }), // Min 1 is voldoende, Supabase valideert verder
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

export async function loginUser(prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  console.log('Supabase Login action aangeroepen...');
  const supabase = await createClient(); // Add await

  // 1. Valideer formulier data
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    console.log('Validatie gefaald:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: 'Validatiefout',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  console.log(`Attempting Supabase login for email: ${email}`);

  // Verwijderd: Check voor JWT_SECRET

  // 2. Roep Supabase signInWithPassword aan
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // 3. Handel errors af
  if (error) {
    console.error('Supabase login error:', error.message);
    // TODO: Geef specifiekere feedback op basis van error.message indien gewenst
    return {
      success: false,
      message: 'Ongeldige inloggegevens of serverfout.', // Algemeen bericht
      errors: { general: ['Ongeldige inloggegevens of er is iets misgegaan.'] },
    };
  }

  // --- AUTHENTICATIE SUCCESVOL ---
  console.log('Supabase authenticatie succesvol voor:', email);
  // Supabase/@supabase/ssr handelt het zetten van de sessie cookie af.

  // Verwijderd: Genereer JWT
  // Verwijderd: Zet JWT cookie

  // 4. Redirect naar het admin dashboard
  // Redirect MOET buiten try/catch of na een succesvolle operatie gebeuren in Server Actions
  redirect('/admin_area/dashboard');

  // Verwijderd: Oude try/catch block
}


// Actie om de gebruiker uit te loggen
export async function logoutUser() {
  console.log('Supabase Logout action aangeroepen...');
  const supabase = await createClient(); // Add await

  // Roep Supabase signOut aan
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Supabase logout error:', error.message);
    // Probeer toch te redirecten, zelfs als signOut een onverwachte error geeft
  } else {
    console.log('Supabase sign out succesvol.');
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
  const supabase = await createClient(); // Add await

  // 1. Haal huidige sessie op
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.error('ValidateAdminSession: Sessie ophalen mislukt of geen gebruiker.', sessionError);
    throw new Error('Unauthorized: Not logged in or session error.');
  }

  const userId = session.user.id;

  // 2. Query de User tabel om de rol op te halen
  //    BELANGRIJK: Dit vereist RLS setup of het gebruik van de service_role client
  //    Laten we aannemen dat RLS correct is ingesteld zodat een gebruiker zijn eigen rol kan lezen,
  //    of dat we de service role key gebruiken indien nodig (complexer in server actions).
  //    Voor nu gebruiken we de standaard server client. Pas aan indien nodig.
  const { data: userData, error: userError } = await supabase
    .from('User') // Ga uit van tabelnaam 'User'
    .select('role')
    .eq('id', userId)
    .single(); // Verwacht één resultaat

  if (userError || !userData) {
    console.error(`ValidateAdminSession: Rol ophalen mislukt voor user ${userId}`, userError);
    throw new Error('Unauthorized: Could not verify user role.');
  }

  const userRole = userData.role;

  // 3. Check of de rol 'ADMIN' is
  if (userRole !== 'ADMIN') {
    console.warn(`ValidateAdminSession: User ${userId} heeft rol '${userRole}', geen ADMIN.`);
    throw new Error('Forbidden: Insufficient role.');
  }

  console.log(`ValidateAdminSession: User ${userId} is ADMIN.`);
  return { userId, role: userRole }; // Geef gevalideerde data terug
} 
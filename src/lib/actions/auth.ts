'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation'; // Importeer redirect
import { cookies } from 'next/headers'; // Importeer cookies
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Importeer jsonwebtoken

// Zod schema voor login formulier validatie
const LoginSchema = z.object({
  email: z.string().email({ message: 'Ongeldig e-mailadres.' }),
  password: z.string().min(6, { message: 'Wachtwoord moet minimaal 6 tekens bevatten.' }),
});

// Definieer de verwachte structuur van de JWT payload
interface JwtPayload {
  userId: string;
  role: string;
  // Voeg eventueel andere benodigde velden toe
}

// Sessie cookie configuratie
const SESSION_COOKIE_NAME = 'session';
const JWT_EXPIRATION = '1h'; // Verlooptijd token

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
  console.log('Login action aangeroepen...');

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
  console.log(`Zoeken naar gebruiker met email: ${email}`); // Log de input email

  // Controleer of JWT_SECRET is ingesteld
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is niet ingesteld in de omgevingsvariabelen!');
    return {
      success: false,
      message: 'Server configuratiefout.',
      errors: { general: ['Login tijdelijk niet mogelijk door een serverfout.'] },
    };
  }

  try {
    // 2. Zoek gebruiker in database (case-insensitief)
    console.log('Uitvoeren prisma.user.findUnique...');
    const user = await prisma.user.findUnique({
      where: {
         email: email, // Behoud originele case voor return, maar zoek case-insensitief
         // Gebruik mode: insensitive voor de effectieve query
         // Dit vereist mogelijk een aanpassing in hoe je Prisma/DB hebt opgezet
         // Als dit een error geeft, moeten we het anders aanpakken.
         // Alternatief: email: { equals: email, mode: 'insensitive' }
         // We proberen eerst zonder expliciete mode, Prisma probeert vaak al slim te zijn.
         // Correctie: findUnique ondersteunt geen `mode`. We moeten findFirst gebruiken.
      },
    });

    // Correctie: Gebruik findFirst voor case-insensitieve zoekopdracht
    const userFound = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    console.log('Resultaat van findFirst:', userFound); // Log het gevonden object of null

    // Vervang 'user' door 'userFound' in de volgende checks
    if (!userFound || !userFound.passwordHash) {
      console.log('Gebruiker niet gevonden of geen wachtwoord hash (na case-insensitieve zoekopdracht).');
      if (userFound) {
        console.log('Gevonden gebruiker mist passwordHash:', userFound.passwordHash);
      }
      return {
        success: false,
        message: 'Ongeldige inloggegevens.',
        errors: { general: ['Ongeldige inloggegevens.'] },
      };
    }

    // 3. Vergelijk wachtwoorden
    console.log('Vergelijken met hash:', userFound.passwordHash); // Log de hash
    const passwordsMatch = await bcrypt.compare(password, userFound.passwordHash);

    if (!passwordsMatch) {
      console.log('Wachtwoorden komen niet overeen voor gebruiker:', userFound.email);
      return {
        success: false,
        message: 'Ongeldige inloggegevens.',
        errors: { general: ['Ongeldige inloggegevens.'] },
      };
    }

    // --- AUTHENTICATIE SUCCESVOL --- 
    console.log('Authenticatie succesvol voor:', userFound.email); // Gebruik userFound

    // 4. Genereer JWT 
    const payload: JwtPayload = { userId: userFound.id, role: userFound.role }; // Gebruik userFound
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    console.log('JWT gegenereerd:', token);

    // 5. Zet JWT in een HTTP-Only cookie (MET AWAIT)
    console.log('Poging tot zetten van sessie cookie...');
    const cookieStore = await cookies(); // Haal de cookie store op
    cookieStore.set(SESSION_COOKIE_NAME, token, { // Gebruik de store om te setten
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Alleen secure in productie (HTTPS)
      path: '/', // Beschikbaar voor de hele site
      maxAge: 60 * 60, // 1 uur (in seconden), gelijk aan JWT expiration
      sameSite: 'lax', // Goede standaard tegen CSRF
    });
    console.log(`Sessie cookie (${SESSION_COOKIE_NAME}) zou gezet moeten zijn.`);

    // 6. Redirect naar het admin dashboard (Server-side)
    // Let op: redirect() moet buiten de try...catch staan of de error opnieuw throwen
    // Anders wordt de error opgevangen en de redirect niet uitgevoerd.
    // We gooien de error hier niet opnieuw, dus de redirect moet NA de catch.

  } catch (error) {
    console.error('Login actie gefaald (binnen try/catch):', error);
    // Geef specifieke error terug ipv redirecten bij fout
    return {
      success: false,
      message: 'Er is een interne fout opgetreden bij het inloggen.',
      errors: { general: ['Login mislukt door een serverfout.'] },
    };
  }

  // Redirect alleen als alles in de try block succesvol was EN de cookie gezet is
  console.log('Alles succesvol, poging tot redirect naar /admin_area/dashboard...');
  redirect('/admin_area/dashboard'); // Pad aangepast naar nieuwe mapnaam

}

// TODO: Voeg een registerUser actie toe (voor het aanmaken van de eerste admin gebruiker)
// Dit zou wachtwoord hashing moeten bevatten met bcrypt.hash()

// Actie om de gebruiker uit te loggen
export async function logoutUser() {
  console.log('Logout action aangeroepen...');
  try {
    // Verwijder de sessie cookie
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    console.log('Sessie cookie verwijderd.');
  } catch (error) {
    // Hoewel delete waarschijnlijk geen error gooit, is het goed om af te vangen
    console.error('Fout bij het verwijderen van de sessie cookie:', error);
    // We proberen toch te redirecten, het belangrijkste is de cookie weg is.
  }
  
  // Redirect naar de homepage
  redirect('/');
} 
import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
// Mantine imports hier niet meer nodig voor AppShell
import { prisma } from '@/lib/prisma';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'; // Importeer de Client Component

// Definieer opnieuw de JWT payload structuur (of importeer indien gedeeld)
interface JwtPayload {
  userId: string;
  role: string;
}

const SESSION_COOKIE_NAME = 'session'; // Zelfde naam als in auth.ts

async function validateSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    console.log('AdminAreaLayout: Geen sessie token gevonden.');
    return null;
  }

  if (!process.env.JWT_SECRET) {
    console.error('AdminAreaLayout: FATAL ERROR: JWT_SECRET is niet ingesteld!');
    return null; 
  }

  try {
    // Verifieer de token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    console.log('AdminAreaLayout: Token geverifieerd, payload:', decoded);

    // Optioneel maar aanbevolen: Check of gebruiker nog bestaat en de juiste rol heeft
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true }, // Selecteer alleen wat nodig is
    });

    if (!user || user.role !== 'ADMIN') {
        console.log(`AdminAreaLayout: Gebruiker ${decoded.userId} niet gevonden of geen ADMIN.`);
        // Gooi een error zodat de catch block de redirect kan afhandelen
        throw new Error('Gebruiker niet gevonden of ongeldige rol');
    }

    // Als alles ok is, geef de payload terug (of true, of user info)
    return decoded;

  } catch (error) {
    console.error('AdminAreaLayout: Sessie validatie gefaald:', error);
    // Bij een fout (verlopen token, ongeldige signature, gebruiker niet gevonden), beschouw sessie als ongeldig
    return null;
  }
}

export default async function AdminAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Authenticatie weer INGESCHAKELD --- 
  const session = await validateSession();
  
  if (!session) {
    console.log('AdminAreaLayout: Geen geldige sessie, redirect naar /login');
    redirect('/login'); 
  }
  
  console.log(`AdminAreaLayout: Geldige sessie voor gebruiker ${session.userId}, rol ${session.role}. Renderen via Client Component...`);
  // --- Einde authenticatie check ---

  // Geef children door aan de Client Component die de AppShell bevat
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
} 
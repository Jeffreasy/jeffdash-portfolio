import React from 'react';
// Verwijder imports die alleen voor validatie nodig waren:
// import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
// import { prisma } from '@/lib/prisma';

import AdminLayoutClient from '@/components/admin/AdminLayoutClient'; // Importeer de Client Component

// Verwijder de payload interface en cookie naam (nu in middleware)
// interface JwtPayload { ... }
// const SESSION_COOKIE_NAME = ...

// Verwijder de hele validateSession functie
// async function validateSession() { ... }

export default async function AdminAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Verwijder de authenticatie check --- 
  // const session = await validateSession();
  // 
  // if (!session) {
  //   console.log('AdminAreaLayout: Geen geldige sessie, redirect naar /login');
  //   redirect('/login'); 
  // }
  // 
  // console.log(`AdminAreaLayout: Geldige sessie voor gebruiker ${session.userId}, rol ${session.role}. Renderen via Client Component...`);
  // --- Einde verwijderde check ---

  // Geef children direct door aan de Client Component
  // De middleware handelt nu de toegangscontrole af.
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
} 
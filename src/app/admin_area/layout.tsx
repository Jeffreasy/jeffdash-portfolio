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
  // The middleware handles access control for admin routes
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
} 
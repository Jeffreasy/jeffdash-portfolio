// src/app/(pages)/layout.tsx - Hersteld naar simpele wrapper
import React from 'react';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Deze layout erft de RootLayout (incl. Header/Footer)
  return <>{children}</>;
} 
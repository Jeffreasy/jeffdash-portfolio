import React from 'react';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Deze layout kan later uitgebreid worden met bijv. een gedeelde header/footer voor deze pagina's
  return <>{children}</>;
} 
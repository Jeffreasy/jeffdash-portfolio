import React from 'react';
// import Header from '@/components/layout/Header'; // Verwijder import
// import Footer from '@/components/layout/Footer'; // Verwijder import

interface PagesLayoutProps {
  children: React.ReactNode;
}

export default function PagesLayout({ children }: PagesLayoutProps) {
  // Header en Footer zitten al in de root layout (src/app/layout.tsx)
  // Deze layout is nu alleen voor de children van de (pages) group
  return <>{children}</>;
  // Vorige versie:
  // return (
  //   <>
  //     <Header />
  //     {children}
  //     <Footer />
  //   </>
  // );
} 
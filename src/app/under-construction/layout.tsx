import React from 'react';

// Special layout for under construction page that bypasses the normal LayoutWrapper
// This prevents users from accessing navigation links in Header/Footer
export default function UnderConstructionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main style={{ 
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {children}
    </main>
  );
} 
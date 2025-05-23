'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import PageErrorBoundary from '@/components/features/shared/PageErrorBoundary';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // Ensure we only check pathname on client to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // During SSR, always render the normal layout (with Header/Footer)
  // This prevents hydration mismatches from pathname checks
  if (!isClient) {
    return (
      <>
        <Header />
        <PageErrorBoundary>
          <main style={{ 
            minHeight: 'calc(100vh - 200px)',
            paddingTop: '2rem',
            paddingBottom: '2rem' 
          }}>
            {children}
          </main>
        </PageErrorBoundary>
        <Footer />
      </>
    );
  }
  
  // Check if we're in admin area or login - these don't need Header/Footer
  const isAdminRoute = pathname?.startsWith('/admin_area') || pathname?.startsWith('/login');
  
  if (isAdminRoute) {
    // Admin routes handle their own layout
    return <>{children}</>;
  }
  
  // Regular pages get Header/Footer
  return (
    <>
      <Header />
      <PageErrorBoundary>
        <main style={{ 
          minHeight: 'calc(100vh - 200px)', // Adjust based on header/footer height
          paddingTop: '2rem',
          paddingBottom: '2rem' 
        }}>
          {children}
        </main>
      </PageErrorBoundary>
      <Footer />
    </>
  );
} 
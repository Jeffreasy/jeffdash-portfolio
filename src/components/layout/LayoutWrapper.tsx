'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Box } from '@mantine/core';
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
      <Box
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <PageErrorBoundary>
          <Box
            component="main"
            style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>
        </PageErrorBoundary>
        <Footer />
      </Box>
    );
  }
  
  // Check routes that don't need Header/Footer
  const isAdminRoute = pathname?.startsWith('/admin_area') || pathname?.startsWith('/login');
  const isConstructionPage = pathname === '/'; // Homepage with construction page
  const isRouteWithoutLayout = isAdminRoute || isConstructionPage;
  
  if (isRouteWithoutLayout) {
    // These routes handle their own layout or need no layout
    return (
      <Box
        style={{
          minHeight: '100vh',
          background: isConstructionPage 
            ? 'transparent' // Construction page has its own background
            : 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        }}
      >
        {children}
      </Box>
    );
  }
  
  // Regular pages get Header/Footer
  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <PageErrorBoundary>
        <Box
          component="main"
          style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
      </PageErrorBoundary>
      <Footer />
    </Box>
  );
} 
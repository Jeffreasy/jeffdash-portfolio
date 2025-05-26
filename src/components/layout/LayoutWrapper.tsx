import React from 'react';
import { Box } from '@mantine/core';
import Header from './Header';
import Footer from './Footer';
import PageErrorBoundary from '@/components/features/shared/PageErrorBoundary';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  // Simplified layout without client-side route checking to prevent hydration mismatches
  // All pages now consistently get Header/Footer layout
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
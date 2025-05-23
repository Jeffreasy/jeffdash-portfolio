import '@/app/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ReactNode } from 'react';
import PageErrorBoundary from '@/components/features/shared/PageErrorBoundary';

interface LayoutProps {
  children: ReactNode;
}

export default function PagesLayout({ children }: LayoutProps) {
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
import React from 'react';
import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Metadata for under construction page
export const metadata: Metadata = {
  title: 'Website in Onderhoud - Jeffrey Lavente Portfolio',
  description: 'Website tijdelijk in onderhoud. Komt binnenkort terug online met geweldige nieuwe features.',
  robots: {
    index: false,
    follow: false,
  },
  // Prevent caching during maintenance
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

// Special layout for under construction page that bypasses the normal LayoutWrapper
// This prevents users from accessing navigation links in Header/Footer
export default function UnderConstructionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      style={{ 
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw', // Prevent horizontal overflow
        position: 'relative',
        overflow: 'hidden', // Prevent horizontal scrollbar
        overflowY: 'auto', // Allow vertical scrolling only
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--mantine-color-dark-8)',
        color: 'var(--mantine-color-gray-1)',
      }}
    >
      {children}
      
      {/* Vercel Analytics & Speed Insights for maintenance page tracking */}
      <Analytics />
      <SpeedInsights />
      
      {/* Inline script to prevent dev tools access */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Additional security measures
            (function() {
              // Disable drag and drop
              document.addEventListener('dragstart', function(e) {
                e.preventDefault();
              });
              
              // Disable text selection on mobile
              document.addEventListener('selectstart', function(e) {
                e.preventDefault();
              });
              
              // Disable image saving
              document.addEventListener('contextmenu', function(e) {
                if (e.target.tagName === 'IMG') {
                  e.preventDefault();
                }
              });
              
              // Monitor for dev tools (basic detection)
              let devtools = {
                open: false,
                orientation: null
              };
              
              setInterval(function() {
                if (window.outerHeight - window.innerHeight > 200 || 
                    window.outerWidth - window.innerWidth > 200) {
                  if (!devtools.open) {
                    devtools.open = true;
                    console.clear();
                    console.log('%cWebsite in onderhoud', 'color: #3b82f6; font-size: 24px; font-weight: bold;');
                    console.log('%cDeze website is momenteel in onderhoud. Probeer het later opnieuw.', 'color: #6b7280; font-size: 14px;');
                  }
                } else {
                  devtools.open = false;
                }
              }, 500);
            })();
          `,
        }}
      />
    </div>
  );
} 
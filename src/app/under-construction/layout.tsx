import React from 'react';
import { ColorSchemeScript } from '@mantine/core';

// Special layout for under construction page that bypasses the normal LayoutWrapper
// This prevents users from accessing navigation links in Header/Footer
// Enhanced with proper meta tags and security measures
export default function UnderConstructionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Prevent caching during maintenance */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        style={{ 
          margin: 0,
          padding: 0,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
          backgroundColor: 'var(--mantine-color-dark-8)',
          color: 'var(--mantine-color-gray-1)',
          overflow: 'hidden',
        }}
        suppressHydrationWarning={true}
      >
        <main 
          style={{ 
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}
        </main>
        
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
      </body>
    </html>
  );
} 
// src/app/layout.tsx - CLEAN VERSION
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import "./globals.css";
import { MantineProvider, ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { SITE_CONFIG } from '@/lib/config';
import { theme } from '@/lib/theme';

// Import layout wrapper
import LayoutWrapper from '@/components/layout/LayoutWrapper';

// Optimaliseer font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // Zorgt voor betere text rendering tijdens het laden
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Jeffrey Lavente',
    'Web Developer',
    'Full Stack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Portfolio',
  ],
  authors: [{ name: 'Jeffrey Lavente' }],
  creator: 'Jeffrey Lavente',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-default.png`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    // Voeg Google Search Console verificatie toe
    google: 'JOUW_GOOGLE_SITE_VERIFICATION_ID',
  },
};

// JSON-LD voor de hele website
function WebsiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": SITE_CONFIG.url,
          "name": SITE_CONFIG.name,
          "description": SITE_CONFIG.description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${SITE_CONFIG.url}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })
      }}
    />
  );
}

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" {...mantineHtmlProps} className={inter.variable}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <WebsiteJsonLd />
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Notifications />
            
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            
          </ModalsProvider>
        </MantineProvider>
        
        {/* Vercel Analytics & Speed Insights */}
        <Analytics />
        <SpeedInsights />
        
        {/* Google Analytics */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
} 

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

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
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
  metadataBase: new URL(SITE_CONFIG.url),
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
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
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
};

// const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
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
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
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
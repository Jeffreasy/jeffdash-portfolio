import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { siteConfig } from "@/config/site.config";
import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Voeg dit toe voor betere font loading
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  // Voeg extra metadata toe
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          {children}
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

// src/app/layout.tsx

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { siteConfig } from "@/config/site.config";
import { ThemeProvider } from 'next-themes';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Database } from '@/types/supabase';

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: 'website',
  },
};

async function createClient() {
  try {
    const cookieStore = await cookies()
    return createServerComponentClient<Database>({ 
      cookies: () => cookieStore 
    });
  } catch (error) {
    console.error('Error creating client:', error);
    return null;
  }
}

async function getSession() {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Auth error:', error);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null;
  try {
    session = await getSession();
  } catch (error) {
    console.error('Layout error:', error);
  }

  return (
    <html lang="nl" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} h-full`}>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header session={session} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

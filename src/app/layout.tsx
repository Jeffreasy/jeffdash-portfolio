// src/app/layout.tsx - OORSPRONKELIJKE STAAT HERSTELD
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@mantine/core/styles.css';
import "./globals.css";
import { MantineProvider, ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
// import { GoogleAnalytics } from '@next/third-parties/google'; // Houd GA even uitgeschakeld
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeffdash Portfolio",
  description: "Portfolio van Jeffrey",
};

// const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider defaultColorScheme="light">
          <main>{children}</main>
        </MantineProvider>
        {/* {gaId && <GoogleAnalytics gaId={gaId} />} */}
      </body>
    </html>
  );
} 
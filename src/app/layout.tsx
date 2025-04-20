import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Core Mantine styles package first
import '@mantine/core/styles.css';
import "./globals.css";
import { MantineProvider, ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeffdash Portfolio", // Pas dit aan indien gewenst
  description: "Portfolio van Jeffrey", // Pas dit aan indien gewenst
};

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
        <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
} 
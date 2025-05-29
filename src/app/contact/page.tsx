import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import ContactContent from '@/components/features/contact/ContactContent';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen en vragen',
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
  openGraph: {
    title: 'Contact',
    description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen en vragen',
    url: `${SITE_CONFIG.url}/contact`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact',
    description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen en vragen',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD component voor Contact page
function ContactJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Jeffrey Lavente",
          "description": "Neem contact op met Jeffrey Lavente voor samenwerkingen en vragen",
          "mainEntity": {
            "@type": "Person",
            "name": "Jeffrey Lavente",
            "email": "contact@jeffdash.com",
            "url": SITE_CONFIG.url,
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "contact@jeffdash.com",
              "availableLanguage": ["Dutch", "English"]
            }
          }
        })
      }}
    />
  );
}

export default function ContactPage() {
  return (
    <>
      <ContactJsonLd />
      <ContactContent />
    </>
  );
} 

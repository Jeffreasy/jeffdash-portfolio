import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import ContactContent from '@/components/features/contact/ContactContent';

// --- SEO Metadata --- //
export const metadata: Metadata = {
  title: `Contact | ${SITE_CONFIG.name}`,
  description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen, vragen over webontwikkeling projecten, of om een offerte aan te vragen. Ik help graag!',
  keywords: ['contact', 'webontwikkelaar', 'samenwerking', 'offerte', 'Jeffrey Lavente'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
  openGraph: {
    title: `Contact | ${SITE_CONFIG.name}`,
    description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen, vragen over webontwikkeling projecten, of om een offerte aan te vragen.',
    url: `${SITE_CONFIG.url}/contact`,
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary',
    title: `Contact | ${SITE_CONFIG.name}`,
    description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen en webontwikkeling projecten.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactContent />;
} 
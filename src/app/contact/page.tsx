import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import ContactContent from '@/components/features/contact/ContactContent';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen en vragen',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact',
    description: 'Neem contact op met Jeffrey Lavente voor samenwerkingen en vragen',
    url: '/contact',
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

export default function ContactPage() {
  return <ContactContent />;
} 
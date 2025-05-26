import React from 'react';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';

// Importeer de daadwerkelijke sectie componenten
import HeroSection from '@/components/features/home/HeroSection';
import FeaturedProjects from '@/components/features/home/FeaturedProjects';
import PricingSection from '@/components/features/home/PricingSection';
import ShortAboutBlurb from '@/components/features/home/ShortAboutBlurb';
import CallToActionBlock from '@/components/features/home/CallToActionBlock';
import RecentBlogSection from '@/components/features/home/RecentBlogSection';

// Importeer blog-gerelateerde zaken
import { getPublishedPosts } from '@/lib/actions/blog';

// Importeer profielfoto action
import { getProfilePicture } from '@/lib/actions/content';

// --- SEO Metadata --- //
export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - Webontwikkelaar & Portfolio`,
  description: 'Jeffrey Lavente - Gepassioneerde webontwikkelaar gespecialiseerd in moderne technologieën zoals Next.js, React, TypeScript. Bekijk mijn projecten en expertise.',
  keywords: ['Jeffrey Lavente', 'webontwikkelaar', 'portfolio', 'Next.js', 'React', 'TypeScript', 'webontwikkeling', 'fullstack developer'],
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} - Webontwikkelaar & Portfolio`,
    description: 'Jeffrey Lavente - Gepassioneerde webontwikkelaar gespecialiseerd in moderne technologieën. Bekijk mijn projecten en expertise.',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} - Webontwikkelaar & Portfolio`,
    description: 'Jeffrey Lavente - Gepassioneerde webontwikkelaar gespecialiseerd in moderne technologieën.',
  },
  robots: {
    index: true,
    follow: true,
  },
  category: 'technology',
};

// Mark the page as dynamic
export const dynamic = 'force-dynamic';

// Pagina wordt async vanwege data fetching
export default async function HomePage() {
  // Haal data parallel op
  const [recentPosts, profilePicture] = await Promise.all([
    getPublishedPosts(3),
    getProfilePicture()
  ]);

  return (
    // De <main> tag wordt nu door de RootLayout verzorgd
    <>
      {/* Verwelkomingstitel kan eventueel onderdeel worden van HeroSection */}
      {/* <Title order={1}>Welkom bij Jeffdash Portfolio</Title> */}

      {/* 1. Hero Section */}
      <section aria-labelledby="hero-title">
        <h2 id="hero-title" className="sr-only">Hero Section</h2>
        <HeroSection />
      </section>

      {/* 2. Featured Projects */}
      <section aria-labelledby="featured-projects-title">
        <FeaturedProjects />
      </section>

      {/* 3. Pricing Section */}
      <section aria-labelledby="pricing-title">
        <PricingSection />
      </section>

      {/* 4. Recent Blog Posts (NIEUW) - Nu als client component */}
      <RecentBlogSection posts={recentPosts} />

      {/* 5. Short About Blurb - Nu met image props */}
      <section aria-labelledby="about-blurb-title">
        <ShortAboutBlurb 
          profileImageUrl={profilePicture.url} 
          profileImageAlt={profilePicture.alt}
        />
      </section>

      {/* 6. Call to Action */}
      <section aria-labelledby="cta-title">
        <h2 id="cta-title" className="sr-only">Call to Action</h2>
        <CallToActionBlock />
      </section>
    </>
  );
} 
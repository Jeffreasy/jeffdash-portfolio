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

// Force dynamic rendering to avoid static generation issues with Supabase
export const dynamic = 'force-dynamic';

// --- SEO Metadata --- //
export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - Full-Stack Developer & AI Explorer`,
  description: 'Jeffrey Lavente Portfolio - Gepassioneerd Full-Stack Developer die moderne webtechnologieën en AI combineert om innovatieve webapplicaties te creëren.',
  keywords: ['Jeffrey Lavente', 'webontwikkelaar', 'portfolio', 'Full-Stack Developer', 'AI', 'Next.js', 'React', 'TypeScript', 'webontwikkeling'],
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} - Full-Stack Developer & AI Explorer`,
    description: 'Jeffrey Lavente Portfolio - Innovatieve webapplicaties met moderne technologieën en AI.',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: 'website',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} - Full-Stack Developer & AI Explorer`,
    description: 'Jeffrey Lavente Portfolio - Innovatieve webapplicaties met moderne technologieën.',
  },
  robots: {
    index: true,
    follow: true,
  },
  category: 'technology',
};

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

      {/* 3. Pricing Section - RE-ENABLED */}
      <section aria-labelledby="pricing-title">
        <h2 id="pricing-title" className="sr-only">Pricing Section</h2>
        <PricingSection />
      </section>

      {/* 4. Recent Blog Posts */}
      <RecentBlogSection posts={recentPosts} />

      {/* 5. Short About Blurb */}
      <section aria-labelledby="about-blurb-title">
        <h2 id="about-blurb-title" className="sr-only">About Section</h2>
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
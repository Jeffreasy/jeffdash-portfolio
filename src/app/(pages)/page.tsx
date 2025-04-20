import React from 'react';
import { Title } from '@mantine/core';

// Importeer de daadwerkelijke sectie componenten
import HeroSection from '@/components/features/home/HeroSection';
import FeaturedProjects from '@/components/features/home/FeaturedProjects';
import ShortAboutBlurb from '@/components/features/home/ShortAboutBlurb';
import CallToActionBlock from '@/components/features/home/CallToActionBlock';

export default function HomePage() {
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
      <section aria-labelledby="featured-projects-title" className="mt-8">
        <h2 id="featured-projects-title">Uitgelichte Projecten</h2>
        <FeaturedProjects />
      </section>

      {/* 3. Short About Blurb */}
      <section aria-labelledby="about-blurb-title" className="mt-8">
        <h2 id="about-blurb-title">Over Mij (Kort)</h2>
        <ShortAboutBlurb />
      </section>

      {/* 4. Call to Action */}
      <section aria-labelledby="cta-title" className="mt-8">
        <h2 id="cta-title" className="sr-only">Call to Action</h2>
        <CallToActionBlock />
      </section>
    </>
  );
} 
import React from 'react';
// Originele imports hersteld
import { Title } from '@mantine/core';
import HeroSection from '@/components/features/home/HeroSection';
import FeaturedProjects from '@/components/features/home/FeaturedProjects';
import ShortAboutBlurb from '@/components/features/home/ShortAboutBlurb';
import CallToActionBlock from '@/components/features/home/CallToActionBlock';

export default function HomePage() {
  // --- OORSPRONKELIJKE HOMEPAGE STRUCTUUR HERSTELD ---
  return (
    <>
      {/* <Title order={1}>Welkom bij Jeffdash Portfolio</Title> */}

      <section aria-labelledby="hero-title">
        <h2 id="hero-title" className="sr-only">Hero Section</h2>
        <HeroSection />
      </section>

      <section aria-labelledby="featured-projects-title" className="mt-8">
        <h2 id="featured-projects-title">Uitgelichte Projecten</h2>
        <FeaturedProjects />
      </section>

      <section aria-labelledby="about-blurb-title" className="mt-8">
        <h2 id="about-blurb-title">Over Mij (Kort)</h2>
        <ShortAboutBlurb />
      </section>

      <section aria-labelledby="cta-title" className="mt-8">
        <h2 id="cta-title" className="sr-only">Call to Action</h2>
        <CallToActionBlock />
      </section>
    </>
  );
} 
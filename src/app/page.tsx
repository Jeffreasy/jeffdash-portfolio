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
import { getPublishedPostsLegacy } from '@/lib/actions/blog';

// Importeer project-gerelateerde zaken
import { getFeaturedProjects } from '@/lib/actions/projects';

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

// JSON-LD component voor de homepage
function HomeJsonLd({ profilePicture }: { profilePicture: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "name": "Jeffrey Lavente Portfolio",
          "description": "Jeffrey Lavente Portfolio - Gepassioneerd Full-Stack Developer die moderne webtechnologieën en AI combineert om innovatieve webapplicaties te creëren.",
          "url": SITE_CONFIG.url,
          "mainEntity": {
            "@type": "Person",
            "name": "Jeffrey Lavente",
            "jobTitle": "Full-Stack Developer & AI Explorer",
            "description": "Gepassioneerd door moderne webtechnologieën. Ik verken het volledige spectrum van full-stack development, ondersteund door AI (Vibecoding), om innovatieve en complete webapplicaties te realiseren.",
            "url": SITE_CONFIG.url,
            "image": profilePicture?.url || `${SITE_CONFIG.url}/images/profile.jpg`,
            "sameAs": [
              "https://github.com/jeffdash",
              "https://linkedin.com/in/jeffreylavente"
            ],
            "knowsAbout": [
              "Web Development",
              "React",
              "Next.js",
              "TypeScript",
              "AI Integration",
              "Full-Stack Development"
            ]
          },
          "potentialAction": {
            "@type": "ViewAction",
            "target": [
              `${SITE_CONFIG.url}/projects`,
              `${SITE_CONFIG.url}/contact`
            ]
          }
        })
      }}
    />
  );
}

// Pagina wordt async vanwege data fetching
export default async function HomePage() {
  // Haal data parallel op
  const [recentPosts, profilePicture, projectsData] = await Promise.all([
    getPublishedPostsLegacy(3),
    getProfilePicture(),
    getFeaturedProjects()
  ]);

  return (
    <>
      <HomeJsonLd profilePicture={profilePicture} />
      
      {/* 1. Hero Section */}
      <section aria-labelledby="hero-title">
        <h2 id="hero-title" className="sr-only">Hero Section</h2>
        <HeroSection />
      </section>

      {/* 2. Featured Projects */}
      <section aria-labelledby="featured-projects-title">
        <FeaturedProjects 
          featuredProjects={projectsData.featuredProjects}
          totalProjectCount={projectsData.totalProjectCount}
        />
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

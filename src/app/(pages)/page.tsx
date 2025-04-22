import React from 'react';
import { Title, SimpleGrid, Container, Button, Group } from '@mantine/core';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

// Importeer de daadwerkelijke sectie componenten
import HeroSection from '@/components/features/home/HeroSection';
import FeaturedProjects from '@/components/features/home/FeaturedProjects';
import ShortAboutBlurb from '@/components/features/home/ShortAboutBlurb';
import CallToActionBlock from '@/components/features/home/CallToActionBlock';

// Importeer blog-gerelateerde zaken
import { getPublishedPosts, type PublishedPostPreviewType } from '@/lib/actions/blog';
import BlogPostCard from '@/components/features/blog/BlogPostCard';

// Pagina wordt async vanwege data fetching
export default async function HomePage() {
  // Haal de laatste 3 blog posts op
  const recentPosts = await getPublishedPosts(); //.slice(0, 3); // .slice is niet nodig als getPublishedPosts al limiteert of sorteert
  // Aanpassing: getPublishedPosts haalt nu alle posts op, we slicen hier.
  const limitedRecentPosts = recentPosts.slice(0, 3);

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
      <section aria-labelledby="featured-projects-title" className="mt-16">
        <FeaturedProjects />
      </section>

      {/* 3. Recent Blog Posts (NIEUW) */}
      {limitedRecentPosts.length > 0 && (
        <section aria-labelledby="recent-blog-title" className="mt-16">
           <Container size="lg">
             <Group justify="space-between" mb="xl">
               <Title order={2} id="recent-blog-title">
                 Recente Blog Posts
               </Title>
               <Button
                  component={Link}
                  href="/blog"
                  variant="outline"
                  rightSection={<IconArrowRight size={16} />}
                >
                  Alle posts
               </Button>
             </Group>
             <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {limitedRecentPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
             </SimpleGrid>
           </Container>
        </section>
      )}

      {/* 4. Short About Blurb */}
      <section aria-labelledby="about-blurb-title" className="mt-16">
        <ShortAboutBlurb />
      </section>

      {/* 5. Call to Action */}
      <section aria-labelledby="cta-title" className="mt-8">
        <h2 id="cta-title" className="sr-only">Call to Action</h2>
        <CallToActionBlock />
      </section>
    </>
  );
} 
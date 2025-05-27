'use client';

import React, { useEffect } from 'react';
import { Container, Title, Button, Group, Text, Box } from '@mantine/core';
import { IconArrowRight, IconBrandGithub, IconEye } from '@tabler/icons-react';
import { FeaturedProjectType } from '@/lib/actions/projects';
import AnimatedProjectGrid from './AnimatedProjectGrid';
import PageErrorBoundary from '../shared/PageErrorBoundary';
import { useAnalytics } from '@/hooks/useAnalytics';

interface FeaturedProjectsProps {
  featuredProjects: FeaturedProjectType[];
  totalProjectCount: number;
}

/**
 * FeaturedProjects Component
 * Client Component that displays featured projects with analytics tracking
 * Uses AnimatedProjectGrid for client-side animations
 */
export default function FeaturedProjects({ featuredProjects, totalProjectCount }: FeaturedProjectsProps) {
  const { trackEvent, trackPageView } = useAnalytics();

  // Track featured projects section view
  useEffect(() => {
    trackPageView('page_load_complete', {
      section: 'featured_projects',
      featured_count: featuredProjects?.length || 0,
      total_project_count: totalProjectCount || 0,
      has_featured_projects: !!(featuredProjects && featuredProjects.length > 0),
      show_view_all_cta: totalProjectCount > (featuredProjects?.length || 0)
    });
  }, [trackPageView, featuredProjects, totalProjectCount]);

  // Handle "View All Projects" CTA click
  const handleViewAllProjectsClick = () => {
    trackEvent('hero_cta_clicked', {
      action: 'view_all_projects_click',
      element: 'view_all_projects_button',
      destination: '/projects',
      section: 'featured_projects',
      featured_count: featuredProjects?.length || 0,
      total_count: totalProjectCount || 0
    });
  };

  // Handle "Ask About Projects" CTA click
  const handleAskAboutProjectsClick = () => {
    trackEvent('hero_cta_clicked', {
      action: 'ask_about_projects_click',
      element: 'ask_about_projects_button',
      destination: 'mailto',
      section: 'featured_projects',
      contact_type: 'project_inquiry'
    });
  };

  // Handle empty state
  if (!featuredProjects || featuredProjects.length === 0) {
    return (
      <PageErrorBoundary>
        <section style={{ 
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        }}>
          <Container size="lg" py={{ base: 'xl', md: '3xl' }}>
            <Box style={{ textAlign: 'center' }}>
              <Title order={2} c="dimmed" mb="md">
                Projecten worden geladen...
              </Title>
              <Text c="dimmed">
                Momenteel geen uitgelichte projecten om weer te geven.
              </Text>
            </Box>
          </Container>
        </section>
      </PageErrorBoundary>
    );
  }

  // Render featured projects with CTA section
  return (
    <PageErrorBoundary>
      <section style={{ 
        position: 'relative',
        overflow: 'hidden',
        background: `
          linear-gradient(180deg, 
            transparent 0%, 
            rgba(0, 0, 0, 0.2) 15%, 
            rgba(15, 23, 42, 0.95) 25%, 
            rgba(15, 23, 42, 0.95) 75%, 
            rgba(0, 0, 0, 0.2) 85%, 
            transparent 100%
          )
        `,
        paddingTop: 'clamp(4rem, 8vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
      }}>
        {/* Decorative background element */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <Container size="lg" py={{ base: 'xl', md: '3xl' }} style={{ position: 'relative', zIndex: 1 }}>
          {/* Animated project grid */}
          <AnimatedProjectGrid 
            projects={featuredProjects}
            title="Uitgelichte Projecten"
            description="Een selectie van mijn meest recente en interessante werk"
            showTitle={true}
          />

          {/* Call-to-action section */}
          {totalProjectCount > featuredProjects.length && (
            <Box style={{ 
              textAlign: 'center',
              marginTop: 'var(--mantine-spacing-3xl)',
              padding: 'var(--mantine-spacing-xl)',
              borderRadius: 'var(--mantine-radius-lg)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}>
              <Title order={3} size="h2" mb="md" c="gray.2">
                Meer projecten bekijken?
              </Title>
              <Text c="gray.4" mb="xl" maw={400} mx="auto">
                Ontdek alle {totalProjectCount} projecten in mijn portfolio en zie de volledige scope van mijn werk.
              </Text>
              
              <Group justify="center" gap="md">
                <Button
                  component="a"
                  href="/projects"
                  onClick={handleViewAllProjectsClick}
                  variant="gradient"
                  gradient={{ from: 'blue.6', to: 'cyan.5' }}
                  size="lg"
                  radius="md"
                  rightSection={<IconEye size={18} />}
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  Bekijk Alle Projecten
                </Button>
                
                <Button
                  component="a"
                  href="mailto:jeffrey@jeffdash.nl?subject=Project Portfolio Interesse&body=Hallo Jeffrey,%0D%0A%0D%0AIk ben geïnteresseerd in je projecten en zou graag meer willen weten over je werk.%0D%0A%0D%0AMet vriendelijke groet"
                  onClick={handleAskAboutProjectsClick}
                  variant="outline"
                  color="gray"
                  size="lg"
                  radius="md"
                  rightSection={<IconArrowRight size={18} />}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'var(--mantine-color-gray-2)',
                  }}
                >
                  Vraag Over Projecten
                </Button>
              </Group>
            </Box>
          )}
        </Container>
      </section>
    </PageErrorBoundary>
  );
}
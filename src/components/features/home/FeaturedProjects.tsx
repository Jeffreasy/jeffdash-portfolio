// Dit is nu een Server Component
import React from 'react';
// Verwijder ProjectCard import hier, wordt nu gebruikt in AnimatedProjectGrid
import { Container, Title, Button, Group, Text, Box } from '@mantine/core';
import { IconArrowRight, IconBrandGithub } from '@tabler/icons-react';
import { getFeaturedProjects, FeaturedProjectType } from '@/lib/actions/projects';
// Verwijder motion import
// Importeer de nieuwe client component voor de animatie
import AnimatedProjectGrid from './AnimatedProjectGrid';
import PageErrorBoundary from '../shared/PageErrorBoundary';

/**
 * FeaturedProjects Component
 * Server Component that fetches and displays featured projects
 * Uses AnimatedProjectGrid for client-side animations
 */
export default async function FeaturedProjects() {
  // Fetch featured projects data on the server
  const { featuredProjects, totalProjectCount } = await getFeaturedProjects();

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
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
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
                  href="mailto:jeffrey@jeffdash.nl?subject=Project Portfolio Interesse&body=Hallo Jeffrey,%0D%0A%0D%0AIk ben geïnteresseerd in je projecten en zou graag meer willen weten over je werk.%0D%0A%0D%0AMet vriendelijke groet"
                  variant="gradient"
                  gradient={{ from: 'blue.6', to: 'cyan.5' }}
                  size="lg"
                  radius="md"
                  rightSection={<IconArrowRight size={18} />}
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  Vraag Over Projecten
                </Button>
                
                <Button
                  component="a"
                  href="https://github.com/Jeffreasy"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  color="gray"
                  size="lg"
                  radius="md"
                  leftSection={<IconBrandGithub size={18} />}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'var(--mantine-color-gray-2)',
                  }}
                >
                  GitHub
                </Button>
              </Group>
            </Box>
          )}
        </Container>
      </section>
    </PageErrorBoundary>
  );
}
import React from 'react';
import { Container, Title, Text, Paper, Group, Button, Stack, Anchor } from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub } from '@tabler/icons-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { getAboutContent } from '@/lib/actions/content';
import Image from 'next/image';

// --- SEO Metadata --- //
export const metadata: Metadata = {
  title: `Over Mij | ${SITE_CONFIG.name}`,
  description: `Leer meer over Jeffrey Lavente, een gepassioneerde webontwikkelaar gespecialiseerd in moderne technologieën zoals Next.js, React en TypeScript. Bekijk projecten en neem contact op.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: `Over Mij | ${SITE_CONFIG.name}`,
    description: `Leer meer over Jeffrey Lavente, een gepassioneerde webontwikkelaar gespecialiseerd in moderne technologieën zoals Next.js, React en TypeScript. Bekijk projecten en neem contact op.`,
    url: `${SITE_CONFIG.url}/about`,
    siteName: SITE_CONFIG.name,
    type: 'profile',
    locale: 'nl_NL',
  },
  twitter: {
    card: 'summary',
    title: `Over Mij | ${SITE_CONFIG.name}`,
    description: `Leer meer over Jeffrey Lavente, een gepassioneerde webontwikkelaar...`,
  },
};

// Mark the page as dynamic
export const dynamic = 'force-dynamic';

// --- Pagina Component --- //
export default async function AboutPage() {
  // Haal content en afbeelding op
  const content = await getAboutContent();

  // Gebruik de opgehaalde content, met fallbacks
  const pageTitle = content.about_title || 'Over Mij';
  const introText = content.about_intro || 'Introductietekst niet gevonden.';
  const focusText = content.about_focus || '';
  const projectsText = content.about_projects || '';
  const contactText = content.about_contact || '';
  const linkedInUrl = content.linkedin_url || '#';
  const githubUrl = content.github_url || '#';
  const profileImageUrl = content.profileImageUrl;
  const profileImageAlt = content.profileImageAlt || 'Profielfoto';

  return (
    <Container size="md" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Stack gap="xl">
          <Title order={1} ta="center">
            {pageTitle}
          </Title>

          {profileImageUrl && (
            <Group justify="center">
              <Image
                src={profileImageUrl}
                alt={profileImageAlt}
                width={150}
                height={150}
                quality={85}
                priority
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </Group>
          )}

          <Stack gap="lg">
            <Text size="lg">
              {introText}
            </Text>
            {focusText && <Text>{focusText}</Text>}
            {projectsText && <Text>{projectsText}</Text>}
            {contactText && <Text>{contactText}</Text>}
          </Stack>

          <Group justify="center" gap="lg" mt="md">
            <Button
              component="a"
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              leftSection={<IconBrandLinkedin size={18} />}
              disabled={linkedInUrl === '#'}
            >
              LinkedIn
            </Button>
            <Button
              component="a"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="default"
              leftSection={<IconBrandGithub size={18} />}
              disabled={githubUrl === '#'}
            >
              GitHub
            </Button>
            <Button
              component={Link}
              href="/contact"
              variant="outline"
            >
              Neem Contact Op
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
} 
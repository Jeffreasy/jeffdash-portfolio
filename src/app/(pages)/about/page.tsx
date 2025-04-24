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
  description: `Leer meer over Jeffrey Lavente, een gepassioneerde webontwikkelaar gespecialiseerd in moderne technologieën zoals Next.js, React en TypeScript. Bekijk projecten en neem contact op.`, // Pas deze beschrijving aan!
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: `Over Mij | ${SITE_CONFIG.name}`,
    description: `Leer meer over Jeffrey Lavente, een gepassioneerde webontwikkelaar gespecialiseerd in moderne technologieën zoals Next.js, React en TypeScript. Bekijk projecten en neem contact op.`, // Pas aan!
    url: `${SITE_CONFIG.url}/about`,
    siteName: SITE_CONFIG.name,
    type: 'profile',
    locale: 'nl_NL',
    // Voeg hier eventueel een standaard OG afbeelding toe als je die hebt
    // images: [
    //   {
    //     url: `${SITE_CONFIG.url}/images/og-about.png`,
    //     width: 1200,
    //     height: 630,
    //     alt: `Over Jeffrey Lavente`,
    //   },
    // ],
  },
   twitter: {
      card: 'summary',
      title: `Over Mij | ${SITE_CONFIG.name}`,
      description: `Leer meer over Jeffrey Lavente, een gepassioneerde webontwikkelaar...`, // Pas aan!
      // site: '@jouwTwitterHandle',
      // creator: '@jouwTwitterHandle',
      // images: [`${SITE_CONFIG.url}/images/twitter-about.png`], // Optionele Twitter afbeelding
    },
};

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
  const profileImageUrl = content.profileImageUrl; // Kan undefined zijn
  const profileImageAlt = content.profileImageAlt || 'Profielfoto'; // Fallback alt tekst

  return (
    <Container size="md" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Stack gap="xl">
          <Title order={1} ta="center">
            {pageTitle}
          </Title>

          {/* Dynamische Profielfoto (indien beschikbaar) */}
          {profileImageUrl && (
            <Group justify="center">
              <Image
                src={profileImageUrl}
                alt={profileImageAlt}
                width={150} // Specificeer breedte
                height={150} // Specificeer hoogte
                quality={85} // Optioneel: kwaliteit aanpassen
                priority // Geef prioriteit aan LCP-kandidaat
                style={{
                  borderRadius: '50%', // Cirkel stijl
                  objectFit: 'cover', // Zorg dat afbeelding de ruimte vult
                }}
              />
            </Group>
          )}

          <Stack gap="lg">
            {/* Tekst blijft hetzelfde */}
            <Text size="lg">
              {introText}
            </Text>
            {focusText && <Text>{focusText}</Text>}
            {projectsText && <Text>{projectsText}</Text>}
            {contactText && <Text>{contactText}</Text>}
          </Stack>

          <Group justify="center" gap="lg" mt="md">
            {/* Knoppen blijven hetzelfde */}
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
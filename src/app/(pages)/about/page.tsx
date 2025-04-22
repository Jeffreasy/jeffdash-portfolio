import React from 'react';
import { Container, Title, Text, Paper, Group, Button, Stack, Anchor } from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub } from '@tabler/icons-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/config';

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
export default function AboutPage() {
  const linkedInUrl = "https://www.linkedin.com/in/jeffrey-lavente-026a41330/";
  const githubUrl = "https://github.com/Jeffreasy";

  return (
    <Container size="md" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Stack gap="xl">
          <Title order={1} ta="center">
            Over Mij
          </Title>

          {/* TODO: Voeg hier je profielfoto toe zodra je die hebt */}
          {/* Bijvoorbeeld:
          <Group justify="center">
            <Image
              radius="50%" // Cirkel
              h={150}
              w="auto"
              fit="cover"
              src="/images/jouw-foto.jpg" // Pad naar je foto in /public/images
              alt="Foto van Jeffrey Lavente"
            />
          </Group>
          */}

          <Stack gap="lg">
            {/* === VERVANG DEZE TEKST MET JE EIGEN VERHAAL === */}
            <Text size="lg">
              Welkom op mijn portfolio! Ik ben Jeffrey Lavente, een enthousiaste en gedreven webontwikkelaar met een passie voor het creëren van moderne, gebruiksvriendelijke en performante webapplicaties.
            </Text>
            <Text>
              Mijn focus ligt op het bouwen met cutting-edge technologieën zoals Next.js, React, TypeScript, en Prisma. Ik geniet ervan om complexe problemen om te zetten in elegante, schaalbare oplossingen. Of het nu gaat om het ontwikkelen van een interactieve frontend, het opzetten van een robuuste backend-API, of het optimaliseren van de database interactie, ik streef altijd naar de hoogste kwaliteit.
            </Text>
            <Text>
              Op deze site vind je een selectie van mijn projecten die mijn vaardigheden en interesses weerspiegelen. Ik ben altijd op zoek naar nieuwe uitdagingen en mogelijkheden om te leren en te groeien als ontwikkelaar.
            </Text>
            <Text>
              Bekijk gerust mijn profielen op LinkedIn en GitHub, of neem contact op als je vragen hebt of wilt samenwerken!
            </Text>
            {/* === EINDE TEKST === */}
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
"use client"; // Behoud dit als je de Next.js App Router gebruikt

import React from 'react';
import { Title, Text, Button, Container, Box, Group } from '@mantine/core'; // Box en Group toegevoegd
import { IconArrowRight } from '@tabler/icons-react'; // Voorbeeld icoon (installeer @tabler/icons-react)
import Link from 'next/link';
import ErrorBoundary from './ErrorBoundary';
// Optioneel: importeer een CSS-module voor meer geavanceerde stijlen of animaties
// import classes from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  const titleId = "hero-title"; // ID voor aria-labelledby

  return (
    <ErrorBoundary>
      <Box
        component="section"
        aria-labelledby={titleId}
        // Voorbeeld: een subtiele gradient achtergrond. Pas kleuren aan naar je thema.
        // Je kunt ook een afbeelding of effen kleur gebruiken.
        // bg={`linear-gradient(135deg, var(--mantine-color-gray-0) 0%, var(--mantine-color-blue-0) 100%)`}
        // className={classes.heroContainer} // Alternatief via CSS module
        // Meer verticale padding, responsief gemaakt
        py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 3)' }}
      >
        <Container size="md">
          {/* Titel: Groter, vetter en met een persoonlijke touch */}
          <Title
            id={titleId}
            order={1}
            ta="center"
            fz={{ base: '2.5rem', sm: '3.5rem' }}
            fw={800}
            // Gebruik white-space: pre-line om regelafbrekingen uit de code te respecteren
            style={{ whiteSpace: 'pre-line' }}
          >
            {/* Tekst nu met daadwerkelijke regelafbrekingen in de string */}
            {`Jeffrey
            Full-Stack Developer
            &
            AI Coding Explorer`}
          </Title>

          {/* Subtitel: Duidelijk, bondig en iets subtieler van kleur */}
          <Text
            ta="center"
            mt="md"
            mb="xl" // Extra ruimte voor de knop
            c="dimmed" // Maakt de tekst iets minder prominent dan de titel
            fz="lg" // Iets groter dan standaard tekst
          >
            {/* Aangepaste Subtitel */}
            Gepassioneerd door moderne webtechnologieën. Ik verken het volledige spectrum van full-stack development, ondersteund door AI (Vibecoding), om innovatieve en complete webapplicaties te realiseren.
          </Text>

          {/* Call-to-Action Knop: Gecentreerd, opvallend en met een icoon */}
          <Group justify="center" mt="xl">
            <Button
              component={Link}
              href="/projects" // Zorg dat dit de juiste link is!
              size="lg" // Grote, duidelijke knop
              variant="gradient" // Moderne gradient stijl
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }} // Pas gradient kleuren aan
              leftSection={<IconArrowRight size={18} />} // Icoon voor visuele hint
              // className={classes.ctaButton} // Optioneel via CSS module
            >
              Bekijk mijn werk
            </Button>
            {/* Optioneel: Voeg een secundaire CTA toe */}
            {/*
            <Button
              component={Link}
              href="/contact"
              size="lg"
              variant="default" // Subtielere stijl
            >
              Neem contact op
            </Button>
            */}
          </Group>
        </Container>
      </Box>
    </ErrorBoundary>
  );
};

export default HeroSection;
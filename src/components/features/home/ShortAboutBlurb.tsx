'use client'; // Markeer als Client Component

import React from 'react';
import { Text, Button, Container, Title, Group, Grid, useMantineTheme } from '@mantine/core';
import Link from 'next/link'; // Gebruik Next.js Link voor navigatie
import Image from 'next/image'; // Importeer next/image
import { useMediaQuery } from '@mantine/hooks'; // Importeer hook voor media query
import ErrorBoundary from './ErrorBoundary';

// Definieer de props interface
interface ShortAboutBlurbProps {
  profileImageUrl?: string;
  profileImageAlt?: string;
}

const ShortAboutBlurb: React.FC<ShortAboutBlurbProps> = ({ 
  profileImageUrl, 
  profileImageAlt 
}) => {
  // Hook om te checken of we op een klein scherm zitten (onder xs breakpoint)
  const isMobile = useMediaQuery(`(max-width: ${useMantineTheme().breakpoints.xs})`); // Haal breakpoint uit theme

  return (
    <ErrorBoundary>
      <Container size="md" py="xl">
        <Title order={2} ta="center" mb="xl">
          Over Mij (Kort)
        </Title>
        <Grid gutter="xl" align="center">
          {/* Afbeelding Kolom (alleen tonen als URL bestaat) */}
          {profileImageUrl && (
            <Grid.Col span={{ base: 12, xs: 4, sm: 3 }}>
              <Image
                src={profileImageUrl}
                alt={profileImageAlt || 'Profielfoto'} // Fallback alt
                width={120} // Aangepaste, kleinere maat voor de blurb
                height={120}
                quality={80}
                priority // Belangrijk voor LCP als het above the fold is
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto', // Centreer de afbeelding in de kolom
                  display: 'block' // Zorg dat margin auto werkt
                }}
              />
            </Grid.Col>
          )}

          {/* Tekst Kolom (neemt resterende ruimte) */}
          <Grid.Col span={{ base: 12, xs: profileImageUrl ? 8 : 12, sm: profileImageUrl ? 9 : 12 }}>
            <Text ta={isMobile ? 'center' : 'left'}> {/* Tekstuitlijning met ternary operator gebaseerd op isMobile */}
              Naast mijn werk in de zorg als begeleider, duik ik in mijn vrije tijd vol passie in de wereld van web development. Ik focus op het volledige full-stack proces, vaak met hulp van AI-tools, om moderne applicaties te bouwen.
            </Text>
            <Group justify={isMobile ? 'center' : 'flex-start'} mt="lg"> {/* Knop positie met ternary operator gebaseerd op isMobile */}
               <Button component={Link} href="/about" size="md">
                  Lees Meer Over Mij
               </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    </ErrorBoundary>
  );
};

export default ShortAboutBlurb; 
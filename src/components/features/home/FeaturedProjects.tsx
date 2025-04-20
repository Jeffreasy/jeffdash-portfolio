// Dit is nu een Server Component
import React from 'react';
// Belangrijk: Zorg ervoor dat ProjectCard goed is ontworpen.
// Deze zou Mantine's Card, Image, Text, Badge, Group, Button/Anchor moeten gebruiken.
import ProjectCard from '../projects/ProjectCard';
import { SimpleGrid, Container, Title, Button, Group, Text } from '@mantine/core'; // Title, Button, Group, Text toegevoegd
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react'; // Voor button icoon (installeer @tabler/icons-react)
// Importeer de data ophaal functie en het type
import { getFeaturedProjects, FeaturedProjectType } from '@/lib/actions/projects';

// Component is nu async om data te kunnen awaiten
export default async function FeaturedProjects() {
  // --- Data Ophalen --- (Gebeurt nu op de server)
  const { featuredProjects, totalProjectCount } = await getFeaturedProjects();

  // --- Render Logic ---
  // Toon niets of een bericht als er geen projecten zijn
  if (!featuredProjects || featuredProjects.length === 0) {
    return (
      <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
        <Text ta="center" c="dimmed">Momenteel geen projecten om weer te geven.</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py={{ base: 'xl', sm: 'calc(var(--mantine-spacing-xl) * 2)' }}>
      {/* Sectie Titel */}
      <Title order={2} ta="center" mb="xl">
        Uitgelichte Projecten
      </Title>

      {/* Grid met Project Kaarten */}
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }} // Responsive kolommen
        spacing="xl" // Ruimte tussen de kaarten
      >
        {/* Gebruik de opgehaalde featuredProjects */}
        {featuredProjects.map((project: FeaturedProjectType) => (
          // De ProjectCard component toont de details.
          // Zorg ervoor dat deze component de 'project' prop gebruikt om:
          // - De afbeelding (imageUrl) te tonen
          // - De titel (title) te tonen
          // - De beschrijving (description) te tonen
          // - De tags (tags) weer te geven (bijv. met Mantine's <Badge>)
          // - Te linken naar de detailpagina: <Anchor component={Link} href={`/projects/${project.slug}`}>
          <ProjectCard key={project.id} project={project} />
        ))}
      </SimpleGrid>

      {/* Toon knop alleen als er meer projecten zijn dan getoond */}
      {totalProjectCount > featuredProjects.length && (
        <Group justify="center" mt="xl">
          <Button
            component={Link}
            href="/projects" // Link naar je hoofd projectenpagina
            variant="outline" // Subtielere stijl dan primaire CTA
            size="md"
            rightSection={<IconArrowRight size={16} />} // Optioneel: icoon
          >
            Bekijk alle projecten
          </Button>
        </Group>
      )}
    </Container>
  );
}
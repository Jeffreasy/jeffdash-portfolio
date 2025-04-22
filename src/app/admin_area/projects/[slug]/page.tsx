import React from 'react';
import { Container, Title, Paper, Alert, Text } from '@mantine/core';
import { notFound } from 'next/navigation'; // Importeer notFound
import { IconInfoCircle } from '@tabler/icons-react';

import ProjectForm from '@/components/admin/ProjectForm';
import { getProjectBySlug, updateProjectAction } from '@/lib/actions/projects'; // Importeer get en update actions

interface EditProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditProjectPage(props: EditProjectPageProps) {
  const params = await props.params;

  const {
    slug
  } = params;

  // Haal het project op met de direct beschikbare slug
  const project = await getProjectBySlug(slug);

  // Als project niet gevonden wordt, toon 404
  if (!project) {
    notFound();
  }

  return (
    <Container size="md" my="xl">
      <Title order={2} mb="lg">
        Project Bewerken: {project.title}
      </Title>

      {/* Optioneel: Toon een waarschuwing als er geen content is */}
      {!project.detailedContent && (
         <Alert icon={<IconInfoCircle size="1rem" />} title="Let op" color="yellow" mb="lg">
           Dit project heeft nog geen gedetailleerde inhoud.
         </Alert>
      )}

      <Paper withBorder shadow="sm" p="xl">
        <ProjectForm
          action={updateProjectAction} // Gebruik de update action
          project={project} // Geef de projectdata mee
          submitButtonLabel="Wijzigingen Opslaan" // Aangepast label
          // Geen initialState nodig hier, useFormState start met lege state
        />
      </Paper>
    </Container>
  );
} 
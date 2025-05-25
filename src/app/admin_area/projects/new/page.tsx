import React from 'react';
import { Container, Title, Paper } from '@mantine/core';
import ProjectForm from '@/components/admin/ProjectForm';
import { createProjectAction } from '@/lib/actions/projects';

export default function NewProjectPage() {
  return (
    <Container size="md" my="xl">
      <Title order={2} mb="lg">
        Nieuw Project Toevoegen
      </Title>
      <Paper withBorder shadow="sm" p="xl">
        <ProjectForm 
          action={createProjectAction} 
          submitButtonLabel="Project Aanmaken" 
        />
      </Paper>
    </Container>
  );
} 
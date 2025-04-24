import React from 'react';
import { Title, Text, Button, Alert } from '@mantine/core';
import Link from 'next/link';
// import { prisma } from '@/lib/prisma'; // Remove Prisma client import
import { IconInfoCircle } from '@tabler/icons-react';
import ProjectsTable from '@/components/admin/ProjectsTable'; // Importeer de tabel component
// import type { Project as PrismaProject } from '@prisma/client'; // Remove Prisma type import
import { getProjectsForAdmin } from '@/lib/actions/projects'; // Importeer de nieuwe action
import type { AdminProjectListItemType } from '@/lib/actions/projects'; // Importeer het bijbehorende type

export default async function AdminProjectsPage() {
  // let projects: PrismaProject[] = []; // Use Supabase Project type
  let projects: AdminProjectListItemType[] = []; // Gebruik het nieuwe type
  let fetchError = null;

  try {
    // // Haal projecten op uit de database, sorteer op nieuwste eerst
    // projects = await prisma.project.findMany({
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    //   // Geen select hier, tabel heeft mogelijk alle velden nodig
    // });
    // Fetch projects using the Supabase server action
    projects = await getProjectsForAdmin();
  } catch (error) {
    console.error("Fout bij ophalen projecten voor admin:", error);
    // De action gooit nu mogelijk een error, vang die op
    fetchError = (error instanceof Error) ? error.message : "Kon projecten niet laden door een serverfout.";
  }

  return (
    <div>
      <Title order={2} mb="xl">Projecten Beheer</Title>
      
      {/* Knop om nieuw project toe te voegen */}
      <Button component={Link} href="/admin_area/projects/new" mb="xl">
        Nieuw Project Toevoegen
      </Button>

      {/* Toon foutmelding indien ophalen mislukt */}
      {fetchError && (
        <Alert icon={<IconInfoCircle size="1rem" />} title="Fout" color="red" mb="xl">
          {fetchError}
        </Alert>
      )}

      {/* TODO: Toon projecten in een tabel */}
      {!fetchError && projects.length === 0 && (
        <Text>Nog geen projecten gevonden.</Text>
      )}
      {!fetchError && projects.length > 0 && (
        <ProjectsTable projects={projects} /> 
      )}
    </div>
  );
} 
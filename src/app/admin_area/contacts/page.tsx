import { getContactSubmissions, ContactSubmissionType } from '@/lib/actions/contact';
import { Container, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import ContactSubmissionsTable from '@/components/admin/ContactSubmissionsTable'; // Importeer de client component

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export default async function ContactsAdminPage() {
  let submissions: ContactSubmissionType[] = [];
  let error: string | null = null;

  try {
    submissions = await getContactSubmissions();
  } catch (err: any) {
    console.error("Error fetching contact submissions:", err);
    error = err.message || 'Kon de contactinzendingen niet laden.';
  }

  return (
    <Container size="lg" my="xl">
      <Title order={2} mb="lg">Contactformulier Inzendingen</Title>

      {error && (
        <Alert title="Fout bij laden" color="red" icon={<IconAlertCircle />} mb="md">
          {error}
        </Alert>
      )}

      {/* Geef de data door aan de client component voor weergave en interactie */}
      {!error && <ContactSubmissionsTable initialSubmissions={submissions} />}
      
    </Container>
  );
} 
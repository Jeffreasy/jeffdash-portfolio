import { Suspense } from 'react';
import { getAboutContentForAdmin } from '@/lib/actions/siteContent';
import { Container, Title, Card, Stack, LoadingOverlay } from '@mantine/core';
import AboutForm from '@/components/admin/AboutForm';
import AdminLayout from '@/components/admin/AdminLayout';
import { redirect } from 'next/navigation';
import { validateAdminSession } from '@/lib/actions/auth';

async function AboutAdminContent() {
  try {
    await validateAdminSession();
    const aboutContent = await getAboutContentForAdmin();
    
    return (
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <Title order={1} size="h2">
            About Content Beheer
          </Title>
          
          <Card withBorder shadow="sm" radius="md" p="lg">
            <Stack gap="md">
              <Title order={2} size="h3" c="blue">
                Bewerk About Pagina
              </Title>
              <AboutForm initialData={aboutContent} />
            </Stack>
          </Card>
        </Stack>
      </Container>
    );
  } catch (error: any) {
    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      redirect('/admin_area/login');
    }
    throw error;
  }
}

function AboutAdminLoading() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Title order={1} size="h2">
          About Content Beheer
        </Title>
        <Card withBorder shadow="sm" radius="md" p="lg" style={{ position: 'relative', minHeight: 400 }}>
          <LoadingOverlay visible={true} overlayProps={{ radius: 'sm', blur: 2 }} />
        </Card>
      </Stack>
    </Container>
  );
}

export default function AboutAdminPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<AboutAdminLoading />}>
        <AboutAdminContent />
      </Suspense>
    </AdminLayout>
  );
} 
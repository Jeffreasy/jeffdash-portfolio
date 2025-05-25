import React from 'react';
import { Title, Text, Card, SimpleGrid, Button, Stack } from '@mantine/core';
import Link from 'next/link';
import { getProjectsForAdmin } from '@/lib/actions/projects';
import { getPosts } from '@/lib/actions/blog';
import { getContactSubmissions } from '@/lib/actions/contact';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering for admin pages that use cookies/auth
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Test data fetching
  let projectsCount = 0;
  let postsCount = 0;
  let contactsCount = 0;
  let errors: string[] = [];
  let authInfo = '';
  let debugInfo: any = {};

  // Debug authentication
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      authInfo = `Auth Error: ${error.message}`;
    } else if (session?.user) {
      authInfo = `Ingelogd als: ${session.user.email} (ID: ${session.user.id})`;
      
      // Test direct database queries
      const { data: projectsData, error: projectsError } = await supabase
        .from('Project')
        .select('id, title')
        .limit(5);
      
      debugInfo.projects = { data: projectsData, error: projectsError };
      
      const { data: postsData, error: postsError } = await supabase
        .from('Post')
        .select('id, title')
        .limit(5);
      
      debugInfo.posts = { data: postsData, error: postsError };

      // Test contact submissions query
      const { data: contactsData, error: contactsError } = await supabase
        .from('ContactSubmission')
        .select('id, name, email, isRead')
        .limit(5);
      
      debugInfo.contacts = { data: contactsData, error: contactsError };
      
    } else {
      authInfo = 'Niet ingelogd';
    }
  } catch (error: any) {
    authInfo = `Auth Exception: ${error.message}`;
  }

  try {
    const projects = await getProjectsForAdmin();
    projectsCount = projects.length;
  } catch (error: any) {
    errors.push(`Projects: ${error.message}`);
  }

  try {
    const posts = await getPosts();
    postsCount = posts.length;
  } catch (error: any) {
    errors.push(`Posts: ${error.message}`);
  }

  try {
    const contacts = await getContactSubmissions();
    contactsCount = contacts.length;
  } catch (error: any) {
    errors.push(`Contacts: ${error.message}`);
  }

  return (
    <Stack gap="lg">
      <Title order={2}>Admin Dashboard</Title>
      <Text mt="md">Welkom bij het admin dashboard.</Text>
      
      {/* Debug Info */}
      <Card withBorder p="md" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
        <Title order={4}>Debug Info</Title>
        <Text size="sm"><strong>Auth Status:</strong> {authInfo}</Text>
        {debugInfo.projects && (
          <Text size="sm">
            <strong>Direct Projects Query:</strong> {debugInfo.projects.error ? 
              `Error: ${debugInfo.projects.error.message}` : 
              `Found ${debugInfo.projects.data?.length || 0} projects`}
          </Text>
        )}
        {debugInfo.posts && (
          <Text size="sm">
            <strong>Direct Posts Query:</strong> {debugInfo.posts.error ? 
              `Error: ${debugInfo.posts.error.message}` : 
              `Found ${debugInfo.posts.data?.length || 0} posts`}
          </Text>
        )}
        {debugInfo.contacts && (
          <Text size="sm">
            <strong>Direct Contacts Query:</strong> {debugInfo.contacts.error ? 
              `Error: ${debugInfo.contacts.error.message}` : 
              `Found ${debugInfo.contacts.data?.length || 0} contacts`}
          </Text>
        )}
      </Card>
      
      {errors.length > 0 && (
        <Card withBorder p="md" style={{ backgroundColor: '#fdf2f2', borderColor: '#fecaca' }}>
          <Title order={4} c="red">Errors detected:</Title>
          {errors.map((error, index) => (
            <Text key={index} c="red" size="sm">{error}</Text>
          ))}
        </Card>
      )}

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card withBorder p="md">
          <Stack gap="xs">
            <Title order={4}>Projecten</Title>
            <Text size="xl" fw={700}>{projectsCount}</Text>
            <Button component={Link} href="/admin_area/projects" size="xs">
              Beheren
            </Button>
          </Stack>
        </Card>

        <Card withBorder p="md">
          <Stack gap="xs">
            <Title order={4}>Blog Posts</Title>
            <Text size="xl" fw={700}>{postsCount}</Text>
            <Button component={Link} href="/admin_area/posts" size="xs">
              Beheren
            </Button>
          </Stack>
        </Card>

        <Card withBorder p="md">
          <Stack gap="xs">
            <Title order={4}>Contact Submissions</Title>
            <Text size="xl" fw={700}>{contactsCount}</Text>
            <Button component={Link} href="/admin_area/contacts" size="xs">
              Beheren
            </Button>
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
} 
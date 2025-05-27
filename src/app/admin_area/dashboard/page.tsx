import React from 'react';
import { getProjectsForAdmin } from '@/lib/actions/projects';
import { getPosts } from '@/lib/actions/blog';
import { getContactSubmissions } from '@/lib/actions/contact';
import { createClient } from '@/lib/supabase/server';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

// Force dynamic rendering for admin pages that use cookies/auth
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Test data fetching
  let projectsCount = 0;
  let postsCount = 0;
  let contactsCount = 0;
  let unreadContactsCount = 0;
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
      authInfo = `Ingelogd als: ${session.user.email}`;
      
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
    unreadContactsCount = contacts.filter(contact => !contact.isRead).length;
  } catch (error: any) {
    errors.push(`Contacts: ${error.message}`);
  }

  const dashboardData = {
    projectsCount,
    postsCount,
    contactsCount,
    unreadContactsCount,
    errors,
    authInfo,
    debugInfo,
  };

  return <AdminDashboardClient data={dashboardData} />;
} 
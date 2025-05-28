import React from 'react';
import { getProjectsForAdmin } from '@/lib/actions/projects';
import { getPosts } from '@/lib/actions/blog';
import { getContactSubmissions } from '@/lib/actions/contact';
import { createClient } from '@/lib/supabase/server';
import { getPageViewsLast7Days, getGAOverviewData, GAAnalyticsData } from '@/lib/analytics/google-analytics';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

// Force dynamic rendering for admin pages that use cookies/auth
export const dynamic = 'force-dynamic';

interface AnalyticsData {
  pricingAnalytics: {
    totalViews: number;
    totalClicks: number;
    totalInquiries: number;
    conversionRate: number;
    popularPlan: string | null;
  };
  recentEvents: Array<{
    id: string;
    event_type: string;
    plan_name?: string;
    created_at: string;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    clicks: number;
    inquiries: number;
  }>;
}

interface GoogleAnalyticsData {
  pageViews: GAAnalyticsData;
  overview: {
    totalUsers: number;
    totalSessions: number;
    totalPageViews: number;
    bounceRate: number;
    averageSessionDuration: number;
    error?: string;
  };
}

export default async function AdminDashboardPage() {
  // Test data fetching
  let projectsCount = 0;
  let postsCount = 0;
  let contactsCount = 0;
  let unreadContactsCount = 0;
  let pricingPlansCount = 0;
  let errors: string[] = [];
  let authInfo = '';
  let debugInfo: any = {};
  let analyticsData: AnalyticsData = {
    pricingAnalytics: {
      totalViews: 0,
      totalClicks: 0,
      totalInquiries: 0,
      conversionRate: 0,
      popularPlan: null,
    },
    recentEvents: [],
    dailyStats: [],
  };

  let googleAnalyticsData: GoogleAnalyticsData = {
    pageViews: {
      pageViews: [],
      totalPageViews: 0,
      totalSessions: 0,
    },
    overview: {
      totalUsers: 0,
      totalSessions: 0,
      totalPageViews: 0,
      bounceRate: 0,
      averageSessionDuration: 0,
    },
  };

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

      // Fetch Pricing Plans Count
      try {
        const { data: pricingPlansData, error: pricingPlansError } = await supabase
          .from('PricingPlans')
          .select('id')
          .eq('is_active', true);

        if (pricingPlansError) {
          errors.push(`Pricing Plans Error: ${pricingPlansError.message}`);
        } else {
          pricingPlansCount = pricingPlansData?.length || 0;
        }
      } catch (pricingError: any) {
        errors.push(`Pricing Plans Fetch Error: ${pricingError.message}`);
      }

      // Fetch Google Analytics Data
      try {
        console.log('Fetching Google Analytics data...');
        const [pageViewsData, overviewData] = await Promise.all([
          getPageViewsLast7Days(),
          getGAOverviewData(),
        ]);

        googleAnalyticsData = {
          pageViews: pageViewsData,
          overview: overviewData,
        };

        console.log('GA Data fetched:', {
          pageViewsCount: pageViewsData.pageViews.length,
          totalPageViews: pageViewsData.totalPageViews,
          totalUsers: overviewData.totalUsers,
          hasError: pageViewsData.error || overviewData.error,
        });

        // Add GA errors to debug info
        if (pageViewsData.error) {
          errors.push(`GA Page Views: ${pageViewsData.error}`);
        }
        if (overviewData.error) {
          errors.push(`GA Overview: ${overviewData.error}`);
        }
      } catch (gaError: any) {
        errors.push(`Google Analytics Fetch Error: ${gaError.message}`);
        console.error('GA fetch error:', gaError);
      }

      // Fetch Analytics Data
      try {
        // Pricing Analytics Summary (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: pricingEvents, error: analyticsError } = await supabase
          .from('PricingPlanAnalytics')
          .select(`
            event_type,
            plan_id,
            created_at
          `)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false });

        if (analyticsError) {
          errors.push(`Analytics Error: ${analyticsError.message}`);
        } else if (pricingEvents) {
          // Get plan names separately to avoid relationship issues
          const planIds = [...new Set(pricingEvents.map(e => e.plan_id))];
          const { data: planNames } = await supabase
            .from('PricingPlans')
            .select('id, name')
            .in('id', planIds);

          const planNameMap = new Map(planNames?.map(p => [p.id, p.name]) || []);

          // Calculate totals
          const totalViews = pricingEvents.filter(e => e.event_type === 'view').length;
          const totalClicks = pricingEvents.filter(e => e.event_type === 'click').length;
          const totalInquiries = pricingEvents.filter(e => e.event_type === 'inquiry').length;
          const conversionRate = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0;

          // Find most popular plan
          const planCounts: Record<string, number> = {};
          pricingEvents.forEach(event => {
            const planName = planNameMap.get(event.plan_id);
            if (planName) {
              planCounts[planName] = (planCounts[planName] || 0) + 1;
            }
          });
          
          const popularPlan = Object.keys(planCounts).length > 0 
            ? Object.keys(planCounts).reduce((a, b) => 
                planCounts[a] > planCounts[b] ? a : b
              )
            : null;

          analyticsData.pricingAnalytics = {
            totalViews,
            totalClicks,
            totalInquiries,
            conversionRate: Math.round(conversionRate * 100) / 100,
            popularPlan,
          };

          // Recent events (last 10)
          const recentEvents = pricingEvents
            .slice(0, 10)
            .map(event => ({
              id: event.plan_id,
              event_type: event.event_type,
              plan_name: planNameMap.get(event.plan_id) || 'Unknown',
              created_at: event.created_at,
            }));

          analyticsData.recentEvents = recentEvents;

          // Daily stats for last 7 days
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const dailyEvents = pricingEvents.filter(e => 
            new Date(e.created_at) >= sevenDaysAgo
          );

          const dailyStats: Record<string, { views: number; clicks: number; inquiries: number }> = {};
          
          dailyEvents.forEach(event => {
            const date = new Date(event.created_at).toISOString().split('T')[0];
            if (!dailyStats[date]) {
              dailyStats[date] = { views: 0, clicks: 0, inquiries: 0 };
            }
            
            if (event.event_type === 'view') dailyStats[date].views++;
            if (event.event_type === 'click') dailyStats[date].clicks++;
            if (event.event_type === 'inquiry') dailyStats[date].inquiries++;
          });

          analyticsData.dailyStats = Object.entries(dailyStats)
            .map(([date, stats]) => ({ date, ...stats }))
            .sort((a, b) => a.date.localeCompare(b.date));
        }
      } catch (analyticsError: any) {
        errors.push(`Analytics Fetch Error: ${analyticsError.message}`);
      }
      
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
    pricingPlansCount,
    errors,
    authInfo,
    debugInfo,
    analyticsData,
    googleAnalyticsData,
  };

  return <AdminDashboardClient data={dashboardData} />;
} 
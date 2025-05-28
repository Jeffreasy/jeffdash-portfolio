import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';
import fs from 'fs';

// GA4 Property ID - temporarily hardcoded to fix env issue
const propertyId = process.env.GA4_PROPERTY_ID || '490263153';

// Initialize the client
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

// Development: Try to use local credentials file first
try {
  const credentialsPath = path.join(process.cwd(), 'ga-credentials.json');
  if (fs.existsSync(credentialsPath)) {
    analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: credentialsPath,
    });
    console.log('✅ Using local GA credentials file for development');
  } else {
    console.log('❌ Local GA credentials file not found at:', credentialsPath);
  }
} catch (error) {
  console.log('❌ Error loading local GA credentials:', error);
  analyticsDataClient = null;
}

// Fallback: Try environment variables only if local file fails
if (!analyticsDataClient) {
  if (process.env.NODE_ENV === 'production' && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Production: Use service account credentials from file path
    try {
      analyticsDataClient = new BetaAnalyticsDataClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
      console.log('✅ Using production GA credentials file');
    } catch (error) {
      console.log('❌ Error loading production GA credentials:', error);
    }
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    // Production: Use JSON credentials from environment variable
    try {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials,
      });
      console.log('✅ Using GA credentials from environment JSON');
    } catch (error) {
      console.error('❌ Error parsing Google Analytics credentials JSON:', error);
      analyticsDataClient = null;
    }
  }
}

export interface PageViewData {
  pageTitle: string;
  pagePath: string;
  screenPageViews: number;
  sessions: number;
  averageSessionDuration: number;
}

export interface GAAnalyticsData {
  pageViews: PageViewData[];
  totalPageViews: number;
  totalSessions: number;
  error?: string;
}

export async function getPageViewsLast7Days(): Promise<GAAnalyticsData> {
  console.log('🔍 GA Debug - Property ID:', propertyId);
  console.log('🔍 GA Debug - Client available:', !!analyticsDataClient);
  
  if (!analyticsDataClient || !propertyId) {
    const configStatus = !propertyId ? 'Missing GA4_PROPERTY_ID' : 'Missing or invalid credentials';
    return {
      pageViews: [],
      totalPageViews: 0,
      totalSessions: 0,
      error: `Google Analytics not configured. ${configStatus}`,
    };
  }

  try {
    console.log('📡 Fetching GA data for property:', propertyId);
    
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'pageTitle',
        },
        {
          name: 'pagePath',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
        {
          name: 'sessions',
        },
        {
          name: 'averageSessionDuration',
        },
      ],
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit: 10, // Top 10 pages
    });

    const pageViews: PageViewData[] = [];
    let totalPageViews = 0;
    let totalSessions = 0;

    if (response.rows) {
      for (const row of response.rows) {
        const pageTitle = row.dimensionValues?.[0]?.value || 'Unknown';
        const pagePath = row.dimensionValues?.[1]?.value || '/';
        const screenPageViews = parseInt(row.metricValues?.[0]?.value || '0');
        const sessions = parseInt(row.metricValues?.[1]?.value || '0');
        const averageSessionDuration = parseFloat(row.metricValues?.[2]?.value || '0');

        pageViews.push({
          pageTitle,
          pagePath,
          screenPageViews,
          sessions,
          averageSessionDuration,
        });

        totalPageViews += screenPageViews;
        totalSessions += sessions;
      }
    }

    console.log('✅ GA data fetched successfully - Pages:', pageViews.length, 'Total views:', totalPageViews);

    return {
      pageViews,
      totalPageViews,
      totalSessions,
    };
  } catch (error) {
    console.error('❌ Error fetching Google Analytics data:', error);
    return {
      pageViews: [],
      totalPageViews: 0,
      totalSessions: 0,
      error: `GA API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function getGAOverviewData() {
  if (!analyticsDataClient || !propertyId) {
    const configStatus = !propertyId ? 'Missing GA4_PROPERTY_ID' : 'Missing or invalid credentials';
    return {
      totalUsers: 0,
      totalSessions: 0,
      totalPageViews: 0,
      bounceRate: 0,
      averageSessionDuration: 0,
      error: `Google Analytics not configured. ${configStatus}`,
    };
  }

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        {
          name: 'totalUsers',
        },
        {
          name: 'sessions',
        },
        {
          name: 'screenPageViews',
        },
        {
          name: 'bounceRate',
        },
        {
          name: 'averageSessionDuration',
        },
      ],
    });

    const totalUsers = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0');
    const totalSessions = parseInt(response.rows?.[0]?.metricValues?.[1]?.value || '0');
    const totalPageViews = parseInt(response.rows?.[0]?.metricValues?.[2]?.value || '0');
    const bounceRate = parseFloat(response.rows?.[0]?.metricValues?.[3]?.value || '0');
    const averageSessionDuration = parseFloat(response.rows?.[0]?.metricValues?.[4]?.value || '0');

    return {
      totalUsers,
      totalSessions,
      totalPageViews,
      bounceRate: Math.round(bounceRate * 100) / 100, // Round to 2 decimal places
      averageSessionDuration: Math.round(averageSessionDuration),
    };
  } catch (error) {
    console.error('Error fetching GA overview data:', error);
    return {
      totalUsers: 0,
      totalSessions: 0,
      totalPageViews: 0,
      bounceRate: 0,
      averageSessionDuration: 0,
      error: `GA API Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
} 
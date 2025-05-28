import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Check if site is under construction (public endpoint)
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch the under_construction setting (no auth required for this public check)
    const { data: setting, error } = await supabase
      .from('SiteSettings')
      .select('value')
      .eq('key', 'under_construction')
      .single();

    if (error) {
      console.error('Error fetching under construction status:', error);
      // Fallback to environment variable if database fails
      const envStatus = process.env.UNDER_CONSTRUCTION === 'true';
      return NextResponse.json({ 
        underConstruction: envStatus,
        source: 'environment'
      });
    }

    const isUnderConstruction = setting.value === 'true';

    return NextResponse.json({ 
      underConstruction: isUnderConstruction,
      source: 'database'
    });
  } catch (error) {
    console.error('Unexpected error in site-status GET:', error);
    // Fallback to environment variable if anything fails
    const envStatus = process.env.UNDER_CONSTRUCTION === 'true';
    return NextResponse.json({ 
      underConstruction: envStatus,
      source: 'environment'
    });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch all site settings
export async function GET() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error in site-settings GET:', authError);
      return NextResponse.json(
        { error: 'Authentication failed', details: authError.message },
        { status: 401 }
      );
    }
    
    if (!user) {
      console.error('No user found in site-settings GET');
      return NextResponse.json(
        { error: 'No authenticated user found' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', user.id);

    // Verify admin role - simplified approach
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user role:', userError);
      return NextResponse.json(
        { error: 'Failed to verify user permissions', details: userError.message },
        { status: 500 }
      );
    }

    if (!userData || userData.role !== 'ADMIN') {
      console.error('User is not admin:', userData);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('Admin verified, fetching settings...');

    // Fetch all site settings
    const { data: settings, error: settingsError } = await supabase
      .from('SiteSettings')
      .select('*')
      .order('key');

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      return NextResponse.json(
        { error: 'Failed to fetch settings', details: settingsError.message },
        { status: 500 }
      );
    }

    console.log('Settings fetched successfully:', settings?.length || 0, 'items');

    return NextResponse.json({
      settings: settings || [],
      message: 'Settings fetched successfully'
    });

  } catch (error) {
    console.error('Unexpected error in site-settings GET:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Update a site setting
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin role
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Update the setting
    const { data, error } = await supabase
      .from('SiteSettings')
      .update({ value })
      .eq('key', key)
      .select()
      .single();

    if (error) {
      console.error('Error updating site setting:', error);
      return NextResponse.json(
        { error: 'Failed to update site setting' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Setting updated successfully',
      setting: data 
    });
  } catch (error) {
    console.error('Unexpected error in site-settings PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new site setting
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin role
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { key, value, description, type = 'string' } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Create the setting
    const { data, error } = await supabase
      .from('SiteSettings')
      .insert({ key, value, description, type })
      .select()
      .single();

    if (error) {
      console.error('Error creating site setting:', error);
      return NextResponse.json(
        { error: 'Failed to create site setting' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Setting created successfully',
      setting: data 
    });
  } catch (error) {
    console.error('Unexpected error in site-settings POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
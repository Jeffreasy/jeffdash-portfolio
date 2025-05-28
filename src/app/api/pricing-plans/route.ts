import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Types for the pricing data
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string | number;
  original_price?: string | number;
  period: string;
  is_popular: boolean;
  cta_text: string;
  cta_variant: 'filled' | 'outline' | 'gradient';
  gradient_from: string;
  gradient_to: string;
  sort_order: number;
  category_name: string;
  category_icon: string;
  category_color: string;
  features: Array<{
    id: string;
    text: string;
    highlighted: boolean;
    sort_order: number;
  }>;
}

export interface PricingResponse {
  success: boolean;
  data?: PricingPlan[];
  error?: string;
  metadata?: {
    total_plans: number;
    popular_plan?: string;
    last_updated: string;
  };
}

// Type for the database plan data
interface DatabasePlan {
  id: string;
  name: string;
  description: string;
  price: string | number;
  original_price?: string | number;
  period: string;
  is_popular: boolean;
  is_active: boolean;
  cta_text: string;
  cta_variant: string;
  gradient_from: string;
  gradient_to: string;
  sort_order: number;
  category_name: string;
  category_icon: string;
  category_color: string;
  category_is_active: boolean;
  features: Array<{
    id: string;
    text: string;
    highlighted: boolean;
    sort_order: number;
  }>;
}

export async function GET(request: NextRequest): Promise<NextResponse<PricingResponse>> {
  try {
    const supabase = await createClient();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';
    const categoryFilter = searchParams.get('category');
    
    console.log('Fetching pricing plans from database...');
    
    // Use the view for optimized data fetching
    let query = supabase
      .from('PricingPlansComplete')
      .select('*');
    
    // Apply filters if needed
    // Note: The view already filters for active plans by default
    // Only add explicit filter if we want to include inactive plans
    if (includeInactive) {
      // If we want inactive plans, we need to query the tables directly
      // For now, the view only shows active plans
      console.log('Note: includeInactive=true not fully supported with current view');
    }
    
    if (categoryFilter) {
      query = query.eq('category_name', categoryFilter);
    }
    
    const { data: plans, error } = await query.order('sort_order');
    
    if (error) {
      console.error('Error fetching pricing plans:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch pricing plans'
      }, { status: 500 });
    }
    
    if (!plans || plans.length === 0) {
      console.log('No pricing plans found');
      return NextResponse.json({
        success: true,
        data: [],
        metadata: {
          total_plans: 0,
          last_updated: new Date().toISOString()
        }
      });
    }
    
    // Transform the data to match the expected format
    const transformedPlans: PricingPlan[] = plans.map((plan: DatabasePlan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      original_price: plan.original_price,
      period: plan.period,
      is_popular: plan.is_popular,
      cta_text: plan.cta_text,
      cta_variant: plan.cta_variant as 'filled' | 'outline' | 'gradient',
      gradient_from: plan.gradient_from,
      gradient_to: plan.gradient_to,
      sort_order: plan.sort_order,
      category_name: plan.category_name,
      category_icon: plan.category_icon,
      category_color: plan.category_color,
      features: Array.isArray(plan.features) ? plan.features.map((feature: any) => ({
        id: feature.id,
        text: feature.text,
        highlighted: feature.highlighted,
        sort_order: feature.sort_order
      })) : []
    }));
    
    // Find popular plan
    const popularPlan = transformedPlans.find(plan => plan.is_popular);
    
    console.log(`Successfully fetched ${transformedPlans.length} pricing plans`);
    
    return NextResponse.json({
      success: true,
      data: transformedPlans,
      metadata: {
        total_plans: transformedPlans.length,
        popular_plan: popularPlan?.name,
        last_updated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in pricing plans API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// POST endpoint for analytics tracking
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    const {
      plan_id,
      event_type,
      user_session,
      metadata
    } = body;
    
    // Validate required fields
    if (!plan_id || !event_type) {
      return NextResponse.json({
        success: false,
        error: 'plan_id and event_type are required'
      }, { status: 400 });
    }
    
    // Validate event_type
    const validEventTypes = ['view', 'click', 'inquiry', 'conversion', 'hover', 'modal_open'];
    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json({
        success: false,
        error: `Invalid event_type. Must be one of: ${validEventTypes.join(', ')}`
      }, { status: 400 });
    }
    
    console.log(`Tracking pricing event: ${event_type} for plan ${plan_id}`);
    
    // Get client IP and user agent for analytics
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || null;
    
    // Insert analytics record
    const { data, error } = await supabase
      .from('PricingPlanAnalytics')
      .insert({
        plan_id,
        event_type,
        user_session,
        user_agent: userAgent,
        ip_address: clientIP,
        referrer,
        metadata: metadata || {}
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error tracking pricing event:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to track event'
      }, { status: 500 });
    }
    
    console.log(`Successfully tracked pricing event: ${data.id}`);
    
    return NextResponse.json({
      success: true,
      data: { event_id: data.id }
    });
    
  } catch (error) {
    console.error('Unexpected error in pricing analytics API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 
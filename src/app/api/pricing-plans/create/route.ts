import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST - Create a new pricing plan
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const body = await request.json();

    console.log('Creating new pricing plan:', body);

    // Validate required fields
    const {
      name,
      description,
      price,
      original_price,
      period,
      is_popular,
      cta_text,
      cta_variant,
      category_color,
      gradient_from,
      gradient_to,
      sort_order,
      features
    } = body;

    if (!name || !description || !price || !cta_text) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, description, price, cta_text'
      }, { status: 400 });
    }

    // First, find the category by color to get category_id
    const { data: category, error: categoryError } = await supabase
      .from('PricingCategories')
      .select('id')
      .eq('color', category_color)
      .single();

    if (categoryError || !category) {
      console.error('Error finding category:', categoryError);
      return NextResponse.json({
        success: false,
        error: 'Invalid category color'
      }, { status: 400 });
    }

    // Create the pricing plan
    const { data: plan, error: planError } = await supabase
      .from('PricingPlans')
      .insert({
        category_id: category.id,
        name,
        description,
        price,
        original_price: original_price || null,
        period,
        is_popular,
        cta_text,
        cta_variant,
        gradient_from,
        gradient_to,
        sort_order,
        is_active: true
      })
      .select()
      .single();

    if (planError) {
      console.error('Error creating plan:', planError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create pricing plan'
      }, { status: 500 });
    }

    // Add features if provided
    if (features && Array.isArray(features) && features.length > 0) {
      const featureInserts = features.map((feature: string, index: number) => ({
        plan_id: plan.id,
        feature_text: feature,
        is_highlighted: false,
        sort_order: index + 1
      }));

      const { error: featuresError } = await supabase
        .from('PricingFeatures')
        .insert(featureInserts);

      if (featuresError) {
        console.error('Error creating features:', featuresError);
        // Don't fail the whole request for features error
      }
    }

    console.log('Successfully created pricing plan:', plan.id);

    return NextResponse.json({
      success: true,
      data: plan
    });

  } catch (error) {
    console.error('Unexpected error creating pricing plan:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 
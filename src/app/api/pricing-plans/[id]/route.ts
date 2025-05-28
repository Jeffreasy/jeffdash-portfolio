import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: { id: string };
}

// PUT - Update a pricing plan
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { id } = params;
    const body = await request.json();

    console.log('Updating pricing plan:', id, body);

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

    // Update the pricing plan
    const { data: plan, error: planError } = await supabase
      .from('PricingPlans')
      .update({
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
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (planError) {
      console.error('Error updating plan:', planError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update pricing plan'
      }, { status: 500 });
    }

    // Update features if provided
    if (features && Array.isArray(features)) {
      // First, delete existing features
      await supabase
        .from('PricingFeatures')
        .delete()
        .eq('plan_id', id);

      // Then insert new features
      if (features.length > 0) {
        const featureInserts = features.map((feature: string, index: number) => ({
          plan_id: id,
          feature_text: feature,
          is_highlighted: false,
          sort_order: index + 1
        }));

        const { error: featuresError } = await supabase
          .from('PricingFeatures')
          .insert(featureInserts);

        if (featuresError) {
          console.error('Error updating features:', featuresError);
          // Don't fail the whole request for features error
        }
      }
    }

    console.log('Successfully updated pricing plan:', plan.id);

    return NextResponse.json({
      success: true,
      data: plan
    });

  } catch (error) {
    console.error('Unexpected error updating pricing plan:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE - Delete a pricing plan
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { id } = params;

    console.log('Deleting pricing plan:', id);

    // Check if plan exists
    const { data: existingPlan, error: checkError } = await supabase
      .from('PricingPlans')
      .select('id, name')
      .eq('id', id)
      .single();

    if (checkError || !existingPlan) {
      return NextResponse.json({
        success: false,
        error: 'Pricing plan not found'
      }, { status: 404 });
    }

    // Delete the plan (features will be deleted automatically due to CASCADE)
    const { error: deleteError } = await supabase
      .from('PricingPlans')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting plan:', deleteError);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete pricing plan'
      }, { status: 500 });
    }

    console.log('Successfully deleted pricing plan:', existingPlan.name);

    return NextResponse.json({
      success: true,
      message: `Pricing plan "${existingPlan.name}" deleted successfully`
    });

  } catch (error) {
    console.error('Unexpected error deleting pricing plan:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// GET - Get a specific pricing plan
export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { id } = params;

    console.log('Fetching pricing plan:', id);

    const { data: plan, error } = await supabase
      .from('PricingPlansComplete')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !plan) {
      return NextResponse.json({
        success: false,
        error: 'Pricing plan not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: plan
    });

  } catch (error) {
    console.error('Unexpected error fetching pricing plan:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 
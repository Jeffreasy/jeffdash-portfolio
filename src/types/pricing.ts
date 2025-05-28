// src/types/pricing.ts
// Central type definitions for pricing plans
// EXACTLY matching the API route interface to prevent type conflicts

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string | number; // Allow both for flexibility
  original_price?: string | number;
  period: string;
  is_popular: boolean; // Required to match API
  cta_text: string;
  cta_variant: 'filled' | 'outline' | 'gradient'; // Required with specific values
  gradient_from: string; // Required to match API
  gradient_to: string; // Required to match API
  sort_order: number;
  category_name: string; // Required to match API
  category_icon: string; // Required to match API
  category_color: string; // Required to match API
  features: Array<{
    id: string;
    text: string;
    highlighted: boolean;
    sort_order: number;
  }>; // Exact format from API
}

export interface PricingCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface PricingFeature {
  id: string;
  plan_id: string;
  feature_text: string;
  is_highlighted: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface PricingAnalytics {
  totalViews: number;
  totalClicks: number;
  totalInquiries: number;
  conversionRate: number;
  popularPlan: string | null;
} 
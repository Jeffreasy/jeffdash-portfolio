import { useState, useEffect } from 'react';
import { PricingPlan, PricingResponse } from '@/app/api/pricing-plans/route';

interface UsePricingPlansOptions {
  category?: string;
  includeInactive?: boolean;
  autoFetch?: boolean;
}

interface UsePricingPlansReturn {
  plans: PricingPlan[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  trackEvent: (planId: string, eventType: string, metadata?: any) => Promise<void>;
  metadata: {
    totalPlans: number;
    popularPlan?: string;
    lastUpdated?: string;
  };
}

export function usePricingPlans(options: UsePricingPlansOptions = {}): UsePricingPlansReturn {
  const {
    category,
    includeInactive = false,
    autoFetch = true
  } = options;

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    totalPlans: 0,
    popularPlan: undefined as string | undefined,
    lastUpdated: undefined as string | undefined
  });

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (includeInactive) params.append('include_inactive', 'true');

      const response = await fetch(`/api/pricing-plans?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PricingResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch pricing plans');
      }

      setPlans(result.data || []);
      setMetadata({
        totalPlans: result.metadata?.total_plans || 0,
        popularPlan: result.metadata?.popular_plan,
        lastUpdated: result.metadata?.last_updated
      });

      console.log(`Successfully loaded ${result.data?.length || 0} pricing plans`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching pricing plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const trackEvent = async (planId: string, eventType: string, eventMetadata?: any) => {
    try {
      // Generate a simple session ID if not available
      const userSession = sessionStorage.getItem('pricing_session') || 
                         `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store session ID for consistency
      sessionStorage.setItem('pricing_session', userSession);

      const response = await fetch('/api/pricing-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: planId,
          event_type: eventType,
          user_session: userSession,
          metadata: eventMetadata
        })
      });

      if (!response.ok) {
        console.warn(`Failed to track pricing event: ${response.status}`);
        return;
      }

      const result = await response.json();
      if (result.success) {
        console.log(`Tracked pricing event: ${eventType} for plan ${planId}`);
      }

    } catch (err) {
      // Don't throw errors for analytics - just log them
      console.warn('Error tracking pricing event:', err);
    }
  };

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchPlans();
    }
  }, [category, includeInactive, autoFetch]);

  return {
    plans,
    isLoading,
    error,
    refetch: fetchPlans,
    trackEvent,
    metadata
  };
}

// Helper hook for getting a specific plan by ID
export function usePricingPlan(planId: string) {
  const { plans, isLoading, error } = usePricingPlans();
  
  const plan = plans.find(p => p.id === planId);
  
  return {
    plan,
    isLoading,
    error,
    found: !!plan
  };
}

// Helper hook for getting plans by category
export function usePricingPlansByCategory(category: string) {
  return usePricingPlans({ category });
}

// Helper function to convert icon string to component
export function getIconComponent(iconName: string) {
  // This will be used to map icon names to actual icon components
  // You'll need to import the icons and create a mapping
  const iconMap: Record<string, any> = {
    'IconPalette': 'IconPalette',
    'IconServer': 'IconServer', 
    'IconCode': 'IconCode',
    'IconSettings': 'IconSettings'
  };
  
  return iconMap[iconName] || 'IconCode'; // Default fallback
} 
'use client';

import { useState, useCallback } from 'react';
import { PricingPlan } from '@/types/pricing';
import { useAnalytics } from './useAnalytics';

interface UseContactModalReturn {
  opened: boolean;
  selectedPlan: PricingPlan | null;
  openModal: (plan?: PricingPlan) => void;
  closeModal: () => void;
  openWithPlan: (plan: PricingPlan) => void;
}

export function useContactModal(): UseContactModalReturn {
  const [opened, setOpened] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const { trackEvent } = useAnalytics();

  const openModal = useCallback((plan?: PricingPlan) => {
    setSelectedPlan(plan || null);
    setOpened(true);
    
    // Track modal opening
    trackEvent('navigation_clicked', {
      action: 'contact_modal_trigger',
      element: 'contact_modal_hook',
      modal_type: plan ? 'plan_specific' : 'general',
      has_plan: !!plan,
      plan_name: plan?.name || 'none',
      plan_id: plan?.id || 'none',
      trigger_source: 'hook_open_modal'
    });
  }, [trackEvent]);

  const closeModal = useCallback(() => {
    // Track modal closing
    trackEvent('navigation_clicked', {
      action: 'contact_modal_close',
      element: 'contact_modal_hook',
      modal_type: selectedPlan ? 'plan_specific' : 'general',
      had_plan: !!selectedPlan,
      plan_name: selectedPlan?.name || 'none',
      close_source: 'hook_close_modal'
    });

    setOpened(false);
    // Clear plan after a short delay to allow for exit animation
    setTimeout(() => setSelectedPlan(null), 300);
  }, [selectedPlan, trackEvent]);

  const openWithPlan = useCallback((plan: PricingPlan) => {
    setSelectedPlan(plan);
    setOpened(true);
    
    // Track plan-specific modal opening
    trackEvent('plan_selected', {
      plan_id: plan.id,
      plan_name: plan.name,
      plan_price: plan.price,
      plan_color: plan.category_color,
      is_popular: plan.is_popular || false,
      selection_method: 'hook_open_with_plan',
      destination: 'contact_modal',
      features_count: plan.features?.length || 0
    });
  }, [trackEvent]);

  return {
    opened,
    selectedPlan,
    openModal,
    closeModal,
    openWithPlan,
  };
} 
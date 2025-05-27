'use client';

import { useState, useCallback } from 'react';
import { PricingPlan } from '@/components/features/home/PricingSection/data';

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

  const openModal = useCallback((plan?: PricingPlan) => {
    setSelectedPlan(plan || null);
    setOpened(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpened(false);
    // Clear plan after a short delay to allow for exit animation
    setTimeout(() => setSelectedPlan(null), 300);
  }, []);

  const openWithPlan = useCallback((plan: PricingPlan) => {
    setSelectedPlan(plan);
    setOpened(true);
  }, []);

  return {
    opened,
    selectedPlan,
    openModal,
    closeModal,
    openWithPlan,
  };
} 
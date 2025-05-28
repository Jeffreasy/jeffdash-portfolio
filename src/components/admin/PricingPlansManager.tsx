'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Stack,
  Alert,
  Loader,
  Box,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { usePricingPlans } from '@/hooks/usePricingPlans';
import { PricingPlan } from '@/app/api/pricing-plans/route';
import AdminErrorBoundary from './AdminErrorBoundary';
import PricingPlansTable from './pricing/PricingPlansTable';
import PricingPlanModal from './pricing/PricingPlanModal';
import { PricingPlansManagerProps, FormData } from './pricing/types';

const PricingPlansManager: React.FC<PricingPlansManagerProps> = () => {
  const { plans, isLoading, error, refetch } = usePricingPlans({ includeInactive: true });
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePlan = useCallback(() => {
    setSelectedPlan(null);
    setModalOpened(true);
  }, []);

  // Listen for custom event from parent page
  useEffect(() => {
    const handleCreateEvent = () => {
      handleCreatePlan();
    };

    window.addEventListener('createPricingPlan', handleCreateEvent);
    
    return () => {
      window.removeEventListener('createPricingPlan', handleCreateEvent);
    };
  }, [handleCreatePlan]);

  const handleEditPlan = useCallback((plan: PricingPlan) => {
    if (!plan?.id) {
      throw new Error('Invalid plan data');
    }

    setSelectedPlan(plan);
    setModalOpened(true);
  }, []);

  // Optimized delete modal with proper error handling
  const openDeleteModal = useCallback((plan: PricingPlan) => {
    if (!plan?.id || !plan?.name) {
      throw new Error('Invalid plan ID or name');
    }

    modals.openConfirmModal({
      title: 'Plan Verwijderen',
      centered: true,
      size: 'clamp(300px, 85vw, 450px)',
      styles: {
        content: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          maxWidth: '90vw',
          maxHeight: '90vh',
        },
        header: {
          background: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 'clamp(12px, 3vw, 16px)',
        },
        title: {
          color: 'var(--mantine-color-gray-1)',
          fontWeight: 600,
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
        },
        body: {
          padding: 'clamp(12px, 3vw, 16px)',
        },
      },
      children: (
        <Text 
          size="sm" 
          c="gray.3"
          style={{
            fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
            lineHeight: 1.5,
          }}
        >
          Weet je zeker dat je het plan <strong style={{ color: 'var(--mantine-color-gray-1)' }}>{plan.name}</strong> permanent wilt verwijderen?
          Deze actie kan niet ongedaan worden gemaakt.
        </Text>
      ),
      labels: { confirm: 'Verwijderen', cancel: 'Annuleren' },
      confirmProps: { 
        color: 'red',
        variant: 'gradient',
        gradient: { from: 'red.6', to: 'red.7' },
        style: {
          minHeight: '44px',
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
        }
      },
      cancelProps: {
        variant: 'subtle',
        color: 'gray',
        style: {
          minHeight: '44px',
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
        }
      },
      onCancel: () => {
        console.log('Plan verwijderen geannuleerd');
      },
      onConfirm: () => handleDelete(plan),
    });
  }, []);

  const handleDelete = async (plan: PricingPlan) => {
    if (!plan?.id) return;
    
    const notificationId = notifications.show({
      loading: true,
      title: 'Plan Verwijderen',
      message: `Plan "${plan.name}" wordt verwijderd...`,
      autoClose: false,
      withCloseButton: false,
      styles: {
        root: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: 'clamp(280px, 85vw, 400px)',
        },
        title: {
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
        },
        description: {
          fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
        }
      },
    });

    try {
      const response = await fetch(`/api/pricing-plans/${plan.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete plan');
      }
      
      notifications.update({
        id: notificationId,
        color: 'teal',
        title: 'Succes!',
        message: `Plan "${plan.name}" succesvol verwijderd.`,
        icon: <IconCheck size={16} />,
        loading: false,
        autoClose: 5000,
        withCloseButton: true,
        styles: {
          root: {
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            backdropFilter: 'blur(10px)',
          },
          title: {
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          },
          description: {
            fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
          }
        },
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting plan:', error);
      notifications.update({
        id: notificationId,
        color: 'red',
        title: 'Fout!',
        message: error instanceof Error ? error.message : 'Er is een fout opgetreden bij het verwijderen van het plan.',
        icon: <IconX size={16} />,
        loading: false,
        autoClose: 7000,
        withCloseButton: true,
        styles: {
          root: {
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(10px)',
          },
          title: {
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
          },
          description: {
            fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
          }
        },
      });
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    const notificationId = notifications.show({
      loading: true,
      title: selectedPlan ? 'Plan Bijwerken' : 'Plan Aanmaken',
      message: `${formData.name} wordt ${selectedPlan ? 'bijgewerkt' : 'aangemaakt'}...`,
      autoClose: false,
      withCloseButton: false,
      styles: {
        root: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: 'clamp(280px, 85vw, 400px)',
        },
      },
    });

    try {
      const requestBody = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        original_price: formData.original_price,
        period: formData.period,
        is_popular: formData.is_popular,
        cta_text: formData.cta_text,
        cta_variant: formData.cta_variant,
        category_color: formData.category_color,
        gradient_from: formData.gradient_from,
        gradient_to: formData.gradient_to,
        sort_order: formData.sort_order,
        features: formData.features.filter(f => f.trim())
      };

      const url = selectedPlan 
        ? `/api/pricing-plans/${selectedPlan.id}`
        : '/api/pricing-plans/create';
      
      const method = selectedPlan ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save plan');
      }
      
      notifications.update({
        id: notificationId,
        color: 'teal',
        title: 'Succes!',
        message: `${formData.name} is succesvol ${selectedPlan ? 'bijgewerkt' : 'aangemaakt'}`,
        icon: <IconCheck size={16} />,
        loading: false,
        autoClose: 5000,
        withCloseButton: true,
        styles: {
          root: {
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        },
      });
      
      setModalOpened(false);
      refetch();
    } catch (error) {
      console.error('Error saving plan:', error);
      notifications.update({
        id: notificationId,
        color: 'red',
        title: 'Fout!',
        message: error instanceof Error ? error.message : 'Er is een fout opgetreden bij het opslaan van het plan',
        icon: <IconX size={16} />,
        loading: false,
        autoClose: 7000,
        withCloseButton: true,
        styles: {
          root: {
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate props
  if (!Array.isArray(plans)) {
    throw new Error('Plans must be an array');
  }

  if (isLoading) {
    return (
      <AdminErrorBoundary componentName="Pricing Plans Manager">
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'clamp(200px, 30vh, 300px)',
            width: '100%',
          }}
        >
          <Stack align="center" gap="md">
            <Loader size="lg" color="orange.4" type="dots" />
            <Text 
              c="gray.4" 
              ta="center"
              style={{
                fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
              }}
            >
              Pricing plans laden...
            </Text>
          </Stack>
        </Box>
      </AdminErrorBoundary>
    );
  }

  if (error) {
    return (
      <AdminErrorBoundary componentName="Pricing Plans Manager">
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Fout bij laden" 
          color="red"
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {error}
        </Alert>
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary componentName="Pricing Plans Manager">
      <Stack gap="xl">
        <PricingPlansTable
          plans={plans}
          onEdit={handleEditPlan}
          onDelete={openDeleteModal}
        />
        
        <PricingPlanModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          selectedPlan={selectedPlan}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Stack>
    </AdminErrorBoundary>
  );
};

export default PricingPlansManager; 
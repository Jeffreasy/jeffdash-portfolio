'use client'; // Contact form will likely need client-side interaction

import React, { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { TextInput, Textarea, Button, Stack, Group, Alert, LoadingOverlay, Paper, Text, ThemeIcon, Badge } from '@mantine/core';
import { IconCheck, IconAlertCircle, IconSend, IconStar, IconPalette, IconServer, IconCode, IconSettings } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { submitContactForm, type ContactFormState } from '@/lib/actions/contact';
import { useAnalytics } from '@/hooks/useAnalytics';
import ContactErrorBoundary from './ContactErrorBoundary';
import { usePricingPlans } from '@/hooks/usePricingPlans';

// Icon mapping for dynamic icon rendering
const iconMap = {
  'IconPalette': IconPalette,
  'IconServer': IconServer,
  'IconCode': IconCode,
  'IconSettings': IconSettings,
};

// Animation variants
const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const buttonVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.98 },
} as const;

// Aparte component voor de submit knop om useFormStatus te kunnen gebruiken
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
      <Button 
        type="submit" 
        loading={pending}
        variant="gradient"
        gradient={{ from: 'blue.6', to: 'cyan.5' }}
        size="md"
        fullWidth
        rightSection={<IconSend size={18} />}
        style={{
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          fontWeight: 500,
        }}
      >
        {pending ? 'Bezig met verzenden...' : 'Verzenden'}
      </Button>
    </motion.div>
  );
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  const { plans } = usePricingPlans();
  const selectedPlan = planId ? plans.find(plan => plan.id === planId) : null;
  const { trackEvent } = useAnalytics();

  const initialState: ContactFormState = { message: undefined, errors: {}, success: false };
  const [state, formAction] = useActionState(submitContactForm, initialState);

  // Get icon component from string
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || IconCode;
  };

  // Track form initialization
  useEffect(() => {
    trackEvent('contact_form_started', {
      has_plan: !!selectedPlan,
      plan_name: selectedPlan?.name || 'none',
      plan_price: selectedPlan?.price || 'none',
      form_source: 'contact_page'
    });
  }, [selectedPlan, trackEvent]);

  // Track form submission results
  useEffect(() => {
    if (state.success) {
      trackEvent('contact_form_submitted', {
        has_plan: !!selectedPlan,
        plan_name: selectedPlan?.name || 'general_inquiry',
        plan_price: selectedPlan?.price || 'none',
        submission_successful: true
      });
    } else if (state.errors && Object.keys(state.errors).length > 0) {
      trackEvent('contact_form_error', {
        has_plan: !!selectedPlan,
        plan_name: selectedPlan?.name || 'general_inquiry',
        error_type: 'validation',
        error_fields: Object.keys(state.errors).join(',')
      });
    }
  }, [state, selectedPlan, trackEvent]);

  // Optioneel: Reset formulier na succes
  const formRef = React.useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  // Track field interactions
  const handleFieldFocus = (fieldName: string) => {
    trackEvent('navigation_clicked', {
      action: 'field_focus',
      element: `contact_form_${fieldName}`,
      has_plan: !!selectedPlan
    });
  };

  // Valideer form state
  if (state && typeof state !== 'object') {
    throw new Error('Invalid form state');
  }

  return (
    <ContactErrorBoundary>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {/* Selected Plan Display */}
        {selectedPlan && (
          <motion.div variants={inputVariants}>
            <Paper 
              p="md" 
              mb="lg" 
              radius="lg"
              style={{
                background: `linear-gradient(135deg, rgba(${selectedPlan.category_color === 'cyan' ? '6, 182, 212' : selectedPlan.category_color === 'violet' ? '139, 92, 246' : selectedPlan.category_color === 'blue' ? '59, 130, 246' : '249, 115, 22'}, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)`,
                border: `1px solid rgba(${selectedPlan.category_color === 'cyan' ? '6, 182, 212' : selectedPlan.category_color === 'violet' ? '139, 92, 246' : selectedPlan.category_color === 'blue' ? '59, 130, 246' : '249, 115, 22'}, 0.2)`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Group>
                <ThemeIcon
                  size="lg"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: selectedPlan.gradient_from, to: selectedPlan.gradient_to }}
                >
                  {React.createElement(getIconComponent(selectedPlan.category_icon), { size: 20 })}
                </ThemeIcon>
                <div style={{ flex: 1 }}>
                  <Group gap="xs">
                    <Text size="lg" fw={700} c="gray.1">
                      {selectedPlan.name}
                    </Text>
                    {selectedPlan.is_popular && (
                      <Badge
                        variant="gradient"
                        gradient={{ from: selectedPlan.gradient_from, to: selectedPlan.gradient_to }}
                        size="sm"
                        leftSection={<IconStar size={10} />}
                      >
                        Populair
                      </Badge>
                    )}
                  </Group>
                  <Text size="sm" c="gray.4">
                    Geïnteresseerd in: {selectedPlan.description}
                  </Text>
                  <Text size="lg" fw={600} c={`${selectedPlan.category_color}.4`} mt={4}>
                    {selectedPlan.price} {selectedPlan.period}
                  </Text>
                </div>
              </Group>
            </Paper>
          </motion.div>
        )}

        <form 
          ref={formRef} 
          action={formAction}
          onSubmit={(e) => {
            // Voeg extra validatie toe indien nodig
            const formData = new FormData(e.currentTarget);
            if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
              e.preventDefault();
              trackEvent('contact_form_error', {
                error_type: 'client_validation',
                has_plan: !!selectedPlan
              });
              console.error('Alle velden zijn verplicht');
              return;
            }
            
            // Track form submission attempt
            trackEvent('contact_form_submitted', {
              has_plan: !!selectedPlan,
              plan_name: selectedPlan?.name || 'general_inquiry',
              submission_attempt: true
            });
          }}
        >
          {/* Hidden field for plan information */}
          {selectedPlan && (
            <input type="hidden" name="selectedPlan" value={JSON.stringify({
              id: selectedPlan.id,
              name: selectedPlan.name,
              price: selectedPlan.price
            })} />
          )}

          <Stack gap="lg">
            {/* Toon algemeen bericht (succes of server-side fout) */}
            {state.message && !state.success && (
              <motion.div variants={inputVariants}>
                <Alert 
                  icon={<IconAlertCircle size="1.2rem" />} 
                  title="Fout!" 
                  color="red" 
                  variant="light"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: 'var(--mantine-color-red-3)',
                  }}
                  styles={{
                    title: {
                      color: 'var(--mantine-color-red-4)',
                      fontWeight: 600,
                    },
                    message: {
                      color: 'var(--mantine-color-red-3)',
                    }
                  }}
                >
                  {state.message}
                </Alert>
              </motion.div>
            )}
            
            {state.message && state.success && (
              <motion.div variants={inputVariants}>
                <Alert 
                  icon={<IconCheck size="1.2rem" />} 
                  title="Succes!" 
                  color="green" 
                  variant="light"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    color: 'var(--mantine-color-green-3)',
                  }}
                  styles={{
                    title: {
                      color: 'var(--mantine-color-green-4)',
                      fontWeight: 600,
                    },
                    message: {
                      color: 'var(--mantine-color-green-3)',
                    }
                  }}
                >
                  {state.message}
                </Alert>
              </motion.div>
            )}

            <motion.div variants={inputVariants}>
              <TextInput
                name="name"
                label="Naam"
                placeholder="Uw volledige naam"
                required
                error={state.errors?.name?.join(', ')}
                size="md"
                onFocus={() => handleFieldFocus('name')}
                styles={{
                  label: {
                    color: 'var(--mantine-color-gray-2)',
                    fontWeight: 500,
                    marginBottom: '8px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  },
                  input: {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--mantine-color-gray-1)',
                    backdropFilter: 'blur(10px)',
                    '&:focus': {
                      borderColor: 'rgba(59, 130, 246, 0.5)',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                    },
                    '&::placeholder': {
                      color: 'var(--mantine-color-gray-5)',
                    }
                  },
                  error: {
                    color: 'var(--mantine-color-red-4)',
                  }
                }}
              />
            </motion.div>

            <motion.div variants={inputVariants}>
              <TextInput
                name="email"
                label="Email"
                placeholder="uw@email.com"
                type="email"
                required
                error={state.errors?.email?.join(', ')}
                size="md"
                onFocus={() => handleFieldFocus('email')}
                styles={{
                  label: {
                    color: 'var(--mantine-color-gray-2)',
                    fontWeight: 500,
                    marginBottom: '8px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  },
                  input: {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--mantine-color-gray-1)',
                    backdropFilter: 'blur(10px)',
                    '&:focus': {
                      borderColor: 'rgba(59, 130, 246, 0.5)',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                    },
                    '&::placeholder': {
                      color: 'var(--mantine-color-gray-5)',
                    }
                  },
                  error: {
                    color: 'var(--mantine-color-red-4)',
                  }
                }}
              />
            </motion.div>

            <motion.div variants={inputVariants}>
              <Textarea
                name="message"
                label="Bericht"
                placeholder={selectedPlan 
                  ? `Vertel ons meer over uw ${selectedPlan.name} project. Welke specifieke eisen heeft u? Wat is de gewenste opleverdatum?`
                  : "Vertel ons over uw project of vraag..."
                }
                required
                rows={5}
                error={state.errors?.message?.join(', ')}
                size="md"
                onFocus={() => handleFieldFocus('message')}
                styles={{
                  label: {
                    color: 'var(--mantine-color-gray-2)',
                    fontWeight: 500,
                    marginBottom: '8px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  },
                  input: {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--mantine-color-gray-1)',
                    backdropFilter: 'blur(10px)',
                    resize: 'vertical',
                    minHeight: '120px',
                    '&:focus': {
                      borderColor: 'rgba(59, 130, 246, 0.5)',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                    },
                    '&::placeholder': {
                      color: 'var(--mantine-color-gray-5)',
                    }
                  },
                  error: {
                    color: 'var(--mantine-color-red-4)',
                  }
                }}
              />
            </motion.div>

            <motion.div variants={inputVariants}>
              <SubmitButton />
            </motion.div>
          </Stack>
        </form>
      </motion.div>
    </ContactErrorBoundary>
  );
} 
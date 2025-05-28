'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  Select,
  Switch,
  NumberInput,
  Button,
  Stack,
  Grid,
  Group,
  LoadingOverlay,
  Box,
  Text,
} from '@mantine/core';
import { motion } from 'framer-motion';
import {
  PricingPlanModalProps,
  FormData,
  initialFormData,
  colorOptions,
  ctaVariantOptions,
} from './types';

// Input styling consistent with PostForm.tsx
const inputStyles = {
  label: {
    color: 'var(--mantine-color-gray-2)',
    fontWeight: 500,
    marginBottom: 'clamp(6px, 1.5vw, 8px)',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
  },
  input: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--mantine-color-gray-1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 'clamp(6px, 1.5vw, 8px)',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    padding: 'clamp(10px, 2.5vw, 12px)',
    '&:focus': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
    },
    '&::placeholder': {
      color: 'var(--mantine-color-gray-5)',
      fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
    }
  },
  error: {
    color: 'var(--mantine-color-red-4)',
    fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
  },
  description: {
    color: 'var(--mantine-color-gray-4)',
    fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
    lineHeight: 1.4,
  }
};

// Animation variants
const inputVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Color render option function using Mantine CSS variables
const renderColorOption = ({ option, checked }: { option: any; checked?: boolean }) => (
  <Group gap="sm" wrap="nowrap" style={{ width: '100%', padding: '4px 0' }}>
    <Box
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        backgroundColor: `var(--mantine-color-${option.value}-5)`,
        border: '2px solid rgba(255, 255, 255, 0.3)',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    />
    <Text 
      size="sm" 
      style={{ 
        color: 'var(--mantine-color-gray-2)',
        fontWeight: 500,
        flex: 1,
      }}
    >
      {option.label}
    </Text>
  </Group>
);

const PricingPlanModal: React.FC<PricingPlanModalProps> = ({
  opened,
  onClose,
  selectedPlan,
  onSubmit,
  isSubmitting,
}) => {
  const [features, setFeatures] = useState<string>('');
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Update form when selectedPlan changes
  useEffect(() => {
    if (selectedPlan) {
      const planData: FormData = {
        name: selectedPlan.name,
        description: selectedPlan.description,
        price: selectedPlan.price,
        original_price: selectedPlan.original_price || '',
        period: selectedPlan.period,
        is_popular: selectedPlan.is_popular,
        cta_text: selectedPlan.cta_text,
        cta_variant: selectedPlan.cta_variant,
        category_color: selectedPlan.category_color,
        gradient_from: selectedPlan.gradient_from,
        gradient_to: selectedPlan.gradient_to,
        sort_order: selectedPlan.sort_order,
        features: selectedPlan.features.map(f => f.text),
      };
      setFormData(planData);
      setFeatures(selectedPlan.features.map(f => f.text).join('\n'));
    } else {
      setFormData(initialFormData);
      setFeatures('');
    }
  }, [selectedPlan, opened]);

  const handleFeaturesChange = useCallback((value: string) => {
    setFeatures(value);
    setFormData(prev => ({
      ...prev,
      features: value.split('\n').filter(f => f.trim())
    }));
  }, []);

  const handleInputChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use our typed FormData with features from state
    const finalFormData: FormData = {
      ...formData,
      features: features.split('\n').filter(f => f.trim())
    };

    await onSubmit(finalFormData);
  };

  const handleClose = () => {
    setFeatures('');
    setFormData(initialFormData);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={selectedPlan ? 'Plan Bewerken' : 'Nieuw Plan'}
      size="lg"
      centered
      styles={{
        content: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          maxHeight: '90vh',
        },
        header: {
          background: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 'clamp(16px, 4vw, 24px)',
        },
        title: {
          color: 'var(--mantine-color-gray-1)',
          fontWeight: 600,
          fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
        },
        body: {
          padding: 'clamp(16px, 4vw, 24px)',
          maxHeight: 'calc(90vh - 120px)',
          overflowY: 'auto',
        },
      }}
    >
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
        <form onSubmit={handleSubmit}>
          <LoadingOverlay 
            visible={isSubmitting} 
            overlayProps={{ 
              radius: "sm", 
              blur: 2,
              backgroundOpacity: 0.1,
            }}
            loaderProps={{
              color: 'violet.4',
              type: 'dots',
              size: 'lg',
            }}
          />
          
          <Stack gap="lg">
            {/* Hidden input for planId when editing */}
            {selectedPlan?.id && (
              <input type="hidden" name="planId" value={selectedPlan.id} />
            )}

            <Grid>
              <Grid.Col span={6}>
                <motion.div variants={inputVariants}>
                  <TextInput
                    label="Plan Naam"
                    name="name"
                    placeholder="Frontend Specialist"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    size="md"
                    styles={{
                      label: inputStyles.label,
                      input: {
                        ...inputStyles.input,
                        minHeight: '44px',
                      },
                      error: inputStyles.error,
                      description: inputStyles.description,
                    }}
                  />
                </motion.div>
              </Grid.Col>
              <Grid.Col span={6}>
                <motion.div variants={inputVariants}>
                  <Select
                    label="Kleur"
                    name="category_color"
                    placeholder={formData.category_color ? `${colorOptions.find(c => c.value === formData.category_color)?.label || 'Selecteer een kleur...'}` : "Selecteer een kleur..."}
                    value={formData.category_color}
                    onChange={(value) => handleInputChange('category_color', value || '')}
                    required
                    data={colorOptions}
                    size="md"
                    styles={{
                      label: inputStyles.label,
                      input: {
                        ...inputStyles.input,
                        minHeight: '44px',
                      },
                      error: inputStyles.error,
                      description: inputStyles.description,
                      dropdown: {
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'clamp(8px, 2vw, 12px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      },
                      option: {
                        backgroundColor: 'transparent',
                        color: 'var(--mantine-color-gray-2)',
                        padding: 'clamp(8px, 2vw, 12px)',
                        '&[data-hovered]': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                        '&[data-selected]': {
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          color: 'var(--mantine-color-gray-1)',
                        },
                      },
                    }}
                    comboboxProps={{ 
                      withinPortal: false,
                      dropdownPadding: 8,
                    }}
                    clearable
                    renderOption={renderColorOption}
                  />
                </motion.div>
              </Grid.Col>
            </Grid>

            <motion.div variants={inputVariants}>
              <Textarea
                label="Beschrijving"
                name="description"
                placeholder="Moderne, responsieve websites"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                minRows={3}
                maxRows={5}
                autosize
                size="md"
                styles={inputStyles}
                description="Een korte beschrijving van het plan."
              />
            </motion.div>

            <Grid>
              <Grid.Col span={6}>
                <motion.div variants={inputVariants}>
                  <TextInput
                    label="Prijs"
                    name="price"
                    placeholder="€849"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                    size="md"
                    styles={{
                      label: inputStyles.label,
                      input: {
                        ...inputStyles.input,
                        minHeight: '44px',
                      },
                      error: inputStyles.error,
                      description: inputStyles.description,
                    }}
                  />
                </motion.div>
              </Grid.Col>
              <Grid.Col span={6}>
                <motion.div variants={inputVariants}>
                  <TextInput
                    label="Originele Prijs (optioneel)"
                    name="original_price"
                    placeholder="€999"
                    value={formData.original_price}
                    onChange={(e) => handleInputChange('original_price', e.target.value)}
                    size="md"
                    styles={{
                      label: inputStyles.label,
                      input: {
                        ...inputStyles.input,
                        minHeight: '44px',
                      },
                      error: inputStyles.error,
                      description: inputStyles.description,
                    }}
                  />
                </motion.div>
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <motion.div variants={inputVariants}>
                  <TextInput
                    label="Periode"
                    name="period"
                    placeholder="per project"
                    value={formData.period}
                    onChange={(e) => handleInputChange('period', e.target.value)}
                    required
                    size="md"
                    styles={{
                      label: inputStyles.label,
                      input: {
                        ...inputStyles.input,
                        minHeight: '44px',
                      },
                      error: inputStyles.error,
                      description: inputStyles.description,
                    }}
                  />
                </motion.div>
              </Grid.Col>
              <Grid.Col span={6}>
                <motion.div variants={inputVariants}>
                  <Select
                    label="CTA Variant"
                    name="cta_variant"
                    placeholder="Selecteer CTA variant..."
                    value={formData.cta_variant}
                    onChange={(value) => handleInputChange('cta_variant', value || '')}
                    required
                    data={ctaVariantOptions}
                    size="md"
                    styles={{
                      label: inputStyles.label,
                      input: {
                        ...inputStyles.input,
                        minHeight: '44px',
                      },
                      error: inputStyles.error,
                      description: inputStyles.description,
                      dropdown: {
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'clamp(8px, 2vw, 12px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      },
                      option: {
                        backgroundColor: 'transparent',
                        color: 'var(--mantine-color-gray-2)',
                        padding: 'clamp(8px, 2vw, 12px)',
                        '&[data-hovered]': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                        '&[data-selected]': {
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          color: 'var(--mantine-color-gray-1)',
                        },
                      },
                    }}
                    comboboxProps={{ 
                      withinPortal: false,
                      dropdownPadding: 8,
                    }}
                    clearable
                  />
                </motion.div>
              </Grid.Col>
            </Grid>

            <motion.div variants={inputVariants}>
              <TextInput
                label="CTA Tekst"
                name="cta_text"
                placeholder="Start Project"
                value={formData.cta_text}
                onChange={(e) => handleInputChange('cta_text', e.target.value)}
                required
                size="md"
                styles={{
                  label: inputStyles.label,
                  input: {
                    ...inputStyles.input,
                    minHeight: '44px',
                  },
                  error: inputStyles.error,
                  description: inputStyles.description,
                }}
              />
            </motion.div>

            <Grid>
              <Grid.Col span={6}>
                <motion.div variants={inputVariants}>
                  <NumberInput
                    label="Sorteervolgorde"
                    name="sort_order"
                    placeholder="0"
                    value={formData.sort_order}
                    onChange={(value) => handleInputChange('sort_order', typeof value === 'number' ? value : 0)}
                    min={0}
                    size="md"
                    styles={{
                      label: inputStyles.label,
                      input: {
                        ...inputStyles.input,
                        minHeight: '44px',
                      },
                      error: inputStyles.error,
                      description: inputStyles.description,
                    }}
                  />
                </motion.div>
              </Grid.Col>
              <Grid.Col span={6}>
                <motion.div variants={inputVariants} style={{ paddingTop: '24px' }}>
                  <Switch
                    label="Populair plan"
                    name="is_popular"
                    description="Markeer als populair plan"
                    checked={formData.is_popular}
                    onChange={(e) => handleInputChange('is_popular', e.target.checked)}
                    size="md"
                    styles={{
                      label: {
                        color: 'var(--mantine-color-gray-2)',
                        fontWeight: 500,
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        lineHeight: 1.4,
                      },
                      input: {
                        minHeight: '20px',
                        minWidth: '20px',
                        '&:checked': {
                          backgroundColor: 'var(--mantine-color-violet-6)',
                          borderColor: 'var(--mantine-color-violet-6)',
                        },
                      },
                      body: {
                        alignItems: 'center',
                        gap: 'clamp(8px, 2vw, 12px)',
                      },
                      description: {
                        color: 'var(--mantine-color-gray-4)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                        lineHeight: 1.4,
                        marginTop: 'clamp(4px, 1vw, 6px)',
                      },
                    }}
                  />
                </motion.div>
              </Grid.Col>
            </Grid>

            {/* Remove hidden inputs since we use controlled state */}

            <motion.div variants={inputVariants}>
              <Textarea
                label="Features (één per regel)"
                placeholder={`Responsive Design
Modern UI/UX
React/Next.js Development
Performance Optimalisatie`}
                value={features}
                onChange={(e) => handleFeaturesChange(e.target.value)}
                minRows={4}
                maxRows={8}
                autosize
                size="md"
                styles={inputStyles}
                description="Voeg elke feature op een nieuwe regel toe"
              />
            </motion.div>

            <Group justify="flex-end" mt="xl" gap="md">
              <Button 
                variant="light" 
                onClick={handleClose}
                disabled={isSubmitting}
                style={{
                  minHeight: '44px',
                  fontSize: 'clamp(0.875rem, 2.2vw, 1rem)',
                }}
              >
                Annuleren
              </Button>
              <Button 
                type="submit" 
                loading={isSubmitting}
                variant="gradient"
                gradient={{ from: 'violet.6', to: 'purple.5' }}
                style={{
                  minHeight: '44px',
                  fontSize: 'clamp(0.875rem, 2.2vw, 1rem)',
                }}
              >
                {selectedPlan ? 'Bijwerken' : 'Aanmaken'}
              </Button>
            </Group>
          </Stack>
        </form>
      </motion.div>
    </Modal>
  );
};

export default PricingPlanModal; 
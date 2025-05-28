import { PricingPlan } from '@/app/api/pricing-plans/route';

export interface PricingPlansManagerProps {
  // Optional props for customization
}

export interface FormData {
  name: string;
  description: string;
  price: string | number;
  original_price: string | number;
  period: string;
  is_popular: boolean;
  cta_text: string;
  cta_variant: 'filled' | 'outline' | 'gradient';
  category_color: string;
  category_name: string;
  category_icon: string;
  gradient_from: string;
  gradient_to: string;
  sort_order: number;
  features: string[];
}

export const initialFormData: FormData = {
  name: '',
  description: '',
  price: '',
  original_price: '',
  period: 'per project',
  is_popular: false,
  cta_text: 'Start Project',
  cta_variant: 'outline',
  category_color: 'blue',
  category_name: 'Standard',
  category_icon: 'star',
  gradient_from: 'blue.6',
  gradient_to: 'cyan.6',
  sort_order: 0,
  features: [],
};

export const colorOptions = [
  { value: 'blue', label: 'Blue' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'violet', label: 'Violet' },
  { value: 'orange', label: 'Orange' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
  { value: 'yellow', label: 'Yellow' },
];

export const ctaVariantOptions = [
  { value: 'outline', label: 'Outline' },
  { value: 'filled', label: 'Filled' },
  { value: 'gradient', label: 'Gradient' },
];

export interface PricingPlanModalProps {
  opened: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan | null;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
} 
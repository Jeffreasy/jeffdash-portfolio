import {
  IconCode,
  IconServer,
  IconPalette,
  IconSettings,
} from '@tabler/icons-react';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  period: string;
  popular?: boolean;
  icon: React.ComponentType<any>;
  features: string[];
  color: string;
  gradient: { from: string; to: string };
  ctaText: string;
  ctaVariant: 'filled' | 'outline' | 'gradient';
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'frontend',
    name: 'Frontend Specialist',
    description: 'Moderne, responsieve websites',
    price: '€849',
    originalPrice: '€999',
    period: 'per project',
    icon: IconPalette,
    color: 'cyan',
    gradient: { from: 'cyan.6', to: 'blue.6' },
    features: [
      'Responsive Design (Mobile-first)',
      'Modern UI/UX met Mantine/Tailwind',
      'React/Next.js Development',
      'Performance Optimalisatie',
      'SEO-vriendelijke structuur',
      'Cross-browser compatibiliteit',
      '3 maanden ondersteuning',
      'Deployment naar Vercel/Netlify',
    ],
    ctaText: 'Start Frontend Project',
    ctaVariant: 'outline',
  },
  {
    id: 'backend',
    name: 'Backend Powerhouse',
    description: 'Robuuste server-side oplossingen',
    price: '€1249',
    originalPrice: '€1499',
    period: 'per project',
    icon: IconServer,
    color: 'violet',
    gradient: { from: 'violet.6', to: 'purple.6' },
    features: [
      'RESTful API Development',
      'Database Design & Optimalisatie',
      'Authentication & Authorization',
      'Third-party API Integraties',
      'Server Deployment & Configuratie',
      'Data Backup & Security',
      '6 maanden ondersteuning',
      'Performance Monitoring',
    ],
    ctaText: 'Start Backend Project',
    ctaVariant: 'outline',
  },
  {
    id: 'fullstack',
    name: 'Full-Stack Complete',
    description: 'Volledige webapplicatie ervaring',
    price: '€1899',
    originalPrice: '€2499',
    period: 'per project',
    popular: true,
    icon: IconCode,
    color: 'blue',
    gradient: { from: 'blue.6', to: 'cyan.5' },
    features: [
      'Complete Frontend & Backend',
      'Database Design & Implementation',
      'User Authentication Systeem',
      'Admin Dashboard',
      'Real-time Features (WebSockets)',
      'Payment Gateway Integratie',
      'Automated Testing Suite',
      'CI/CD Pipeline Setup',
      '12 maanden ondersteuning',
      'Performance Optimalisatie',
    ],
    ctaText: 'Start Full-Stack Project',
    ctaVariant: 'gradient',
  },
  {
    id: 'custom',
    name: 'Custom Enterprise',
    description: 'Maatwerk voor complexe projecten',
    price: 'Op maat',
    period: 'offerte op aanvraag',
    icon: IconSettings,
    color: 'orange',
    gradient: { from: 'orange.6', to: 'red.6' },
    features: [
      'Volledig maatwerk ontwikkeling',
      'Enterprise-grade architectuur',
      'Dedicated project manager',
      'Uitgebreide consultatie fase',
      'Custom integraties & API\'s',
      'Scalability planning',
      'Training & documentatie',
      'Ongoing maintenance contract',
      '24/7 support beschikbaar',
      'SLA garanties',
    ],
    ctaText: 'Vraag Offerte Aan',
    ctaVariant: 'outline',
  },
]; 
import React from 'react';
import { Paper, PaperProps } from '@mantine/core';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

// Extend props to explicitly include className, children and variant
interface CardProps extends PaperProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'legacy';
}

// Custom Card component that wraps Mantine Paper with consistent styling
const Card = ({ children, className, variant = 'glass', ...rest }: CardProps) => {
  try {
    // Validate children prop
    if (!children) {
      console.warn('Card component rendered without children');
    }

    // Define styling variants
    const getVariantStyles = () => {
      switch (variant) {
        case 'glass':
          return {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
          };
        case 'legacy':
          return {
            className: "bg-white dark:bg-gray-800",
          };
        case 'default':
        default:
          return {
            background: 'var(--mantine-color-dark-6)',
            border: '1px solid var(--mantine-color-dark-4)',
          };
      }
    };

    const variantStyles = getVariantStyles();
    const combinedClassName = `${variantStyles.className || ''} ${className || ''}`.trim();

    return (
      <ErrorBoundary componentName="Card">
        <Paper 
          shadow={variant === 'glass' ? 'md' : 'xs'}
          p="md" 
          radius={variant === 'glass' ? 'lg' : 'md'}
          withBorder={variant !== 'glass'}
          className={combinedClassName || undefined}
          style={{
            ...variantStyles,
            ...(rest.style || {}),
          }}
          styles={{
            root: {
              '&:hover': variant === 'glass' ? {
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.08) 100%)',
              } : {},
              ...(rest.styles?.root || {}),
            }
          }}
          {...rest}
        >
          {children}
        </Paper>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Error rendering Card:', error);
    return (
      <ErrorBoundary componentName="Card">
        <Paper 
          shadow="xs" 
          p="md" 
          withBorder 
          className={className} 
          {...rest}
        >
          {children}
        </Paper>
      </ErrorBoundary>
    );
  }
};

export default Card; 
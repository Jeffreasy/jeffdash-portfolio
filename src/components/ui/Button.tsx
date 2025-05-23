import React, { ElementType } from 'react';
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';
// Import Mantine's specific type helper for polymorphic components
import type { PolymorphicComponentProps } from '@mantine/utils';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

// Define props using Mantine's helper
export type ButtonProps<C extends ElementType = 'button'> =
  PolymorphicComponentProps<C, MantineButtonProps>;

// Use forwardRef to correctly handle refs, necessary for Mantine components
const Button = React.forwardRef(
  <C extends ElementType = 'button'>(
    // Destructure props using the Mantine-based type
    { className, component, ...props }: ButtonProps<C>,
    // Use a more generic ref type for polymorphic components
    ref: React.ForwardedRef<any>
  ) => {
    try {
      // Default styling that can be overridden by className prop
      const defaultStyling = "transition-all duration-200 ease-in-out";
      const combinedClassName = `${defaultStyling} ${className || ''}`.trim();

      return (
        <ErrorBoundary componentName="Button">
          <MantineButton
            ref={ref}
            component={component}
            className={combinedClassName}
            {...props as any}
          />
        </ErrorBoundary>
      );
    } catch (error) {
      console.error('Error rendering Button:', error);
      return (
        <ErrorBoundary componentName="Button">
          <MantineButton
            ref={ref}
            component={component}
            className={className}
            {...props as any}
          />
        </ErrorBoundary>
      );
    }
  }
);

Button.displayName = 'CustomButton'; // Helpful for debugging

export default Button; 
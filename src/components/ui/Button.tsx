import React, { ElementType } from 'react';
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';
// Import Mantine's specific type helper for polymorphic components
import type { PolymorphicComponentProps } from '@mantine/utils';

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
    // Replace "your-custom-styling-classes" with the actual classes
    const customStyling = "your-custom-styling-classes";
    const combinedClassName = `${customStyling} ${className || ''}`.trim();

    // Pass props, using 'as any' on the spread props as a workaround
    // for the complex polymorphic type issue internally.
    return (
      <MantineButton
        ref={ref}
        component={component}
        className={combinedClassName}
        {...props as any} // Use type assertion here
      />
    );
  }
);

Button.displayName = 'CustomButton'; // Helpful for debugging

export default Button; 
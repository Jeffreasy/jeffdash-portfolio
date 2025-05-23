import React from 'react';
import { Paper, PaperProps } from '@mantine/core';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

// Extend props to explicitly include className and children
interface CardProps extends PaperProps {
  className?: string;
  children: React.ReactNode;
}

// Voorbeeld van een custom Card die Mantine Paper wrapt
const Card = ({ children, className, ...rest }: CardProps) => {
  try {
    // Validate children prop
    if (!children) {
      console.warn('Card component rendered without children');
    }

    // Default styling that can be overridden by className prop
    const defaultStyling = "bg-white dark:bg-gray-800";
    const combinedClassName = `${defaultStyling} ${className || ''}`.trim();

    return (
      <ErrorBoundary componentName="Card">
        <Paper 
          shadow="xs" 
          p="md" 
          withBorder 
          className={combinedClassName} 
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
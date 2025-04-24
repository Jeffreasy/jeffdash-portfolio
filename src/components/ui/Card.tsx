import React from 'react';
import { Paper, PaperProps } from '@mantine/core';

// Extend props to explicitly include className
interface CardProps extends PaperProps {
  className?: string;
}

// Voorbeeld van een custom Card die Mantine Paper wrapt
const Card = ({ children, className, ...rest }: React.PropsWithChildren<CardProps>) => {
  // Pass the className prop to the Paper component
  return <Paper shadow="xs" p="md" withBorder className={className} {...rest}>{children}</Paper>;
};

export default Card; 
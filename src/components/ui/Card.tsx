import React from 'react';
import { Paper, PaperProps } from '@mantine/core';

// Voorbeeld van een custom Card die Mantine Paper wrapt
const Card = ({ children, ...rest }: React.PropsWithChildren<PaperProps>) => {
  return <Paper shadow="xs" p="md" withBorder {...rest}>{children}</Paper>;
};

export default Card; 
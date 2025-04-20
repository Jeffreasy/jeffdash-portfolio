import React from 'react';
import { Button as MantineButton, ButtonProps } from '@mantine/core';

// Voorbeeld van een custom Button die Mantine Button wrapt
const Button = (props: ButtonProps) => {
  return <MantineButton {...props} />;
};

export default Button; 
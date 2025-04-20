'use client'; // Contact form will likely need client-side interaction

import React from 'react';
import { TextInput, Textarea, Button } from '@mantine/core';

export default function ContactForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Voeg hier logica toe voor het verzenden van het formulier
    // (bijv. via een Server Action of API route)
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Naam"
        placeholder="Uw naam"
        required
      />
      <TextInput
        label="Email"
        placeholder="uw@email.com"
        type="email"
        required
      />
      <Textarea
        label="Bericht"
        placeholder="Uw bericht"
        required
        rows={4}
      />
      <Button type="submit">Verzenden</Button>
    </form>
  );
} 
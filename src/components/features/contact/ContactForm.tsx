'use client'; // Contact form will likely need client-side interaction

import React, { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { TextInput, Textarea, Button, Stack, Group, Alert, LoadingOverlay } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { submitContactForm, type ContactFormState } from '@/lib/actions/contact';
import ContactErrorBoundary from './ContactErrorBoundary';

// Aparte component voor de submit knop om useFormStatus te kunnen gebruiken
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      {pending ? 'Bezig met verzenden...' : 'Verzenden'}
    </Button>
  );
}

export default function ContactForm() {
  const initialState: ContactFormState = { message: undefined, errors: {}, success: false };
  const [state, formAction] = useActionState(submitContactForm, initialState);

  // Optioneel: Reset formulier na succes
  const formRef = React.useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  // Valideer form state
  if (state && typeof state !== 'object') {
    throw new Error('Invalid form state');
  }

  return (
    <ContactErrorBoundary>
      <form 
        ref={formRef} 
        action={formAction as any} 
        className="space-y-4"
        onSubmit={(e) => {
          // Voeg extra validatie toe indien nodig
          const formData = new FormData(e.currentTarget);
          if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
            e.preventDefault();
            throw new Error('Alle velden zijn verplicht');
          }
        }}
      >
        <Stack gap="md">
          {/* Toon algemeen bericht (succes of server-side fout) */}
          {state.message && !state.success && (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Fout!" color="red" variant="light">
              {state.message}
            </Alert>
          )}
          {state.message && state.success && (
            <Alert icon={<IconCheck size="1rem" />} title="Succes!" color="green" variant="light">
              {state.message}
            </Alert>
          )}

          <TextInput
            name="name"
            label="Naam"
            placeholder="Uw naam"
            required
            error={state.errors?.name?.join(', ')}
            onError={(e) => {
              console.error('Error in name field:', e);
            }}
          />
          <TextInput
            name="email"
            label="Email"
            placeholder="uw@email.com"
            type="email"
            required
            error={state.errors?.email?.join(', ')}
            onError={(e) => {
              console.error('Error in email field:', e);
            }}
          />
          <Textarea
            name="message"
            label="Bericht"
            placeholder="Uw bericht"
            required
            rows={4}
            error={state.errors?.message?.join(', ')}
            onError={(e) => {
              console.error('Error in message field:', e);
            }}
          />
          <Group justify="flex-end">
            <SubmitButton />
          </Group>
        </Stack>
      </form>
    </ContactErrorBoundary>
  );
} 
'use client'; // Contact form will likely need client-side interaction

import React, { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { TextInput, Textarea, Button, Stack, Group, Alert, LoadingOverlay } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { submitContactForm, type ContactFormState } from '@/lib/actions/contact';

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
  // Gebruik nu React.useActionState
  const [state, formAction] = useActionState(submitContactForm, initialState);

  // Optioneel: Reset formulier na succes
  const formRef = React.useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction as any} className="space-y-4">
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
          name="name" // Belangrijk voor FormData
          label="Naam"
          placeholder="Uw naam"
          required
          error={state.errors?.name?.join(', ')} // Toon validatiefout
        />
        <TextInput
          name="email" // Belangrijk voor FormData
          label="Email"
          placeholder="uw@email.com"
          type="email"
          required
          error={state.errors?.email?.join(', ')} // Toon validatiefout
        />
        <Textarea
          name="message" // Belangrijk voor FormData
          label="Bericht"
          placeholder="Uw bericht"
          required
          rows={4}
          error={state.errors?.message?.join(', ')} // Toon validatiefout
        />
        <Group justify="flex-end">
          <SubmitButton />
        </Group>
      </Stack>
    </form>
  );
} 
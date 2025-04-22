'use client'; // Nodig voor formulier interactie

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Title, Paper, TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { loginUser, type LoginState } from '@/lib/actions/auth'; // Importeer de action en state type

// Aparte component voor de submit knop om useFormStatus te gebruiken
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth mt="xl" loading={pending}>
      Inloggen
    </Button>
  );
}

export default function AdminLoginPage() {
  const initialState: LoginState = { success: false };
  const [state, formAction] = useActionState(loginUser, initialState);

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ maxWidth: 420, margin: 'auto' }}>
      <Title ta="center" order={2} mb="xl">
        Admin Login
      </Title>
      <form action={formAction}> {/* Gebruik formAction hier */}
        <Stack>
          {/* Toon algemene foutmelding */}
          {state?.message && !state.success && state.errors?.general && (
            <Alert icon={<IconInfoCircle size="1rem" />} title="Login Fout" color="red" variant="light">
              {state.errors.general.join(', ')}
            </Alert>
          )}

          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            name="email"
            type="email"
            error={state?.errors?.email?.join(', ')}
          />
          <PasswordInput
            label="Wachtwoord"
            placeholder="Je wachtwoord"
            required
            name="password"
            error={state?.errors?.password?.join(', ')}
          />
          <SubmitButton /> {/* Gebruik de aparte knop component */}
        </Stack>
      </form>
      {/* Debugging: toon state */}
      {/* {state && <pre>{JSON.stringify(state, null, 2)}</pre>} */}
    </Paper>
  );
} 
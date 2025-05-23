'use client';

import React, { useState, useTransition } from 'react';
import { Title, Paper, TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { loginUser, type LoginState } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [state, setState] = useState<LoginState>({ success: false });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await loginUser(undefined, formData);
        setState(result);
        
        if (result.success) {
          // Login successful, redirect will be handled by the server action
          router.push('/admin_area/dashboard');
        }
      } catch (error) {
        console.error('Login error:', error);
        setState({
          success: false,
          message: 'Er is een onverwachte fout opgetreden.',
          errors: { general: ['Client-side error'] }
        });
      }
    });
  };

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ maxWidth: 420, margin: 'auto' }}>
      <Title ta="center" order={2} mb="xl">
        Admin Login
      </Title>
      <form action={handleSubmit}>
        <Stack>
          {/* Toon algemene foutmelding */}
          {state?.message && !state.success && (
            <Alert icon={<IconInfoCircle size="1rem" />} title="Login Fout" color="red" variant="light">
              {state.message}
            </Alert>
          )}

          {/* Toon specifieke field errors */}
          {state?.errors?.general && (
            <Alert icon={<IconInfoCircle size="1rem" />} title="Fout" color="red" variant="light">
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
            disabled={isPending}
          />
          <PasswordInput
            label="Wachtwoord"
            placeholder="Je wachtwoord"
            required
            name="password"
            error={state?.errors?.password?.join(', ')}
            disabled={isPending}
          />
          <Button type="submit" fullWidth mt="xl" loading={isPending}>
            Inloggen
          </Button>
        </Stack>
      </form>
      
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && state && (
        <pre style={{ fontSize: '10px', marginTop: '1rem', background: '#f5f5f5', padding: '0.5rem' }}>
          {JSON.stringify(state, null, 2)}
        </pre>
      )}
    </Paper>
  );
} 
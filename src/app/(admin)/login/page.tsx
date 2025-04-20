'use client'; // Login form vereist client interactie

import React from 'react';
import { TextInput, PasswordInput, Button } from '@mantine/core';

export default function LoginPage() {

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Voeg hier login logica toe (bijv. met NextAuth.js of een custom action)
    console.log('Login attempt');
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-4 mt-4">
        <TextInput
          label="Email / Username"
          required
        />
        <PasswordInput
          label="Password"
          required
        />
        <Button type="submit" fullWidth>Login</Button>
      </form>
    </div>
  );
} 
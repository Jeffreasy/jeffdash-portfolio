'use client'; // Contact form will likely need client-side interaction

import React, { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { TextInput, Textarea, Button, Stack, Group, Alert, LoadingOverlay } from '@mantine/core';
import { IconCheck, IconAlertCircle, IconSend } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { submitContactForm, type ContactFormState } from '@/lib/actions/contact';
import ContactErrorBoundary from './ContactErrorBoundary';

// Animation variants
const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const buttonVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.98 },
} as const;

// Aparte component voor de submit knop om useFormStatus te kunnen gebruiken
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
      <Button 
        type="submit" 
        loading={pending}
        variant="gradient"
        gradient={{ from: 'blue.6', to: 'cyan.5' }}
        size="md"
        fullWidth
        rightSection={<IconSend size={18} />}
        style={{
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          fontWeight: 500,
        }}
      >
        {pending ? 'Bezig met verzenden...' : 'Verzenden'}
      </Button>
    </motion.div>
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <form 
          ref={formRef} 
          action={formAction as any}
          onSubmit={(e) => {
            // Voeg extra validatie toe indien nodig
            const formData = new FormData(e.currentTarget);
            if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
              e.preventDefault();
              throw new Error('Alle velden zijn verplicht');
            }
          }}
        >
          <Stack gap="lg">
            {/* Toon algemeen bericht (succes of server-side fout) */}
            {state.message && !state.success && (
              <motion.div variants={inputVariants}>
                <Alert 
                  icon={<IconAlertCircle size="1.2rem" />} 
                  title="Fout!" 
                  color="red" 
                  variant="light"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: 'var(--mantine-color-red-3)',
                  }}
                  styles={{
                    title: {
                      color: 'var(--mantine-color-red-4)',
                      fontWeight: 600,
                    },
                    message: {
                      color: 'var(--mantine-color-red-3)',
                    }
                  }}
                >
                  {state.message}
                </Alert>
              </motion.div>
            )}
            
            {state.message && state.success && (
              <motion.div variants={inputVariants}>
                <Alert 
                  icon={<IconCheck size="1.2rem" />} 
                  title="Succes!" 
                  color="green" 
                  variant="light"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    color: 'var(--mantine-color-green-3)',
                  }}
                  styles={{
                    title: {
                      color: 'var(--mantine-color-green-4)',
                      fontWeight: 600,
                    },
                    message: {
                      color: 'var(--mantine-color-green-3)',
                    }
                  }}
                >
                  {state.message}
                </Alert>
              </motion.div>
            )}

            <motion.div variants={inputVariants}>
              <TextInput
                name="name"
                label="Naam"
                placeholder="Uw volledige naam"
                required
                error={state.errors?.name?.join(', ')}
                size="md"
                styles={{
                  label: {
                    color: 'var(--mantine-color-gray-2)',
                    fontWeight: 500,
                    marginBottom: '8px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  },
                  input: {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--mantine-color-gray-1)',
                    backdropFilter: 'blur(10px)',
                    '&:focus': {
                      borderColor: 'rgba(59, 130, 246, 0.5)',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                    },
                    '&::placeholder': {
                      color: 'var(--mantine-color-gray-5)',
                    }
                  },
                  error: {
                    color: 'var(--mantine-color-red-4)',
                  }
                }}
                onError={(e) => {
                  console.error('Error in name field:', e);
                }}
              />
            </motion.div>

            <motion.div variants={inputVariants}>
              <TextInput
                name="email"
                label="Email"
                placeholder="uw@email.com"
                type="email"
                required
                error={state.errors?.email?.join(', ')}
                size="md"
                styles={{
                  label: {
                    color: 'var(--mantine-color-gray-2)',
                    fontWeight: 500,
                    marginBottom: '8px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  },
                  input: {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--mantine-color-gray-1)',
                    backdropFilter: 'blur(10px)',
                    '&:focus': {
                      borderColor: 'rgba(59, 130, 246, 0.5)',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                    },
                    '&::placeholder': {
                      color: 'var(--mantine-color-gray-5)',
                    }
                  },
                  error: {
                    color: 'var(--mantine-color-red-4)',
                  }
                }}
                onError={(e) => {
                  console.error('Error in email field:', e);
                }}
              />
            </motion.div>

            <motion.div variants={inputVariants}>
              <Textarea
                name="message"
                label="Bericht"
                placeholder="Vertel ons over uw project of vraag..."
                required
                rows={5}
                error={state.errors?.message?.join(', ')}
                size="md"
                styles={{
                  label: {
                    color: 'var(--mantine-color-gray-2)',
                    fontWeight: 500,
                    marginBottom: '8px',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                  },
                  input: {
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--mantine-color-gray-1)',
                    backdropFilter: 'blur(10px)',
                    resize: 'vertical',
                    minHeight: '120px',
                    '&:focus': {
                      borderColor: 'rgba(59, 130, 246, 0.5)',
                      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                    },
                    '&::placeholder': {
                      color: 'var(--mantine-color-gray-5)',
                    }
                  },
                  error: {
                    color: 'var(--mantine-color-red-4)',
                  }
                }}
                onError={(e) => {
                  console.error('Error in message field:', e);
                }}
              />
            </motion.div>

            <motion.div variants={inputVariants}>
              <SubmitButton />
            </motion.div>
          </Stack>
        </form>
      </motion.div>
    </ContactErrorBoundary>
  );
} 
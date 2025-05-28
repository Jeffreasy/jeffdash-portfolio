'use client';

import { Stack, TextInput, Textarea, Button, Alert, Box, Group, ThemeIcon } from '@mantine/core';
import { IconCheck, IconAlertCircle, IconUser, IconLink, IconDeviceFloppy } from '@tabler/icons-react';
import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { updateAboutContent, type AboutContentType, type AboutFormState } from '@/lib/actions/siteContent';
import { notifications } from '@mantine/notifications';

interface AboutFormProps {
  initialData: AboutContentType;
}

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

export default function AboutForm({ initialData }: AboutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<AboutFormState>({ success: false });
  
  const [formData, setFormData] = useState<AboutContentType>(initialData);

  const handleInputChange = (field: keyof AboutContentType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    startTransition(async () => {
      const result = await updateAboutContent(formState, form);
      setFormState(result);
      
      if (result.success) {
        notifications.show({
          title: 'Succes!',
          message: 'About content is succesvol bijgewerkt.',
          color: 'green',
          icon: <IconCheck size={16} />,
          styles: {
            root: {
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              backdropFilter: 'blur(10px)',
            },
          },
        });
      } else {
        notifications.show({
          title: 'Fout',
          message: result.message || 'Er is een fout opgetreden.',
          color: 'red',
          icon: <IconAlertCircle size={16} />,
          styles: {
            root: {
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(10px)',
            },
          },
        });
      }
    });
  };

  // Clean input styles without media queries
  const inputStyles = {
    label: {
      color: 'var(--mantine-color-gray-2)',
      fontWeight: 500,
      marginBottom: '8px',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    },
    input: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'var(--mantine-color-gray-1)',
      backdropFilter: 'blur(10px)',
      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
      padding: 'clamp(8px, 2vw, 12px)',
      '&:focus': {
        borderColor: 'rgba(59, 130, 246, 0.5)',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
      },
      '&::placeholder': {
        color: 'var(--mantine-color-gray-5)',
        fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
      }
    },
    error: {
      color: 'var(--mantine-color-red-4)',
      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    }
  };

  return (
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
      style={{
        width: '100%',
        maxWidth: '100%',
        padding: 'clamp(12px, 3vw, 24px)',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          {formState.errors?.general && (
            <motion.div variants={inputVariants}>
              <Alert 
                variant="light" 
                color="red" 
                icon={<IconAlertCircle size={16} />}
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(12px, 3vw, 16px)',
                }}
                styles={{
                  title: {
                    color: 'var(--mantine-color-red-4)',
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  },
                  message: {
                    color: 'var(--mantine-color-red-3)',
                    fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
                  }
                }}
              >
                {formState.errors.general.join(', ')}
              </Alert>
            </motion.div>
          )}

          <motion.div variants={inputVariants}>
            <TextInput
              label="Titel"
              placeholder="Over Mij"
              value={formData.about_title}
              onChange={(event) => handleInputChange('about_title', event.currentTarget.value)}
              error={formState.errors?.about_title?.[0]}
              required
              leftSection={<IconUser size={16} />}
              size="md"
              styles={inputStyles}
              style={{
                width: '100%',
              }}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <Textarea
              label="Introductie"
              placeholder="Welkom op mijn portfolio..."
              value={formData.about_intro}
              onChange={(event) => handleInputChange('about_intro', event.currentTarget.value)}
              error={formState.errors?.about_intro?.[0]}
              minRows={3}
              maxRows={6}
              autosize
              required
              size="md"
              styles={inputStyles}
              style={{
                width: '100%',
              }}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <Textarea
              label="Focus & Specialisaties"
              placeholder="Mijn focus ligt op..."
              value={formData.about_focus}
              onChange={(event) => handleInputChange('about_focus', event.currentTarget.value)}
              error={formState.errors?.about_focus?.[0]}
              minRows={4}
              maxRows={8}
              autosize
              required
              size="md"
              styles={inputStyles}
              style={{
                width: '100%',
              }}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <Textarea
              label="Projecten Sectie"
              placeholder="Op deze site vind je..."
              value={formData.about_projects}
              onChange={(event) => handleInputChange('about_projects', event.currentTarget.value)}
              error={formState.errors?.about_projects?.[0]}
              minRows={3}
              maxRows={6}
              autosize
              required
              size="md"
              styles={inputStyles}
              style={{
                width: '100%',
              }}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <Textarea
              label="Contact Sectie"
              placeholder="Bekijk gerust mijn profielen..."
              value={formData.about_contact}
              onChange={(event) => handleInputChange('about_contact', event.currentTarget.value)}
              error={formState.errors?.about_contact?.[0]}
              minRows={3}
              maxRows={6}
              autosize
              required
              size="md"
              styles={inputStyles}
              style={{
                width: '100%',
              }}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <TextInput
              label="LinkedIn URL"
              placeholder="https://www.linkedin.com/in/..."
              value={formData.linkedin_url}
              onChange={(event) => handleInputChange('linkedin_url', event.currentTarget.value)}
              error={formState.errors?.linkedin_url?.[0]}
              required
              leftSection={<IconLink size={16} />}
              size="md"
              styles={inputStyles}
              style={{
                width: '100%',
              }}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <TextInput
              label="GitHub URL"
              placeholder="https://github.com/..."
              value={formData.github_url}
              onChange={(event) => handleInputChange('github_url', event.currentTarget.value)}
              error={formState.errors?.github_url?.[0]}
              required
              leftSection={<IconLink size={16} />}
              size="md"
              styles={inputStyles}
              style={{
                width: '100%',
              }}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button 
                type="submit" 
                loading={isPending}
                leftSection={<IconDeviceFloppy size={18} />}
                size="lg"
                variant="gradient"
                gradient={{ from: 'blue.6', to: 'cyan.5' }}
                fullWidth
                style={{
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  fontWeight: 600,
                  minHeight: '48px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  padding: 'clamp(12px, 3vw, 16px)',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    },
                  },
                }}
              >
                {isPending ? 'Bezig met opslaan...' : 'About Content Opslaan'}
              </Button>
            </motion.div>
          </motion.div>
        </Stack>
      </form>
    </motion.div>
  );
} 
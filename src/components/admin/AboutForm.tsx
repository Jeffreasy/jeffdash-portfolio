'use client';

import { Stack, TextInput, Textarea, Button, Alert, Notification } from '@mantine/core';
import { IconCheck, IconAlertCircle, IconUser, IconLink } from '@tabler/icons-react';
import { useState, useTransition } from 'react';
import { updateAboutContent, type AboutContentType, type AboutFormState } from '@/lib/actions/siteContent';
import { notifications } from '@mantine/notifications';

interface AboutFormProps {
  initialData: AboutContentType;
}

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
        });
      } else {
        notifications.show({
          title: 'Fout',
          message: result.message || 'Er is een fout opgetreden.',
          color: 'red',
          icon: <IconAlertCircle size={16} />,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        {formState.errors?.general && (
          <Alert variant="light" color="red" icon={<IconAlertCircle size={16} />}>
            {formState.errors.general.join(', ')}
          </Alert>
        )}

        <TextInput
          label="Titel"
          placeholder="Over Mij"
          value={formData.about_title}
          onChange={(event) => handleInputChange('about_title', event.currentTarget.value)}
          error={formState.errors?.about_title?.[0]}
          required
          leftSection={<IconUser size={16} />}
        />

        <Textarea
          label="Introductie"
          placeholder="Welkom op mijn portfolio..."
          value={formData.about_intro}
          onChange={(event) => handleInputChange('about_intro', event.currentTarget.value)}
          error={formState.errors?.about_intro?.[0]}
          minRows={3}
          required
        />

        <Textarea
          label="Focus & Specialisaties"
          placeholder="Mijn focus ligt op..."
          value={formData.about_focus}
          onChange={(event) => handleInputChange('about_focus', event.currentTarget.value)}
          error={formState.errors?.about_focus?.[0]}
          minRows={4}
          required
        />

        <Textarea
          label="Projecten Sectie"
          placeholder="Op deze site vind je..."
          value={formData.about_projects}
          onChange={(event) => handleInputChange('about_projects', event.currentTarget.value)}
          error={formState.errors?.about_projects?.[0]}
          minRows={3}
          required
        />

        <Textarea
          label="Contact Sectie"
          placeholder="Bekijk gerust mijn profielen..."
          value={formData.about_contact}
          onChange={(event) => handleInputChange('about_contact', event.currentTarget.value)}
          error={formState.errors?.about_contact?.[0]}
          minRows={3}
          required
        />

        <TextInput
          label="LinkedIn URL"
          placeholder="https://www.linkedin.com/in/..."
          value={formData.linkedin_url}
          onChange={(event) => handleInputChange('linkedin_url', event.currentTarget.value)}
          error={formState.errors?.linkedin_url?.[0]}
          required
          leftSection={<IconLink size={16} />}
        />

        <TextInput
          label="GitHub URL"
          placeholder="https://github.com/..."
          value={formData.github_url}
          onChange={(event) => handleInputChange('github_url', event.currentTarget.value)}
          error={formState.errors?.github_url?.[0]}
          required
          leftSection={<IconLink size={16} />}
        />

        <Button 
          type="submit" 
          loading={isPending}
          leftSection={<IconCheck size={16} />}
          size="md"
        >
          Opslaan
        </Button>
      </Stack>
    </form>
  );
} 
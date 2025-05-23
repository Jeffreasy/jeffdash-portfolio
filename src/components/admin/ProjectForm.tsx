'use client';

import React, { useState, useEffect, useCallback, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { TextInput, Textarea, Switch, Button, Group, Stack, Alert, Text, FileInput, SimpleGrid, Image, CloseButton, Box, Title } from '@mantine/core';
import { IconAlertCircle, IconUpload } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { ProjectFormState, FullProjectType, ProjectImage } from '@/lib/actions/projects';
import AdminErrorBoundary from './AdminErrorBoundary';

// Definieer de properties voor het formulier
interface ProjectFormProps {
  action: (prevState: ProjectFormState | undefined, formData: FormData) => Promise<ProjectFormState>;
  initialState?: ProjectFormState; // Start status voor het formulier
  project?: FullProjectType | null; // Optioneel voor bestaand project (voor bewerken)
  submitButtonLabel?: string; // Label voor de submit knop (bv. 'Opslaan' of 'Aanmaken')
}

// Submit knop component dat rekening houdt met pending state
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} disabled={pending}>
      {label}
    </Button>
  );
}

interface ImagePreviewState {
  file: File;
  previewUrl: string;
  altText: string;
}

// Type voor bestaande afbeelding data (uit project prop)
interface ExistingImage {
  id: string;
  url: string;
  altText: string;
  order: number;
}

// Type voor nieuwe afbeelding previews (uit FileInput)
interface NewImagePreview {
  file: File;
  previewUrl: string;
  altText: string;
}

export default function ProjectForm({
  action,
  initialState = { success: false },
  project,
  submitButtonLabel = 'Project Opslaan',
}: ProjectFormProps) {
  // Validate props
  if (!action || typeof action !== 'function') {
    throw new Error('Invalid action prop provided to ProjectForm');
  }

  const [state, formAction] = useActionState(action, initialState);

  // State for existing images
  const [existingImagesData, setExistingImagesData] = useState<ExistingImage[]>(() => {
    try {
      return project?.ProjectImage?.map((img: ProjectImage) => ({ 
        id: img.id,
        url: img.url,
        altText: img.altText,
        order: img.order
      })) || [];
    } catch (err) {
      console.error('Error initializing existing images:', err);
      return [];
    }
  });

  // State for new image previews
  const [newImagePreviews, setNewImagePreviews] = useState<NewImagePreview[]>([]);

  // Cleanup effect for Object URLs
  useEffect(() => {
    return () => {
      try {
        console.log('Cleanup: Revoking Object URLs for new previews');
        newImagePreviews.forEach(img => URL.revokeObjectURL(img.previewUrl));
      } catch (err) {
        console.error('Error during cleanup:', err);
      }
    };
  }, [newImagePreviews]);

  // Handlers for new images
  const handleFileChange = (files: File[] | null) => {
    try {
      if (!files) {
        newImagePreviews.forEach(img => URL.revokeObjectURL(img.previewUrl));
        setNewImagePreviews([]);
        return;
      }

      const currentNewFiles = newImagePreviews.map(p => p.file);
      const addedFiles = files.filter(file => 
        !currentNewFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)
      );

      const newPreviews = addedFiles.map(file => ({
        file: file,
        previewUrl: URL.createObjectURL(file),
        altText: '' 
      }));

      setNewImagePreviews(prev => [...prev, ...newPreviews]);
    } catch (err) {
      console.error('Error handling file change:', err);
      notifications.show({
        title: 'Fout',
        message: 'Er is een fout opgetreden bij het verwerken van de afbeeldingen.',
        color: 'red',
        icon: <IconAlertCircle />,
      });
    }
  };

  const handleNewAltTextChange = (index: number, value: string) => {
    try {
      setNewImagePreviews(prev => 
        prev.map((preview, i) => i === index ? { ...preview, altText: value } : preview)
      );
    } catch (err) {
      console.error('Error handling new alt text change:', err);
      notifications.show({
        title: 'Fout',
        message: 'Er is een fout opgetreden bij het verwerken van de alt-tekst.',
        color: 'red',
        icon: <IconAlertCircle />,
      });
    }
  };
  
  const removeNewImagePreview = (indexToRemove: number) => {
    try {
      const previewToRemove = newImagePreviews[indexToRemove];
      URL.revokeObjectURL(previewToRemove.previewUrl);
      setNewImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    } catch (err) {
      console.error('Error removing image preview:', err);
      notifications.show({
        title: 'Fout',
        message: 'Er is een fout opgetreden bij het verwijderen van de afbeelding.',
        color: 'red',
        icon: <IconAlertCircle />,
      });
    }
  };
  
  // Handler for existing image alt text
  const handleExistingAltTextChange = (index: number, value: string) => {
    try {
      setExistingImagesData(prev => 
        prev.map((img, i) => i === index ? { ...img, altText: value } : img)
      );
    } catch (err) {
      console.error('Error handling existing alt text change:', err);
      notifications.show({
        title: 'Fout',
        message: 'Er is een fout opgetreden bij het verwerken van de alt-tekst.',
        color: 'red',
        icon: <IconAlertCircle />,
      });
    }
  };

  // Gebruik de state van useActionState indien beschikbaar (bij fouten),
  // anders de initiële project slug.
  const currentSlug = state?.projectSlug ?? project?.slug;

  return (
    <AdminErrorBoundary componentName="Project Form">
      <form action={formAction}>
        {/* Voeg verborgen veld toe voor project ID bij bewerken */}
        {project?.id && <input type="hidden" name="projectId" value={project.id} />}

        <Stack gap="md">

          {/* Toon algemene foutmeldingen bovenaan */} 
          {!state.success && state.message && state.errors?.general && (
            <Alert icon={<IconAlertCircle size="1rem" />} title="Fout!" color="red" withCloseButton>
              {state.errors.general.join(', ')}
            </Alert>
          )}

          <TextInput
            label="Titel"
            name="title"
            placeholder="Project titel"
            required
            error={state.errors?.title?.join(', ')}
            defaultValue={project?.title} // Vul vooraf in
          />

          <TextInput
            label="Slug"
            name="slug"
            placeholder="project-titel-slug"
            description="Unieke identifier voor de URL (alleen kleine letters, cijfers, koppeltekens)."
            required
            error={state.errors?.slug?.join(', ')}
            defaultValue={project?.slug} // Vul vooraf in
          />

          <Textarea
            label="Korte Beschrijving"
            name="shortDescription"
            placeholder="Een korte samenvatting van het project voor lijsten en kaarten."
            autosize
            minRows={2}
            error={state.errors?.shortDescription?.join(', ')}
            defaultValue={project?.shortDescription || ''} // Vul vooraf in
          />

          <Textarea
            label="Gedetailleerde Inhoud (Markdown)"
            name="detailedContent"
            placeholder="Beschrijf het project uitgebreid. Markdown wordt ondersteund."
            required
            autosize
            minRows={5}
            error={state.errors?.detailedContent?.join(', ')}
            defaultValue={project?.detailedContent} // Vul vooraf in
          />

          <TextInput
            label="Live URL"
            name="liveUrl"
            placeholder="https://voorbeeld.com"
            type="url"
            error={state.errors?.liveUrl?.join(', ')}
            defaultValue={project?.liveUrl || ''} // Vul vooraf in
          />

          <TextInput
            label="GitHub URL"
            name="githubUrl"
            placeholder="https://github.com/gebruikersnaam/repo"
            type="url"
            error={state.errors?.githubUrl?.join(', ')}
            defaultValue={project?.githubUrl || ''} // Vul vooraf in
          />

          <TextInput
            label="Technologieën (komma-gescheiden)"
            name="technologies"
            placeholder="React, Next.js, TypeScript, Prisma"
            description="Voer de gebruikte technologieën in, gescheiden door komma's."
            error={state.errors?.technologies?.join(', ')}
            defaultValue={project?.technologies?.join(', ') || ''} // Vul vooraf in
          />
          
          <TextInput
            label="Categorie"
            name="category"
            placeholder="Web Development"
            error={state.errors?.category?.join(', ')}
            defaultValue={project?.category || ''} // Vul vooraf in
          />

          <Switch
            label="Uitgelicht project?"
            name="isFeatured"
            description="Markeer om dit project op de homepage te tonen."
            defaultChecked={project?.isFeatured} // Vul vooraf in
          />

          {/* --- Bestaande Afbeeldingen (alleen bij bewerken) --- */}
          {project && existingImagesData.length > 0 && (
            <Box mt="lg">
              <Title order={4} mb="sm">Bestaande Afbeeldingen</Title>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {existingImagesData.map((img, index) => (
                  <Box key={img.id} style={{ border: '1px solid var(--mantine-color-gray-7)', padding: '8px', borderRadius: 'var(--mantine-radius-sm)' }}>
                    <input type="hidden" name="existingImageIds" value={img.id} />
                    <Image 
                      src={img.url} // Gebruik de Cloudinary URL
                      alt={`Bestaande afbeelding ${index + 1}`}
                      height={150} 
                      fit="contain" 
                      mb="xs"
                    />
                    <TextInput
                      label={`Alt Tekst Afbeelding ${index + 1}`}
                      name="existingAltTexts" // Aparte naam!
                      placeholder="Beschrijvende alt-tekst" 
                      required 
                      value={img.altText} // Gebruik altText uit state
                      onChange={(event) => handleExistingAltTextChange(index, event.currentTarget.value)}
                    />
                    {/* TODO (Fase 3b): Verwijderknop voor bestaande afbeelding */}
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* --- Nieuwe Afbeeldingen Input & Previews --- */}
          <Box mt={existingImagesData.length > 0 ? "xl" : "md"}> {/* Extra margin als er al bestaande zijn */} 
             <Title order={4} mb="sm">Nieuwe Afbeeldingen Toevoegen</Title>
            <FileInput
              label="Selecteer nieuwe afbeeldingen"
              name="newImages" // Naam gewijzigd naar newImages voor consistentie
              placeholder="Klik hier om bestanden te selecteren"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              error={state.errors?.images?.join(', ')} // Blijft images error key gebruiken
              leftSection={<IconUpload size={14} />}
              clearable
            />

            {newImagePreviews.length > 0 && (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt="md" spacing="md">
                {newImagePreviews.map((imgPreview, index) => (
                  <Box key={index} pos="relative" style={{ border: '1px solid var(--mantine-color-gray-3)', padding: '4px' }}>
                    <CloseButton 
                      pos="absolute" 
                      top={5} 
                      right={5} 
                      onClick={() => removeNewImagePreview(index)} 
                      aria-label={`Verwijder ${imgPreview.file.name}`} 
                      variant="transparent" 
                      color="red" 
                      style={{ zIndex: 1, backgroundColor: 'rgba(255,255,255,0.7)' }}
                    />
                    <Image 
                      src={imgPreview.previewUrl} 
                      alt={`Nieuwe preview ${index + 1}`}
                      height={150} 
                      fit="contain" 
                      mb="xs"
                    />
                    <TextInput
                      label={`Alt Tekst Nieuwe Afb. ${index + 1}`}
                      name="newAltTexts" // Aparte naam!
                      placeholder="Beschrijvende alt-tekst" 
                      required 
                      value={imgPreview.altText} // Gebruik altText uit state
                      onChange={(event) => handleNewAltTextChange(index, event.currentTarget.value)}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>

          {/* --- Einde Afbeeldingen --- */}

          <Group justify="flex-end" mt="xl">
            <SubmitButton label={submitButtonLabel} />
          </Group>
        </Stack>
      </form>
    </AdminErrorBoundary>
  );
} 
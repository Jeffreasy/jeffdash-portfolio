'use client';

import React, { useState, useEffect, useCallback, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { 
  TextInput, 
  Textarea, 
  Switch, 
  Button, 
  Group, 
  Stack, 
  Alert, 
  Text, 
  FileInput, 
  SimpleGrid, 
  Image, 
  CloseButton, 
  Box, 
  Title,
  ThemeIcon,
  Badge,
  Card,
  LoadingOverlay,
  Divider,
} from '@mantine/core';
import { IconAlertCircle, IconUpload, IconDeviceFloppy, IconFolder, IconPhoto, IconX, IconCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const;

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

// Submit knop component dat rekening houdt met pending state
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
      <Button 
        type="submit" 
        loading={pending} 
        disabled={pending}
        leftSection={<IconDeviceFloppy size={18}/>}
        size="lg"
        variant="gradient"
        gradient={{ from: 'blue.6', to: 'cyan.5' }}
        fullWidth
        style={{
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          fontWeight: 600,
          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
          minHeight: '48px',
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
        {pending ? 'Bezig met opslaan...' : label}
      </Button>
    </motion.div>
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

  // Effect to show notifications based on form state
  useEffect(() => {
    try {
      if (state?.success === true) {
        notifications.show({
          title: 'Succes',
          message: state.message || 'Project succesvol opgeslagen!',
          color: 'green',
          icon: <IconCheck size={16} />,
          styles: {
            root: {
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              backdropFilter: 'blur(10px)',
              maxWidth: 'clamp(280px, 85vw, 400px)',
            },
            title: {
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            },
            description: {
              fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
            }
          },
        });
      } else if (state?.success === false && state.message) {
        notifications.show({
          title: 'Fout',
          message: state.message,
          color: 'red',
          icon: <IconAlertCircle />,
          styles: {
            root: {
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(10px)',
              maxWidth: 'clamp(280px, 85vw, 400px)',
            },
            title: {
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            },
            description: {
              fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
            }
          },
        });
      }
    } catch (err) {
      console.error('Error showing notification:', err);
    }
  }, [state]);

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

  // Mobile-optimized input styles
  const inputStyles = {
    label: {
      color: 'var(--mantine-color-gray-2)',
      fontWeight: 600,
      marginBottom: 'clamp(6px, 1.5vw, 8px)',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    },
    input: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'var(--mantine-color-gray-1)',
      backdropFilter: 'blur(10px)',
      borderRadius: 'clamp(6px, 1.5vw, 8px)',
      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
      padding: 'clamp(10px, 2.5vw, 12px)',
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
      fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
    },
    description: {
      color: 'var(--mantine-color-gray-4)',
      fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
      lineHeight: 1.4,
    }
  };

  return (
    <AdminErrorBoundary componentName="Project Form">
      <Box
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
          padding: 'clamp(12px, 3vw, 24px)',
        }}
      >
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 'clamp(150px, 25vw, 200px)',
          height: 'clamp(150px, 25vw, 200px)',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 'clamp(100px, 20vw, 150px)',
          height: 'clamp(100px, 20vw, 150px)',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <Box
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            padding: 'clamp(16px, 4vw, 24px)',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {/* Inner decorative element */}
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: 'clamp(80px, 15vw, 120px)',
            height: 'clamp(80px, 15vw, 120px)',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(25px)',
            pointerEvents: 'none',
          }} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <form action={formAction}>
              <LoadingOverlay 
                visible={useFormStatus().pending} 
                overlayProps={{ 
                  radius: "sm", 
                  blur: 2,
                  backgroundOpacity: 0.1,
                }}
                loaderProps={{
                  color: 'blue.4',
                  type: 'dots',
                  size: 'lg',
                }}
              />

              {/* Voeg verborgen veld toe voor project ID bij bewerken */}
              {project?.id && <input type="hidden" name="projectId" value={project.id} />}

              <Stack gap="xl">
                {/* Header Section */}
                <motion.div variants={inputVariants}>
                  <Box
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
                      border: '1px solid rgba(59, 130, 246, 0.1)',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      padding: 'clamp(16px, 4vw, 24px)',
                      marginBottom: 'clamp(12px, 3vw, 16px)',
                    }}
                  >
                    <Group gap="md" align="center" wrap="nowrap">
                      <ThemeIcon
                        size="xl"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                        style={{
                          width: 'clamp(48px, 8vw, 64px)',
                          height: 'clamp(48px, 8vw, 64px)',
                          flexShrink: 0,
                        }}
                      >
                        <IconFolder size={24} />
                      </ThemeIcon>
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Title 
                          order={2}
                          style={{
                            background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                            fontWeight: 800,
                            marginBottom: 'clamp(4px, 1vw, 8px)',
                            lineHeight: 1.2,
                            wordBreak: 'break-word',
                          }}
                        >
                          {project ? 'Project Bewerken' : 'Nieuw Project Aanmaken'}
                        </Title>
                        <Text 
                          c="gray.4" 
                          size="sm"
                          style={{
                            fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
                            lineHeight: 1.4,
                          }}
                        >
                          {project ? 'Wijzig de projectdetails en sla de wijzigingen op' : 'Vul alle vereiste velden in om een nieuw project toe te voegen'}
                        </Text>
                      </Box>
                      {project && (
                        <Badge
                          variant="light"
                          color={project.isFeatured ? 'blue' : 'gray'}
                          size="lg"
                          style={{
                            background: project.isFeatured 
                              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
                              : 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)',
                            border: `1px solid ${project.isFeatured 
                              ? 'rgba(59, 130, 246, 0.2)' 
                              : 'rgba(107, 114, 128, 0.2)'}`,
                            color: project.isFeatured 
                              ? 'var(--mantine-color-blue-4)' 
                              : 'var(--mantine-color-gray-4)',
                            fontWeight: 600,
                            fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                            padding: 'clamp(4px, 1vw, 8px) clamp(8px, 2vw, 12px)',
                            flexShrink: 0,
                          }}
                        >
                          {project.isFeatured ? '⭐ Featured' : 'Standaard'}
                        </Badge>
                      )}
                    </Group>
                  </Box>
                </motion.div>

                {/* Toon algemene foutmeldingen bovenaan */} 
                {!state.success && state.message && state.errors?.general && (
                  <motion.div variants={inputVariants}>
                    <Alert 
                      icon={<IconAlertCircle size="1rem" />} 
                      title="Validatiefout" 
                      color="red"
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
                          fontWeight: 600,
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        },
                        message: {
                          color: 'var(--mantine-color-red-3)',
                          fontSize: 'clamp(0.8rem, 2.2vw, 0.9rem)',
                        }
                      }}
                    >
                      {state.errors.general.join(', ')}
                    </Alert>
                  </motion.div>
                )}

                {/* Basic Information Section */}
                <motion.div variants={inputVariants}>
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      padding: 'clamp(16px, 4vw, 24px)',
                    }}
                  >
                    <Group gap="md" mb="lg" wrap="nowrap">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'green.6', to: 'teal.5' }}
                        style={{ flexShrink: 0 }}
                      >
                        <IconFolder size={16} />
                      </ThemeIcon>
                      <Text 
                        fw={700} 
                        size="lg"
                        style={{ 
                          color: 'var(--mantine-color-gray-1)',
                          WebkitFontSmoothing: 'antialiased',
                          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                        }}
                      >
                        Basis Informatie
                      </Text>
                    </Group>

                    <Stack gap="lg">
                      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                        <TextInput
                          label="Project Titel"
                          name="title"
                          placeholder="Bijv. E-commerce Platform"
                          required
                          error={state.errors?.title?.join(', ')}
                          defaultValue={project?.title}
                          size="md"
                          styles={{
                            label: inputStyles.label,
                            input: {
                              ...inputStyles.input,
                              minHeight: '44px',
                            },
                            error: inputStyles.error,
                            description: inputStyles.description,
                          }}
                        />

                        <TextInput
                          label="URL Slug"
                          name="slug"
                          placeholder="bijv-ecommerce-platform"
                          required
                          error={state.errors?.slug?.join(', ')}
                          defaultValue={project?.slug}
                          size="md"
                          styles={{
                            label: inputStyles.label,
                            input: {
                              ...inputStyles.input,
                              minHeight: '44px',
                            },
                            error: inputStyles.error,
                            description: inputStyles.description,
                          }}
                          description="URL-vriendelijke versie van de titel (alleen letters, cijfers en koppeltekens)"
                        />
                      </SimpleGrid>

                      <Textarea
                        label="Korte Beschrijving"
                        name="shortDescription"
                        placeholder="Een beknopte samenvatting van het project in 1-2 zinnen..."
                        required
                        error={state.errors?.shortDescription?.join(', ')}
                        defaultValue={project?.shortDescription || ''}
                        minRows={3}
                        maxRows={5}
                        autosize
                        size="md"
                        styles={inputStyles}
                        description="Deze beschrijving wordt getoond in projectoverzichten"
                      />

                      <TextInput
                        label="Categorie"
                        name="category"
                        placeholder="Web Development, Mobile App, Design, etc."
                        error={state.errors?.category?.join(', ')}
                        defaultValue={project?.category || ''}
                        size="md"
                        styles={{
                          label: inputStyles.label,
                          input: {
                            ...inputStyles.input,
                            minHeight: '44px',
                          },
                          error: inputStyles.error,
                          description: inputStyles.description,
                        }}
                        description="Categoriseer je project voor betere organisatie"
                      />
                    </Stack>
                  </Card>
                </motion.div>

                {/* Detailed Content Section */}
                <motion.div variants={inputVariants}>
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      padding: 'clamp(16px, 4vw, 24px)',
                    }}
                  >
                    <Group gap="md" mb="lg" wrap="nowrap">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'violet.6', to: 'purple.5' }}
                        style={{ flexShrink: 0 }}
                      >
                        <IconPhoto size={16} />
                      </ThemeIcon>
                      <Text 
                        fw={700} 
                        size="lg"
                        style={{ 
                          color: 'var(--mantine-color-gray-1)',
                          WebkitFontSmoothing: 'antialiased',
                          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                        }}
                      >
                        Gedetailleerde Inhoud
                      </Text>
                    </Group>

                    <Stack gap="lg">
                      <Textarea
                        label="Uitgebreide Projectbeschrijving"
                        name="detailedContent"
                        placeholder="Beschrijf het project uitgebreid. Je kunt Markdown gebruiken voor opmaak:

## Overzicht
Een korte introductie van het project...

## Functionaliteiten
- Functie 1
- Functie 2
- Functie 3

## Technische Details
Beschrijf de technische aspecten..."
                        required
                        error={state.errors?.detailedContent?.join(', ')}
                        defaultValue={project?.detailedContent || ''}
                        minRows={8}
                        maxRows={15}
                        autosize
                        size="md"
                        styles={inputStyles}
                        description="Gebruik Markdown voor opmaak (## voor headers, - voor lijsten, **bold**, *italic*)"
                      />

                      <Textarea
                        label="Gebruikte Technologieën"
                        name="technologies"
                        placeholder="React, Next.js, TypeScript, Tailwind CSS, Supabase, Vercel"
                        error={state.errors?.technologies?.join(', ')}
                        defaultValue={project?.technologies || ''}
                        minRows={2}
                        maxRows={4}
                        autosize
                        size="md"
                        styles={inputStyles}
                        description="Komma-gescheiden lijst van alle gebruikte technologieën en tools"
                      />
                    </Stack>
                  </Card>
                </motion.div>

                {/* Links Section */}
                <motion.div variants={inputVariants}>
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      padding: 'clamp(16px, 4vw, 24px)',
                    }}
                  >
                    <Group gap="md" mb="lg" wrap="nowrap">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'orange.6', to: 'red.5' }}
                        style={{ flexShrink: 0 }}
                      >
                        <IconUpload size={16} />
                      </ThemeIcon>
                      <Text 
                        fw={700} 
                        size="lg"
                        style={{ 
                          color: 'var(--mantine-color-gray-1)',
                          WebkitFontSmoothing: 'antialiased',
                          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                        }}
                      >
                        Project Links
                      </Text>
                    </Group>

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                      <TextInput
                        label="GitHub Repository"
                        name="githubUrl"
                        placeholder="https://github.com/username/repository"
                        error={state.errors?.githubUrl?.join(', ')}
                        defaultValue={project?.githubUrl || ''}
                        size="md"
                        styles={{
                          label: inputStyles.label,
                          input: {
                            ...inputStyles.input,
                            minHeight: '44px',
                          },
                          error: inputStyles.error,
                          description: inputStyles.description,
                        }}
                        description="Link naar de broncode (optioneel)"
                      />

                      <TextInput
                        label="Live Demo URL"
                        name="liveUrl"
                        placeholder="https://project-demo.com"
                        error={state.errors?.liveUrl?.join(', ')}
                        defaultValue={project?.liveUrl || ''}
                        size="md"
                        styles={{
                          label: inputStyles.label,
                          input: {
                            ...inputStyles.input,
                            minHeight: '44px',
                          },
                          error: inputStyles.error,
                          description: inputStyles.description,
                        }}
                        description="Link naar de werkende versie (optioneel)"
                      />
                    </SimpleGrid>
                  </Card>
                </motion.div>

                {/* Settings Section */}
                <motion.div variants={inputVariants}>
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      padding: 'clamp(16px, 4vw, 24px)',
                    }}
                  >
                    <Group gap="md" mb="lg" wrap="nowrap">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'yellow.6', to: 'orange.5' }}
                        style={{ flexShrink: 0 }}
                      >
                        <IconDeviceFloppy size={16} />
                      </ThemeIcon>
                      <Text 
                        fw={700} 
                        size="lg"
                        style={{ 
                          color: 'var(--mantine-color-gray-1)',
                          WebkitFontSmoothing: 'antialiased',
                          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                        }}
                      >
                        Project Instellingen
                      </Text>
                    </Group>

                    <Box
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.1)',
                        borderRadius: 'clamp(6px, 1.5vw, 8px)',
                        padding: 'clamp(12px, 3vw, 16px)',
                      }}
                    >
                      <Switch
                        label="Featured Project"
                        name="isFeatured"
                        defaultChecked={project?.isFeatured || false}
                        size="md"
                        color="blue"
                        styles={{
                          label: {
                            color: 'var(--mantine-color-gray-2)',
                            fontWeight: 600,
                            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                          },
                          description: {
                            color: 'var(--mantine-color-gray-4)',
                            fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                            marginTop: 'clamp(4px, 1vw, 6px)',
                            lineHeight: 1.4,
                          },
                          track: {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            minHeight: '24px',
                            minWidth: '44px',
                          },
                          thumb: {
                            backgroundColor: 'var(--mantine-color-gray-1)',
                            borderColor: 'var(--mantine-color-gray-3)',
                          },
                        }}
                        description="Featured projecten worden prominenter getoond op de homepage en in het portfolio overzicht"
                      />
                    </Box>
                  </Card>
                </motion.div>

                {/* Images Section */}
                <motion.div variants={inputVariants}>
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      padding: 'clamp(16px, 4vw, 24px)',
                    }}
                  >
                    <Group gap="md" mb="lg" wrap="nowrap">
                      <ThemeIcon
                        size="md"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'pink.6', to: 'violet.5' }}
                        style={{ flexShrink: 0 }}
                      >
                        <IconPhoto size={16} />
                      </ThemeIcon>
                      <Text 
                        fw={700} 
                        size="lg"
                        style={{ 
                          color: 'var(--mantine-color-gray-1)',
                          WebkitFontSmoothing: 'antialiased',
                          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                        }}
                      >
                        Project Afbeeldingen
                      </Text>
                    </Group>

                    <FileInput
                      label="Nieuwe afbeeldingen toevoegen"
                      placeholder="Klik om afbeeldingen te selecteren..."
                      leftSection={<IconUpload size={16} />}
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      size="md"
                      styles={inputStyles}
                      description="Selecteer meerdere afbeeldingen tegelijk. Ondersteunde formaten: JPG, PNG, WebP"
                    />

                    {/* Bestaande afbeeldingen */}
                    {existingImagesData.length > 0 && (
                      <Box mt="xl">
                        <Text 
                          size="sm" 
                          fw={600} 
                          mb="md" 
                          c="gray.2"
                          style={{
                            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                          }}
                        >
                          Huidige afbeeldingen ({existingImagesData.length}):
                        </Text>
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                          {existingImagesData.map((img, index) => (
                            <Card
                              key={img.id}
                              style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                                padding: 'clamp(8px, 2vw, 12px)',
                              }}
                            >
                              <Image
                                src={img.url}
                                alt={img.altText}
                                height={140}
                                fit="cover"
                                radius="md"
                                mb="xs"
                                style={{
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                              />
                              <TextInput
                                placeholder="Beschrijving van de afbeelding..."
                                value={img.altText}
                                onChange={(e) => handleExistingAltTextChange(index, e.target.value)}
                                size="xs"
                                styles={{
                                  label: inputStyles.label,
                                  input: {
                                    ...inputStyles.input,
                                    minHeight: '36px',
                                  },
                                  error: inputStyles.error,
                                  description: inputStyles.description,
                                }}
                              />
                              <input type="hidden" name={`existingImages[${index}][id]`} value={img.id} />
                              <input type="hidden" name={`existingImages[${index}][altText]`} value={img.altText} />
                            </Card>
                          ))}
                        </SimpleGrid>
                      </Box>
                    )}

                    {/* Nieuwe afbeelding previews */}
                    {newImagePreviews.length > 0 && (
                      <Box mt="xl">
                        <Text 
                          size="sm" 
                          fw={600} 
                          mb="md" 
                          c="gray.2"
                          style={{
                            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                          }}
                        >
                          Nieuwe afbeeldingen ({newImagePreviews.length}):
                        </Text>
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                          {newImagePreviews.map((preview, index) => (
                            <Card
                              key={index}
                              style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                                position: 'relative',
                                padding: 'clamp(8px, 2vw, 12px)',
                              }}
                            >
                              <CloseButton
                                onClick={() => removeNewImagePreview(index)}
                                style={{
                                  position: 'absolute',
                                  top: 'clamp(8px, 2vw, 12px)',
                                  right: 'clamp(8px, 2vw, 12px)',
                                  zIndex: 2,
                                  background: 'rgba(0, 0, 0, 0.7)',
                                  color: 'white',
                                  backdropFilter: 'blur(10px)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  minHeight: '32px',
                                  minWidth: '32px',
                                }}
                                size="sm"
                              />
                              <Image
                                src={preview.previewUrl}
                                alt="Preview"
                                height={140}
                                fit="cover"
                                radius="md"
                                mb="xs"
                                style={{
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                              />
                              <TextInput
                                placeholder="Beschrijving van de afbeelding..."
                                value={preview.altText}
                                onChange={(e) => handleNewAltTextChange(index, e.target.value)}
                                size="xs"
                                styles={{
                                  label: inputStyles.label,
                                  input: {
                                    ...inputStyles.input,
                                    minHeight: '36px',
                                  },
                                  error: inputStyles.error,
                                  description: inputStyles.description,
                                }}
                              />
                            </Card>
                          ))}
                        </SimpleGrid>
                      </Box>
                    )}
                  </Card>
                </motion.div>

                {/* Submit Section */}
                <motion.div variants={inputVariants}>
                  <Divider 
                    my="xl" 
                    style={{ 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      margin: 'clamp(16px, 4vw, 24px) 0',
                    }} 
                  />
                  <SubmitButton label={submitButtonLabel} />
                </motion.div>
              </Stack>
            </form>
          </motion.div>
        </Box>
      </Box>
    </AdminErrorBoundary>
  );
} 
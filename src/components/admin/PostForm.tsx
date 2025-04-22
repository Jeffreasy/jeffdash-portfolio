'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { 
  TextInput, 
  Textarea, 
  Button, 
  Stack, 
  Checkbox, 
  Group, 
  Paper, 
  Title, 
  Alert,
  TagsInput, // For tags
  Select,   // For category (optional)
  LoadingOverlay,
} from '@mantine/core';
import { IconAlertCircle, IconDeviceFloppy } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { PostFormState, FullAdminPostType } from '@/lib/actions/blog'; // Import types
import { useRouter } from 'next/navigation'; // Import useRouter

// Type for the form action prop
type PostAction = (prevState: PostFormState | undefined, formData: FormData) => Promise<PostFormState>;

// Props for the PostForm component
interface PostFormProps {
  action: PostAction;
  initialData?: FullAdminPostType | null; // Optional initial data for editing
  formTitle: string;
}

// SubmitButton component to show loading state
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      loading={pending} 
      leftSection={<IconDeviceFloppy size={14}/>}
    >
      {isEditing ? 'Wijzigingen Opslaan' : 'Post Aanmaken'}
    </Button>
  );
}

export default function PostForm({ action, initialData, formTitle }: PostFormProps) {
  const router = useRouter(); // Initialize router
  const isEditing = !!initialData;

  // Initialize form state using useActionState
  const [state, formAction] = useActionState(action, {
    success: false,
    message: undefined,
    errors: undefined,
    postSlug: initialData?.slug ?? null, // Keep track of slug, especially for updates
  });

  // State for tags (controlled component)
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  // Effect to show notifications based on form state
  useEffect(() => {
    if (state?.success === true) {
      // Success notification (redirection happens in action)
      notifications.show({
        title: 'Succes',
        message: state.message || (isEditing ? 'Post succesvol bijgewerkt!' : 'Post succesvol aangemaakt!'),
        color: 'green',
      });
      // Note: Redirect is handled by the server action itself
      // router.push('/admin_area/posts'); // Avoid client-side redirect if server action does it
    } else if (state?.success === false && state.message) {
      // Error notification
      notifications.show({
        title: 'Fout',
        message: state.message,
        color: 'red',
        icon: <IconAlertCircle />,
      });
    }
  }, [state, isEditing, router]);

  // --- Logica om slug automatisch te genereren (optioneel) ---
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.slug);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.currentTarget.value;
    setTitle(newTitle);
    if (!isSlugManuallyEdited) {
      // Simple slug generation: lowercase, replace spaces with hyphens, remove special chars
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
        .substring(0, 50); // Limit length
      setSlug(generatedSlug);
    }
  };

  const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(event.currentTarget.value);
    setIsSlugManuallyEdited(true); // Mark slug as manually edited
  };
  // --- Einde slug generatie logica ---

  return (
    <Paper shadow="md" p="xl" withBorder>
      <form action={formAction}>
       <LoadingOverlay visible={useFormStatus().pending} overlayProps={{ radius: "sm", blur: 2 }} />
        <Stack gap="lg">
          <Title order={3}>{formTitle}</Title>

          {/* Hidden input for postId when editing */}
          {isEditing && initialData?.id && (
            <input type="hidden" name="postId" value={initialData.id} />
          )}

          {/* General Error Message */}
          {state?.errors?.general && (
            <Alert title="Fout" color="red" icon={<IconAlertCircle />}>
              {state.errors.general.join(', ')}
            </Alert>
          )}

          <TextInput
            label="Titel"
            name="title"
            required
            value={title} // Controlled component for slug generation
            onChange={handleTitleChange}
            error={state?.errors?.title?.join(', ')}
          />

          <TextInput
            label="Slug"
            name="slug"
            required
            placeholder="wordt-automatisch-gegenereerd-of-pas-aan"
            value={slug} // Controlled component
            onChange={handleSlugChange}
            error={state?.errors?.slug?.join(', ')}
            description="Unieke identifier voor de URL. Alleen kleine letters, cijfers en koppeltekens."
          />

          {/* TODO: Add a Rich Text Editor (e.g., Mantine RTE or Tiptap) instead of simple Textarea */}
          <Textarea
            label="Inhoud (Markdown wordt ondersteund)"
            name="content"
            required
            rows={15}
            defaultValue={initialData?.content || ''}
            error={state?.errors?.content?.join(', ')}
            description="Gebruik Markdown voor opmaak."
          />

          <Textarea
            label="Samenvatting (Excerpt)"
            name="excerpt"
            rows={3}
            defaultValue={initialData?.excerpt || ''}
            error={state?.errors?.excerpt?.join(', ')}
            description="Korte samenvatting voor de bloglijst."
          />
          
          {/* --- Afbeeldingen --- */}
          <TextInput
            label="URL Uitgelichte Afbeelding"
            name="featuredImageUrl"
            type="url"
            defaultValue={initialData?.featuredImageUrl || ''}
            error={state?.errors?.featuredImageUrl?.join(', ')}
            placeholder="https://..."
          />
          
          <TextInput
            label="Alt-tekst Uitgelichte Afbeelding"
            name="featuredImageAltText"
            defaultValue={initialData?.featuredImageAltText || ''}
            error={state?.errors?.featuredImageAltText?.join(', ')}
            description="Belangrijk voor SEO en toegankelijkheid."
          />
          
          {/* --- Taxonomie --- */}
          <TagsInput
             label="Tags"
             name="tags" // Name is needed for FormData
             value={tags} // Controlled component
             onChange={setTags} // Update state on change
             placeholder="Voeg tags toe (bv. react, nextjs)"
             clearable
             error={state?.errors?.tags?.join(', ')}
             description="Scheid tags met een komma of Enter."
          />
          {/* Hidden input to pass tags array correctly */} 
          <input type="hidden" name="tags" value={tags.join(',')} /> 


          {/* Voorbeeld Categorie Select - Vervang met echte categorieën */}
          <Select
             label="Categorie"
             name="category"
             placeholder="Kies een categorie"
             data={['Web Development', 'Tutorial', 'Nieuws', 'Opinie']} // Vervang met dynamische lijst indien nodig
             defaultValue={initialData?.category || ''}
             error={state?.errors?.category?.join(', ')}
             clearable
           />

          {/* --- Publicatie & SEO --- */}
          <Checkbox
            label="Gepubliceerd"
            name="published"
            defaultChecked={initialData?.published || false}
            error={state?.errors?.published?.join(', ')}
          />

          <TextInput
            label="Meta Titel (SEO)"
            name="metaTitle"
            defaultValue={initialData?.metaTitle || ''}
            error={state?.errors?.metaTitle?.join(', ')}
            description="Optioneel. Indien leeg, wordt de post titel gebruikt."
          />

          <Textarea
            label="Meta Beschrijving (SEO)"
            name="metaDescription"
            rows={2}
            defaultValue={initialData?.metaDescription || ''}
            error={state?.errors?.metaDescription?.join(', ')}
            description="Optioneel. Indien leeg, wordt de samenvatting gebruikt."
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={() => router.back()}>Annuleren</Button>
            <SubmitButton isEditing={isEditing} />
          </Group>
        </Stack>
      </form>
    </Paper>
  );
} 
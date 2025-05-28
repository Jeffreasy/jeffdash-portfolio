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
  Box,
  ThemeIcon,
} from '@mantine/core';
import { IconAlertCircle, IconDeviceFloppy, IconFileText } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { notifications } from '@mantine/notifications';
import { PostFormState, FullAdminPostType } from '@/lib/actions/blog'; // Import types
import { useRouter } from 'next/navigation'; // Import useRouter
import AdminErrorBoundary from './AdminErrorBoundary';

// Type for the form action prop
type PostAction = (prevState: PostFormState | undefined, formData: FormData) => Promise<PostFormState>;

// Props for the PostForm component
interface PostFormProps {
  action: PostAction;
  initialData?: FullAdminPostType | null; // Optional initial data for editing
  formTitle: string;
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

// SubmitButton component to show loading state
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
      <Button 
        type="submit" 
        loading={pending} 
        leftSection={<IconDeviceFloppy size={18}/>}
        size="lg"
        variant="gradient"
        gradient={{ from: 'violet.6', to: 'purple.5' }}
        fullWidth
        style={{
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          fontWeight: 600,
          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
          minHeight: '48px',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          padding: 'clamp(12px, 3vw, 16px)',
        }}
        styles={{
          root: {
            '&:hover': {
              boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
          },
        }}
      >
        {pending 
          ? (isEditing ? 'Bezig met opslaan...' : 'Bezig met aanmaken...') 
          : (isEditing ? 'Wijzigingen Opslaan' : 'Post Aanmaken')
        }
      </Button>
    </motion.div>
  );
}

export default function PostForm({ action, initialData, formTitle }: PostFormProps) {
  // Validate props
  if (!action || typeof action !== 'function') {
    throw new Error('Invalid action prop provided to PostForm');
  }

  if (!formTitle) {
    throw new Error('formTitle is required for PostForm');
  }

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
  const [tags, setTags] = useState<string[]>(() => {
    try {
      return initialData?.tags || [];
    } catch (err) {
      console.error('Error initializing tags:', err);
      return [];
    }
  });

  // Effect to show notifications based on form state
  useEffect(() => {
    try {
      if (state?.success === true) {
        // Success notification (redirection happens in action)
        notifications.show({
          title: 'Succes',
          message: state.message || (isEditing ? 'Post succesvol bijgewerkt!' : 'Post succesvol aangemaakt!'),
          color: 'green',
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
        // Note: Redirect is handled by the server action itself
        // router.push('/admin_area/posts'); // Avoid client-side redirect if server action does it
      } else if (state?.success === false && state.message) {
        // Error notification
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
      notifications.show({
        title: 'Fout',
        message: 'Er is een onverwachte fout opgetreden.',
        color: 'red',
        icon: <IconAlertCircle />,
      });
    }
  }, [state, isEditing]);

  // --- Logica om slug automatisch te genereren (optioneel) ---
  const [title, setTitle] = useState(() => {
    try {
      return initialData?.title || '';
    } catch (err) {
      console.error('Error initializing title:', err);
      return '';
    }
  });
  const [slug, setSlug] = useState(() => {
    try {
      return initialData?.slug || '';
    } catch (err) {
      console.error('Error initializing slug:', err);
      return '';
    }
  });
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.slug);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
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
    } catch (err) {
      console.error('Error handling title change:', err);
      notifications.show({
        title: 'Fout',
        message: 'Er is een fout opgetreden bij het verwerken van de titel.',
        color: 'red',
        icon: <IconAlertCircle />,
      });
    }
  };

  const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSlug(event.currentTarget.value);
      setIsSlugManuallyEdited(true); // Mark slug as manually edited
    } catch (err) {
      console.error('Error handling slug change:', err);
      notifications.show({
        title: 'Fout',
        message: 'Er is een fout opgetreden bij het verwerken van de slug.',
        color: 'red',
        icon: <IconAlertCircle />,
      });
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    try {
      setTags(newTags);
    } catch (err) {
      console.error('Error handling tags change:', err);
      notifications.show({
        title: 'Fout',
        message: 'Er is een fout opgetreden bij het verwerken van de tags.',
        color: 'red',
        icon: <IconAlertCircle />,
      });
    }
  };
  // --- Einde slug generatie logica ---

  const inputStyles = {
    label: {
      color: 'var(--mantine-color-gray-2)',
      fontWeight: 500,
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
        borderColor: 'rgba(139, 92, 246, 0.5)',
        boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
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
    <AdminErrorBoundary componentName="Post Form">
      <Box
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          padding: 'clamp(16px, 4vw, 24px)',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {/* Decorative element */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: 'clamp(80px, 15vw, 100px)',
          height: 'clamp(80px, 15vw, 100px)',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }} />

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
                color: 'violet.4',
                type: 'dots',
                size: 'lg',
              }}
            />
            <Stack gap="lg">
              <motion.div variants={inputVariants}>
                <Group gap="md" mb="lg" wrap="nowrap">
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: 'violet.6', to: 'purple.5' }}
                    style={{
                      width: 'clamp(48px, 8vw, 64px)',
                      height: 'clamp(48px, 8vw, 64px)',
                      flexShrink: 0,
                    }}
                  >
                    <IconFileText size={20} />
                  </ThemeIcon>
                  <Title 
                    order={2}
                    style={{
                      background: 'linear-gradient(135deg, var(--mantine-color-violet-4), var(--mantine-color-purple-4))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      wordBreak: 'break-word',
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    {formTitle}
                  </Title>
                </Group>
              </motion.div>

              {/* Hidden input for postId when editing */}
              {isEditing && initialData?.id && (
                <input type="hidden" name="postId" value={initialData.id} />
              )}

              {/* General Error Message */}
              {state?.errors?.general && (
                <motion.div variants={inputVariants}>
                  <Alert 
                    title="Fout" 
                    color="red" 
                    icon={<IconAlertCircle />}
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 'clamp(6px, 1.5vw, 8px)',
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
                    {state.errors.general.join(', ')}
                  </Alert>
                </motion.div>
              )}

              {/* Title Field */}
              <motion.div variants={inputVariants}>
                <TextInput
                  label="Titel"
                  name="title"
                  placeholder="Voer de titel van je post in..."
                  value={title}
                  onChange={handleTitleChange}
                  error={state?.errors?.title?.[0]}
                  required
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
              </motion.div>

              {/* Slug Field */}
              <motion.div variants={inputVariants}>
                <TextInput
                  label="Slug (URL)"
                  name="slug"
                  placeholder="url-vriendelijke-slug"
                  value={slug}
                  onChange={handleSlugChange}
                  error={state?.errors?.slug?.[0]}
                  required
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
                  description="De URL-vriendelijke versie van de titel. Wordt automatisch gegenereerd maar kan handmatig aangepast worden."
                />
              </motion.div>

              {/* Excerpt Field */}
              <motion.div variants={inputVariants}>
                <Textarea
                  label="Excerpt (Samenvatting)"
                  name="excerpt"
                  placeholder="Korte samenvatting van je post..."
                  defaultValue={initialData?.excerpt || ''}
                  error={state?.errors?.excerpt?.[0]}
                  minRows={3}
                  maxRows={6}
                  autosize
                  size="md"
                  styles={inputStyles}
                  description="Een korte samenvatting die wordt getoond in overzichten."
                />
              </motion.div>

              {/* Content Field */}
              <motion.div variants={inputVariants}>
                <Textarea
                  label="Content (Markdown)"
                  name="content"
                  placeholder="Schrijf je post content in Markdown..."
                  defaultValue={initialData?.content || ''}
                  error={state?.errors?.content?.[0]}
                  required
                  minRows={8}
                  maxRows={20}
                  autosize
                  size="md"
                  styles={inputStyles}
                  description="De volledige inhoud van je post in Markdown formaat."
                />
              </motion.div>

              {/* Category Field */}
              <motion.div variants={inputVariants}>
                <Select
                  label="Categorie"
                  name="category"
                  placeholder="Selecteer een categorie..."
                  defaultValue={initialData?.category || ''}
                  error={state?.errors?.category?.[0]}
                  data={[
                    { value: 'tech', label: 'Technologie' },
                    { value: 'design', label: 'Design' },
                    { value: 'development', label: 'Development' },
                    { value: 'tutorial', label: 'Tutorial' },
                    { value: 'personal', label: 'Persoonlijk' },
                  ]}
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
                  clearable
                />
              </motion.div>

              {/* Tags Field */}
              <motion.div variants={inputVariants}>
                <TagsInput
                  label="Tags"
                  name="tags"
                  placeholder="Voeg tags toe..."
                  value={tags}
                  onChange={handleTagsChange}
                  error={state?.errors?.tags?.[0]}
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
                  description="Druk op Enter om een tag toe te voegen."
                />
                {/* Hidden input to submit tags */}
                <input type="hidden" name="tagsJson" value={JSON.stringify(tags)} />
              </motion.div>

              {/* Published Checkbox */}
              <motion.div variants={inputVariants}>
                <Checkbox
                  label="Publiceren"
                  name="published"
                  defaultChecked={initialData?.published || false}
                  size="md"
                  styles={{
                    label: {
                      color: 'var(--mantine-color-gray-2)',
                      fontWeight: 500,
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      lineHeight: 1.4,
                    },
                    input: {
                      minHeight: '20px',
                      minWidth: '20px',
                      '&:checked': {
                        backgroundColor: 'var(--mantine-color-violet-6)',
                        borderColor: 'var(--mantine-color-violet-6)',
                      },
                    },
                    body: {
                      alignItems: 'center',
                      gap: 'clamp(8px, 2vw, 12px)',
                    },
                    description: {
                      color: 'var(--mantine-color-gray-4)',
                      fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                      lineHeight: 1.4,
                      marginTop: 'clamp(4px, 1vw, 6px)',
                    },
                  }}
                  description="Vink aan om de post direct te publiceren."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={inputVariants}>
                <SubmitButton isEditing={isEditing} />
              </motion.div>
            </Stack>
          </form>
        </motion.div>
      </Box>
    </AdminErrorBoundary>
  );
} 
import { Suspense } from 'react';
import { getAboutContentForAdmin } from '@/lib/actions/siteContent';
import { Container, Title, Stack, Box, Text, ThemeIcon, Group, Loader, Center } from '@mantine/core';
import { IconUser, IconEdit } from '@tabler/icons-react';
import { redirect } from 'next/navigation';
import { validateAdminSession } from '@/lib/actions/auth';
import AboutForm from '@/components/admin/AboutForm';

// Force dynamic rendering for admin pages that use cookies/auth
export const dynamic = 'force-dynamic';

function AboutAdminLoading() {
  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 24px)',
      }}
    >
      <Container size="lg">
        <Stack gap="xl" align="center">
          <Title 
            order={1}
            ta="center"
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 900,
            }}
          >
            About Content Beheer
          </Title>
          
          <Box
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              padding: 'clamp(16px, 4vw, 24px)',
              position: 'relative',
              minHeight: 'clamp(300px, 50vh, 400px)',
              width: '100%',
              maxWidth: 'clamp(300px, 90vw, 600px)',
            }}
          >
            <Center h="100%">
              <Stack align="center" gap="md">
                <Loader size="lg" color="blue.4" type="dots" />
                <Text 
                  c="gray.4" 
                  ta="center"
                  style={{
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  }}
                >
                  About content laden...
                </Text>
              </Stack>
            </Center>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

async function AboutAdminContent() {
  try {
    await validateAdminSession();
    const aboutContent = await getAboutContentForAdmin();
    
    return (
      <Box
        style={{
          position: 'relative',
          minHeight: '100%',
          width: '100%',
        }}
      >
        {/* Subtle background elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 'clamp(150px, 25vw, 200px)',
          height: 'clamp(150px, 25vw, 200px)',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <Container 
          size="lg" 
          style={{ 
            position: 'relative', 
            zIndex: 1,
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <Stack gap="xl">
            {/* Header */}
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Box style={{ flex: 1, minWidth: '250px' }}>
                <Title 
                  order={1}
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontWeight: 900,
                    marginBottom: 'clamp(8px, 2vw, 12px)',
                  }}
                >
                  About Content Beheer
                </Title>
                <Text 
                  size="lg" 
                  c="gray.3"
                  style={{
                    fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                    lineHeight: 1.5,
                  }}
                >
                  Bewerk je persoonlijke informatie en about sectie
                </Text>
              </Box>
              
              <ThemeIcon
                size="xl"
                radius="md"
                variant="gradient"
                gradient={{ from: 'blue.6', to: 'cyan.5' }}
                visibleFrom="sm"
                style={{
                  minHeight: '48px',
                  minWidth: '48px',
                }}
              >
                <IconUser size={24} />
              </ThemeIcon>
            </Group>
            
            {/* About Form Card */}
            <Box
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'clamp(8px, 2vw, 12px)',
                padding: 'clamp(16px, 4vw, 24px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative element */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: 'clamp(60px, 15vw, 100px)',
                height: 'clamp(60px, 15vw, 100px)',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }} />

              <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
                <Group gap="md" wrap="wrap">
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: 'blue.6', to: 'cyan.5' }}
                    style={{
                      minHeight: '44px',
                      minWidth: '44px',
                    }}
                  >
                    <IconEdit size={20} />
                  </ThemeIcon>
                  <Box style={{ flex: 1, minWidth: '200px' }}>
                    <Title 
                      order={2} 
                      c="gray.1" 
                      size="h3"
                      style={{
                        fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                        marginBottom: 'clamp(4px, 1vw, 8px)',
                      }}
                    >
                      Bewerk About Pagina
                    </Title>
                    <Text 
                      size="sm" 
                      c="gray.4"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.2vw, 0.875rem)',
                        lineHeight: 1.4,
                      }}
                    >
                      Update je persoonlijke informatie en vaardigheden
                    </Text>
                  </Box>
                </Group>
                
                <AboutForm initialData={aboutContent} />
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  } catch (error: any) {
    if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
      redirect('/admin_area/login');
    }
    throw error;
  }
}

export default function AboutAdminPage() {
  return (
    <Suspense fallback={<AboutAdminLoading />}>
      <AboutAdminContent />
    </Suspense>
  );
} 
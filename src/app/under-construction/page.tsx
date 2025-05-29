'use client';

import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Box, Group, ThemeIcon, Stack, Card } from '@mantine/core';
import { IconHammer, IconRocket, IconSparkles, IconClock, IconMail } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Enhanced animation variants with consistent easing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const floatingAnimation = {
  y: [-8, 8, -8],
  rotate: [0, 3, -3, 0],
  transition: {
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

interface SiteSettings {
  maintenance_message?: string;
  maintenance_contact_email?: string;
  site_name?: string;
}

export default function UnderConstructionPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-status');
        if (response.ok) {
          // Try to fetch additional settings from admin API (will fail if not admin, that's ok)
          try {
            const adminResponse = await fetch('/api/admin/site-settings');
            if (adminResponse.ok) {
              const adminData = await adminResponse.json();
              const settingsMap: SiteSettings = {};
              adminData.settings?.forEach((setting: any) => {
                settingsMap[setting.key as keyof SiteSettings] = setting.value;
              });
              setSettings(settingsMap);
            }
          } catch (error) {
            // Not admin or error, use defaults
            console.log('Using default settings');
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Enhanced security measures during maintenance
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Default values with better fallbacks
  const maintenanceMessage = settings.maintenance_message || 
    'We werken hard aan het verbeteren van je ervaring. De website komt binnenkort terug online met geweldige nieuwe features!';
  const contactEmail = settings.maintenance_contact_email || 'contact@jeffdash.com';
  const siteName = settings.site_name || 'Jeffrey Lavente Portfolio';

  return (
    <>
      <Box
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          maxWidth: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          overflowY: 'auto',
          background: `
            linear-gradient(135deg, 
              var(--mantine-color-dark-8) 0%, 
              var(--mantine-color-dark-7) 50%,
              var(--mantine-color-dark-8) 100%
            )
          `,
          userSelect: 'none',
          paddingTop: 'clamp(20px, 5vh, 40px)',
          paddingBottom: 'clamp(20px, 5vh, 40px)',
          paddingLeft: 'clamp(16px, 4vw, 32px)',
          paddingRight: 'clamp(16px, 4vw, 32px)',
        }}
      >
        {/* Enhanced animated background elements - constrained within viewport */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 'clamp(200px, 25vw, 350px)',
            height: 'clamp(200px, 25vw, 350px)',
            background: `
              radial-gradient(circle, 
                rgba(59, 130, 246, 0.12) 0%, 
                rgba(59, 130, 246, 0.06) 40%,
                transparent 70%
              )
            `,
            borderRadius: '50%',
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '5%',
            width: 'clamp(180px, 22vw, 300px)',
            height: 'clamp(180px, 22vw, 300px)',
            background: `
              radial-gradient(circle, 
                rgba(6, 182, 212, 0.12) 0%, 
                rgba(6, 182, 212, 0.06) 40%,
                transparent 70%
              )
            `,
            borderRadius: '50%',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Additional decorative elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '60%',
            left: '75%',
            width: 'clamp(120px, 15vw, 200px)',
            height: 'clamp(120px, 15vw, 200px)',
            background: `
              radial-gradient(circle, 
                rgba(139, 92, 246, 0.08) 0%, 
                transparent 60%
              )
            `,
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
          animate={{
            x: [0, -15, 0],
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
        />

        <Container 
          size="lg" 
          style={{ 
            position: 'relative', 
            zIndex: 1,
            width: '100%',
            maxWidth: '100%',
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Stack gap={clamp(24, 4, 36)} align="center" ta="center">
              {/* Logo with professional styling */}
              <motion.div variants={itemVariants}>
                <motion.div 
                  animate={{
                    y: [-4, 4, -4],
                    rotate: [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    filter: 'drop-shadow(0 20px 40px rgba(59, 130, 246, 0.25))',
                  }}
                >
                  <Box
                    style={{
                      position: 'relative',
                      width: 'clamp(120px, 20vw, 180px)',
                      height: 'clamp(120px, 20vw, 180px)',
                      borderRadius: '50%',
                      background: `
                        linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.08) 0%, 
                          rgba(255, 255, 255, 0.03) 100%
                        )
                      `,
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(59, 130, 246, 0.2)',
                      boxShadow: `
                        0 25px 80px rgba(59, 130, 246, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src="/logo.png"
                      alt="Jeffrey Lavente Portfolio Logo"
                      width={180}
                      height={180}
                      style={{
                        width: 'clamp(80px, 15vw, 120px)',
                        height: 'clamp(80px, 15vw, 120px)',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                      }}
                      priority
                      onError={(e) => {
                        // Fallback to text if logo fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div style="
                              background: linear-gradient(135deg, #3b82f6, #06b6d4);
                              background-clip: text;
                              -webkit-background-clip: text;
                              color: transparent;
                              font-size: clamp(1.5rem, 4vw, 2.5rem);
                              font-weight: 900;
                              text-align: center;
                              line-height: 1;
                              letter-spacing: -0.02em;
                            ">
                              JL
                            </div>
                          `;
                        }
                      }}
                    />
                  </Box>
                </motion.div>
              </motion.div>

              {/* Enhanced main icon */}
              <motion.div variants={itemVariants}>
                <motion.div 
                  animate={floatingAnimation}
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(59, 130, 246, 0.4))',
                  }}
                >
                  <ThemeIcon
                    size="xl"
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'blue.5', to: 'cyan.4', deg: 135 }}
                    style={{
                      width: 'clamp(80px, 15vw, 120px)',
                      height: 'clamp(80px, 15vw, 120px)',
                      boxShadow: `
                        0 25px 80px rgba(59, 130, 246, 0.35),
                        0 0 0 1px rgba(59, 130, 246, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                      border: '2px solid rgba(59, 130, 246, 0.3)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <IconHammer size={clamp(32, 6, 48)} />
                  </ThemeIcon>
                </motion.div>
              </motion.div>

              {/* Enhanced title with better typography */}
              <motion.div variants={itemVariants}>
                <Title
                  order={1}
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        var(--mantine-color-blue-4) 0%,
                        var(--mantine-color-cyan-4) 50%,
                        var(--mantine-color-blue-3) 100%
                      )
                    `,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontSize: 'clamp(2rem, 6vw, 4rem)',
                    fontWeight: 900,
                    marginBottom: 'clamp(12px, 3vw, 24px)',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textAlign: 'center',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3))',
                    maxWidth: '100%',
                    wordWrap: 'break-word',
                  }}
                >
                  Website in Onderhoud
                </Title>
              </motion.div>

              {/* Enhanced subtitle with better spacing */}
              <motion.div variants={itemVariants}>
                <Text
                  size="xl"
                  c="gray.2"
                  style={{
                    fontSize: 'clamp(1rem, 3.5vw, 1.5rem)',
                    lineHeight: 1.6,
                    maxWidth: '100%',
                    margin: '0 auto',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                    textAlign: 'center',
                    wordWrap: 'break-word',
                  }}
                >
                  {maintenanceMessage}
                </Text>
              </motion.div>

              {/* Enhanced feature cards with better glassmorphism */}
              <motion.div variants={itemVariants}>
                <Group 
                  gap={clamp(16, 3, 24)}
                  justify="center" 
                  style={{ 
                    marginTop: 'clamp(24px, 5vw, 48px)',
                    width: '100%',
                    maxWidth: '100%',
                  }} 
                  wrap="wrap"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    style={{ width: '100%', maxWidth: 'clamp(200px, 40vw, 260px)' }}
                  >
                    <Card
                      shadow="xl"
                      padding={clamp(16, 3, 20)}
                      radius="xl"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.03) 0%, 
                            rgba(255, 255, 255, 0.08) 100%
                          )
                        `,
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: `
                          0 20px 40px rgba(0, 0, 0, 0.1),
                          0 0 0 1px rgba(255, 255, 255, 0.05)
                        `,
                      }}
                    >
                      <Stack gap="md" align="center">
                        <motion.div animate={pulseAnimation}>
                          <ThemeIcon
                            size="xl"
                            radius="lg"
                            variant="gradient"
                            gradient={{ from: 'violet.5', to: 'purple.4', deg: 135 }}
                            style={{ 
                              minHeight: '56px', 
                              minWidth: '56px',
                              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                            }}
                          >
                            <IconRocket size={28} />
                          </ThemeIcon>
                        </motion.div>
                        <Text fw={700} c="gray.1" size="lg">
                          Nieuwe Features
                        </Text>
                        <Text size="sm" c="gray.4" style={{ lineHeight: 1.5 }}>
                          Verbeterde functionaliteit en prestaties
                        </Text>
                      </Stack>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    style={{ width: '100%', maxWidth: 'clamp(200px, 40vw, 260px)' }}
                  >
                    <Card
                      shadow="xl"
                      padding={clamp(16, 3, 20)}
                      radius="xl"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.03) 0%, 
                            rgba(255, 255, 255, 0.08) 100%
                          )
                        `,
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: `
                          0 20px 40px rgba(0, 0, 0, 0.1),
                          0 0 0 1px rgba(255, 255, 255, 0.05)
                        `,
                      }}
                    >
                      <Stack gap="md" align="center">
                        <motion.div animate={pulseAnimation}>
                          <ThemeIcon
                            size="xl"
                            radius="lg"
                            variant="gradient"
                            gradient={{ from: 'orange.5', to: 'yellow.4', deg: 135 }}
                            style={{ 
                              minHeight: '56px', 
                              minWidth: '56px',
                              boxShadow: '0 8px 24px rgba(251, 146, 60, 0.3)',
                            }}
                          >
                            <IconSparkles size={28} />
                          </ThemeIcon>
                        </motion.div>
                        <Text fw={700} c="gray.1" size="lg">
                          Beter Design
                        </Text>
                        <Text size="sm" c="gray.4" style={{ lineHeight: 1.5 }}>
                          Moderne en intuïtieve gebruikerservaring
                        </Text>
                      </Stack>
                    </Card>
                  </motion.div>
                </Group>
              </motion.div>

              {/* Enhanced status card */}
              <motion.div variants={itemVariants}>
                <Card
                  shadow="xl"
                  padding={clamp(16, 3, 24)}
                  radius="xl"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(34, 197, 94, 0.12) 0%, 
                        rgba(16, 185, 129, 0.12) 100%
                      )
                    `,
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    backdropFilter: 'blur(20px)',
                    marginTop: 'clamp(24px, 4vw, 40px)',
                    boxShadow: `
                      0 20px 40px rgba(34, 197, 94, 0.1),
                      0 0 0 1px rgba(34, 197, 94, 0.1)
                    `,
                  }}
                >
                  <Group gap="sm" justify="center" wrap="wrap">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <IconClock size={24} style={{ color: 'var(--mantine-color-green-4)' }} />
                    </motion.div>
                    <Text fw={600} c="green.3" size="lg">
                      Verwachte online tijd: Binnenkort
                    </Text>
                  </Group>
                </Card>
              </motion.div>

              {/* Enhanced contact section */}
              <motion.div variants={itemVariants}>
                <Card
                  shadow="lg"
                  padding={clamp(20, 4, 28)}
                  radius="xl"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.02) 0%, 
                        rgba(255, 255, 255, 0.05) 100%
                      )
                    `,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginTop: 'clamp(32px, 5vw, 48px)',
                    maxWidth: '500px',
                  }}
                >
                  <Stack gap="md" align="center" ta="center">
                    <Group gap="sm" justify="center">
                      <IconMail size={20} style={{ color: 'var(--mantine-color-blue-4)' }} />
                      <Text fw={600} c="gray.2" size="lg">
                        Dringende zaken?
                      </Text>
                    </Group>
                    <Text
                      size="md"
                      c="gray.4"
                      style={{
                        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                        lineHeight: 1.6,
                      }}
                    >
                      Neem contact op via{' '}
                      <Text
                        component="a"
                        href={`mailto:${contactEmail}`}
                        style={{
                          color: 'var(--mantine-color-blue-4)',
                          textDecoration: 'none',
                          borderBottom: '1px solid rgba(59, 130, 246, 0.4)',
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderBottomColor = 'var(--mantine-color-blue-4)';
                          e.currentTarget.style.color = 'var(--mantine-color-blue-3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderBottomColor = 'rgba(59, 130, 246, 0.4)';
                          e.currentTarget.style.color = 'var(--mantine-color-blue-4)';
                        }}
                      >
                        {contactEmail}
                      </Text>
                    </Text>
                  </Stack>
                </Card>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}

// Helper function for responsive values
function clamp(min: number, vw: number, max: number): string {
  return `clamp(${min}px, ${vw}vw, ${max}px)`;
} 
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  Switch,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Alert,
  Badge,
  Divider,
  LoadingOverlay,
  ActionIcon,
  Tooltip,
  ThemeIcon,
  Box
} from '@mantine/core';
import { 
  IconSettings, 
  IconAlertTriangle, 
  IconCheck, 
  IconRefresh,
  IconInfoCircle,
  IconHammer,
  IconDatabase,
  IconUser,
  IconCode
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { notifications } from '@mantine/notifications';

interface SiteSetting {
  key: string;
  value: string;
  description?: string;
  type: 'string' | 'boolean' | 'number' | 'json';
  createdAt: string;
  updatedAt: string;
}

// Animation variants
const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/site-settings');
      
      if (!response.ok) {
        // Get more specific error information
        let errorMessage = 'Failed to fetch settings';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSettings(data.settings || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      
      // Show more specific error messages
      let userMessage = 'Failed to load site settings';
      if (error instanceof Error) {
        if (error.message.includes('Unauthorized') || error.message.includes('401')) {
          userMessage = 'Niet geautoriseerd. Zorg ervoor dat je bent ingelogd als admin.';
        } else if (error.message.includes('Forbidden') || error.message.includes('403')) {
          userMessage = 'Toegang geweigerd. Je hebt geen admin rechten.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          userMessage = 'Netwerkfout. Controleer je internetverbinding en of de server draait.';
        } else if (error.message.includes('500')) {
          userMessage = 'Server fout. Controleer of de database migratie is uitgevoerd.';
        } else {
          userMessage = `Fout: ${error.message}`;
        }
      }
      
      notifications.show({
        title: 'Error',
        message: userMessage,
        color: 'red',
        icon: <IconAlertTriangle size={16} />,
        autoClose: false, // Don't auto-close so user can read the full message
      });
    } finally {
      setLoading(false);
    }
  };

  // Update setting
  const updateSetting = async (key: string, value: string) => {
    try {
      setUpdating(key);
      
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      const data = await response.json();
      
      // Update local state
      setSettings(prev => 
        prev.map(setting => 
          setting.key === key 
            ? { ...setting, value, updatedAt: data.setting.updatedAt }
            : setting
        )
      );

      notifications.show({
        title: 'Success',
        message: `Setting "${key}" updated successfully`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      // Special handling for under_construction toggle
      if (key === 'under_construction') {
        const isEnabled = value === 'true';
        notifications.show({
          title: isEnabled ? 'Under Construction Enabled' : 'Under Construction Disabled',
          message: isEnabled 
            ? 'Site is now in maintenance mode. Only admins can access the site.'
            : 'Site is now live. All users can access the site.',
          color: isEnabled ? 'orange' : 'green',
          icon: isEnabled ? <IconHammer size={16} /> : <IconCheck size={16} />,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update setting',
        color: 'red',
        icon: <IconAlertTriangle size={16} />,
      });
    } finally {
      setUpdating(null);
    }
  };

  // Handle boolean toggle
  const handleBooleanToggle = (key: string, currentValue: string) => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    updateSetting(key, newValue);
  };

  // Handle text input change
  const handleTextChange = (key: string, value: string) => {
    updateSetting(key, value);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Get setting by key
  const getSetting = (key: string) => settings.find(s => s.key === key);

  const underConstructionSetting = getSetting('under_construction');
  const isUnderConstruction = underConstructionSetting?.value === 'true';

  return (
    <Box style={{ position: 'relative' }}>
      {/* Decorative background element */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: 'clamp(100px, 20vw, 150px)',
        height: 'clamp(100px, 20vw, 150px)',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card 
          shadow="sm" 
          padding="lg" 
          radius="md" 
          withBorder
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <LoadingOverlay visible={loading} />
          
          <Group justify="space-between" mb="md">
            <Group>
              <ThemeIcon
                size="lg"
                radius="md"
                variant="gradient"
                gradient={{ from: 'violet.6', to: 'purple.5' }}
              >
                <IconSettings size={20} />
              </ThemeIcon>
              <Title 
                order={3}
                style={{
                  color: 'var(--mantine-color-gray-1)',
                  fontSize: 'clamp(1.125rem, 3.5vw, 1.5rem)',
                  fontWeight: 700,
                }}
              >
                Site Instellingen
              </Title>
            </Group>
            <Tooltip label="Ververs instellingen">
              <ActionIcon 
                variant="light" 
                onClick={fetchSettings}
                loading={loading}
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Text 
            size="sm" 
            c="gray.4" 
            mb="xl"
            style={{
              fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
              lineHeight: 1.5,
            }}
          >
            Beheer site-brede instellingen en configuratie opties.
          </Text>

          <Stack gap="lg">
            {/* Under Construction Toggle */}
            {underConstructionSetting && (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <Card 
                  withBorder 
                  padding="md" 
                  style={{ 
                    background: isUnderConstruction 
                      ? 'linear-gradient(135deg, rgba(255, 165, 0, 0.05), rgba(255, 69, 0, 0.05))'
                      : 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05))',
                    border: isUnderConstruction 
                      ? '1px solid rgba(255, 165, 0, 0.3)'
                      : '1px solid rgba(34, 197, 94, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '40px',
                    height: '40px',
                    background: isUnderConstruction 
                      ? 'radial-gradient(circle, rgba(255, 165, 0, 0.1) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(10px)',
                    pointerEvents: 'none',
                  }} />

                  <Group justify="space-between" align="flex-start" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ flex: 1 }}>
                      <Group mb="xs">
                        <ThemeIcon
                          size="md"
                          radius="md"
                          variant="gradient"
                          gradient={isUnderConstruction 
                            ? { from: 'orange.6', to: 'red.5' }
                            : { from: 'green.6', to: 'teal.5' }
                          }
                        >
                          <IconHammer size={16} />
                        </ThemeIcon>
                        <Text 
                          fw={600}
                          style={{
                            fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                            color: 'var(--mantine-color-gray-1)',
                          }}
                        >
                          Under Construction Mode
                        </Text>
                        <Badge 
                          color={isUnderConstruction ? 'orange' : 'green'}
                          variant="light"
                          style={{
                            fontSize: 'clamp(0.7rem, 2vw, 0.75rem)',
                          }}
                        >
                          {isUnderConstruction ? 'ACTIEF' : 'INACTIEF'}
                        </Badge>
                      </Group>
                      <Text 
                        size="sm" 
                        c="gray.4" 
                        mb="md"
                        style={{
                          fontSize: 'clamp(0.75rem, 2.2vw, 0.8rem)',
                          lineHeight: 1.4,
                        }}
                      >
                        Schakel onderhoudsmodus in om de site tijdelijk offline te zetten voor bezoekers. 
                        Admin toegang blijft behouden.
                      </Text>
                      {isUnderConstruction && (
                        <Alert 
                          icon={<IconAlertTriangle size={16} />} 
                          color="orange" 
                          variant="light"
                          mb="md"
                          style={{
                            background: 'rgba(255, 165, 0, 0.05)',
                            border: '1px solid rgba(255, 165, 0, 0.2)',
                          }}
                        >
                          <Text 
                            size="sm"
                            style={{
                              fontSize: 'clamp(0.75rem, 2.2vw, 0.8rem)',
                              lineHeight: 1.4,
                            }}
                          >
                            <strong>Let op:</strong> De site is momenteel in onderhoudsmodus. 
                            Alleen admins kunnen de site bezoeken.
                          </Text>
                        </Alert>
                      )}
                    </div>
                    <Switch
                      checked={isUnderConstruction}
                      onChange={() => handleBooleanToggle('under_construction', underConstructionSetting?.value || 'false')}
                      disabled={updating === 'under_construction'}
                      size="lg"
                      color={isUnderConstruction ? 'orange' : 'green'}
                      thumbIcon={
                        isUnderConstruction ? (
                          <IconHammer size={12} />
                        ) : (
                          <IconCheck size={12} />
                        )
                      }
                    />
                  </Group>
                </Card>
              </motion.div>
            )}

            {settings.length > 1 && <Divider />}

            {/* Other Settings */}
            {settings
              .filter(setting => setting.key !== 'under_construction')
              .map((setting, index) => (
                <motion.div
                  key={setting.key}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  <Card 
                    withBorder 
                    padding="md"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.03) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Subtle decorative element */}
                    <div style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      width: '30px',
                      height: '30px',
                      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(8px)',
                      pointerEvents: 'none',
                    }} />

                    <Stack gap="sm" style={{ position: 'relative', zIndex: 1 }}>
                      <Group justify="space-between">
                        <div>
                          <Text 
                            fw={500}
                            style={{
                              fontSize: 'clamp(0.9rem, 2.8vw, 1rem)',
                              color: 'var(--mantine-color-gray-2)',
                            }}
                          >
                            {setting.key.replace(/_/g, ' ').toUpperCase()}
                          </Text>
                          {setting.description && (
                            <Text 
                              size="sm" 
                              c="gray.4"
                              style={{
                                fontSize: 'clamp(0.75rem, 2.2vw, 0.8rem)',
                                lineHeight: 1.4,
                              }}
                            >
                              {setting.description}
                            </Text>
                          )}
                        </div>
                        <Badge 
                          variant="light" 
                          size="sm"
                          color="violet"
                          style={{
                            fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                          }}
                        >
                          {setting.type}
                        </Badge>
                      </Group>

                      {setting.type === 'boolean' ? (
                        <Switch
                          checked={setting.value === 'true'}
                          onChange={() => handleBooleanToggle(setting.key, setting.value)}
                          disabled={updating === setting.key}
                          label={setting.value === 'true' ? 'Ingeschakeld' : 'Uitgeschakeld'}
                          color="violet"
                        />
                      ) : setting.key.includes('message') || setting.key.includes('description') ? (
                        <Textarea
                          value={setting.value}
                          onChange={(e) => handleTextChange(setting.key, e.target.value)}
                          placeholder={`Voer ${setting.key} in...`}
                          disabled={updating === setting.key}
                          autosize
                          minRows={2}
                          maxRows={4}
                          styles={{
                            input: {
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'var(--mantine-color-gray-2)',
                            },
                          }}
                        />
                      ) : (
                        <TextInput
                          value={setting.value}
                          onChange={(e) => handleTextChange(setting.key, e.target.value)}
                          placeholder={`Voer ${setting.key} in...`}
                          disabled={updating === setting.key}
                          styles={{
                            input: {
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'var(--mantine-color-gray-2)',
                            },
                          }}
                        />
                      )}

                      <Text 
                        size="xs" 
                        c="gray.5"
                        style={{
                          fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                        }}
                      >
                        Laatst bijgewerkt: {new Date(setting.updatedAt).toLocaleString('nl-NL')}
                      </Text>
                    </Stack>
                  </Card>
                </motion.div>
              ))}

            {settings.length === 0 && !loading && (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <Alert 
                  icon={<IconInfoCircle size={16} />} 
                  color="blue"
                  style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  Geen instellingen gevonden. Voer eerst de database migratie uit.
                </Alert>
              </motion.div>
            )}

            {/* Troubleshooting Section */}
            {settings.length === 0 && !loading && (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <Card 
                  withBorder 
                  padding="md" 
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(6, 182, 212, 0.02) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '50px',
                    height: '50px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(15px)',
                    pointerEvents: 'none',
                  }} />

                  <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
                    <Group>
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'blue.6', to: 'cyan.5' }}
                      >
                        <IconInfoCircle size={20} />
                      </ThemeIcon>
                      <Text 
                        fw={600} 
                        style={{
                          color: 'var(--mantine-color-blue-3)',
                          fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                        }}
                      >
                        Troubleshooting
                      </Text>
                    </Group>
                    
                    <Text 
                      size="sm" 
                      c="gray.3"
                      style={{
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
                        lineHeight: 1.5,
                      }}
                    >
                      Als je deze foutmelding ziet, controleer dan de volgende stappen:
                    </Text>
                    
                    <Stack gap="sm">
                      <Group gap="xs" align="flex-start">
                        <ThemeIcon size="sm" variant="light" color="blue" radius="sm">
                          <IconDatabase size={12} />
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Text 
                            size="sm" 
                            fw={500}
                            style={{
                              fontSize: 'clamp(0.75rem, 2.2vw, 0.8rem)',
                              color: 'var(--mantine-color-gray-2)',
                            }}
                          >
                            Database Migratie:
                          </Text>
                          <Text 
                            size="xs" 
                            c="gray.4"
                            style={{
                              fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                              lineHeight: 1.4,
                            }}
                          >
                            Voer de SQL scripts uit in je Supabase dashboard
                          </Text>
                          <Text 
                            size="xs" 
                            c="gray.5" 
                            style={{ 
                              fontFamily: 'monospace', 
                              background: 'rgba(0,0,0,0.2)', 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              fontSize: 'clamp(0.65rem, 1.6vw, 0.7rem)',
                              marginTop: '4px',
                            }}
                          >
                            supabasesql/V1_4_SiteSettings.sql<br />
                            supabasesql/RLSV1.5_SiteSettings.sql
                          </Text>
                        </div>
                      </Group>
                      
                      <Group gap="xs" align="flex-start">
                        <ThemeIcon size="sm" variant="light" color="cyan" radius="sm">
                          <IconUser size={12} />
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Text 
                            size="sm" 
                            fw={500}
                            style={{
                              fontSize: 'clamp(0.75rem, 2.2vw, 0.8rem)',
                              color: 'var(--mantine-color-gray-2)',
                            }}
                          >
                            Admin Rechten:
                          </Text>
                          <Text 
                            size="xs" 
                            c="gray.4"
                            style={{
                              fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                              lineHeight: 1.4,
                            }}
                          >
                            Zorg ervoor dat je gebruiker de rol 'ADMIN' heeft in de User tabel
                          </Text>
                        </div>
                      </Group>
                      
                      <Group gap="xs" align="flex-start">
                        <ThemeIcon size="sm" variant="light" color="violet" radius="sm">
                          <IconCode size={12} />
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Text 
                            size="sm" 
                            fw={500}
                            style={{
                              fontSize: 'clamp(0.75rem, 2.2vw, 0.8rem)',
                              color: 'var(--mantine-color-gray-2)',
                            }}
                          >
                            Browser Console:
                          </Text>
                          <Text 
                            size="xs" 
                            c="gray.4"
                            style={{
                              fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)',
                              lineHeight: 1.4,
                            }}
                          >
                            Open de developer tools (F12) en kijk naar eventuele foutmeldingen
                          </Text>
                        </div>
                      </Group>
                    </Stack>
                    
                    <Button 
                      variant="light" 
                      size="sm" 
                      onClick={fetchSettings}
                      leftSection={<IconRefresh size={16} />}
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: 'var(--mantine-color-blue-3)',
                        fontSize: 'clamp(0.75rem, 2.2vw, 0.875rem)',
                      }}
                    >
                      Probeer Opnieuw
                    </Button>
                  </Stack>
                </Card>
              </motion.div>
            )}
          </Stack>
        </Card>
      </motion.div>
    </Box>
  );
} 
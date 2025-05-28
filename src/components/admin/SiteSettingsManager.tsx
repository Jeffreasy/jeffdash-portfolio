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
  Tooltip
} from '@mantine/core';
import { 
  IconSettings, 
  IconAlertTriangle, 
  IconCheck, 
  IconRefresh,
  IconInfoCircle,
  IconHammer
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface SiteSetting {
  key: string;
  value: string;
  description?: string;
  type: 'string' | 'boolean' | 'number' | 'json';
  createdAt: string;
  updatedAt: string;
}

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
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <LoadingOverlay visible={loading} />
      
      <Group justify="space-between" mb="md">
        <Group>
          <IconSettings size={24} />
          <Title order={3}>Site Instellingen</Title>
        </Group>
        <Tooltip label="Ververs instellingen">
          <ActionIcon 
            variant="light" 
            onClick={fetchSettings}
            loading={loading}
          >
            <IconRefresh size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Text size="sm" c="dimmed" mb="xl">
        Beheer site-brede instellingen en configuratie opties.
      </Text>

      <Stack gap="lg">
        {/* Under Construction Toggle */}
        <Card withBorder padding="md" style={{ 
          background: isUnderConstruction 
            ? 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 69, 0, 0.1))'
            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))'
        }}>
          <Group justify="space-between" align="flex-start">
            <div style={{ flex: 1 }}>
              <Group mb="xs">
                <IconHammer size={20} />
                <Text fw={600}>Under Construction Mode</Text>
                <Badge 
                  color={isUnderConstruction ? 'orange' : 'green'}
                  variant="light"
                >
                  {isUnderConstruction ? 'ACTIEF' : 'INACTIEF'}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Schakel onderhoudsmodus in om de site tijdelijk offline te zetten voor bezoekers. 
                Admin toegang blijft behouden.
              </Text>
              {isUnderConstruction && (
                <Alert 
                  icon={<IconAlertTriangle size={16} />} 
                  color="orange" 
                  variant="light"
                  mb="md"
                >
                  <Text size="sm">
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

        <Divider />

        {/* Other Settings */}
        {settings
          .filter(setting => setting.key !== 'under_construction')
          .map((setting) => (
            <Card key={setting.key} withBorder padding="md">
              <Stack gap="sm">
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{setting.key.replace(/_/g, ' ').toUpperCase()}</Text>
                    {setting.description && (
                      <Text size="sm" c="dimmed">{setting.description}</Text>
                    )}
                  </div>
                  <Badge variant="light" size="sm">
                    {setting.type}
                  </Badge>
                </Group>

                {setting.type === 'boolean' ? (
                  <Switch
                    checked={setting.value === 'true'}
                    onChange={() => handleBooleanToggle(setting.key, setting.value)}
                    disabled={updating === setting.key}
                    label={setting.value === 'true' ? 'Ingeschakeld' : 'Uitgeschakeld'}
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
                  />
                ) : (
                  <TextInput
                    value={setting.value}
                    onChange={(e) => handleTextChange(setting.key, e.target.value)}
                    placeholder={`Voer ${setting.key} in...`}
                    disabled={updating === setting.key}
                  />
                )}

                <Text size="xs" c="dimmed">
                  Laatst bijgewerkt: {new Date(setting.updatedAt).toLocaleString('nl-NL')}
                </Text>
              </Stack>
            </Card>
          ))}

        {settings.length === 0 && !loading && (
          <Alert icon={<IconInfoCircle size={16} />} color="blue">
            Geen instellingen gevonden. Voer eerst de database migratie uit.
          </Alert>
        )}

        {/* Troubleshooting Section */}
        {settings.length === 0 && !loading && (
          <Card withBorder padding="md" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
            <Stack gap="md">
              <Group>
                <IconInfoCircle size={20} color="var(--mantine-color-blue-4)" />
                <Text fw={600} c="blue.4">Troubleshooting</Text>
              </Group>
              
              <Text size="sm" c="dimmed">
                Als je deze foutmelding ziet, controleer dan de volgende stappen:
              </Text>
              
              <Stack gap="xs">
                <Text size="sm">
                  <strong>1. Database Migratie:</strong> Voer de SQL scripts uit in je Supabase dashboard:
                </Text>
                <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.1)', padding: '8px', borderRadius: '4px' }}>
                  supabasesql/V1_4_SiteSettings.sql<br />
                  supabasesql/RLSV1.5_SiteSettings.sql
                </Text>
                
                <Text size="sm">
                  <strong>2. Admin Rechten:</strong> Zorg ervoor dat je gebruiker de rol 'ADMIN' heeft in de User tabel.
                </Text>
                
                <Text size="sm">
                  <strong>3. Supabase Verbinding:</strong> Controleer of je Supabase environment variables correct zijn ingesteld.
                </Text>
                
                <Text size="sm">
                  <strong>4. Browser Console:</strong> Open de developer tools (F12) en kijk naar eventuele foutmeldingen.
                </Text>
              </Stack>
              
              <Button 
                variant="light" 
                size="sm" 
                onClick={fetchSettings}
                leftSection={<IconRefresh size={16} />}
              >
                Probeer Opnieuw
              </Button>
            </Stack>
          </Card>
        )}
      </Stack>
    </Card>
  );
} 
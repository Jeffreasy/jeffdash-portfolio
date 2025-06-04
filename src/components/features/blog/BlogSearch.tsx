'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TextInput, ActionIcon, Group, Text, Box } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  resultCount?: number;
}

export default function BlogSearch({ 
  onSearch, 
  isLoading = false, 
  placeholder = "Zoek in blog posts...",
  resultCount 
}: BlogSearchProps) {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 500);
  const previousSearchRef = useRef('');

  // Effect to handle debounced search - FIXED: Only trigger when value actually changes
  useEffect(() => {
    if (debouncedSearchValue !== previousSearchRef.current) {
      previousSearchRef.current = debouncedSearchValue;
      onSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue]); // Removed onSearch dependency to prevent infinite loop

  const handleClear = useCallback(() => {
    setSearchValue('');
    // Don't call onSearch here - let the useEffect handle it
  }, []);

  return (
    <Box style={{ width: '100%', maxWidth: '500px' }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TextInput
          placeholder={placeholder}
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
          leftSection={
            <motion.div
              animate={{ 
                rotate: isLoading ? 360 : 0,
                scale: isLoading ? 1.1 : 1
              }}
              transition={{ 
                duration: 1, 
                repeat: isLoading ? Infinity : 0, 
                ease: "linear" 
              }}
            >
              <IconSearch size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
            </motion.div>
          }
          rightSection={
            <AnimatePresence>
              {searchValue && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    color="gray"
                    onClick={handleClear}
                    style={{ cursor: 'pointer' }}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </motion.div>
              )}
            </AnimatePresence>
          }
          size="md"
          radius="md"
          style={{
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            border: searchValue ? '2px solid var(--mantine-color-blue-4)' : '1px solid var(--mantine-color-dark-4)',
            transition: 'all 0.2s ease',
          }}
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-dark-6)',
              '&::placeholder': {
                color: 'var(--mantine-color-dimmed)',
              },
              '&:focus': {
                borderColor: 'var(--mantine-color-blue-4)',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              },
            },
          }}
        />
      </motion.div>

      {/* Search results indicator */}
      <AnimatePresence>
        {searchValue && typeof resultCount === 'number' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <Group gap="xs" mt="xs">
              <Text size="sm" c="dimmed">
                {isLoading ? (
                  'Zoeken...'
                ) : (
                  <>
                    {resultCount} result{resultCount !== 1 ? 'aten' : 'aat'} gevonden
                    {searchValue && (
                      <Text component="span" c="blue.4" fw={500}>
                        {' '}voor "{searchValue}"
                      </Text>
                    )}
                  </>
                )}
              </Text>
            </Group>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
} 
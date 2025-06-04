'use client';

import React from 'react';
import { Group, Button, Text, Box, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconDots } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { PaginationMeta } from '@/lib/actions/blog';

interface BlogPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function BlogPagination({ 
  pagination, 
  onPageChange, 
  isLoading = false 
}: BlogPaginationProps) {
  const { 
    currentPage, 
    totalPages, 
    totalItems, 
    itemsPerPage, 
    hasNextPage, 
    hasPreviousPage 
  } = pagination;

  // Don't render if only one page or no items
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate item range for current page
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '2rem',
        }}
      >
        {/* Results info */}
        <Text
          size="sm"
          c="dimmed"
          ta="center"
          mb="lg"
          style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
        >
          Resultaten {startItem}-{endItem} van {totalItems}
        </Text>

        {/* Pagination controls */}
        <Group justify="center" gap="xs" wrap="wrap">
          {/* Previous button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ActionIcon
              variant="subtle"
              size="lg"
              color="blue"
              disabled={!hasPreviousPage || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
              style={{
                borderRadius: '8px',
                opacity: !hasPreviousPage || isLoading ? 0.5 : 1,
              }}
            >
              <IconChevronLeft size={18} />
            </ActionIcon>
          </motion.div>

          {/* Page numbers */}
          <Group gap="xs">
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <Box key={`ellipsis-${index}`} style={{ padding: '0.5rem' }}>
                    <IconDots size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
                  </Box>
                );
              }

              const isCurrentPage = page === currentPage;

              return (
                <motion.div
                  key={page}
                  whileHover={{ scale: isCurrentPage ? 1 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={isCurrentPage ? 'filled' : 'subtle'}
                    color={isCurrentPage ? 'blue' : 'gray'}
                    size="sm"
                    disabled={isLoading}
                    onClick={() => onPageChange(page)}
                    style={{
                      borderRadius: '8px',
                      minWidth: '40px',
                      height: '40px',
                      fontWeight: isCurrentPage ? 600 : 400,
                      ...(isCurrentPage && {
                        background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-cyan-6))',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      }),
                    }}
                  >
                    {page}
                  </Button>
                </motion.div>
              );
            })}
          </Group>

          {/* Next button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ActionIcon
              variant="subtle"
              size="lg"
              color="blue"
              disabled={!hasNextPage || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
              style={{
                borderRadius: '8px',
                opacity: !hasNextPage || isLoading ? 0.5 : 1,
              }}
            >
              <IconChevronRight size={18} />
            </ActionIcon>
          </motion.div>
        </Group>

        {/* Quick navigation for larger page sets */}
        {totalPages > 10 && (
          <Group justify="center" gap="xs" mt="md">
            <Text size="xs" c="dimmed">
              Ga naar pagina:
            </Text>
            <Group gap="xs">
              {currentPage > 5 && (
                <Button
                  variant="subtle"
                  size="xs"
                  color="gray"
                  onClick={() => onPageChange(1)}
                  disabled={isLoading}
                >
                  Eerste
                </Button>
              )}
              {currentPage < totalPages - 4 && (
                <Button
                  variant="subtle"
                  size="xs"
                  color="gray"
                  onClick={() => onPageChange(totalPages)}
                  disabled={isLoading}
                >
                  Laatste
                </Button>
              )}
            </Group>
          </Group>
        )}
      </Box>
    </motion.div>
  );
} 
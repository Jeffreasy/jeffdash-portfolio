'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { SimpleGrid, Container, Title, Text, Box, Stack, Center, Loader } from '@mantine/core';
import { motion } from 'framer-motion';
import BlogPostCard from './BlogPostCard';
import BlogSearch from './BlogSearch';
import BlogPagination from './BlogPagination';
import type { PublishedPostPreviewType, PaginatedPostsResult } from '@/lib/actions/blog';
import { getPublishedPosts } from '@/lib/actions/blog';
import BlogErrorBoundary from './BlogErrorBoundary';
// import { useAnalytics } from '@/hooks/useAnalytics'; // DISABLED FOR NOW

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

// Animation variants for individual items
const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
} as const;

// Props interface for the new BlogList
interface BlogListProps {
  initialData?: PaginatedPostsResult;
  postsPerPage?: number;
}

export default function BlogList({ 
  initialData,
  postsPerPage = 12 
}: BlogListProps) {
  const initialLoadRef = useRef(false);
  
  // State management
  const [data, setData] = useState<PaginatedPostsResult | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts function
  const fetchPosts = useCallback(async (page: number, search?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getPublishedPosts(page, postsPerPage, search);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Er is een fout opgetreden bij het laden van de blog posts.';
      setError(errorMessage);
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postsPerPage]);

  // Handle search - STABLE function using state setters
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    
    setIsLoading(true);
    setError(null);
    
    getPublishedPosts(1, postsPerPage, query)
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : 'Er is een fout opgetreden bij het laden van de blog posts.';
        setError(errorMessage);
        console.error('Error fetching posts:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [postsPerPage]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchPosts(page, searchQuery);
    
    // Scroll to top of results
    const blogSection = document.querySelector('[data-blog-section]');
    if (blogSection) {
      blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [fetchPosts, searchQuery]);

  // Initial load if no initial data provided
  useEffect(() => {
    if (!initialData && !initialLoadRef.current) {
      initialLoadRef.current = true;
      fetchPosts(1);
    }
  }, [initialData, fetchPosts]);

  return (
    <BlogErrorBoundary>
      <section 
        data-blog-section
        style={{ 
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          minHeight: '100vh',
        }}
      >
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '65%',
            right: '8%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <Container size="lg" py={{ base: 'xl', md: '3xl' }} style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Header and Search */}
            <motion.div
              variants={itemVariants}
              style={{ 
                textAlign: 'center',
                marginBottom: 'var(--mantine-spacing-3xl)',
              }}
            >
              <Title 
                order={2} 
                ta="center" 
                mb="xl"
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}
              >
                Blog Posts
              </Title>

              {/* Search Component - RE-ENABLED */}
              <Stack align="center" gap="md" mb="xl">
                <BlogSearch
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  resultCount={data?.pagination.totalItems}
                />
              </Stack>
            </motion.div>

            {/* Loading State */}
            {isLoading && !data && (
              <motion.div variants={itemVariants}>
                <Center py="xl">
                  <Stack align="center" gap="md">
                    <Loader size="lg" color="blue.4" type="dots" />
                    <Text c="dimmed">Blog posts laden...</Text>
                  </Stack>
                </Center>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div variants={itemVariants}>
                <Box ta="center" py="xl">
                  <Title order={3} c="red.4" mb="md">
                    Er is een fout opgetreden
                  </Title>
                  <Text c="gray.4" size="lg">
                    {error}
                  </Text>
                </Box>
              </motion.div>
            )}

            {/* No Results State */}
            {data && data.posts.length === 0 && !isLoading && (
              <motion.div variants={itemVariants}>
                <Box ta="center" py="xl">
                  <Title order={3} c="gray.2" mb="md">
                    {searchQuery 
                      ? `Geen resultaten gevonden voor "${searchQuery}"` 
                      : 'Geen blog posts gevonden'
                    }
                  </Title>
                  <Text c="gray.4" size="lg">
                    {searchQuery 
                      ? 'Probeer een andere zoekterm.' 
                      : 'Momenteel geen blog posts om weer te geven.'
                    }
                  </Text>
                </Box>
              </motion.div>
            )}

            {/* Posts Grid */}
            {data && data.posts.length > 0 && (
              <>
                <motion.div variants={itemVariants}>
                  <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3 }}
                    spacing="xl"
                    verticalSpacing={{ base: "xl", sm: "xl", lg: "2xl" }}
                    style={{
                      gap: 'clamp(1.5rem, 4vw, 2.5rem)',
                      opacity: isLoading ? 0.6 : 1,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    {data.posts.map((post, index) => {
                      // Validate each post before rendering
                      if (!post || typeof post !== 'object') {
                        console.error('Invalid post data:', post);
                        return null;
                      }

                      return (
                        <motion.div 
                          key={`${post.id}-${post.slug}`}
                          variants={itemVariants}
                          custom={index}
                          layout
                        >
                          <BlogPostCard post={post} />
                        </motion.div>
                      );
                    })}
                  </SimpleGrid>
                </motion.div>

                {/* Pagination */}
                <motion.div variants={itemVariants}>
                  <BlogPagination
                    pagination={data.pagination}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                  />
                </motion.div>
              </>
            )}
          </motion.div>
        </Container>
      </section>
    </BlogErrorBoundary>
  );
} 
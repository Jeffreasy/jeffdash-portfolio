'use client'; // Image, Link etc. vereisen client-side

import React from 'react';
import Link from 'next/link';
import { Card, Image, Text, Stack, Badge, Group, Button, AspectRatio } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import type { PublishedPostPreviewType } from '@/lib/actions/blog';
import { formatDate } from '@/lib/utils'; // Utility functie om datum te formatteren (moet mogelijk aangemaakt worden)
import BlogErrorBoundary from './BlogErrorBoundary';

type BlogPostCardProps = {
  post: PublishedPostPreviewType;
};

// Helper function to validate URL
const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return false;
  }
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function BlogPostCard({ post }: BlogPostCardProps) {
  // Valideer post object
  if (!post || typeof post !== 'object') {
    throw new Error('Invalid post data');
  }

  const fallbackImage = 'https://via.placeholder.com/400x200/1f2937/9ca3af.png?text=Blog+Post';
  
  // Validate and determine the image source
  const getImageSrc = (): string => {
    const featuredImageUrl = post.featuredImageUrl;
    
    if (isValidUrl(featuredImageUrl)) {
      return featuredImageUrl!;
    }
    
    // Log warning for invalid or missing URLs (only in development)
    if (process.env.NODE_ENV === 'development' && featuredImageUrl) {
      console.warn(`Invalid featuredImageUrl for post ${post.id}: "${featuredImageUrl}"`);
    }
    
    return fallbackImage;
  };

  const imageSrc = getImageSrc();

  // Improved error handler
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.currentTarget;
    const postId = post.id;
    
    // Log detailed error information
    console.warn(`Failed to load image for blog post ${postId}:`, {
      originalSrc: post.featuredImageUrl,
      attemptedSrc: target.src,
      fallbackSrc: fallbackImage,
      errorEvent: event.type
    });
    
    // Set fallback image if not already set
    if (target.src !== fallbackImage) {
      target.src = fallbackImage;
    }
  };

  return (
    <BlogErrorBoundary>
      <motion.div
        style={{ height: '100%' }}
        whileHover={{ 
          y: -8,
          transition: { 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.3
          }
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card 
          shadow="md" 
          padding="lg" 
          radius="lg" 
          h="100%"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          styles={{
            root: {
              '&:hover': {
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                borderColor: 'rgba(59, 130, 246, 0.4)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.08) 100%)',
              }
            }
          }}
        >
          <Card.Section>
            <motion.div 
              style={{ 
                margin: 'var(--mantine-spacing-md)',
                marginBottom: 0,
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <AspectRatio ratio={16 / 9}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: 'var(--mantine-radius-md)',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <Image
                    src={imageSrc}
                    alt={post.featuredImageAltText || post.title || 'Blog post afbeelding'}
                    fallbackSrc={fallbackImage}
                    onError={handleImageError}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  
                  {/* Subtle gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '30%',
                    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.2))',
                    pointerEvents: 'none',
                  }} />

                  {/* Hover effect overlay */}
                  <motion.div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
                      opacity: 0,
                      pointerEvents: 'none',
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </AspectRatio>
            </motion.div>
          </Card.Section>

          <Stack mt="md" mb="xs" gap="xs" style={{ flexGrow: 1 }}>
            {/* Categorie en Datum */}
            <Group justify="space-between">
                {post.category && (
                    <Badge 
                      size="sm" 
                      variant="light"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: 'var(--mantine-color-blue-3)',
                      }}
                    >
                      {post.category}
                    </Badge>
                )}
                {post.publishedAt && (
                    <Text size="xs" c="gray.5">
                        {formatDate(post.publishedAt)} {/* Gebruik formatDate utility */}
                    </Text>
                )}
            </Group>

            {/* Titel */}
            <Text 
              fw={600} 
              size="lg" 
              lineClamp={2} 
              component={Link} 
              href={`/blog/${post.slug}`} 
              td="none"
              style={{
                lineHeight: 1.3,
                color: 'var(--mantine-color-gray-1)',
                minHeight: '2.6em',
                // Optimal text rendering
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
              }}
            >
              {post.title}
            </Text>

            {/* Excerpt */}
            {post.excerpt && (
              <Text 
                size="sm" 
                c="gray.4" 
                lineClamp={3}
                style={{ 
                  lineHeight: 1.4,
                  minHeight: '3.6em',
                  // Optimal text rendering
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {post.excerpt}
              </Text>
            )}

            {/* Tags */}
            <Group gap="xs" mt="auto" style={{ flexWrap: 'wrap', minHeight: '2rem' }}>
              {post.tags?.slice(0, 3).map((tag: string) => (
                <Badge 
                  key={tag} 
                  size="sm" 
                  variant="outline"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'var(--mantine-color-gray-4)',
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {post.tags && post.tags.length > 3 && (
                 <Badge 
                   size="sm" 
                   variant="outline"
                   style={{
                     borderColor: 'rgba(255, 255, 255, 0.3)',
                     color: 'var(--mantine-color-gray-4)',
                   }}
                 >
                   +{post.tags.length - 3}
                 </Badge>
              )}
            </Group>
          </Stack>

          {/* Lees Meer button */}
          <motion.div
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
          >
            <Button
              component={Link}
              href={`/blog/${post.slug}`}
              variant="gradient"
              gradient={{ from: 'blue.6', to: 'cyan.5' }}
              fullWidth
              size="sm"
              radius="md"
              rightSection={
                <motion.div
                  animate={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconArrowRight size={16} />
                </motion.div>
              }
              style={{
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                fontWeight: 600,
                marginTop: 'var(--mantine-spacing-md)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              styles={{
                root: {
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.5)',
                    transform: 'translateY(-2px)',
                    background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6)',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 2s ease infinite',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: 'left 0.5s ease',
                  },
                  '&:hover::before': {
                    left: '100%',
                  }
                }
              }}
            >
              Lees Meer
            </Button>
          </motion.div>

          {/* Subtle decorative element */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '40px',
            height: '40px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(10px)',
            pointerEvents: 'none',
          }} />
        </Card>
      </motion.div>
    </BlogErrorBoundary>
  );
} 
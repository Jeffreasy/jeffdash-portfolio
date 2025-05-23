'use client';

import React, { useState, useCallback } from 'react';
import { Container, Group, Button, Text, Stack, Box, Paper } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPhoto, IconX } from '@tabler/icons-react';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import PageErrorBoundary from '@/components/features/shared/PageErrorBoundary';

interface ImageGalleryProps {
  images: Array<{
    url: string;
    alt?: string;
    caption?: string;
  }>;
  title?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

// Animatie varianten
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
} as const;

const imageVariants = {
  enter: {
    x: 300,
    opacity: 0,
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    x: -300,
    opacity: 0,
  },
} as const;

const thumbnailVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
} as const;

export default function ImageGallery({ 
  images, 
  title = "Galerij",
  autoPlay = false,
  autoPlayInterval = 5000 
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Validate images prop
  if (!Array.isArray(images)) {
    throw new Error('Images must be an array');
  }

  if (!images || images.length === 0) {
    return (
      <PageErrorBoundary>
        <Container size="md" py="xl">
          <Paper
            p="xl"
            radius="lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
            }}
          >
            <IconPhoto size={48} style={{ color: 'var(--mantine-color-gray-6)', marginBottom: '1rem' }} />
            <Text c="dimmed" size="lg">
              Geen afbeeldingen beschikbaar
            </Text>
          </Paper>
        </Container>
      </PageErrorBoundary>
    );
  }

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, handleNext, images.length]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') handlePrevious();
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext]);

  const currentImage = images[currentIndex];

  return (
    <PageErrorBoundary>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Container size="lg" py="xl">
          <Stack gap="xl">
            {/* Title */}
            <Text size="xl" fw={600} ta="center" c="gray.2">
              {title}
            </Text>

            {/* Main Image Container */}
            <Paper
              radius="lg"
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                aspectRatio: '16/9',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsFullscreen(true)}
                >
                  <NextImage
                    src={currentImage.url}
                    alt={currentImage.alt || `Gallery image ${currentIndex + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={90}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="filled"
                    color="dark"
                    size="lg"
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                    }}
                    onClick={handlePrevious}
                  >
                    <IconChevronLeft size={20} />
                  </Button>

                  <Button
                    variant="filled"
                    color="dark"
                    size="lg"
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                    }}
                    onClick={handleNext}
                  >
                    <IconChevronRight size={20} />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              <Box
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--mantine-radius-md)',
                  zIndex: 2,
                }}
              >
                <Text size="sm" c="white">
                  {currentIndex + 1} / {images.length}
                </Text>
              </Box>
            </Paper>

            {/* Caption */}
            {currentImage.caption && (
              <Text ta="center" c="dimmed" style={{ fontStyle: 'italic' }}>
                {currentImage.caption}
              </Text>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <Group justify="center" gap="sm">
                {images.map((image, index) => (
                  <motion.div
                    key={`thumb-${index}`}
                    variants={thumbnailVariants}
                    whileHover="hover"
                    onClick={() => goToSlide(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Box
                      style={{
                        width: '60px',
                        height: '40px',
                        borderRadius: 'var(--mantine-radius-sm)',
                        overflow: 'hidden',
                        border: index === currentIndex 
                          ? '2px solid var(--mantine-color-blue-5)' 
                          : '2px solid transparent',
                        transition: 'border-color 0.2s ease',
                      }}
                    >
                      <NextImage
                        src={image.url}
                        alt={image.alt || `Thumbnail ${index + 1}`}
                        width={60}
                        height={40}
                        style={{ objectFit: 'cover' }}
                        quality={60}
                      />
                    </Box>
                  </motion.div>
                ))}
              </Group>
            )}
          </Stack>
        </Container>

        {/* Fullscreen Modal */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.95)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setIsFullscreen(false)}
            >
              <Button
                variant="filled"
                color="dark"
                style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '2rem',
                  zIndex: 1001,
                }}
                onClick={() => setIsFullscreen(false)}
              >
                <IconX size={20} />
              </Button>
              
              <NextImage
                src={currentImage.url}
                alt={currentImage.alt || `Gallery image ${currentIndex + 1}`}
                width={1200}
                height={800}
                style={{ 
                  maxWidth: '90vw', 
                  maxHeight: '90vh', 
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
                quality={95}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageErrorBoundary>
  );
} 
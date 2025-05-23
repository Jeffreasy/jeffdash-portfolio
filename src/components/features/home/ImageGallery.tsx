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
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        }}>
          <Container size="md" py="xl">
            <Paper
              p="xl"
              radius="lg"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
              }}
            >
              <IconPhoto size={48} style={{ color: 'var(--mantine-color-gray-6)', marginBottom: '1rem' }} />
              <Text c="gray.4" size="lg">
                Geen afbeeldingen beschikbaar
              </Text>
            </Paper>
          </Container>
        </section>
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
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      }}>
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '75%',
            right: '10%',
            width: '140px',
            height: '140px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Container size="lg" py="xl">
            <Stack gap="xl">
              {/* Title */}
              <Text 
                size="xl" 
                fw={600} 
                ta="center" 
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
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
                  backdropFilter: 'blur(10px)',
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
                        border: '1px solid rgba(255, 255, 255, 0.1)',
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
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      onClick={handleNext}
                    >
                      <IconChevronRight size={20} />
                    </Button>
                  </>
                )}
              </Paper>

              {/* Caption */}
              {currentImage.caption && (
                <Text ta="center" c="gray.4" size="md" style={{ fontStyle: 'italic' }}>
                  {currentImage.caption}
                </Text>
              )}

              {/* Thumbnails */}
              {images.length > 1 && (
                <Group justify="center" gap="sm" wrap="wrap">
                  {images.map((image, index) => (
                    <motion.div
                      key={`thumb-${index}`}
                      variants={thumbnailVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      onClick={() => goToSlide(index)}
                      style={{
                        width: '80px',
                        height: '60px',
                        position: 'relative',
                        borderRadius: 'var(--mantine-radius-md)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: currentIndex === index 
                          ? '2px solid var(--mantine-color-blue-4)' 
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        opacity: currentIndex === index ? 1 : 0.6,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <NextImage
                        src={image.url}
                        alt={image.alt || `Thumbnail ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="80px"
                      />
                    </motion.div>
                  ))}
                </Group>
              )}

              {/* Counter */}
              {images.length > 1 && (
                <Text size="sm" c="gray.4" ta="center">
                  {currentIndex + 1} van {images.length}
                </Text>
              )}
            </Stack>
          </Container>
        </motion.div>

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
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
              }}
              onClick={() => setIsFullscreen(false)}
            >
              <Button
                variant="filled"
                color="dark"
                size="lg"
                style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '2rem',
                  zIndex: 10000,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                onClick={() => setIsFullscreen(false)}
              >
                <IconX size={20} />
              </Button>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                style={{
                  position: 'relative',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  aspectRatio: '16/9',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <NextImage
                  src={currentImage.url}
                  alt={currentImage.alt || `Gallery image ${currentIndex + 1}`}
                  fill
                  style={{ objectFit: 'contain' }}
                  quality={100}
                  sizes="90vw"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageErrorBoundary>
  );
} 
'use client';

import React, { useState, useCallback } from 'react';
import { Container, Paper, Text, Group, Avatar, Button, Stack, Box } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconQuote, IconStar } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageErrorBoundary from '@/components/features/shared/PageErrorBoundary';

interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    role?: string;
    company?: string;
    avatar?: string;
  };
  rating?: number;
  date?: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
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

const testimonialVariants = {
  enter: {
    x: 300,
    opacity: 0,
    scale: 0.9,
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: {
    zIndex: 0,
    x: -300,
    opacity: 0,
    scale: 0.9,
  },
} as const;

const indicatorVariants = {
  hidden: { opacity: 0.5, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.2 },
} as const;

export default function TestimonialSlider({ 
  testimonials, 
  title = "Wat klanten zeggen",
  autoPlay = true,
  autoPlayInterval = 8000 
}: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Validate testimonials prop
  if (!Array.isArray(testimonials)) {
    throw new Error('Testimonials must be an array');
  }

  if (!testimonials || testimonials.length === 0) {
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
            <IconQuote size={48} style={{ color: 'var(--mantine-color-gray-6)', marginBottom: '1rem' }} />
            <Text c="dimmed" size="lg">
              Momenteel geen testimonials beschikbaar.
            </Text>
          </Paper>
        </Container>
      </PageErrorBoundary>
    );
  }

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const interval = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, handleNext, testimonials.length]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') handlePrevious();
      if (event.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext]);

  const currentTestimonial = testimonials[currentIndex];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconStar
        key={i}
        size={16}
        style={{
          color: i < rating ? 'var(--mantine-color-yellow-4)' : 'var(--mantine-color-gray-6)',
          fill: i < rating ? 'var(--mantine-color-yellow-4)' : 'none',
        }}
      />
    ));
  };

  return (
    <PageErrorBoundary>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Container size="md" py="xl">
          <Stack gap="xl">
            {/* Title */}
            <Text size="xl" fw={600} ta="center" c="gray.2">
              {title}
            </Text>

            {/* Main Testimonial Container */}
            <Box style={{ position: 'relative', minHeight: '300px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={testimonialVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 }
                  }}
                >
                  <Paper
                    p="xl"
                    radius="lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05))',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                    }}
                  >
                    {/* Quote Icon */}
                    <IconQuote 
                      size={40} 
                      style={{ 
                        color: 'var(--mantine-color-blue-4)', 
                        opacity: 0.3,
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                      }} 
                    />

                    <Stack gap="lg" style={{ paddingTop: '1rem' }}>
                      {/* Rating */}
                      {currentTestimonial.rating && (
                        <Group justify="center" gap="xs">
                          {renderStars(currentTestimonial.rating)}
                        </Group>
                      )}

                      {/* Testimonial Content */}
                      <Text 
                        size="lg" 
                        ta="center"
                        style={{ 
                          fontStyle: 'italic',
                          lineHeight: 1.6,
                          fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                          color: 'var(--mantine-color-gray-2)',
                        }}
                      >
                        "{currentTestimonial.content}"
                      </Text>

                      {/* Author Info */}
                      <Group justify="center" gap="md">
                        <Avatar
                          src={currentTestimonial.author.avatar}
                          alt={currentTestimonial.author.name}
                          size="lg"
                          radius="xl"
                          style={{
                            border: '2px solid var(--mantine-color-blue-4)',
                          }}
                        />
                        <Stack gap={2} align="center">
                          <Text fw={600} c="gray.1">
                            {currentTestimonial.author.name}
                          </Text>
                          {currentTestimonial.author.role && (
                            <Text size="sm" c="dimmed">
                              {currentTestimonial.author.role}
                              {currentTestimonial.author.company && 
                                ` @ ${currentTestimonial.author.company}`
                              }
                            </Text>
                          )}
                          {currentTestimonial.date && (
                            <Text size="xs" c="gray.6">
                              {currentTestimonial.date}
                            </Text>
                          )}
                        </Stack>
                      </Group>
                    </Stack>
                  </Paper>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              {testimonials.length > 1 && (
                <>
                  <Button
                    variant="filled"
                    color="dark"
                    size="lg"
                    style={{
                      position: 'absolute',
                      left: '-1rem',
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
                      right: '-1rem',
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
            </Box>

            {/* Indicators */}
            {testimonials.length > 1 && (
              <Group justify="center" gap="sm">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={`indicator-${index}`}
                    variants={indicatorVariants}
                    whileHover="hover"
                    onClick={() => goToSlide(index)}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      background: index === currentIndex 
                        ? 'var(--mantine-color-blue-5)' 
                        : 'rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Group>
            )}

            {/* Counter */}
            {testimonials.length > 1 && (
              <Text size="sm" c="dimmed" ta="center">
                {currentIndex + 1} van {testimonials.length}
              </Text>
            )}
          </Stack>
        </Container>
      </motion.div>
    </PageErrorBoundary>
  );
} 
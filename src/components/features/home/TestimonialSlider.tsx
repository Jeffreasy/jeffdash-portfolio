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
              <IconQuote size={48} style={{ color: 'var(--mantine-color-gray-6)', marginBottom: '1rem' }} />
              <Text c="gray.4" size="lg">
                Momenteel geen testimonials beschikbaar.
              </Text>
            </Paper>
          </Container>
        </section>
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
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      }}>
        {/* Animated background elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '70%',
            right: '15%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Container size="md" py="xl">
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

                      <Stack gap="lg" style={{ paddingTop: '2rem' }}>
                        {/* Testimonial Content */}
                        <Text 
                          size="lg" 
                          c="gray.2" 
                          ta="center"
                          style={{ 
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                          }}
                        >
                          "{currentTestimonial.content}"
                        </Text>

                        {/* Rating */}
                        {currentTestimonial.rating && (
                          <Group justify="center" gap="xs">
                            {renderStars(currentTestimonial.rating)}
                          </Group>
                        )}

                        {/* Author Info */}
                        <Group justify="center" gap="md">
                          {currentTestimonial.author.avatar && (
                            <Avatar 
                              src={currentTestimonial.author.avatar} 
                              alt={currentTestimonial.author.name}
                              size="md"
                              radius="xl"
                              style={{
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                              }}
                            />
                          )}
                          <Stack gap={0} align="center">
                            <Text fw={600} c="gray.2">
                              {currentTestimonial.author.name}
                            </Text>
                            {(currentTestimonial.author.role || currentTestimonial.author.company) && (
                              <Text size="sm" c="gray.4">
                                {currentTestimonial.author.role}
                                {currentTestimonial.author.role && currentTestimonial.author.company && ' bij '}
                                {currentTestimonial.author.company}
                              </Text>
                            )}
                          </Stack>
                        </Group>
                      </Stack>
                    </Paper>
                  </motion.div>
                </AnimatePresence>
              </Box>

              {/* Navigation Controls */}
              {testimonials.length > 1 && (
                <Group justify="center" gap="md">
                  <Button
                    variant="outline"
                    color="gray"
                    size="md"
                    onClick={handlePrevious}
                    leftSection={<IconChevronLeft size={18} />}
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'var(--mantine-color-gray-2)',
                    }}
                  >
                    Vorige
                  </Button>

                  {/* Indicators */}
                  <Group gap="xs">
                    {testimonials.map((_, index) => (
                      <motion.div
                        key={index}
                        variants={indicatorVariants}
                        initial="hidden"
                        animate={currentIndex === index ? "visible" : "hidden"}
                        whileHover="hover"
                        onClick={() => goToSlide(index)}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: currentIndex === index 
                            ? 'var(--mantine-color-blue-4)' 
                            : 'rgba(255, 255, 255, 0.3)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </Group>

                  <Button
                    variant="outline"
                    color="gray"
                    size="md"
                    onClick={handleNext}
                    rightSection={<IconChevronRight size={18} />}
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'var(--mantine-color-gray-2)',
                    }}
                  >
                    Volgende
                  </Button>
                </Group>
              )}
            </Stack>
          </Container>
        </motion.div>
      </section>
    </PageErrorBoundary>
  );
} 
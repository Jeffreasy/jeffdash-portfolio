'use client';

import React from 'react';
import { Container, Card, Text, Group, Avatar, Button } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import SharedErrorBoundary from './SharedErrorBoundary';

interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  // Validate testimonials prop
  if (!Array.isArray(testimonials)) {
    throw new Error('Testimonials must be an array');
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <SharedErrorBoundary componentName="Testimonial Slider">
        <Container size="md" py="xl">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text c="dimmed" ta="center">
              Momenteel geen testimonials beschikbaar.
            </Text>
          </Card>
        </Container>
      </SharedErrorBoundary>
    );
  }

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <SharedErrorBoundary componentName="Testimonial Slider">
      <Container size="md" py="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" align="center" mb="md">
            <Button
              variant="light"
              onClick={handlePrevious}
              disabled={testimonials.length <= 1}
            >
              <IconChevronLeft size={16} />
            </Button>

            <Group gap="md">
              <Avatar
                src={currentTestimonial.author.avatar}
                alt={currentTestimonial.author.name}
                size="lg"
                radius="xl"
              />
              <div>
                <Text fw={500}>{currentTestimonial.author.name}</Text>
                {currentTestimonial.author.role && (
                  <Text size="sm" c="dimmed">{currentTestimonial.author.role}</Text>
                )}
              </div>
            </Group>

            <Button
              variant="light"
              onClick={handleNext}
              disabled={testimonials.length <= 1}
            >
              <IconChevronRight size={16} />
            </Button>
          </Group>

          <Text size="lg" style={{ fontStyle: 'italic' }}>
            "{currentTestimonial.content}"
          </Text>
        </Card>
      </Container>
    </SharedErrorBoundary>
  );
} 
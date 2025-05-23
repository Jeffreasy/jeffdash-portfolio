'use client';

import React from 'react';
import { Container, Image, Group, Button } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import SharedErrorBoundary from './SharedErrorBoundary';

interface ImageGalleryProps {
  images: Array<{
    url: string;
    alt?: string;
  }>;
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  // Validate images prop
  if (!Array.isArray(images)) {
    throw new Error('Images must be an array');
  }

  if (!images || images.length === 0) {
    return (
      <SharedErrorBoundary componentName="Image Gallery">
        <Container size="md" py="xl">
          <Image
            src="https://via.placeholder.com/800x450/dee2e6/868e96.png?text=Geen+Afbeeldingen"
            alt="No images available"
            fallbackSrc="https://via.placeholder.com/800x450/dee2e6/868e96.png?text=Image+Error"
          />
        </Container>
      </SharedErrorBoundary>
    );
  }

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <SharedErrorBoundary componentName="Image Gallery">
      <Container size="md" py="xl">
        <Group justify="center" align="center" wrap="nowrap">
          <Button
            variant="light"
            onClick={handlePrevious}
            disabled={images.length <= 1}
          >
            <IconChevronLeft size={16} />
          </Button>

          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || `Gallery image ${currentIndex + 1}`}
            fallbackSrc="https://via.placeholder.com/800x450/dee2e6/868e96.png?text=Image+Error"
            onError={(e) => {
              console.error('Error loading gallery image:', e);
              e.currentTarget.src = 'https://via.placeholder.com/800x450/dee2e6/868e96.png?text=Image+Error';
            }}
          />

          <Button
            variant="light"
            onClick={handleNext}
            disabled={images.length <= 1}
          >
            <IconChevronRight size={16} />
          </Button>
        </Group>
      </Container>
    </SharedErrorBoundary>
  );
} 
'use client';

import React, { useState, useEffect, useRef, ReactNode, Suspense } from 'react';
import { Skeleton, Container, Text, Center, Loader, Stack } from '@mantine/core';

interface ProgressiveLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number; // Intersection threshold (0-1)
  rootMargin?: string; // Margin around the root for triggering
  minHeight?: number; // Minimum height for skeleton
  showLoader?: boolean; // Show spinner instead of skeleton
  className?: string;
}

export default function ProgressiveLoader({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '100px',
  minHeight = 200,
  showLoader = false,
  className,
}: ProgressiveLoaderProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    
    if (!currentContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          // Small delay to simulate loading
          setTimeout(() => setIsLoaded(true), 100);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentContainer);

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [isInView, threshold, rootMargin]);

  // Default fallback loading component
  const defaultFallback = showLoader ? (
    <Center style={{ minHeight }}>
      <Stack gap="md" align="center">
        <Loader size="lg" />
        <Text size="sm" c="dimmed">
          Inhoud wordt geladen...
        </Text>
      </Stack>
    </Center>
  ) : (
    <Container>
      <Stack gap="md">
        <Skeleton height={minHeight * 0.4} radius="md" />
        <Skeleton height={20} width="70%" radius="sm" />
        <Skeleton height={20} width="90%" radius="sm" />
        <Skeleton height={20} width="60%" radius="sm" />
        <Stack gap="xs">
          <Skeleton height={40} width="150px" radius="md" />
          <Skeleton height={40} width="200px" radius="md" />
        </Stack>
      </Stack>
    </Container>
  );

  return (
    <div ref={containerRef} className={className}>
      {isInView ? (
        <Suspense fallback={fallback || defaultFallback}>
          <div style={{ 
            opacity: isLoaded ? 1 : 0, 
            transition: 'opacity 0.3s ease-in-out' 
          }}>
            {children}
          </div>
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
} 
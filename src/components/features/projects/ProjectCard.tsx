"use client"; // Image component vereist client-side rendering

import React, { useRef } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Card, Text, Stack, Badge, Group, Button } from '@mantine/core';
import type { FeaturedProjectType } from '@/lib/actions/projects';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import ProjectErrorBoundary from './ProjectErrorBoundary';

type ProjectCardProps = {
  project: FeaturedProjectType;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  // Validate project prop
  if (!project || typeof project !== 'object') {
    throw new Error('Invalid project data provided to ProjectCard');
  }

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set((event.clientX - left) / width - 0.5);
    mouseY.set((event.clientY - top) / height - 0.5);
  };

  // --- Tilt Animatie (Verfijnd) ---
  // Iets subtielere rotatie
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]); // Was 10
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]); // Was 10

  // Iets strakkere spring physics
  const springConfig = { stiffness: 350, damping: 35, mass: 1 }; // Iets stijver
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  // --- Interne Parallax (Nieuw) ---
  // Transformeer muispositie naar Z-translatie voor interne elementen
  // Verschillende ranges voor diepte effect
  const imageTranslateZ = useTransform(mouseY, [-0.5, 0.5], [-15, 35]); // Afbeelding beweegt meer
  const contentTranslateZ = useTransform(mouseY, [-0.5, 0.5], [-10, 25]);
  const buttonTranslateZ = useTransform(mouseY, [-0.5, 0.5], [-5, 45]); // Knop komt het meest naar voren

  const imageZSpring = useSpring(imageTranslateZ, springConfig);
  const contentZSpring = useSpring(contentTranslateZ, springConfig);
  const buttonZSpring = useSpring(buttonTranslateZ, springConfig);

  return (
    <ProjectErrorBoundary>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: '1000px',
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d', // Belangrijk voor interne Z-translatie
        }}
        whileHover={{ scale: 1.02 }} // Iets subtielere schaal
        transition={{ type: 'spring', stiffness: 350, damping: 35 }} // Overeenkomstige transitie
      >
        <Card
          shadow="sm" padding="lg" radius="md" withBorder h="100%"
          style={{ transformStyle: 'preserve-3d' }} // Ook hier preserve-3d
        >
          <Card.Section>
            <motion.div style={{ translateZ: imageZSpring }}> {/* Koppel Z aan spring */}
              <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                <NextImage
                  src={project.featuredImageUrl || 'https://via.placeholder.com/400x200/dee2e6/868e96.png?text=No+Image'}
                  alt={project.featuredImageAlt || project.title}
                  fill
                  loading="lazy" // Lazy loading voor betere performance
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={80} // Optimized quality
                  style={{ 
                    objectFit: 'cover',
                    transform: 'translateZ(0)' // Voorkom dubbele transformatie
                  }}
                  onError={(e) => {
                    console.error('Error loading project image:', e);
                    // Fallback to placeholder image
                    e.currentTarget.src = 'https://via.placeholder.com/400x200/dee2e6/868e96.png?text=Image+Error';
                  }}
                />
              </div>
            </motion.div>
          </Card.Section>

          <motion.div style={{ translateZ: contentZSpring }}> {/* Koppel Z aan spring */}
            <Stack
              mt="md" mb="xs" gap="xs"
              style={{ flexGrow: 1, transform: 'translateZ(0)' }} // Voorkom dubbele transformatie
            >
              <Text fw={600} size="lg" lineClamp={2}>{project.title}</Text>
              {project.shortDescription && (
                <Text size="sm" c="dimmed" lineClamp={3}>
                  {project.shortDescription}
                </Text>
              )}
              <Group gap="xs" mt="auto">
                {project.technologies?.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} size="sm" variant="light">
                    {tag}
                  </Badge>
                ))}
                {project.technologies && project.technologies.length > 3 && (
                   <Badge size="sm" variant="outline">+{project.technologies.length - 3}</Badge>
                )}
              </Group>
            </Stack>
          </motion.div>

          <motion.div style={{ translateZ: buttonZSpring }}> {/* Koppel Z aan spring */}
            <Button
              component={Link}
              href={`/projects/${project.slug}`}
              variant="light"
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              style={{ transform: 'translateZ(0)' }} // Voorkom dubbele transformatie
            >
              Bekijk Details
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </ProjectErrorBoundary>
  );
}

/*
// --- OORSPRONKELIJKE CODE HIERONDER (UITGECOMMENTEERD) ---
*/
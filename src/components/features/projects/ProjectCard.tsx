"use client"; // Image component requires client-side rendering

import React, { useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Card, Text, Stack, Badge, Group, Button, Paper } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import type { FeaturedProjectType, ProjectPreviewType } from '@/lib/actions/projects';
import { motion } from 'framer-motion';
import PageErrorBoundary from '../shared/PageErrorBoundary';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ProjectCardProps {
  project: FeaturedProjectType | ProjectPreviewType;
}

/**
 * ProjectCard Component
 * Displays a project card with image, details, and CTA button
 * Optimized animations without 3D transforms to prevent text blur
 * Accepts both FeaturedProjectType and ProjectPreviewType
 */
function ProjectCard({ project }: ProjectCardProps) {
  const { trackEvent } = useAnalytics();
  
  // Validate project prop
  if (!project || typeof project !== 'object') {
    throw new Error('Invalid project data provided to ProjectCard');
  }

  // Track card view on mount
  useEffect(() => {
    trackEvent('project_viewed', {
      action: 'project_card_viewed',
      project_id: project.id,
      project_title: project.title,
      project_slug: project.slug || 'unknown',
      has_featured_image: !!project.featuredImageUrl,
      has_description: !!project.shortDescription,
      technology_count: project.technologies?.length || 0,
      card_type: 'project_card'
    });
  }, [trackEvent, project]);

  // Handle card click (entire card)
  const handleCardClick = () => {
    trackEvent('project_viewed', {
      action: 'project_card_click',
      project_id: project.id,
      project_title: project.title,
      project_slug: project.slug || 'unknown',
      click_area: 'card_body'
    });
  };

  // Handle image click
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('project_viewed', {
      action: 'project_image_click',
      project_id: project.id,
      project_title: project.title,
      project_slug: project.slug || 'unknown',
      click_area: 'featured_image'
    });
  };

  // Handle technology tag click
  const handleTechnologyClick = (technology: string, e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('navigation_clicked', {
      action: 'technology_tag_click',
      element: 'project_technology',
      technology_name: technology,
      project_id: project.id,
      project_title: project.title
    });
  };

  // Handle CTA button click
  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('project_viewed', {
      action: 'project_cta_click',
      project_id: project.id,
      project_title: project.title,
      project_slug: project.slug || 'unknown',
      click_area: 'cta_button',
      button_text: 'Bekijk Project'
    });
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    trackEvent('image_load_error', {
      project_id: project.id,
      original_src: project.featuredImageUrl || 'none',
      attempted_src: e.currentTarget.src,
      fallback_src: 'https://via.placeholder.com/800x500/1f2937/9ca3af.png?text=Image+Error'
    });
    
    console.error('Error loading project image:', e);
    e.currentTarget.src = 'https://via.placeholder.com/800x500/1f2937/9ca3af.png?text=Image+Error';
  };

  return (
    <PageErrorBoundary>
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
          padding={0}
          radius="lg" 
          withBorder 
          h="100%"
          onClick={handleCardClick}
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
          {/* Image section */}
          <Card.Section>
            <motion.div 
              style={{ 
                margin: 'var(--mantine-spacing-md)',
                marginBottom: 0,
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={handleImageClick}
            >
              <Paper 
                radius="md" 
                style={{ 
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)',
                }}
              >
                <NextImage
                  src={project.featuredImageUrl || 'https://via.placeholder.com/800x500/1f2937/9ca3af.png?text=No+Image'}
                  alt={project.featuredImageAlt || project.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={85}
                  style={{ 
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.3s ease',
                  }}
                  onError={handleImageError}
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
              </Paper>
            </motion.div>
          </Card.Section>

          {/* Content section - NO 3D transforms for sharp text */}
          <div style={{ 
            padding: 'var(--mantine-spacing-md) var(--mantine-spacing-lg) var(--mantine-spacing-md)',
          }}>
            <Stack gap="sm" style={{ flexGrow: 1, minHeight: 140 }}>
              <Text 
                fw={600} 
                size="lg" 
                lineClamp={2}
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
                {project.title}
              </Text>
              
              {project.shortDescription && (
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
                  {project.shortDescription}
                </Text>
              )}
              
              {/* Technology badges */}
              <Group gap="xs" mt="auto" style={{ flexWrap: 'wrap', minHeight: '2rem' }}>
                {project.technologies?.slice(0, 3).map((tag: string) => (
                  <Badge 
                    key={tag} 
                    size="sm" 
                    variant="light"
                    onClick={(e) => handleTechnologyClick(tag, e)}
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: 'var(--mantine-color-blue-3)',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
                {project.technologies && project.technologies.length > 3 && (
                  <Badge 
                    size="sm" 
                    variant="outline"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'var(--mantine-color-gray-4)',
                    }}
                  >
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </Group>
            </Stack>
          </div>

          {/* CTA Section */}
          <div style={{ 
            padding: '0 var(--mantine-spacing-lg) var(--mantine-spacing-lg)',
          }}>
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
                href={`/projects/${project.slug}`}
                onClick={handleCtaClick}
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
                Bekijk Project
              </Button>
            </motion.div>
          </div>

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
    </PageErrorBoundary>
  );
}

export default ProjectCard;
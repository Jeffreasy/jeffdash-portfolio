'use client';

import React, { useState, useEffect } from 'react';
import { Title, SimpleGrid, Container, Button, Group } from '@mantine/core';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import BlogPostCard from '@/components/features/blog/BlogPostCard';
import type { PublishedPostPreviewType } from '@/lib/actions/blog';
import { useAnalytics } from '@/hooks/useAnalytics';

interface RecentBlogSectionProps {
  posts: PublishedPostPreviewType[];
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
} as const;

export default function RecentBlogSection({ posts }: RecentBlogSectionProps) {
  // Prevent hydration mismatch by ensuring animations only run client-side
  const [isClient, setIsClient] = useState(false);
  const { trackEvent, trackPageView } = useAnalytics();

  useEffect(() => {
    setIsClient(true);
    
    // Track section view
    trackPageView('blog_section_viewed', {
      section: 'recent_blog_section',
      total_posts: posts?.length || 0,
      has_posts: !!(posts && posts.length > 0)
    });
  }, [trackPageView, posts]);

  // Handle "View All Posts" button click
  const handleViewAllClick = () => {
    trackEvent('blog_post_clicked', {
      action: 'view_all_posts',
      element: 'blog_section_cta',
      destination: '/blog',
      section: 'recent_blog',
      current_page: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });
  };

  // Handle individual blog post clicks
  const handleBlogPostClick = (post: PublishedPostPreviewType) => {
    trackEvent('blog_post_clicked', {
      action: 'post_click',
      post_id: post.id,
      post_title: post.title,
      post_slug: post.slug || 'unknown',
      section: 'recent_blog',
      current_page: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });
  };

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section 
      aria-labelledby="recent-blog-title" 
      style={{ 
        position: 'relative',
        overflow: 'hidden',
        background: `
          linear-gradient(180deg, 
            transparent 0%, 
            rgba(0, 0, 0, 0.2) 15%, 
            rgba(15, 23, 42, 0.95) 25%, 
            rgba(15, 23, 42, 0.95) 75%, 
            rgba(0, 0, 0, 0.2) 85%, 
            transparent 100%
          )
        `,
        minHeight: '80vh',
        paddingTop: 'clamp(4rem, 8vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
      }}
    >
      {/* Animated background elements - only animate when client-side */}
      {isClient ? (
        <>
          <motion.div
            style={{
              position: 'absolute',
              top: '20%',
              left: '8%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
            }}
            animate={{
              x: [0, 25, 0],
              y: [0, -25, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            style={{
              position: 'absolute',
              top: '60%',
              right: '10%',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
            }}
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5,
            }}
          />
        </>
      ) : (
        <>
          {/* Static background elements for server-side rendering */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '8%',
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
            }}
          />
          
          <div
            style={{
              position: 'absolute',
              top: '60%',
              right: '10%',
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
            }}
          />
        </>
      )}

      <Container size="lg" py={{ base: 'xl', md: '3xl' }} style={{ position: 'relative', zIndex: 1 }}>
        {isClient ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants}>
              <Group justify="space-between" mb="xl">
                <Title 
                  order={2} 
                  id="recent-blog-title"
                  style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  Recente Blog Posts
                </Title>
                <Button
                   component={Link}
                   href="/blog"
                   onClick={handleViewAllClick}
                   variant="outline"
                   color="gray"
                   rightSection={<IconArrowRight size={16} />}
                   style={{
                     borderColor: 'rgba(255, 255, 255, 0.2)',
                     color: 'var(--mantine-color-gray-2)',
                   }}
                 >
                   Alle posts
                </Button>
              </Group>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SimpleGrid 
                cols={{ base: 1, sm: 2, lg: 3 }}
                spacing={{ base: "lg", sm: "xl" }}
                verticalSpacing={{ base: "xl", sm: "xl" }}
              >
                {posts.map((post, index) => (
                  <motion.div 
                    key={post.id} 
                    variants={itemVariants}
                    onClick={() => handleBlogPostClick(post)}
                    style={{ cursor: 'pointer' }}
                  >
                    <BlogPostCard post={post} />
                  </motion.div>
                ))}
              </SimpleGrid>
            </motion.div>
          </motion.div>
        ) : (
          // Static version for server-side rendering
          <div>
            <Group justify="space-between" mb="xl">
              <Title 
                order={2} 
                id="recent-blog-title"
                style={{
                  background: 'linear-gradient(135deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                }}
              >
                Recente Blog Posts
              </Title>
              <Button
                 component={Link}
                 href="/blog"
                 onClick={handleViewAllClick}
                 variant="outline"
                 color="gray"
                 rightSection={<IconArrowRight size={16} />}
                 style={{
                   borderColor: 'rgba(255, 255, 255, 0.2)',
                   color: 'var(--mantine-color-gray-2)',
                 }}
               >
                 Alle posts
              </Button>
            </Group>

            <SimpleGrid 
              cols={{ base: 1, sm: 2, lg: 3 }}
              spacing={{ base: "lg", sm: "xl" }}
              verticalSpacing={{ base: "xl", sm: "xl" }}
            >
              {posts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => handleBlogPostClick(post)}
                  style={{ cursor: 'pointer' }}
                >
                  <BlogPostCard post={post} />
                </div>
              ))}
            </SimpleGrid>
          </div>
        )}
      </Container>
    </section>
  );
} 
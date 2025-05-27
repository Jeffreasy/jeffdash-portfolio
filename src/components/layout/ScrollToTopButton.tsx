'use client';

import React, { useState, useEffect } from 'react';
import { ActionIcon, Transition } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '@/hooks/useAnalytics';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const { trackEvent } = useAnalytics();

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      const scrollPosition = window.pageYOffset;
      if (scrollPosition > 300) {
        if (!isVisible) {
          // Track when scroll-to-top button becomes visible
          trackEvent('scroll_to_top_used', {
            action: 'button_appeared',
            scroll_position: scrollPosition,
            page: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
          });
        }
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isVisible, trackEvent]);

  const scrollToTop = () => {
    const currentScrollPosition = window.pageYOffset;
    
    // Track scroll-to-top usage
    trackEvent('scroll_to_top_used', {
      action: 'button_clicked',
      scroll_position: currentScrollPosition,
      page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      scroll_distance: currentScrollPosition
    });

    setIsScrolling(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
          }}
        >
          <motion.div
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
          >
            <ActionIcon
              onClick={scrollToTop}
              size="xl"
              radius="xl"
              variant="filled"
              aria-label="Scroll naar boven"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(6, 182, 212, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              styles={{
                root: {
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 1) 0%, rgba(6, 182, 212, 1) 100%)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.5)',
                    transform: 'translateY(-2px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
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
              <motion.div
                animate={isScrolling ? {
                  y: [-2, 2, -2],
                  transition: {
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                } : {}}
              >
                <IconArrowUp size={20} />
              </motion.div>
            </ActionIcon>
          </motion.div>

          {/* Subtle pulse animation when first appearing */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: 2,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '60px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton; 
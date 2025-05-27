'use client';

import React, { useState, useEffect } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconSettings, IconShield } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

const AdminButton: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { trackEvent } = useAnalytics();

  // Check admin status using multiple methods
  useEffect(() => {
    const checkAdminStatus = () => {
      try {
        // Method 1: Check if we're already in admin area (user is logged in)
        const isInAdminArea = pathname?.startsWith('/admin_area');
        
        // Method 2: Check for various Supabase session indicators
        let hasSupabaseSession = false;
        
        if (typeof window !== 'undefined') {
          // Check localStorage for Supabase auth tokens
          const localStorageKeys = Object.keys(localStorage);
          const supabaseKeys = localStorageKeys.filter(key => 
            key.includes('supabase') || 
            key.includes('sb-') ||
            key.includes('auth')
          );
          
          // Debug: Log what we find in localStorage
          console.log('AdminButton Debug - localStorage keys:', localStorageKeys);
          console.log('AdminButton Debug - Supabase-related keys:', supabaseKeys);
          
          // Check for any Supabase session data
          hasSupabaseSession = supabaseKeys.some(key => {
            const value = localStorage.getItem(key);
            if (value) {
              try {
                const parsed = JSON.parse(value);
                // Look for session or access_token
                return parsed.access_token || 
                       parsed.session || 
                       (parsed.user && parsed.user.id);
              } catch {
                return false;
              }
            }
            return false;
          });
          
          // Also check sessionStorage
          const sessionStorageKeys = Object.keys(sessionStorage);
          const sessionSupabaseKeys = sessionStorageKeys.filter(key => 
            key.includes('supabase') || 
            key.includes('sb-') ||
            key.includes('auth')
          );
          
          console.log('AdminButton Debug - sessionStorage keys:', sessionStorageKeys);
          console.log('AdminButton Debug - Session Supabase-related keys:', sessionSupabaseKeys);
          
          if (!hasSupabaseSession) {
            hasSupabaseSession = sessionSupabaseKeys.some(key => {
              const value = sessionStorage.getItem(key);
              if (value) {
                try {
                  const parsed = JSON.parse(value);
                  return parsed.access_token || 
                         parsed.session || 
                         (parsed.user && parsed.user.id);
                } catch {
                  return false;
                }
              }
              return false;
            });
          }
        }
        
        // Method 3: Check for cookies (Supabase might use cookies)
        let hasSupabaseCookie = false;
        if (typeof document !== 'undefined') {
          const cookies = document.cookie;
          hasSupabaseCookie = cookies.includes('supabase') || 
                             cookies.includes('sb-') ||
                             cookies.includes('auth');
          console.log('AdminButton Debug - Document cookies contain Supabase:', hasSupabaseCookie);
        }

        const adminDetected = isInAdminArea || hasSupabaseSession || hasSupabaseCookie;
        
        console.log('AdminButton Debug - Admin detection:', {
          isInAdminArea,
          hasSupabaseSession,
          hasSupabaseCookie,
          adminDetected,
          pathname
        });

        // Track admin status detection
        if (adminDetected !== isAdmin) {
          trackEvent('navigation_clicked', {
            action: 'admin_status_detected',
            element: 'admin_button',
            admin_status: adminDetected,
            detection_method: isInAdminArea ? 'admin_area_path' : hasSupabaseSession ? 'supabase_session' : 'supabase_cookie',
            current_path: pathname || 'unknown'
          });
        }

        setIsAdmin(adminDetected);
      } catch (error) {
        console.error('Error checking admin status:', error);
        trackEvent('navigation_clicked', {
          action: 'admin_status_error',
          element: 'admin_button',
          error_message: error instanceof Error ? error.message : 'unknown_error',
          current_path: pathname || 'unknown'
        });
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();

    // Listen for storage changes (login/logout)
    const handleStorageChange = (e: StorageEvent) => {
      console.log('AdminButton Debug - Storage change detected:', e.key, e.newValue);
      trackEvent('navigation_clicked', {
        action: 'admin_storage_change',
        element: 'admin_button',
        storage_key: e.key || 'unknown',
        has_new_value: !!e.newValue,
        current_path: pathname || 'unknown'
      });
      checkAdminStatus();
    };

    // Listen for cookie changes (using a simple interval check)
    let lastCookies = typeof document !== 'undefined' ? document.cookie : '';
    const cookieCheckInterval = setInterval(() => {
      if (typeof document !== 'undefined') {
        const currentCookies = document.cookie;
        if (currentCookies !== lastCookies) {
          console.log('AdminButton Debug - Cookie change detected');
          trackEvent('navigation_clicked', {
            action: 'admin_cookie_change',
            element: 'admin_button',
            current_path: pathname || 'unknown'
          });
          lastCookies = currentCookies;
          checkAdminStatus();
        }
      }
    }, 1000);

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case of same-tab changes
    const statusCheckInterval = setInterval(checkAdminStatus, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(statusCheckInterval);
      clearInterval(cookieCheckInterval);
    };
  }, [pathname, isAdmin, trackEvent]);

  // Show button when page is scrolled down (same logic as ScrollToTopButton)
  useEffect(() => {
    const toggleVisibility = () => {
      const scrollPosition = window.pageYOffset;
      const shouldBeVisible = scrollPosition > 300;
      
      if (shouldBeVisible !== isVisible) {
        if (shouldBeVisible && isAdmin) {
          trackEvent('navigation_clicked', {
            action: 'admin_button_appeared',
            element: 'admin_button',
            scroll_position: scrollPosition,
            current_path: pathname || 'unknown'
          });
        }
        setIsVisible(shouldBeVisible);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isVisible, isAdmin, pathname, trackEvent]);

  const handleAdminClick = () => {
    console.log('AdminButton Debug - Admin button clicked, navigating to dashboard');
    
    trackEvent('navigation_clicked', {
      action: 'admin_button_clicked',
      element: 'admin_button',
      destination: '/admin_area/dashboard',
      current_path: pathname || 'unknown',
      scroll_position: window.pageYOffset || 0,
      admin_access_method: 'floating_button'
    });
    
    router.push('/admin_area/dashboard');
  };

  // Don't render anything while loading, if not admin, or if already in admin area
  if (isLoading || !isAdmin || pathname?.startsWith('/admin_area')) {
    console.log('AdminButton Debug - Not rendering button:', {
      isLoading,
      isAdmin,
      isInAdminArea: pathname?.startsWith('/admin_area'),
      pathname
    });
    return null;
  }

  console.log('AdminButton Debug - Rendering admin button');

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
            bottom: '5.5rem', // Position above the scroll-to-top button
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
            <Tooltip 
              label="Admin Panel" 
              position="left"
              styles={{
                tooltip: {
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(31, 41, 55, 0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--mantine-color-gray-2)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
              }}
            >
              <ActionIcon
                onClick={handleAdminClick}
                size="xl"
                radius="xl"
                variant="filled"
                aria-label="Open Admin Panel"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(124, 58, 237, 1) 100%)',
                      boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
                      transform: 'translateY(-2px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
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
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 3,
                  }}
                >
                  <IconSettings size={20} />
                </motion.div>
              </ActionIcon>
            </Tooltip>
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
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />

          {/* Security indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '16px',
              height: '16px',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconShield size={8} style={{ color: 'white' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminButton; 
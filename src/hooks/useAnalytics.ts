'use client';

import { track } from '@vercel/analytics';

// Analytics event types for type safety
export type AnalyticsEvent = 
  // Contact & Conversion Events
  | 'contact_form_started'
  | 'contact_form_submitted'
  | 'contact_form_error'
  | 'plan_selected'
  | 'plan_viewed'
  
  // Portfolio Engagement Events
  | 'project_viewed'
  | 'project_clicked'
  | 'hero_cta_clicked'
  | 'about_section_viewed'
  
  // Navigation & Interaction Events
  | 'scroll_to_top_used'
  | 'navigation_clicked'
  | 'social_link_clicked'
  | 'blog_post_clicked'
  
  // Performance Events
  | 'page_load_complete'
  | 'image_load_error';

export interface AnalyticsProperties {
  [key: string]: string | number | boolean;
}

export const useAnalytics = () => {
  const trackEvent = (eventName: AnalyticsEvent, properties?: Record<string, string | number | boolean | undefined>) => {
    try {
      // Only track in production or when explicitly enabled for development
      const shouldTrack = 
        process.env.NODE_ENV === 'production' || 
        process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';

      if (shouldTrack) {
        // Clean properties - remove undefined values and ensure correct types
        const cleanProperties: AnalyticsProperties | undefined = properties ? 
          Object.fromEntries(
            Object.entries(properties)
              .filter(([_, value]) => value !== undefined)
              .map(([key, value]) => [key, value as string | number | boolean])
          ) : undefined;

        track(eventName, cleanProperties);
        
        // Optional: Log in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Analytics Event:', eventName, cleanProperties);
        }
      }
    } catch (error) {
      // Fail silently in production, log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Analytics tracking failed:', error);
      }
    }
  };

  // Convenience methods for common events
  const trackPageView = (pageName: string, additionalProps?: Record<string, string | number | boolean | undefined>) => {
    trackEvent('page_load_complete', {
      page: pageName,
      timestamp: Date.now(),
      ...additionalProps
    });
  };

  const trackUserInteraction = (
    action: string, 
    element: string, 
    additionalProps?: Record<string, string | number | boolean | undefined>
  ) => {
    trackEvent('navigation_clicked', {
      action,
      element,
      page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      ...additionalProps
    });
  };

  const trackConversion = (
    type: 'contact' | 'plan_selection' | 'project_inquiry',
    value?: string | number,
    additionalProps?: Record<string, string | number | boolean | undefined>
  ) => {
    const eventMap = {
      contact: 'contact_form_submitted',
      plan_selection: 'plan_selected',
      project_inquiry: 'project_clicked'
    } as const;

    trackEvent(eventMap[type], {
      conversion_type: type,
      conversion_value: value,
      ...additionalProps
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackUserInteraction,
    trackConversion
  };
}; 
import { createTheme, MantineColorsTuple } from '@mantine/core';

// Custom color palette
const blue: MantineColorsTuple = [
  '#e7f5ff',
  '#d0ebff',
  '#a5d8ff',
  '#74c0fc',
  '#339af0',
  '#228be6',
  '#1c7ed6',
  '#1971c2',
  '#1864ab',
  '#145a94'
];

const cyan: MantineColorsTuple = [
  '#e3fafc',
  '#c5f6fa',
  '#99e9f2',
  '#66d9ef',
  '#3bc9db',
  '#22b8cf',
  '#15aabf',
  '#1098ad',
  '#0c8599',
  '#0b7285'
];

export const theme = createTheme({
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '700',
  },
  
  colors: {
    blue,
    cyan,
  },
  
  primaryColor: 'blue',
  
  // Global component defaults
  components: {
    Modal: {
      defaultProps: {
        centered: true,
        overlayProps: {
          backgroundOpacity: 0.7,
          blur: 4,
        },
        transitionProps: {
          transition: 'fade',
          duration: 200,
        },
        zIndex: 500,
      },
      styles: {
        root: {
          zIndex: 500,
        },
        overlay: {
          zIndex: 400,
          backdropFilter: 'blur(4px)',
        },
        content: {
          zIndex: 500,
          backgroundColor: 'var(--mantine-color-dark-7)',
          border: '1px solid var(--mantine-color-dark-4)',
        },
        inner: {
          zIndex: 500,
        },
        header: {
          backgroundColor: 'transparent',
          borderBottom: '1px solid var(--mantine-color-dark-4)',
        },
        title: {
          color: 'var(--mantine-color-gray-1)',
          fontWeight: 600,
        },
        body: {
          backgroundColor: 'transparent',
          color: 'var(--mantine-color-gray-3)',
        },
        close: {
          color: 'var(--mantine-color-gray-4)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--mantine-color-gray-2)',
          },
        },
      },
    },
    
    Drawer: {
      defaultProps: {
        overlayProps: {
          backgroundOpacity: 0.5,
          blur: 2,
        },
        transitionProps: {
          transition: 'slide-right',
          duration: 200,
        },
        zIndex: 550,
      },
      styles: {
        root: {
          zIndex: 550,
        },
        overlay: {
          zIndex: 540,
          backdropFilter: 'blur(2px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          zIndex: 550,
        },
      },
    },
    
    Notifications: {
      defaultProps: {
        position: 'top-right',
        limit: 5,
        autoClose: 5000,
        zIndex: 1000,
      },
      styles: {
        root: {
          zIndex: 1000,
        },
      },
    },
    
    Button: {
      defaultProps: {
        variant: 'filled',
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'all 200ms ease',
        },
      },
    },
    
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        withBorder: true,
      },
      styles: {
        root: {
          backgroundColor: 'var(--mantine-color-dark-6)',
          borderColor: 'var(--mantine-color-dark-4)',
        },
      },
    },
    
    Paper: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
      },
      styles: {
        root: {
          backgroundColor: 'var(--mantine-color-dark-6)',
        },
      },
    },
    
    Text: {
      styles: {
        root: {
          lineHeight: 1.6,
        },
      },
    },
    
    Title: {
      styles: {
        root: {
          lineHeight: 1.2,
        },
      },
    },
  },
  
  // Responsive breakpoints
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
}); 
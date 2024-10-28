import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Extend Window interface
declare global {
    interface Window {
        IS_REACT_ACT_ENVIRONMENT: boolean;
    }
}

// Configureer testing-library
configure({
  asyncUtilTimeout: 2000,  // Verhoog timeout voor async operaties
});

// Setup voor React 18 concurrent mode
window.IS_REACT_ACT_ENVIRONMENT = true;

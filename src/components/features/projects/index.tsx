/**
 * Projects Features Barrel Exports
 * Centralized exports for all project-related components
 */

export { default as ProjectCard } from './ProjectCard';
export { default as ProjectList } from './ProjectList';
export { default as ProjectDetailView } from './ProjectDetailView';

// Type exports
export type { 
  ProjectPreviewType,
  FeaturedProjectType, 
  FullProjectType 
} from '@/lib/actions/projects'; 
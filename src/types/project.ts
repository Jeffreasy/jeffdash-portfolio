export interface TechStack {
  name: string;
  icon: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface Challenge {
  problem: string;
  solution: string;
}

// Database types (exact match met Supabase)
export interface ProjectDB {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  image_url: string;
  technologies: string[];
  is_featured: boolean;
  github_url?: string;
  demo_url?: string;
  created_at: string;
  updated_at: string;
}

// Application types (voor de UI)
export interface Project extends ProjectDB {
  tech_stack: TechStack[];
  features: Feature[];
  challenges: Challenge[];
}

// Form data type
export type ProjectFormData = Omit<ProjectDB, 'id' | 'created_at' | 'updated_at'> & {
  tech_stack: TechStack[];
  features: Feature[];
  challenges: Challenge[];
};

// Type voor de database response
export type ProjectResponse = Omit<ProjectDB, 'tech_stack' | 'features' | 'challenges'> & {
  tech_stack?: TechStack[]
  features?: Feature[]
  challenges?: Challenge[]
}

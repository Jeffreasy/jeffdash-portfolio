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

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  short_description: string;
  image_url: string;
  tech_stack: TechStack[];
  live_url: string;
  github_url?: string;
  features: Feature[];
  challenges: Challenge[];
}

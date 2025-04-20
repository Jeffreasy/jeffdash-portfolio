import React from 'react';
import Card from '@/components/ui/Card'; // Gebruik de custom Card

// Definieer een basis type voor Project data
type Project = {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  slug: string;
};

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="mb-2" />} {/* Basic img tag, consider Next/Image later */}
      <h3 className="font-bold">{project.title}</h3>
      {project.description && <p className="text-sm text-gray-600">{project.description}</p>}
      {/* Voeg hier een Link toe naar /projects/[slug] */}
    </Card>
  );
} 
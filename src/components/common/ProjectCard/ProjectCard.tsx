import Image from "next/image"
import { motion } from "framer-motion"
import type { Database } from '@/types/supabase';
import { cn } from "@/lib/utils";

type Project = Database['public']['Tables']['projects']['Row'];

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

const PLACEHOLDER_IMAGE = '/images/project-placeholder.jpg'; // Voeg deze toe aan public/images/

export function ProjectCard({ project, className }: ProjectCardProps) {
  const { 
    title, 
    description, 
    image_url, 
    technologies, 
    github_url, 
    demo_url 
  } = project;

  return (
    <motion.div 
      className={cn("rounded-lg overflow-hidden border bg-background", className)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative h-48 md:h-64">
        <Image
          src={image_url || '/images/project-placeholder.jpg'}
          alt={title}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/project-placeholder.jpg';
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                <div className="w-4 h-4 relative shrink-0">
                  <Image
                    src={`/icons/${tech.toLowerCase()}.svg`}
                    alt={tech}
                    width={16}
                    height={16}
                    className="object-contain"
                    style={{ maxWidth: '16px', maxHeight: '16px' }}
                  />
                </div>
                <span className="truncate">{tech}</span>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-4">
          {demo_url && (
            <a
              href={demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <span>Live Demo</span>
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          )}
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <span>GitHub</span>
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

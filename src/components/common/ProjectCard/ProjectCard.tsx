import Image from "next/image"
import { motion } from "framer-motion"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  link: string
  className?: string
  tags?: string[]
}

export function ProjectCard({
  title,
  description,
  image,
  link,
  className = "",
  tags
}: ProjectCardProps) {
  return (
    <motion.div 
      className={`rounded-lg overflow-hidden border bg-background ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative h-48 md:h-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <span>Bekijk project</span>
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
      </div>
    </motion.div>
  )
}

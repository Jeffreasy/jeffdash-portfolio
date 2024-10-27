import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  link: string
  className?: string
}

export function ProjectCard({ title, description, image, link, className }: ProjectCardProps) {
  return (
    <Link 
      href={link}
      className={cn(
        "group relative flex flex-col space-y-2 rounded-lg border p-6 hover:border-foreground/50 transition-colors",
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Link>
  )
}

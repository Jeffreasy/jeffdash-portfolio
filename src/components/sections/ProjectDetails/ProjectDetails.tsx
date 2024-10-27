import { cn } from "@/lib/utils"
import Image from "next/image"

interface Feature {
  title: string
  description: string
}

interface Challenge {
  problem: string
  solution: string
}

interface Project {
  title: string
  description: string
  image: string
  techStack: string[]
  features: Feature[]
  challenges: Challenge[]
  link: string
}

const PROJECTS_DATA = [
  {
    title: "Whisky For Charity",
    description: "Een innovatief veilingplatform dat whiskyliefhebbers verbindt met goede doelen.",
    image: "/images/whiskyforcharity.jpg",
    techStack: [
      { name: "Next.js", icon: "/icons/nextjs.svg" },
      { name: "TypeScript", icon: "/icons/typescript.svg" },
      { name: "Tailwind CSS", icon: "/icons/tailwind.svg" },
      { name: "Prisma", icon: "/icons/prisma.svg" },
      { name: "PostgreSQL", icon: "/icons/postgresql.svg" }
    ],
    features: [
      {
        title: "Real-time Biedingen",
        description: "Geïmplementeerd met WebSocket technologie voor instant bid updates"
      },
      {
        title: "Beveiligde Betalingen",
        description: "Integratie met Stripe voor veilige transacties"
      },
      {
        title: "Authenticatie Systeem",
        description: "Gebruikersbeheer met verschillende rollen en permissies"
      }
    ],
    challenges: [
      {
        problem: "Concurrent Bidding",
        solution: "Ontwikkelde een robuust queue systeem om race conditions te voorkomen"
      },
      {
        problem: "Image Performance",
        solution: "Geïmplementeerd CDN en image optimization voor snelle laadtijden"
      }
    ],
    link: "https://whiskyforcharity.com"
  },
  {
    title: "De Koninklijke Loop",
    description: "Modern platform voor het organiseren en beheren van hardloopevenementen.",
    image: "/images/dekoninklijkeloop.jpg",
    techStack: [
      { name: "React", icon: "/icons/react.svg" },
      { name: "Node.js", icon: "/icons/nodejs.svg" },
      { name: "MongoDB", icon: "/icons/mongodb.svg" },
      { name: "Express", icon: "/icons/express.svg" }
    ],
    features: [
      {
        title: "Online Registratie",
        description: "Gestroomlijnd aanmeldproces met automatische bevestigingen"
      },
      {
        title: "Route Tracking",
        description: "Interactieve kaarten met real-time locatie updates"
      },
      {
        title: "Resultaten Dashboard",
        description: "Live tijdregistratie en automatische ranking systeem"
      }
    ],
    challenges: [
      {
        problem: "Piek Belasting",
        solution: "Geïmplementeerde caching en load balancing voor grote gebruikersaantallen"
      },
      {
        problem: "Mobile Responsiveness",
        solution: "Custom responsive design system voor optimale mobiele ervaring"
      }
    ],
    link: "https://dekoninklijkeloop.nl"
  }
]

export function ProjectDetails() {
  return (
    <section className="container py-12 space-y-24">
      {PROJECTS_DATA.map((project) => (
        <div key={project.title} className="flex flex-col gap-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">{project.title}</h2>
              <p className="text-lg text-muted-foreground">{project.description}</p>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Tech Stack</h3>
                <div className="flex gap-4 flex-wrap">
                  {project.techStack.map((tech) => (
                    <div key={tech.name} className="flex items-center gap-2 bg-background/5 px-3 py-1 rounded-full">
                      <Image src={tech.icon} alt={tech.name} width={16} height={16} />
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image 
                src={project.image} 
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Key Features</h3>
              <div className="space-y-4">
                {project.features.map((feature) => (
                  <div key={feature.title} className="space-y-2">
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Uitdagingen & Oplossingen</h3>
              <div className="space-y-4">
                {project.challenges.map((challenge) => (
                  <div key={challenge.problem} className="space-y-2">
                    <h4 className="font-medium">{challenge.problem}</h4>
                    <p className="text-muted-foreground">{challenge.solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

import Image from "next/image"

interface TechStackItem {
  name: string
  icon: string
}

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
  techStack: TechStackItem[]
  features: Feature[]
  challenges: Challenge[]
  link: string
}

const PROJECTS_DATA: Project[] = [
  {
    title: "Whisky For Charity",
    description: "Een innovatief veilingplatform dat whiskyliefhebbers verbindt met goede doelen.",
    image: "/images/WHSKSNAP.png",
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
    image: "/images/DKLSNAP.png",
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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8">Project Details</h2>
        <div className="grid gap-8">
          {PROJECTS_DATA.map((project) => (
            <div key={project.title} className="border rounded-lg p-6">
              <div className="flex gap-4">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                  <p className="mt-2">{project.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

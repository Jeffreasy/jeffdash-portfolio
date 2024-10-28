export interface TechStackItem {
  name: string
  icon: string
}

export interface Feature {
  title: string
  description: string
}

export interface Challenge {
  problem: string
  solution: string
}

export interface Project {
  title: string
  description: string
  shortDescription?: string
  image: string
  techStack: TechStackItem[]
  features: Feature[]
  challenges: Challenge[]
  link: string
  tags: string[]
  githubLink?: string
}

export const PROJECTS_DATA: Project[] = [
  {
    title: "Whisky For Charity",
    description: "Een innovatief veilingplatform dat whiskyliefhebbers verbindt met goede doelen.",
    shortDescription: "Een platform voor whisky veilingen met een goed doel. Gebouwd met moderne web technologieën voor een naadloze gebruikerservaring.",
    image: "/images/WHSKSNAP.png",
    techStack: [
      { name: "Next.js", icon: "/icons/next.svg" },
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
    link: "https://whiskyforcharity.com",
    tags: ["Next.js", "TypeScript", "Prisma"],
    githubLink: "https://github.com/yourusername/whisky-for-charity"
  },
  {
    title: "De Koninklijke Loop",
    description: "Modern platform voor het organiseren en beheren van hardloopevenementen.",
    shortDescription: "Website voor het hardloopevenement De Koninklijke Loop. Focus op gebruiksvriendelijkheid en performance.",
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
    link: "https://dekoninklijkeloop.nl",
    tags: ["React", "Node.js", "MongoDB"],
    githubLink: "https://github.com/yourusername/koninklijke-loop"
  }
]

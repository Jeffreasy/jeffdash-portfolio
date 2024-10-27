import { ProjectCard } from "@/components/common/ProjectCard/ProjectCard"

const FEATURED_PROJECTS = [
  {
    title: "Whisky For Charity",
    description: "Een platform voor whisky veilingen met een goed doel. Gebouwd met moderne web technologieën voor een naadloze gebruikerservaring.",
    image: "/images/whiskyforcharity.jpg", // We moeten deze afbeelding nog toevoegen
    link: "https://whiskyforcharity.com"
  },
  {
    title: "De Koninklijke Loop",
    description: "Website voor het hardloopevenement De Koninklijke Loop. Focus op gebruiksvriendelijkheid en performance.",
    image: "/images/dekoninklijkeloop.jpg", // We moeten deze afbeelding nog toevoegen
    link: "https://dekoninklijkeloop.nl"
  },
]

export function Projects() {
  return (
    <section className="container py-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Mijn Projecten</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}

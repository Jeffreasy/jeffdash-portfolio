import { ProjectCard } from "@/components/common/ProjectCard/ProjectCard"

const FEATURED_PROJECTS = [
  {
    title: "Whisky For Charity",
    description: "Een platform voor whisky veilingen met een goed doel. Gebouwd met moderne web technologieën voor een naadloze gebruikerservaring.",
    image: "/images/WHSKSNAP.png",
    link: "https://whiskyforcharity.com"
  },
  {
    title: "De Koninklijke Loop",
    description: "Website voor het hardloopevenement De Koninklijke Loop. Focus op gebruiksvriendelijkheid en performance.",
    image: "/images/DKLSNAP.png",
    link: "https://dekoninklijkeloop.nl"
  },
]

export function Projects() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8">Projecten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              image={project.image}
              link={project.link}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

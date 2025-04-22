import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Project Data - PLEASE REVIEW AND COMPLETE THIS DATA
  const projects = [
    {
      slug: 'whisky-for-charity', // Make sure this is unique and correct
      title: 'Whisky for Charity',
      shortDescription: 'Een moderne, interactieve veilingsite.', // Complete this
      detailedContent: 'Uitgebreide beschrijving van het Whisky for Charity project...', // Complete this
      liveUrl: 'https://www.whiskyforcharity.nl', // Verify URL
      githubUrl: 'https://github.com/Jeffreasy/whiskyforcharity', // Verify URL
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'TailwindCSS', 'PostgreSQL'], // Add technologies used
      category: 'Web Development',
      isFeatured: true, // Set if featured
    },
    {
      slug: 'de-koninklijke-loop', // Make sure this is unique and correct
      title: 'De koninklijke loop',
      shortDescription: 'De sponsorloop van mensen voor mensen.', // Complete this
      detailedContent: 'Een moderne webapplicatie voor het beheren van sponsorevenementen...', // Complete this
      liveUrl: 'https://www.dekoninklijkeloop.nl', // Verify URL
      githubUrl: 'https://github.com/Jeffreasy/koninklijkloop', // Verify URL
      technologies: ['React', 'Node.js', 'Express', 'MongoDB'], // Add technologies used
      category: 'Web Development',
      isFeatured: false,
    },
    {
      slug: 'drl-wenc-backend', // Make sure this is unique and correct
      title: 'DRL & W&C backend Service',
      shortDescription: 'Regelt de achterkant van de mailservice.', // Complete this
      detailedContent: 'Een robuuste en schaalbare backend service gebouwd met...', // Complete this
      liveUrl: 'https://drlemailservice.nl', // Verify URL (if applicable)
      githubUrl: 'https://github.com/Jeffreasy/DRLService', // Verify URL
      technologies: ['Node.js', 'Express', 'TypeScript'], // Add technologies used
      category: 'Backend',
      isFeatured: false,
    },
    // Add more projects if needed
  ];

  for (const projectData of projects) {
    const project = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: projectData, // Update existing project with this slug
      create: projectData, // Create new project if slug doesn't exist
    });
    console.log(`Created/updated project with id: ${project.id} (Slug: ${project.slug})`);
  }

  // Add seeding for other models like Posts, Users etc. if needed here

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
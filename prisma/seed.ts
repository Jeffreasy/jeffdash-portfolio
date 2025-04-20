// Placeholder voor database seeding logica
// Zie: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

async function main() {
  console.log(`Start seeding ...`);
  // Voeg hier je seeding logica toe
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // await prisma.$disconnect(); // Prisma client is hier nog niet per se beschikbaar
  }); 
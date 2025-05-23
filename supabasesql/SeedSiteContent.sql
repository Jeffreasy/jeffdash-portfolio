-- SiteContent seed data voor About pagina
-- Dit script voegt de about content toe aan de SiteContent tabel

INSERT INTO "public"."SiteContent" ("key", "value", "createdAt", "updatedAt") VALUES 
('about_contact', 'Bekijk gerust mijn profielen op LinkedIn en GitHub, of neem contact op als je vragen hebt of wilt samenwerken!', '2025-04-24 00:05:45.532', '2025-04-24 00:05:45.532'), 
('about_focus', 'Mijn focus ligt op het bouwen met cutting-edge technologieën zoals Next.js, React, TypeScript, en Prisma. Ik geniet ervan om complexe problemen om te zetten in elegante, schaalbare oplossingen. Of het nu gaat om het ontwikkelen van een interactieve frontend, het opzetten van een robuuste backend-API, of het optimaliseren van de database interactie, ik streef altijd naar de hoogste kwaliteit.', '2025-04-24 00:05:45.532', '2025-04-24 00:05:45.532'), 
('about_intro', 'Welkom op mijn portfolio! Ik ben Jeffrey Lavente, een enthousiaste en gedreven webontwikkelaar met een passie voor het creëren van moderne, gebruiksvriendelijke en performante webapplicaties.', '2025-04-24 00:05:45.532', '2025-04-24 00:05:45.532'), 
('about_projects', 'Op deze site vind je een selectie van mijn projecten die mijn vaardigheden en interesses weerspiegelen. Ik ben altijd op zoek naar nieuwe uitdagingen en mogelijkheden om te leren en te groeien als ontwikkelaar.', '2025-04-24 00:05:45.532', '2025-04-24 00:05:45.532'), 
('about_title', 'Over Mij', '2025-04-24 00:05:45.532', '2025-04-24 00:05:45.532'), 
('github_url', 'https://github.com/Jeffreasy', '2025-04-24 00:05:45.532', '2025-04-24 00:05:45.532'), 
('linkedin_url', 'https://www.linkedin.com/in/jeffrey-lavente-026a41330/', '2025-04-24 00:05:45.532', '2025-04-24 00:05:45.532');

-- Controleer of de data correct is toegevoegd
SELECT * FROM "public"."SiteContent" ORDER BY "key"; 
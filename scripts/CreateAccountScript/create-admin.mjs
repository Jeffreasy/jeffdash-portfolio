// scripts/CreateAccountScript/create-admin.mjs

// BELANGRIJK: Voer eerst `pnpm install` uit als je dat nog niet gedaan hebt na het toevoegen van bcrypt.
// BELANGRIJK: Vul hieronder de gewenste email en wachtwoord in!

const ADMIN_EMAIL = 'Laventejeffrey@gmail.com'; // <-- VERVANG DIT!
const ADMIN_PASSWORD = 'Bootje@12'; // <-- VERVANG DIT!
const ADMIN_NAME = 'J.J.A. Lavente'; // Optioneel: pas de naam aan

// --- Niet aanpassen onder deze lijn (tenzij je weet wat je doet) ---

import { PrismaClient } from '../../node_modules/.prisma/client/index.js'; // Controleer dit relatieve pad!
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  if (ADMIN_EMAIL === 'VUL_HIER_ADMIN_EMAIL_IN@example.com' || ADMIN_PASSWORD === 'VUL_HIER_WACHTWOORD_IN') {
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('!! FOUT: Vul eerst ADMIN_EMAIL en ADMIN_PASSWORD in dit script !!');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    return; // Stop uitvoering
  }

  console.log(`Poging om admin gebruiker aan te maken/bij te werken voor: ${ADMIN_EMAIL}`);

  try {
    // Hash het wachtwoord
    const saltRounds = 10; // Aanbevolen aantal salt rounds
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);
    console.log('Wachtwoord gehasht.');

    // Maak gebruiker aan of update bestaande (op basis van e-mail)
    const user = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        passwordHash: hashedPassword,
        name: ADMIN_NAME,
        role: 'ADMIN', // Zorg dat de rol altijd ADMIN is
      },
      create: {
        email: ADMIN_EMAIL,
        passwordHash: hashedPassword,
        name: ADMIN_NAME,
        role: 'ADMIN', // Zet rol op ADMIN bij aanmaken
      },
    });

    console.log(`✅ Succes! Admin gebruiker aangemaakt/bijgewerkt: ${user.email} (ID: ${user.id})`);

  } catch (error) {
    console.error('❌ Fout bij het aanmaken/bijwerken van admin gebruiker:', error);
  } finally {
    // Zorg dat de verbinding altijd gesloten wordt
    await prisma.$disconnect();
    console.log('Prisma verbinding gesloten.');
  }
}

// Roep de hoofdfunctie aan
main(); 
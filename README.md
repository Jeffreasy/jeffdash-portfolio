# jeffdash-portfolio

[**Voeg hier een pakkende en duidelijke beschrijving toe van jouw portfolio project.** Wat laat het zien? Wat is het doel?]

## ✨ Features

*   Dynamische weergave van projecten met gedetailleerde informatie (beschrijving, technieken, screenshots/demo).
*   Blogsectie voor het delen van artikelen en inzichten.
*   Geïntegreerd contactformulier voor eenvoudige communicatie.
*   Beveiligd beheerdersgedeelte (Admin Dashboard) voor het beheren van content (projecten, blogposts).

## 🚀 Tech Stack

*   **Framework:** Next.js (TypeScript)
*   **Hosting & Database:** Vercel (Platform & Vercel Postgres)
*   **ORM:** Prisma
*   **Styling:** Tailwind CSS, `tailwind-variants`
*   **UI Components:** Mantine (Core, Hooks, TipTap integratie), Headless UI
*   **Icons:** Heroicons, Tabler Icons

## 🛠️ Installatie en Lokaal Draaien

1.  Clone de repository:
    ```bash
    git clone https://github.com/Jeffreasy/jeffdash-portfolio.git
    cd jeffdash-portfolio
    ```
2.  Installeer dependencies (kies je package manager):
    ```bash
    npm install 
    # or
    yarn install
    # or
    pnpm install
    ```
3.  Stel de omgevingsvariabelen in. Maak een `.env.local` bestand aan (kopieer eventueel `.env.example`) en vul de benodigde variabelen in:
    ```env
    # Voorbeeld variabelen (pas aan naar jouw behoeften)
    DATABASE_URL="jouw_vercel_postgres_url"
    # NEXTAUTH_URL="http://localhost:3000" # Nodig als je NextAuth gebruikt
    # NEXTAUTH_SECRET="genereer_een_sterk_geheim" # Nodig als je NextAuth gebruikt
    # Voeg hier andere benodigde variabelen toe...
    ```
4.  Voer database migraties uit (indien van toepassing met Prisma):
    ```bash
    npx prisma migrate dev
    ```
5.  Start de development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
6.  Open [http://localhost:3000](http://localhost:3000) in je browser.

## 🔗 Live Demo

[**Voeg hier de link toe naar de live deployed versie van je portfolio (bijv. op Vercel)**]

## 📸 Screenshots

[**Voeg hier een of meerdere screenshots toe die je applicatie tonen.** Je kunt afbeeldingen direct in Markdown invoegen]

```markdown
![Beschrijving van Screenshot](pad/naar/screenshot.png)
```

## 🤝 Contact

Jeffrey - [**jouw email adres**] - [**Link naar je LinkedIn profiel (optioneel)**]

Project Link: [https://github.com/Jeffreasy/jeffdash-portfolio](https://github.com/Jeffreasy/jeffdash-portfolio)

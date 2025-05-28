# 🚧 Under Construction Mode

Deze feature stelt je in staat om tijdelijk een "onderhoud" pagina te tonen voor alle publieke bezoekers, terwijl admin toegang behouden blijft.

## 🎯 Hoe het werkt

### Activeren
Voeg deze environment variable toe aan je `.env.local` bestand:
```bash
UNDER_CONSTRUCTION=true
```

### Deactiveren
Zet de waarde op `false` of verwijder de variable:
```bash
UNDER_CONSTRUCTION=false
```
Of verwijder de regel helemaal.

## 🔐 Toegankelijke Routes tijdens Onderhoud

Tijdens onderhoud blijven deze routes toegankelijk:
- `/under-construction` - De onderhoudspagina zelf
- `/admin_area/*` - Alle admin pagina's (voor beheerders)
- `/login` - Login pagina voor admin toegang
- `/api/*` - API endpoints
- `/_next/*` - Next.js assets
- `/favicon.ico` - Favicon
- `/robots.txt` - Robots file
- `/sitemap.xml` - Sitemap

## 🚫 Geblokkeerde Routes tijdens Onderhoud

Deze publieke routes worden automatisch omgeleid naar de onderhoudspagina:
- `/` - Homepage
- `/about` - Over mij pagina
- `/projects` - Projecten pagina
- `/blog` - Blog pagina's
- `/contact` - Contact pagina
- `/test-auth` - Test authenticatie

## 🛡️ Beveiligingsfeatures

### Layout Bypass
- **Speciale Layout**: Under construction pagina gebruikt eigen layout zonder Header/Footer
- **Geen Navigatie**: Voorkomt doorklikken via menu items
- **URL Blokkering**: Directe URL toegang wordt geblokkeerd via middleware

### Extra Beveiliging
- **Right-click Disabled**: Context menu uitgeschakeld
- **Developer Tools**: F12, Ctrl+Shift+I, Ctrl+U geblokkeerd
- **Text Selection**: Tekst selectie uitgeschakeld
- **SEO Protection**: `noindex, nofollow` meta tags
- **Redirect Loops**: Intelligente redirect logica voorkomt loops

## 🎨 Onderhoudspagina Features

De onderhoudspagina (`/under-construction`) bevat:
- ✨ Moderne, responsive design
- 🎭 Smooth animaties met Framer Motion
- 📱 Mobile-first design (320px+)
- 🌙 Dark theme consistent met je portfolio
- 📧 Contact informatie voor dringende zaken
- 🚀 Preview van komende features
- 🛡️ Volledige navigatie blokkering

## 🔄 Deployment

### Vercel
Voeg de environment variable toe in je Vercel dashboard:
1. Ga naar je project settings
2. Environment Variables
3. Voeg toe: `UNDER_CONSTRUCTION` = `true`
4. Redeploy je applicatie

### Andere platforms
Voeg `UNDER_CONSTRUCTION=true` toe aan je environment variables.

## 🛠️ Technische Details

- **Middleware**: Controleert elke request en redirect indien nodig
- **Performance**: Minimale overhead, alleen een environment variable check
- **SEO**: Behoudt proper HTTP status codes + noindex tijdens onderhoud
- **Admin Access**: Volledig behouden tijdens onderhoud
- **API**: Blijft functioneel voor admin operaties
- **Layout Bypass**: Speciale layout voorkomt normale navigatie
- **Security**: Multiple layers van beveiliging tegen omzeiling

## 📝 Aanpassingen

Je kunt de onderhoudspagina aanpassen in:
```
src/app/under-construction/page.tsx
```

De speciale layout wijzigen in:
```
src/app/under-construction/layout.tsx
```

En de toegestane/geblokkeerde routes wijzigen in:
```
src/middleware.ts
```

## 🚀 Quick Start

1. **Activeer onderhoud:**
   ```bash
   echo "UNDER_CONSTRUCTION=true" >> .env.local
   ```

2. **Test lokaal:**
   ```bash
   npm run dev
   ```

3. **Bezoek je site** - Je ziet nu de onderhoudspagina

4. **Test navigatie** - Probeer `/about`, `/projects`, etc. → Alle omgeleid

5. **Admin toegang** - Ga naar `/admin_area` voor normale toegang

6. **Deactiveer onderhoud:**
   ```bash
   # Verwijder de regel uit .env.local of zet op false
   UNDER_CONSTRUCTION=false
   ```

## ⚠️ Belangrijke Opmerkingen

- **Complete Blokkering**: Alle publieke pagina's worden geblokkeerd
- **Admin Toegang**: Alleen admin routes blijven toegankelijk
- **SEO Impact**: Site wordt tijdelijk niet geïndexeerd
- **User Experience**: Bezoekers zien alleen onderhoudspagina
- **Instant Toggle**: Kan direct aan/uit geschakeld worden 
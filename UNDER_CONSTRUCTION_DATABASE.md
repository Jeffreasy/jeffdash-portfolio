# 🚧 Database-Based Under Construction Mode

Deze geavanceerde versie van de under construction feature gebruikt de database in plaats van alleen environment variables, waardoor je de onderhoudsmodus direct vanuit het admin panel kunt beheren.

## 🎯 Hoe het werkt

### Database Setup
1. **Voer de SQL migraties uit:**
   ```sql
   -- Voer uit in je Supabase SQL editor:
   -- 1. supabasesql/V1_4_SiteSettings.sql
   -- 2. supabasesql/RLSV1.5_SiteSettings.sql
   ```

2. **Verifieer de tabel:**
   ```sql
   SELECT * FROM "SiteSettings" WHERE key = 'under_construction';
   ```

### Admin Panel Beheer
1. **Ga naar Admin Panel:** `/admin_area/settings`
2. **Toggle Under Construction:** Gebruik de grote schakelaar bovenaan
3. **Pas berichten aan:** Wijzig onderhoudsbericht en contactgegevens
4. **Instant activatie:** Wijzigingen zijn direct actief

## 🔄 Fallback Systeem

Het systeem gebruikt een intelligente fallback hiërarchie:

1. **Database (Prioriteit 1):** `SiteSettings.under_construction`
2. **Environment Variable (Fallback):** `UNDER_CONSTRUCTION=true`

```typescript
// Middleware controleert beide bronnen:
async function getUnderConstructionStatus(supabase: any): Promise<boolean> {
  try {
    // Probeer database eerst
    const { data: setting } = await supabase
      .from('SiteSettings')
      .select('value')
      .eq('key', 'under_construction')
      .single();

    if (setting) {
      return setting.value === 'true';
    }
  } catch (error) {
    console.log('Database check failed, falling back to environment variable');
  }

  // Fallback naar environment variable
  return process.env.UNDER_CONSTRUCTION === 'true';
}
```

## 🛡️ Beveiligingsfeatures

### Database Beveiliging
- **RLS Policies:** Alleen admins kunnen settings wijzigen
- **Public Read:** Iedereen kan under construction status lezen
- **Admin Write:** Alleen geauthenticeerde admins kunnen wijzigen

### API Endpoints
- **Public:** `/api/site-status` - Controleer onderhoudsstatus
- **Admin:** `/api/admin/site-settings` - Beheer alle instellingen

### Toegangscontrole
```typescript
// Middleware controleert beide bronnen
const isUnderConstruction = await getUnderConstructionStatus(supabase);

// Toegestane routes tijdens onderhoud
const allowedRoutes = [
  '/under-construction',
  '/admin_area',      // Admin toegang behouden
  '/login',           // Login voor admins
  '/api',             // API endpoints
  '/_next',           // Next.js assets
];
```

## 🎨 Dynamische Content

De onderhoudspagina haalt content dynamisch uit de database:

### Configureerbare Instellingen
- `under_construction`: `true/false` - Hoofdschakelaar
- `maintenance_message`: Aangepast onderhoudsbericht
- `maintenance_contact_email`: Contact email tijdens onderhoud
- `site_name`: Site naam voor branding

### Automatische Updates
```typescript
// Under construction pagina haalt settings op:
const response = await fetch('/api/admin/site-settings');
const settings = response.json();

// Gebruikt dynamische content:
const maintenanceMessage = settings.maintenance_message || defaultMessage;
const contactEmail = settings.maintenance_contact_email || defaultEmail;
```

## 🚀 Deployment

### Vercel Deployment
1. **Database Setup:**
   - Voer SQL migraties uit in Supabase
   - Verifieer RLS policies zijn actief

2. **Environment Variables (Optioneel):**
   ```bash
   # Fallback voor als database niet beschikbaar is
   UNDER_CONSTRUCTION=false
   ```

3. **Deploy:**
   ```bash
   git push origin main
   # Vercel deploy automatisch
   ```

### Andere Platforms
- Zorg dat Supabase verbinding werkt
- Voer database migraties uit
- Deploy normaal

## 🔧 Admin Interface Features

### Under Construction Toggle
- **Grote schakelaar** met visuele status indicator
- **Real-time feedback** met notificaties
- **Status badge** (ACTIEF/INACTIEF)
- **Waarschuwing** wanneer actief

### Content Management
- **Onderhoudsbericht:** Volledig aanpasbaar
- **Contact email:** Dynamisch configureerbaar
- **Site naam:** Voor branding
- **Type validatie:** String, boolean, number, json

### User Experience
- **Loading states** tijdens updates
- **Error handling** met fallbacks
- **Success notifications** bij wijzigingen
- **Auto-refresh** van instellingen

## 📊 Monitoring & Logging

### Middleware Logging
```typescript
console.log(`Middleware: Under construction mode - redirecting ${pathname} to /under-construction`);
```

### Admin Actions
```typescript
// Speciale notificatie voor under construction toggle
if (key === 'under_construction') {
  notifications.show({
    title: isEnabled ? 'Under Construction Enabled' : 'Under Construction Disabled',
    message: isEnabled 
      ? 'Site is now in maintenance mode. Only admins can access the site.'
      : 'Site is now live. All users can access the site.',
    color: isEnabled ? 'orange' : 'green',
  });
}
```

## 🔄 Migration van Environment Variable

### Stap 1: Database Setup
```sql
-- Voer migraties uit
\i supabasesql/V1_4_SiteSettings.sql
\i supabasesql/RLSV1.5_SiteSettings.sql
```

### Stap 2: Huidige Status Migreren
```sql
-- Als je momenteel UNDER_CONSTRUCTION=true hebt:
UPDATE "SiteSettings" 
SET value = 'true' 
WHERE key = 'under_construction';
```

### Stap 3: Environment Variable Verwijderen
```bash
# Verwijder uit .env.local (optioneel, blijft als fallback)
# UNDER_CONSTRUCTION=true
```

### Stap 4: Test Admin Panel
1. Ga naar `/admin_area/settings`
2. Test de toggle functionaliteit
3. Verifieer dat wijzigingen direct actief zijn

## ⚠️ Belangrijke Opmerkingen

### Database Afhankelijkheid
- **Primaire bron:** Database heeft prioriteit
- **Fallback:** Environment variable als backup
- **Faalveilig:** Site blijft werken bij database problemen

### Performance
- **Caching:** Middleware cached database calls
- **Minimal overhead:** Alleen één database query per request
- **Fallback speed:** Environment variable is instant

### Admin Toegang
- **Altijd beschikbaar:** Admin routes blijven toegankelijk
- **Instant toggle:** Wijzigingen zijn direct actief
- **No downtime:** Geen herstart nodig

## 🛠️ Troubleshooting

### Database Verbinding Problemen
```typescript
// Middleware valt automatisch terug op environment variable
if (error) {
  console.log('Database check failed, falling back to environment variable');
  return process.env.UNDER_CONSTRUCTION === 'true';
}
```

### Admin Panel Niet Toegankelijk
1. Controleer Supabase verbinding
2. Verifieer RLS policies
3. Check admin user role in database

### Settings Niet Zichtbaar
```sql
-- Controleer of settings bestaan:
SELECT * FROM "SiteSettings";

-- Voeg handmatig toe indien nodig:
INSERT INTO "SiteSettings" (key, value, type) 
VALUES ('under_construction', 'false', 'boolean');
```

## 🎉 Voordelen van Database Approach

1. **Real-time Control:** Instant aan/uit zonder deployment
2. **Rich Content:** Aanpasbare berichten en contact info
3. **Admin Friendly:** Geen technische kennis vereist
4. **Audit Trail:** Database houdt wijzigingshistorie bij
5. **Scalable:** Eenvoudig uitbreidbaar met meer settings
6. **Reliable:** Fallback naar environment variables
7. **Secure:** RLS policies beschermen tegen ongeautoriseerde wijzigingen

Deze implementatie biedt de perfecte balans tussen gebruiksgemak, beveiliging en betrouwbaarheid voor het beheren van onderhoudsmodus op productie websites. 
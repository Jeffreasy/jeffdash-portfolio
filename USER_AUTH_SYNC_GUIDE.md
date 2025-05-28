# 🔐 User Authentication Sync Guide

## 📋 **Probleem**

Je hebt een mismatch tussen Supabase Auth en je User tabel:
- **Supabase Auth**: 2 gebruikers (`jeffrey@gmail.com` en `jeffrey@jeffdash.com`)
- **User tabel**: 1 gebruiker (alleen `jeffrey@gmail.com`)

## 🧠 **Hoe het werkt**

### **Supabase Auth vs User Tabel**

1. **Supabase Auth (`auth.users`)**:
   - Beheert authenticatie (login/logout)
   - Slaat wachtwoorden veilig op
   - Handelt email verificatie af
   - Beheert sessies en tokens

2. **User Tabel (`public.User`)**:
   - Slaat applicatie-specifieke data op
   - Beheert rollen (ADMIN/USER)
   - Slaat extra gebruikersinformatie op
   - Het `passwordHash` veld is een legacy veld dat niet meer gebruikt wordt

### **Waarom de `passwordHash`?**

Het `passwordHash` veld in je User tabel is waarschijnlijk overgebleven van een eerdere implementatie. Met Supabase Auth heb je dit veld niet meer nodig, maar we kunnen het niet zomaar weglaten omdat:
- Bestaande code er mogelijk naar verwijst
- Database constraints het vereisen
- We gebruiken nu een placeholder waarde

## 🛠️ **Stap-voor-Stap Oplossing**

### **Stap 1: Controleer Huidige Situatie**

Voer dit script uit in je Supabase SQL Editor:

```sql
-- Bekijk het bestand: supabasesql/CHECK_User_Auth_Status.sql
```

Dit toont je:
- Welke auth users ontbreken in de User tabel
- Welke User records geen auth account hebben
- Overzicht van admin gebruikers

### **Stap 2: Sync Bestaande Gebruikers**

Voer dit script uit om ontbrekende gebruikers toe te voegen:

```sql
-- Bekijk het bestand: supabasesql/SYNC_Auth_Users.sql
```

Dit script:
- ✅ Voegt ontbrekende auth users toe aan User tabel
- ✅ Gebruikt een placeholder voor `passwordHash`
- ✅ Stelt standaard rol in op 'USER'
- ✅ Laat je handmatig admin rollen toewijzen

### **Stap 3: Automatische Sync voor Nieuwe Gebruikers**

Voer dit script uit om automatische sync in te stellen:

```sql
-- Bekijk het bestand: supabasesql/AUTO_Sync_Auth_Users_Trigger.sql
```

Dit script:
- ✅ Maakt triggers die nieuwe auth users automatisch toevoegen
- ✅ Houdt gebruikersgegevens gesynchroniseerd
- ✅ Voorkomt toekomstige sync problemen

## 🎯 **Specifiek voor Jouw Situatie**

### **Voor `jeffrey@jeffdash.com`**

Na het uitvoeren van de sync scripts:

1. **Voeg de ontbrekende gebruiker toe**:
```sql
-- Dit wordt automatisch gedaan door SYNC_Auth_Users.sql
```

2. **Maak hem admin**:
```sql
UPDATE public."User" 
SET role = 'ADMIN' 
WHERE email = 'jeffrey@jeffdash.com';
```

3. **Controleer het resultaat**:
```sql
SELECT id, email, role, "createdAt" 
FROM public."User" 
WHERE role = 'ADMIN'
ORDER BY "createdAt";
```

## 🔧 **Troubleshooting**

### **Als je nog steeds problemen hebt:**

1. **Controleer RLS Policies**:
```sql
-- Zorg ervoor dat de RLS fix is toegepast
-- Bekijk: supabasesql/FIX_User_RLS_Infinite_Recursion.sql
```

2. **Controleer Triggers**:
```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name LIKE '%auth_user%';
```

3. **Test de Admin API**:
```javascript
// In browser console op je admin pagina
fetch('/api/admin/site-settings')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

## 📊 **Verificatie**

Na het uitvoeren van alle scripts, zou je dit moeten zien:

### **In Supabase Auth Dashboard**:
- ✅ 2 gebruikers: `jeffrey@gmail.com` en `jeffrey@jeffdash.com`

### **In User Tabel**:
- ✅ 2 records met dezelfde IDs als auth users
- ✅ Beide met role 'ADMIN' (als je dat wilt)
- ✅ Placeholder passwordHash waarden

### **In je Admin Panel**:
- ✅ Beide accounts kunnen inloggen
- ✅ Site Settings laden correct
- ✅ Under Construction toggle werkt

## 🚀 **Toekomstige Gebruikers**

Dankzij de triggers worden nieuwe gebruikers automatisch:
- ✅ Toegevoegd aan de User tabel bij registratie
- ✅ Krijgen standaard 'USER' rol
- ✅ Kunnen handmatig gepromoveerd worden tot 'ADMIN'

## 💡 **Best Practices**

1. **Admin Rollen**: Wees voorzichtig met wie je admin rechten geeft
2. **Monitoring**: Controleer regelmatig of auth en User tabel gesynchroniseerd zijn
3. **Backup**: Maak altijd een backup voor je database wijzigingen uitvoert
4. **Testing**: Test admin functionaliteit na elke wijziging

## 🔗 **Gerelateerde Bestanden**

- `supabasesql/CHECK_User_Auth_Status.sql` - Diagnostiek
- `supabasesql/SYNC_Auth_Users.sql` - Eenmalige sync
- `supabasesql/AUTO_Sync_Auth_Users_Trigger.sql` - Automatische sync
- `supabasesql/FIX_User_RLS_Infinite_Recursion.sql` - RLS fix
- `src/app/api/admin/site-settings/route.ts` - Admin API
- `src/components/admin/SiteSettingsManager.tsx` - Admin UI 
# Google Analytics Data API Setup Guide

## 🎯 Overzicht

Deze guide helpt je om Google Analytics Data API te configureren voor je dashboard, zodat je de laatste 7 dagen van pagina views, gebruikersdata en traffic analytics kunt bekijken.

## 📋 Vereisten

1. **Google Analytics 4 (GA4) property** - Geen Universal Analytics (UA)
2. **Google Cloud Project** met enabled APIs
3. **Service Account** met juiste permissions
4. **Environment variables** correct geconfigureerd

## 🚀 Stap-voor-stap Setup

### Stap 1: Google Cloud Project Setup

1. **Ga naar Google Cloud Console**: https://console.cloud.google.com/
2. **Creëer een nieuw project** of selecteer een bestaand project
3. **Enable de Google Analytics Data API**:
   ```bash
   # Via gcloud CLI
   gcloud services enable analyticsdata.googleapis.com
   
   # Of via de Console:
   # APIs & Services > Library > Search "Google Analytics Data API" > Enable
   ```

### Stap 2: Service Account Maken

1. **Ga naar IAM & Admin > Service Accounts**
2. **Click "Create Service Account"**:
   - **Name**: `ga-dashboard-reader`
   - **Description**: `Read access to Google Analytics data for dashboard`
3. **Click "Create and Continue"**
4. **Skip role assignment** (we doen dit later in GA4)
5. **Click "Done"**

### Stap 3: Service Account Key Genereren

1. **Click op je nieuwe service account**
2. **Ga naar "Keys" tab**
3. **Click "Add Key" > "Create new key"**
4. **Selecteer "JSON"** en download het bestand
5. **Bewaar dit bestand veilig** - dit zijn je credentials!

### Stap 4: GA4 Access Verlenen

1. **Ga naar Google Analytics**: https://analytics.google.com/
2. **Selecteer je GA4 property**
3. **Ga naar Admin (⚙️ icon)**
4. **Property Access Management**
5. **Click "+" en "Add users"**
6. **Voeg het service account email toe**:
   - Email: `ga-dashboard-reader@your-project-id.iam.gserviceaccount.com`
   - Role: **Viewer** (read-only access)
7. **Click "Add"**

### Stap 5: GA4 Property ID Vinden

1. **In Google Analytics > Admin**
2. **Property Settings**
3. **Kopieer de "PROPERTY ID"** (bijv. `123456789`)

### Stap 6: Environment Variables Configureren

Voeg deze variabelen toe aan je `.env.local`:

```bash
# Google Analytics 4 Property ID (van stap 5)
GA4_PROPERTY_ID=123456789

# Service Account Credentials (2 opties - kies er 1):

# Optie A: File path (aanbevolen voor development)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json

# Optie B: JSON string (aanbevolen voor production/Vercel)
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"your-project",...}
```

### Stap 7: Production Deployment (Vercel)

Voor Vercel deployment:

1. **Ga naar Vercel Dashboard** van je project
2. **Settings > Environment Variables**
3. **Voeg toe**:
   ```
   GA4_PROPERTY_ID = 123456789
   GOOGLE_APPLICATION_CREDENTIALS_JSON = [paste hele JSON van service account key]
   ```

## 🔧 Code Implementatie

De implementatie is al klaar in:
- **`src/lib/analytics/google-analytics.ts`** - API client
- **`src/app/admin_area/dashboard/page.tsx`** - Data fetching  
- **`src/components/admin/AdminDashboardClient.tsx`** - UI components

## 📊 Beschikbare Data

Het dashboard toont nu:

### Google Analytics Overview (7 dagen):
- **Totaal Gebruikers** - Unieke bezoekers
- **Totaal Sessies** - Website sessies  
- **Pagina Weergaven** - Totaal aantal page views
- **Bounce Rate** - Percentage single-page sessions

### Top Pagina's Tabel:
- **Pagina Titel** - Titel van de pagina
- **Pad** - URL path (klikbaar)
- **Weergaven** - Aantal page views
- **Sessies** - Aantal sessies  
- **Gem. Duur** - Gemiddelde sessie duur

## 🔍 Troubleshooting

### "Google Analytics not configured" Error

**Probleem**: Service account of Property ID ontbreekt
**Oplossing**: 
- Check `.env.local` voor `GA4_PROPERTY_ID`
- Check credentials configuratie
- Herstart development server

### "403 Forbidden" Error  

**Probleem**: Service account heeft geen toegang tot GA4 property
**Oplossing**:
- Check of service account email toegevoegd is in GA4
- Check of role "Viewer" is toegewezen
- Wacht 5-10 minuten voor permissions propagatie

### "Invalid credentials" Error

**Probleem**: Service account JSON is incorrect
**Oplossing**:
- Re-download service account key JSON
- Check of `GOOGLE_APPLICATION_CREDENTIALS_JSON` valid JSON is
- Check of alle quotes correct escaped zijn

### No Data Returned

**Probleem**: Property heeft geen data of verkeerde property ID
**Oplossing**:
- Check `GA4_PROPERTY_ID` in environment variables  
- Verify dat property recent traffic heeft
- Check of het GA4 property is (niet UA)

## 📝 Testing

Test je configuratie:

```bash
# Development
npm run dev

# Check dashboard op: http://localhost:3000/admin_area/dashboard
# Kijk naar "Debug Informatie" sectie voor status
```

## 🔐 Security Best Practices

1. **Nooit** service account keys committen naar Git
2. **Gebruik** environment variables voor alle credentials  
3. **Beperk** service account tot alleen "Viewer" role
4. **Roteer** service account keys regelmatig
5. **Monitor** API usage in Google Cloud Console

## 📈 Monitoring

- **Google Cloud Console** > APIs & Services > Quotas
- **Dashboard Debug sectie** toont API status
- **Browser DevTools** voor client-side errors
- **Vercel Logs** voor server-side errors

## 🆘 Support

Als je problemen hebt:
1. Check de Debug sectie in het dashboard
2. Check browser console voor errors
3. Check Vercel function logs  
4. Verify alle environment variables zijn correct gezet

---

✅ **Setup Compleet!** Je dashboard toont nu real-time Google Analytics data van je website traffic. 
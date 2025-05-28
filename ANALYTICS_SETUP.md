# Analytics Setup Guide

## Google Analytics Setup

### 1. Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your **Measurement ID** (format: G-XXXXXXXXXX)

### 2. Environment Variable
Add this to your `.env.local` file:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Verify Setup
1. Start your development server: `npm run dev`
2. Go to admin dashboard: `/admin_area/dashboard`
3. Check the debug section for Google Analytics status

## Current Analytics Stack

### ✅ Active Analytics
- **Vercel Analytics**: Built-in, always active
- **Custom Pricing Analytics**: Database tracking via `PricingPlanAnalytics` table
- **User Interaction Tracking**: Custom `useAnalytics` hook

### ⚠️ Conditional Analytics
- **Google Analytics**: Only loads if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- **Development Analytics**: Only if `NEXT_PUBLIC_ENABLE_ANALYTICS=true`

## Analytics Features in Dashboard

### 1. Pricing Analytics (Last 30 Days)
- **Total Views**: How many times pricing plans were viewed
- **Total Clicks**: Number of plan button clicks
- **Inquiries**: Contact requests through pricing
- **Conversion Rate**: Views to inquiries percentage
- **Popular Plan**: Most viewed/clicked plan

### 2. Recent Activity Feed
- Real-time user interactions
- Event types: view, click, inquiry, hover
- Plan names and timestamps
- Color-coded badges

### 3. Debug Information
- Authentication status
- Database query results
- Google Analytics status
- Error reporting

## Troubleshooting

### Analytics Error: "More than one relationship was found"
✅ **Fixed**: Simplified Supabase query to avoid relationship conflicts

### Google Analytics Not Loading
❌ **Issue**: Missing environment variable
✅ **Solution**: Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` to `.env.local`

### No Analytics Data
- Check if `PricingPlanAnalytics` table exists in Supabase
- Verify user interactions are being tracked
- Run SQL scripts in `supabasesql/` folder

## Testing Analytics

### 1. Google Analytics
```javascript
// Check in browser console:
typeof gtag !== 'undefined' // Should return true
```

### 2. Vercel Analytics
```javascript
// Check in browser console:
typeof window.va !== 'undefined' // Should return true
```

### 3. Custom Analytics
- Visit pricing section on homepage
- Hover and click on plans
- Check admin dashboard for activity

## Production Setup

### Environment Variables Needed:
```env
# Required for Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional for development tracking
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Deployment Checklist:
- [ ] Google Analytics property created
- [ ] Measurement ID added to environment variables
- [ ] Vercel Analytics enabled in project settings
- [ ] Test analytics in production environment
- [ ] Verify GDPR compliance if targeting EU users

## Advanced Analytics

### Custom Event Tracking
The project includes comprehensive event tracking:
- Page views and section visibility
- User interactions (clicks, hovers, scrolls)
- Form submissions and completions
- Plan selections and conversions
- Social media clicks
- Project and blog engagement

### Analytics Dashboard Features
- Real-time pricing analytics
- Conversion funnel tracking
- Popular content identification
- User behavior insights
- Performance metrics 
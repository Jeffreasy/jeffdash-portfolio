# 🔧 Troubleshooting Guide: "Failed to fetch settings" Error

## Problem
You're seeing the error "Failed to fetch settings" when trying to access the Site Settings in the admin panel.

## Root Cause Analysis

The error occurs because the API endpoint `/api/admin/site-settings` is returning a 401 Unauthorized error. This can happen for several reasons:

### 1. Database Migration Not Run
The `SiteSettings` table doesn't exist in your Supabase database.

### 2. User Not Admin
Your user account doesn't have the `ADMIN` role in the database.

### 3. Authentication Issues
There are problems with the Supabase authentication setup.

## Step-by-Step Solution

### Step 1: Check Database Tables

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project
   - Go to "Table Editor"

2. **Check if SiteSettings table exists**
   - Look for a table named `SiteSettings`
   - If it doesn't exist, proceed to Step 2

### Step 2: Run Database Migration

1. **Open SQL Editor in Supabase**
   - In your Supabase dashboard, go to "SQL Editor"

2. **Run the first migration script**
   ```sql
   -- Copy and paste the contents of supabasesql/V1_4_SiteSettings.sql
   -- This creates the SiteSettings table and seeds it with default data
   ```

3. **Run the second migration script**
   ```sql
   -- Copy and paste the contents of supabasesql/RLSV1.5_SiteSettings.sql
   -- This sets up Row Level Security policies
   ```

4. **Verify the table was created**
   ```sql
   SELECT * FROM "SiteSettings";
   ```
   You should see several rows with keys like `under_construction`, `maintenance_message`, etc.

### Step 3: Check User Role

1. **Check your user in the User table**
   ```sql
   SELECT id, email, role FROM "User" WHERE email = 'your-email@example.com';
   ```

2. **If your user doesn't exist, create it**
   ```sql
   INSERT INTO "User" (id, email, role) 
   VALUES ('your-supabase-user-id', 'your-email@example.com', 'ADMIN');
   ```

3. **If your user exists but isn't admin, update it**
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

### Step 4: Get Your Supabase User ID

If you don't know your Supabase user ID:

1. **Check in browser console**
   - Open developer tools (F12)
   - Go to the admin settings page
   - Click "Test Verbinding (Check Console)"
   - Look for the user ID in the console logs

2. **Or check in Supabase Auth**
   - Go to "Authentication" > "Users" in Supabase dashboard
   - Find your user and copy the ID

### Step 5: Test the Fix

1. **Refresh the admin settings page**
2. **Check browser console for any errors**
3. **Try the "Test Verbinding" button**

## Quick Verification Commands

Run these in your Supabase SQL Editor to verify everything is set up correctly:

```sql
-- 1. Check if SiteSettings table exists and has data
SELECT COUNT(*) as setting_count FROM "SiteSettings";

-- 2. Check if your user exists and has admin role
SELECT id, email, role FROM "User" WHERE role = 'ADMIN';

-- 3. Check RLS policies are enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'SiteSettings';

-- 4. Test if you can read settings (should work for everyone)
SELECT key, value FROM "SiteSettings" WHERE key = 'under_construction';
```

## Common Issues and Solutions

### Issue: "SiteSettings table does not exist"
**Solution:** Run the V1_4_SiteSettings.sql migration script.

### Issue: "User not found in database"
**Solution:** Create your user in the User table with ADMIN role.

### Issue: "Access denied. Admin role required"
**Solution:** Update your user's role to 'ADMIN' in the User table.

### Issue: "Authentication failed"
**Solution:** 
- Check if you're logged in to the admin panel
- Verify your Supabase environment variables
- Clear browser cookies and log in again

## Environment Variables Check

Make sure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Still Having Issues?

1. **Check browser console** for detailed error messages
2. **Check server logs** in your terminal where Next.js is running
3. **Verify Supabase connection** by testing other admin features
4. **Check network tab** in browser dev tools to see the exact API response

## Success Indicators

You'll know it's working when:
- ✅ The settings page loads without errors
- ✅ You can see the "Under Construction Mode" toggle
- ✅ You can toggle settings and see success notifications
- ✅ No errors in browser console

## Need More Help?

If you're still having issues, please share:
1. The exact error message from browser console
2. Your user role from the database
3. Whether the SiteSettings table exists
4. Any server-side error logs 
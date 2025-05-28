-- =====================================================
-- FIX: SiteSettings Trigger Function
-- Description: Fix the trigger function to use correct column name "updatedAt"
-- =====================================================

-- Drop the old trigger first
DROP TRIGGER IF EXISTS update_sitesettings_updated_at ON "SiteSettings";

-- Create the correct trigger function for SiteSettings with camelCase column names
CREATE OR REPLACE FUNCTION update_sitesettings_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the corrected trigger
CREATE TRIGGER update_sitesettings_updated_at
BEFORE UPDATE ON "SiteSettings"
FOR EACH ROW
EXECUTE FUNCTION update_sitesettings_updated_at_column();

-- Test the fix by updating a setting (using proper single quotes for string values)
UPDATE "SiteSettings" 
SET "value" = 'false' 
WHERE "key" = 'under_construction';

SELECT 'SiteSettings trigger fix applied successfully.' AS status; 
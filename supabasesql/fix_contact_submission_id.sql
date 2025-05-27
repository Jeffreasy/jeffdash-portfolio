-- Fix ContactSubmission table to auto-generate UUIDs for id column
-- This prevents the "null value in column id" error

-- Add default UUID generation to the id column
ALTER TABLE "ContactSubmission" 
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Verify the change
SELECT 
    column_name, 
    column_default, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'ContactSubmission' 
AND column_name = 'id';

-- Test insert without providing id (should work now)
-- INSERT INTO "ContactSubmission" (name, email, message) 
-- VALUES ('Test User', 'test@example.com', 'Test message'); 
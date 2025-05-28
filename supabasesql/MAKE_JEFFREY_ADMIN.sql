-- =====================================================
-- MAKE JEFFREY ADMIN
-- Description: Update jeffrey@jeffdash.com to ADMIN role
-- =====================================================

-- Update the specific user to ADMIN role
UPDATE public."User" 
SET 
  role = 'ADMIN',
  "updatedAt" = NOW()
WHERE id = 'da1b3c4d-a65e-4408-900f-2f900ea5e3d6'
  OR email = 'jeffrey@jeffdash.com';

-- Also update any other jeffrey accounts to ADMIN
UPDATE public."User" 
SET 
  role = 'ADMIN',
  "updatedAt" = NOW()
WHERE email IN ('jeffrey@gmail.com', 'jeffrey@jeffdash.com');

-- Verify the changes
SELECT 
  'ADMIN USERS AFTER UPDATE:' as status,
  id,
  email,
  role,
  "updatedAt"
FROM public."User" 
WHERE role = 'ADMIN'
ORDER BY "updatedAt" DESC;

-- Also show all jeffrey accounts
SELECT 
  'ALL JEFFREY ACCOUNTS:' as status,
  id,
  email,
  role,
  "createdAt",
  "updatedAt"
FROM public."User" 
WHERE email LIKE '%jeffrey%' OR email LIKE '%jeffdash%'
ORDER BY "createdAt";

SELECT '✅ Jeffrey accounts updated to ADMIN role!' as result; 
-- Execute this in Supabase SQL Editor to fix RLS policy
-- ======================================================

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "pricing_analytics_policy" ON "public"."PricingPlanAnalytics";

-- Create a new permissive policy that allows anonymous inserts for analytics
CREATE POLICY "allow_anonymous_pricing_analytics" ON "public"."PricingPlanAnalytics"
FOR INSERT 
WITH CHECK (true); -- Allow all inserts for analytics tracking

-- Also allow reading for analytics purposes  
CREATE POLICY "allow_anonymous_pricing_analytics_select" ON "public"."PricingPlanAnalytics"
FOR SELECT 
USING (true); -- Allow all reads for analytics

-- Seed Data for PricingCategories
-- ================================
INSERT INTO "public"."PricingCategories" ("id", "name", "description", "icon", "color", "sort_order", "is_active", "created_at", "updated_at") VALUES 
('05da8a13-009e-41bf-8c02-e148aea99e9a', 'Frontend', 'Modern frontend development', 'IconPalette', 'cyan', '1', 'true', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('6ae4f4a4-fa3d-4380-8f44-86ca25f7aa51', 'Full-Stack', 'Complete web applications', 'IconCode', 'blue', '3', 'true', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('756b4f1b-824e-4b4d-9151-0179702396ce', 'Backend', 'Server-side development', 'IconServer', 'violet', '2', 'true', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('7d0e651c-f6d0-488a-9819-4785e807e55e', 'Custom', 'Enterprise solutions', 'IconSettings', 'orange', '4', 'true', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Add your PricingPlanAnalytics data here if needed
INSERT INTO "public"."PricingPlanAnalytics" ("id", "plan_id", "event_type", "user_session", "user_agent", "ip_address", "referrer", "metadata", "created_at") VALUES 
('01c5bc33-b5d5-4cd4-8998-98f7136cc2e4', 'fba88632-bcff-480c-99f7-5d48466c4088', 'hover', 'session_1748467254451_l7yo3dig4', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', '::1', 'http://localhost:3000/', '{"plan_name": "Custom Enterprise", "view_method": "card_hover"}', '2025-05-28 21:38:52.05534+00')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pricing_analytics_plan_id ON "public"."PricingPlanAnalytics" (plan_id);
CREATE INDEX IF NOT EXISTS idx_pricing_analytics_created_at ON "public"."PricingPlanAnalytics" (created_at);
CREATE INDEX IF NOT EXISTS idx_pricing_analytics_event_type ON "public"."PricingPlanAnalytics" (event_type);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'PricingPlanAnalytics'; 
-- Fix RLS Policy for PricingPlanAnalytics
-- ========================================

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

-- Seed Data for PricingFeatures
-- ==============================
INSERT INTO "public"."PricingFeatures" ("id", "plan_id", "feature_text", "is_highlighted", "sort_order", "created_at", "updated_at") VALUES 
('07b1405c-81ec-4b7b-bdab-f209a58b02f4', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'Database Design & Optimalisatie', 'false', '2', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('11ce9b98-9f22-454c-8caf-373d48589d81', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'React/Next.js Development', 'false', '6', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('125ebaad-b932-4489-91d9-26617de138d0', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'Deployment naar Vercel/Netlify', 'false', '12', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('23c8e28a-e085-44e1-a93a-c51db4855a19', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'RESTful API Development', 'false', '1', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('25ebc594-e753-4511-8a80-446d7db9417f', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Uitgebreide consultatie fase', 'false', '8', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('29b068bc-04ab-4b42-b495-455c73549fab', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Enterprise-grade architectuur', 'false', '3', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('2ad654a5-bdfd-42f7-8356-233dc6256177', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'Modern UI/UX met Mantine/Tailwind', 'false', '3', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('2efcd4b6-c863-4d66-ae9e-5851a1d055d2', 'fba88632-bcff-480c-99f7-5d48466c4088', 'SLA garanties', 'false', '14', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('33b26593-78ef-47d5-8dcf-fa09fbe967f0', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'Server Deployment & Configuratie', 'false', '4', '2025-05-28 19:10:39.418086+00', '2025-05-28 19:10:39.418086+00'), 
('36ba1cd4-2832-4ae1-a434-da68d5325990', 'fba88632-bcff-480c-99f7-5d48466c4088', '24/7 support beschikbaar', 'false', '13', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('36dbaa40-d355-4b3d-95d3-51114ebb6025', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'Performance Optimalisatie', 'false', '7', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('3a8bbb64-f391-467b-ac69-d4ff960ca6b2', '4c741a9a-57bb-4aec-9a5f-2b3581f897e7', 'Admin Dashboard', 'false', '4', '2025-05-28 19:10:39.418086+00', '2025-05-28 19:10:39.418086+00'), 
('3ad45f38-443e-451d-a1dd-7d81956c0e5a', '4c741a9a-57bb-4aec-9a5f-2b3581f897e7', 'User Authentication Systeem', 'false', '3', '2025-05-28 19:10:39.418086+00', '2025-05-28 19:10:39.418086+00'), 
('3e5a89b6-4059-475c-865a-ba46fa13c2bf', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'Modern UI/UX met Mantine/Tailwind', 'false', '4', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('42383c6d-2ef4-4b00-8722-f27a0c943e50', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'Data Backup & Security', 'false', '6', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('4953a639-e569-4193-bc29-1836f36d5848', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', '6 maanden ondersteuning', 'false', '7', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('536d8396-3c1f-447b-823b-44956ba50a5b', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'Responsive Design (Mobile-first)', 'false', '2', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('5452d233-3321-4c36-88c8-d5f634c60411', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', '3 maanden ondersteuning', 'false', '11', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('5bb031c2-1525-4a28-a7d8-d76b4945ea18', '4c741a9a-57bb-4aec-9a5f-2b3581f897e7', 'Database Design & Implementation', 'false', '2', '2025-05-28 19:10:39.418086+00', '2025-05-28 19:10:39.418086+00'), 
('605b154a-4a6c-4671-a78c-b87acb2b4c9b', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'Third-party API Integraties', 'false', '4', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('6308e524-fdfe-482f-b2de-cf1ae034f46b', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'Responsive Design (Mobile-first)', 'false', '1', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('7fd01ede-0c55-424a-a27f-260b4ef07f55', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'React/Next.js Development', 'false', '5', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('87271364-a267-4123-8290-43bd5cbe3ee2', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'SEO-vriendelijke structuur', 'false', '9', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('88d39fdb-0e48-4bd9-be6e-69126933bba7', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'Authentication & Authorization', 'false', '3', '2025-05-28 19:10:39.418086+00', '2025-05-28 19:10:39.418086+00'), 
('88fee8c6-ce79-4b56-8a55-2e8c5cdfbd4c', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'Authentication & Authorization', 'false', '3', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('9d360ea8-a05a-459b-bbb9-54a934e42010', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Enterprise-grade architectuur', 'false', '4', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('a59aef2c-6491-440e-896f-fdf56b6372d3', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'Performance Optimalisatie', 'false', '8', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('afc1adda-d450-4762-8f17-9a75201700d1', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Scalability planning', 'false', '10', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('b1d71df3-03a5-461c-aa86-44e7ac996178', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'Performance Monitoring', 'false', '8', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('b3b00635-3cc1-4401-86a2-d8e1a109e420', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'Database Design & Optimalisatie', 'false', '2', '2025-05-28 19:10:39.418086+00', '2025-05-28 19:10:39.418086+00'), 
('b4bec292-0523-472f-bdaf-eaf078732a93', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Ongoing maintenance contract', 'false', '12', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('b5fe2da7-b7a4-4b79-8dcc-95ee7d5e22bd', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Dedicated project manager', 'false', '5', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('b7d0cab4-d773-4557-8891-09de6918666d', '5cc97ae4-b428-47b3-a6d6-27faeacc6d58', 'Cross-browser compatibiliteit', 'false', '10', '2025-05-28 21:47:08.571374+00', '2025-05-28 21:47:08.571374+00'), 
('bea96482-cd8a-41bc-98ba-601c77e986e2', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Uitgebreide consultatie fase', 'false', '7', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('c2095cd7-1f5a-44e4-a880-6ae77a9dc628', '4c741a9a-57bb-4aec-9a5f-2b3581f897e7', 'Complete Frontend & Backend', 'false', '1', '2025-05-28 19:10:39.418086+00', '2025-05-28 19:10:39.418086+00'), 
('c3dbde5c-9e91-40e4-b788-9c45f1ac2bc1', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'Server Deployment & Configuratie', 'false', '5', '2025-05-28 18:51:17.818653+00', '2025-05-28 18:51:17.818653+00'), 
('c3fecb26-4d26-43ec-a9c2-4c320dacd072', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Volledig maatwerk ontwikkeling', 'false', '2', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('d6ee1312-5ac1-4a48-9736-f8ea7d0d7330', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Training & documentatie', 'false', '11', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('dbb97480-0a2c-441e-9091-ed5f1b8b5c94', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Dedicated project manager', 'false', '6', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('f4b2625e-89ab-4ed9-9548-e08dca4bdf93', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Volledig maatwerk ontwikkeling', 'false', '1', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('f61c47d3-7d7f-4a85-ba94-c445e805d47b', 'fba88632-bcff-480c-99f7-5d48466c4088', 'Custom integraties & API's', 'false', '9', '2025-05-28 21:38:36.349448+00', '2025-05-28 21:38:36.349448+00'), 
('f912a56e-d103-4802-965c-16b1ef63a9c5', '5cfb3ca7-bb15-48dd-a1fb-908404fe3091', 'RESTful API Development', 'false', '1', '2025-05-28 19:10:39.418086+00', '2025-05-28 19:10:39.418086+00')
ON CONFLICT (id) DO UPDATE SET
  plan_id = EXCLUDED.plan_id,
  feature_text = EXCLUDED.feature_text,
  is_highlighted = EXCLUDED.is_highlighted,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_pricing_features_plan_id_sort ON "public"."PricingFeatures" (plan_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_pricing_categories_sort ON "public"."PricingCategories" (sort_order) WHERE is_active = true; 
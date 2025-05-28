-- =====================================================
-- FIX: Add Missing Pricing Plans Data
-- Description: Add only the missing tables and data without recreating existing triggers
-- =====================================================

-- Check if tables exist, create only if missing
CREATE TABLE IF NOT EXISTS "PricingCategories" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT,
    "icon" VARCHAR(50) NOT NULL,
    "color" VARCHAR(20) NOT NULL DEFAULT 'blue',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "PricingPlans" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "category_id" UUID NOT NULL REFERENCES "PricingCategories"("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "price" VARCHAR(50) NOT NULL,
    "original_price" VARCHAR(50),
    "period" VARCHAR(50) NOT NULL DEFAULT 'per project',
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "cta_text" VARCHAR(100) NOT NULL DEFAULT 'Start Project',
    "cta_variant" VARCHAR(20) NOT NULL DEFAULT 'outline',
    "gradient_from" VARCHAR(20) NOT NULL DEFAULT 'blue.6',
    "gradient_to" VARCHAR(20) NOT NULL DEFAULT 'cyan.6',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_cta_variant CHECK (cta_variant IN ('filled', 'outline', 'gradient'))
);

CREATE TABLE IF NOT EXISTS "PricingFeatures" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "plan_id" UUID NOT NULL REFERENCES "PricingPlans"("id") ON DELETE CASCADE,
    "feature_text" TEXT NOT NULL,
    "is_highlighted" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "PricingPlanAnalytics" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "plan_id" UUID NOT NULL REFERENCES "PricingPlans"("id") ON DELETE CASCADE,
    "event_type" VARCHAR(50) NOT NULL,
    "user_session" VARCHAR(100),
    "user_agent" TEXT,
    "ip_address" INET,
    "referrer" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_event_type CHECK (event_type IN ('view', 'click', 'inquiry', 'conversion', 'hover', 'modal_open'))
);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS "idx_pricing_categories_active" ON "PricingCategories"("is_active", "sort_order");
CREATE INDEX IF NOT EXISTS "idx_pricing_plans_category" ON "PricingPlans"("category_id", "is_active", "sort_order");
CREATE INDEX IF NOT EXISTS "idx_pricing_plans_popular" ON "PricingPlans"("is_popular", "is_active");
CREATE INDEX IF NOT EXISTS "idx_pricing_features_plan" ON "PricingFeatures"("plan_id", "sort_order");
CREATE INDEX IF NOT EXISTS "idx_pricing_analytics_plan" ON "PricingPlanAnalytics"("plan_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_pricing_analytics_event" ON "PricingPlanAnalytics"("event_type", "created_at");

-- Insert sample data (will be ignored if already exists due to conflicts)
INSERT INTO "PricingCategories" ("name", "description", "icon", "color", "sort_order") VALUES
('Frontend', 'Modern frontend development', 'IconPalette', 'cyan', 1),
('Backend', 'Server-side development', 'IconServer', 'violet', 2),
('Full-Stack', 'Complete web applications', 'IconCode', 'blue', 3),
('Custom', 'Enterprise solutions', 'IconSettings', 'orange', 4)
ON CONFLICT ("name") DO NOTHING;

-- Insert Plans (only if categories exist)
INSERT INTO "PricingPlans" (
    "category_id", "name", "description", "price", "original_price", "period",
    "is_popular", "cta_text", "cta_variant", "gradient_from", "gradient_to", "sort_order"
) 
SELECT 
    c."id",
    p.name,
    p.description,
    p.price,
    p.original_price,
    p.period,
    p.is_popular,
    p.cta_text,
    p.cta_variant,
    p.gradient_from,
    p.gradient_to,
    p.sort_order
FROM "PricingCategories" c
CROSS JOIN (VALUES
    ('Frontend', 'Frontend Specialist', 'Moderne, responsieve websites', '€849', '€999', 'per project', false, 'Start Frontend Project', 'outline', 'cyan.6', 'blue.6', 1),
    ('Backend', 'Backend Powerhouse', 'Robuuste server-side oplossingen', '€1249', '€1499', 'per project', false, 'Start Backend Project', 'outline', 'violet.6', 'purple.6', 2),
    ('Full-Stack', 'Full-Stack Complete', 'Volledige webapplicatie ervaring', '€1899', '€2499', 'per project', true, 'Start Full-Stack Project', 'gradient', 'blue.6', 'cyan.5', 3),
    ('Custom', 'Custom Enterprise', 'Maatwerk voor complexe projecten', 'Op maat', null, 'offerte op aanvraag', false, 'Vraag Offerte Aan', 'outline', 'orange.6', 'red.6', 4)
) AS p(category_name, name, description, price, original_price, period, is_popular, cta_text, cta_variant, gradient_from, gradient_to, sort_order)
WHERE c."name" = p.category_name
ON CONFLICT DO NOTHING;

-- Insert sample features for each plan
INSERT INTO "PricingFeatures" ("plan_id", "feature_text", "sort_order") 
SELECT p."id", f.feature_text, f.sort_order
FROM "PricingPlans" p
JOIN "PricingCategories" c ON p."category_id" = c."id"
CROSS JOIN (VALUES
    -- Frontend features
    ('Frontend', 'Frontend Specialist', 'Responsive Design (Mobile-first)', 1),
    ('Frontend', 'Frontend Specialist', 'Modern UI/UX met Mantine/Tailwind', 2),
    ('Frontend', 'Frontend Specialist', 'React/Next.js Development', 3),
    ('Frontend', 'Frontend Specialist', 'Performance Optimalisatie', 4),
    -- Backend features  
    ('Backend', 'Backend Powerhouse', 'RESTful API Development', 1),
    ('Backend', 'Backend Powerhouse', 'Database Design & Optimalisatie', 2),
    ('Backend', 'Backend Powerhouse', 'Authentication & Authorization', 3),
    ('Backend', 'Backend Powerhouse', 'Server Deployment & Configuratie', 4),
    -- Full-Stack features
    ('Full-Stack', 'Full-Stack Complete', 'Complete Frontend & Backend', 1),
    ('Full-Stack', 'Full-Stack Complete', 'Database Design & Implementation', 2),
    ('Full-Stack', 'Full-Stack Complete', 'User Authentication Systeem', 3),
    ('Full-Stack', 'Full-Stack Complete', 'Admin Dashboard', 4),
    -- Custom features
    ('Custom', 'Custom Enterprise', 'Volledig maatwerk ontwikkeling', 1),
    ('Custom', 'Custom Enterprise', 'Enterprise-grade architectuur', 2),
    ('Custom', 'Custom Enterprise', 'Dedicated project manager', 3),
    ('Custom', 'Custom Enterprise', 'Uitgebreide consultatie fase', 4)
) AS f(category_name, plan_name, feature_text, sort_order)
WHERE c."name" = f.category_name AND p."name" = f.plan_name
ON CONFLICT DO NOTHING;

-- Create or replace the view
DROP VIEW IF EXISTS "PricingPlansComplete" CASCADE;
CREATE VIEW "PricingPlansComplete" AS
SELECT 
    p."id",
    p."name",
    p."description",
    p."price",
    p."original_price",
    p."period",
    p."is_popular",
    p."is_active",
    p."cta_text",
    p."cta_variant",
    p."gradient_from",
    p."gradient_to",
    p."sort_order",
    c."name" as "category_name",
    c."icon" as "category_icon",
    c."color" as "category_color",
    c."is_active" as "category_is_active",
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', f."id",
                'text', f."feature_text",
                'highlighted', f."is_highlighted",
                'sort_order', f."sort_order"
            ) ORDER BY f."sort_order"
        ) FILTER (WHERE f."id" IS NOT NULL),
        '[]'::json
    ) as "features"
FROM "PricingPlans" p
JOIN "PricingCategories" c ON p."category_id" = c."id"
LEFT JOIN "PricingFeatures" f ON p."id" = f."plan_id"
WHERE p."is_active" = true AND c."is_active" = true
GROUP BY p."id", p."name", p."description", p."price", p."original_price", 
         p."period", p."is_popular", p."is_active", p."cta_text", p."cta_variant", 
         p."gradient_from", p."gradient_to", p."sort_order",
         c."name", c."icon", c."color", c."is_active"
ORDER BY p."sort_order";

-- Grant permissions
GRANT SELECT ON "PricingPlansComplete" TO anon, authenticated;

SELECT 'Pricing plans tables and view created/updated successfully.' AS status; 
-- =====================================================
-- PRICING PLANS DATABASE SCHEMA
-- Version: 1.5
-- Description: Complete pricing plans system with features, categories, and customization
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PRICING CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "PricingCategories" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT,
    "icon" VARCHAR(50) NOT NULL, -- Tabler icon name
    "color" VARCHAR(20) NOT NULL DEFAULT 'blue',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 2. PRICING PLANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "PricingPlans" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "category_id" UUID NOT NULL REFERENCES "PricingCategories"("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "price" VARCHAR(50) NOT NULL, -- Can be "€1299" or "Op maat"
    "original_price" VARCHAR(50), -- For showing discounts
    "period" VARCHAR(50) NOT NULL DEFAULT 'per project',
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "cta_text" VARCHAR(100) NOT NULL DEFAULT 'Start Project',
    "cta_variant" VARCHAR(20) NOT NULL DEFAULT 'outline', -- 'filled', 'outline', 'gradient'
    "gradient_from" VARCHAR(20) NOT NULL DEFAULT 'blue.6',
    "gradient_to" VARCHAR(20) NOT NULL DEFAULT 'cyan.6',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_cta_variant CHECK (cta_variant IN ('filled', 'outline', 'gradient'))
);

-- =====================================================
-- 3. PRICING FEATURES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "PricingFeatures" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "plan_id" UUID NOT NULL REFERENCES "PricingPlans"("id") ON DELETE CASCADE,
    "feature_text" TEXT NOT NULL,
    "is_highlighted" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 4. PRICING PLAN ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "PricingPlanAnalytics" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "plan_id" UUID NOT NULL REFERENCES "PricingPlans"("id") ON DELETE CASCADE,
    "event_type" VARCHAR(50) NOT NULL, -- 'view', 'click', 'inquiry'
    "user_session" VARCHAR(100),
    "user_agent" TEXT,
    "ip_address" INET,
    "referrer" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_event_type CHECK (event_type IN ('view', 'click', 'inquiry', 'conversion'))
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS "idx_pricing_categories_active" ON "PricingCategories"("is_active", "sort_order");
CREATE INDEX IF NOT EXISTS "idx_pricing_plans_category" ON "PricingPlans"("category_id", "is_active", "sort_order");
CREATE INDEX IF NOT EXISTS "idx_pricing_plans_popular" ON "PricingPlans"("is_popular", "is_active");
CREATE INDEX IF NOT EXISTS "idx_pricing_features_plan" ON "PricingFeatures"("plan_id", "sort_order");
CREATE INDEX IF NOT EXISTS "idx_pricing_analytics_plan" ON "PricingPlanAnalytics"("plan_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_pricing_analytics_event" ON "PricingPlanAnalytics"("event_type", "created_at");

-- =====================================================
-- 6. UPDATED_AT TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS update_pricing_categories_updated_at ON "PricingCategories";
DROP TRIGGER IF EXISTS update_pricing_plans_updated_at ON "PricingPlans";
DROP TRIGGER IF EXISTS update_pricing_features_updated_at ON "PricingFeatures";

CREATE TRIGGER update_pricing_categories_updated_at 
    BEFORE UPDATE ON "PricingCategories" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at 
    BEFORE UPDATE ON "PricingPlans" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_features_updated_at 
    BEFORE UPDATE ON "PricingFeatures" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. SAMPLE DATA INSERTION
-- =====================================================

-- Insert Categories
INSERT INTO "PricingCategories" ("name", "description", "icon", "color", "sort_order") VALUES
('Frontend', 'Modern frontend development', 'IconPalette', 'cyan', 1),
('Backend', 'Server-side development', 'IconServer', 'violet', 2),
('Full-Stack', 'Complete web applications', 'IconCode', 'blue', 3),
('Custom', 'Enterprise solutions', 'IconSettings', 'orange', 4)
ON CONFLICT ("name") DO NOTHING;

-- Insert Plans
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

-- Insert Features for Frontend Plan
INSERT INTO "PricingFeatures" ("plan_id", "feature_text", "sort_order") 
SELECT p."id", f.feature_text, f.sort_order
FROM "PricingPlans" p
JOIN "PricingCategories" c ON p."category_id" = c."id"
CROSS JOIN (VALUES
    ('Responsive Design (Mobile-first)', 1),
    ('Modern UI/UX met Mantine/Tailwind', 2),
    ('React/Next.js Development', 3),
    ('Performance Optimalisatie', 4),
    ('SEO-vriendelijke structuur', 5),
    ('Cross-browser compatibiliteit', 6),
    ('3 maanden ondersteuning', 7),
    ('Deployment naar Vercel/Netlify', 8)
) AS f(feature_text, sort_order)
WHERE c."name" = 'Frontend' AND p."name" = 'Frontend Specialist';

-- Insert Features for Backend Plan
INSERT INTO "PricingFeatures" ("plan_id", "feature_text", "sort_order") 
SELECT p."id", f.feature_text, f.sort_order
FROM "PricingPlans" p
JOIN "PricingCategories" c ON p."category_id" = c."id"
CROSS JOIN (VALUES
    ('RESTful API Development', 1),
    ('Database Design & Optimalisatie', 2),
    ('Authentication & Authorization', 3),
    ('Third-party API Integraties', 4),
    ('Server Deployment & Configuratie', 5),
    ('Data Backup & Security', 6),
    ('6 maanden ondersteuning', 7),
    ('Performance Monitoring', 8)
) AS f(feature_text, sort_order)
WHERE c."name" = 'Backend' AND p."name" = 'Backend Powerhouse';

-- Insert Features for Full-Stack Plan
INSERT INTO "PricingFeatures" ("plan_id", "feature_text", "sort_order") 
SELECT p."id", f.feature_text, f.sort_order
FROM "PricingPlans" p
JOIN "PricingCategories" c ON p."category_id" = c."id"
CROSS JOIN (VALUES
    ('Complete Frontend & Backend', 1),
    ('Database Design & Implementation', 2),
    ('User Authentication Systeem', 3),
    ('Admin Dashboard', 4),
    ('Real-time Features (WebSockets)', 5),
    ('Payment Gateway Integratie', 6),
    ('Automated Testing Suite', 7),
    ('CI/CD Pipeline Setup', 8),
    ('12 maanden ondersteuning', 9),
    ('Performance Optimalisatie', 10)
) AS f(feature_text, sort_order)
WHERE c."name" = 'Full-Stack' AND p."name" = 'Full-Stack Complete';

-- Insert Features for Custom Plan
INSERT INTO "PricingFeatures" ("plan_id", "feature_text", "sort_order") 
SELECT p."id", f.feature_text, f.sort_order
FROM "PricingPlans" p
JOIN "PricingCategories" c ON p."category_id" = c."id"
CROSS JOIN (VALUES
    ('Volledig maatwerk ontwikkeling', 1),
    ('Enterprise-grade architectuur', 2),
    ('Dedicated project manager', 3),
    ('Uitgebreide consultatie fase', 4),
    ('Custom integraties & API''s', 5),
    ('Scalability planning', 6),
    ('Training & documentatie', 7),
    ('Ongoing maintenance contract', 8),
    ('24/7 support beschikbaar', 9),
    ('SLA garanties', 10)
) AS f(feature_text, sort_order)
WHERE c."name" = 'Custom' AND p."name" = 'Custom Enterprise';

-- =====================================================
-- 8. USEFUL VIEWS
-- =====================================================

-- View for complete pricing data
CREATE OR REPLACE VIEW "PricingPlansComplete" AS
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

-- =====================================================
-- 9. ANALYTICS FUNCTIONS
-- =====================================================

-- Function to track pricing plan events
CREATE OR REPLACE FUNCTION track_pricing_event(
    p_plan_id UUID,
    p_event_type VARCHAR(50),
    p_user_session VARCHAR(100) DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO "PricingPlanAnalytics" (
        "plan_id",
        "event_type", 
        "user_session",
        "metadata"
    ) VALUES (
        p_plan_id,
        p_event_type,
        p_user_session,
        p_metadata
    ) RETURNING "id" INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get pricing analytics summary
CREATE OR REPLACE FUNCTION get_pricing_analytics_summary(
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    plan_name VARCHAR(100),
    total_views BIGINT,
    total_clicks BIGINT,
    total_inquiries BIGINT,
    conversion_rate NUMERIC(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p."name",
        COUNT(CASE WHEN a."event_type" = 'view' THEN 1 END) as total_views,
        COUNT(CASE WHEN a."event_type" = 'click' THEN 1 END) as total_clicks,
        COUNT(CASE WHEN a."event_type" = 'inquiry' THEN 1 END) as total_inquiries,
        CASE 
            WHEN COUNT(CASE WHEN a."event_type" = 'view' THEN 1 END) > 0 
            THEN ROUND(
                (COUNT(CASE WHEN a."event_type" = 'inquiry' THEN 1 END)::NUMERIC / 
                 COUNT(CASE WHEN a."event_type" = 'view' THEN 1 END)::NUMERIC) * 100, 
                2
            )
            ELSE 0
        END as conversion_rate
    FROM "PricingPlans" p
    LEFT JOIN "PricingPlanAnalytics" a ON p."id" = a."plan_id" 
        AND a."created_at" >= NOW() - INTERVAL '%s days' % p_days
    WHERE p."is_active" = true
    GROUP BY p."id", p."name"
    ORDER BY total_views DESC;
END;
$$ LANGUAGE plpgsql; 
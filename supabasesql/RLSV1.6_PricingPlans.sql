-- =====================================================
-- ROW LEVEL SECURITY POLICIES FOR PRICING PLANS
-- Version: 1.6
-- Description: RLS policies for pricing plans system
-- =====================================================

-- =====================================================
-- 1. ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE "PricingCategories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PricingPlans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PricingFeatures" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PricingPlanAnalytics" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. PRICING CATEGORIES POLICIES
-- =====================================================

-- Public read access for active categories
CREATE POLICY "PricingCategories_public_read" ON "PricingCategories"
    FOR SELECT
    USING (is_active = true);

-- Admin full access
CREATE POLICY "PricingCategories_admin_all" ON "PricingCategories"
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE "User"."id" = auth.uid()::text 
            AND "User"."role" = 'ADMIN'
        )
    );

-- =====================================================
-- 3. PRICING PLANS POLICIES
-- =====================================================

-- Public read access for active plans
CREATE POLICY "PricingPlans_public_read" ON "PricingPlans"
    FOR SELECT
    USING (is_active = true);

-- Admin full access
CREATE POLICY "PricingPlans_admin_all" ON "PricingPlans"
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE "User"."id" = auth.uid()::text 
            AND "User"."role" = 'ADMIN'
        )
    );

-- =====================================================
-- 4. PRICING FEATURES POLICIES
-- =====================================================

-- Public read access for features of active plans
CREATE POLICY "PricingFeatures_public_read" ON "PricingFeatures"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "PricingPlans" 
            WHERE "PricingPlans"."id" = "PricingFeatures"."plan_id" 
            AND "PricingPlans"."is_active" = true
        )
    );

-- Admin full access
CREATE POLICY "PricingFeatures_admin_all" ON "PricingFeatures"
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE "User"."id" = auth.uid()::text 
            AND "User"."role" = 'ADMIN'
        )
    );

-- =====================================================
-- 5. PRICING PLAN ANALYTICS POLICIES
-- =====================================================

-- Public insert access for analytics (anonymous tracking)
CREATE POLICY "PricingPlanAnalytics_public_insert" ON "PricingPlanAnalytics"
    FOR INSERT
    WITH CHECK (true); -- Allow anonymous analytics

-- Admin read access
CREATE POLICY "PricingPlanAnalytics_admin_read" ON "PricingPlanAnalytics"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE "User"."id" = auth.uid()::text 
            AND "User"."role" = 'ADMIN'
        )
    );

-- Admin update/delete access
CREATE POLICY "PricingPlanAnalytics_admin_modify" ON "PricingPlanAnalytics"
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE "User"."id" = auth.uid()::text 
            AND "User"."role" = 'ADMIN'
        )
    );

CREATE POLICY "PricingPlanAnalytics_admin_delete" ON "PricingPlanAnalytics"
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE "User"."id" = auth.uid()::text 
            AND "User"."role" = 'ADMIN'
        )
    );

-- =====================================================
-- 6. GRANT PERMISSIONS FOR VIEWS AND FUNCTIONS
-- =====================================================

-- Grant access to the complete pricing view for public
GRANT SELECT ON "PricingPlansComplete" TO anon, authenticated;

-- Grant execute permissions for analytics functions to admin users
GRANT EXECUTE ON FUNCTION track_pricing_event(UUID, VARCHAR, VARCHAR, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_pricing_analytics_summary(INTEGER) TO authenticated;

-- =====================================================
-- 7. ADDITIONAL SECURITY MEASURES
-- =====================================================

-- Ensure only valid plan IDs can be used in analytics
ALTER TABLE "PricingPlanAnalytics" 
ADD CONSTRAINT "valid_plan_id" 
FOREIGN KEY ("plan_id") REFERENCES "PricingPlans"("id") ON DELETE CASCADE;

-- Ensure event types are valid
ALTER TABLE "PricingPlanAnalytics" 
DROP CONSTRAINT IF EXISTS "valid_event_type";

ALTER TABLE "PricingPlanAnalytics" 
ADD CONSTRAINT "valid_event_type" 
CHECK ("event_type" IN ('view', 'click', 'inquiry', 'conversion', 'hover', 'modal_open'));

-- =====================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE "PricingCategories" IS 'Categories for organizing pricing plans (Frontend, Backend, etc.)';
COMMENT ON TABLE "PricingPlans" IS 'Individual pricing plans with details and configuration';
COMMENT ON TABLE "PricingFeatures" IS 'Features associated with each pricing plan';
COMMENT ON TABLE "PricingPlanAnalytics" IS 'Analytics tracking for pricing plan interactions';

COMMENT ON COLUMN "PricingCategories"."icon" IS 'Tabler icon name (e.g., IconPalette, IconServer)';
COMMENT ON COLUMN "PricingCategories"."color" IS 'Mantine color name (e.g., blue, cyan, violet)';
COMMENT ON COLUMN "PricingPlans"."cta_variant" IS 'Button variant: filled, outline, or gradient';
COMMENT ON COLUMN "PricingPlans"."gradient_from" IS 'Starting color for gradient (e.g., blue.6)';
COMMENT ON COLUMN "PricingPlans"."gradient_to" IS 'Ending color for gradient (e.g., cyan.6)';
COMMENT ON COLUMN "PricingPlanAnalytics"."event_type" IS 'Type of user interaction: view, click, inquiry, conversion, hover, modal_open';

-- =====================================================
-- 9. PERFORMANCE OPTIMIZATION
-- =====================================================

-- Additional indexes for common queries
CREATE INDEX IF NOT EXISTS "idx_pricing_plans_active_popular" 
ON "PricingPlans"("is_active", "is_popular", "sort_order");

-- Simple index without subquery - we'll rely on the foreign key constraint for data integrity
CREATE INDEX IF NOT EXISTS "idx_pricing_features_plan_active" 
ON "PricingFeatures"("plan_id", "sort_order");

CREATE INDEX IF NOT EXISTS "idx_pricing_analytics_recent" 
ON "PricingPlanAnalytics"("created_at" DESC, "event_type", "plan_id");

-- =====================================================
-- 10. VALIDATION FUNCTIONS
-- =====================================================

-- Function to validate pricing plan data
CREATE OR REPLACE FUNCTION validate_pricing_plan()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure only one popular plan per category
    IF NEW.is_popular = true THEN
        UPDATE "PricingPlans" 
        SET "is_popular" = false 
        WHERE "category_id" = NEW.category_id 
        AND "id" != NEW.id 
        AND "is_popular" = true;
    END IF;
    
    -- Ensure sort_order is unique within category
    IF EXISTS (
        SELECT 1 FROM "PricingPlans" 
        WHERE "category_id" = NEW.category_id 
        AND "sort_order" = NEW.sort_order 
        AND "id" != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
    ) THEN
        -- Auto-increment sort_order if conflict
        NEW.sort_order := (
            SELECT COALESCE(MAX("sort_order"), 0) + 1 
            FROM "PricingPlans" 
            WHERE "category_id" = NEW.category_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for pricing plan validation
DROP TRIGGER IF EXISTS "validate_pricing_plan_trigger" ON "PricingPlans";
CREATE TRIGGER "validate_pricing_plan_trigger"
    BEFORE INSERT OR UPDATE ON "PricingPlans"
    FOR EACH ROW EXECUTE FUNCTION validate_pricing_plan(); 
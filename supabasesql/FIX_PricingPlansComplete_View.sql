-- =====================================================
-- FIX: PricingPlansComplete View
-- Description: Force recreate the view to fix column issues
-- =====================================================

-- Force drop the view completely first
DROP VIEW IF EXISTS "PricingPlansComplete" CASCADE;

-- Now create the view fresh with the correct column structure
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

-- Grant access to the view
GRANT SELECT ON "PricingPlansComplete" TO anon, authenticated;

-- Test the view
SELECT COUNT(*) as plan_count FROM "PricingPlansComplete";

SELECT 'PricingPlansComplete view recreated successfully.' AS status; 
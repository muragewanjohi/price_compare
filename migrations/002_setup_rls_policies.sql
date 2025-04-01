BEGIN;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Users can create their own pricing pages" ON pricing_pages;
    DROP POLICY IF EXISTS "Users can view their own pricing pages" ON pricing_pages;
    DROP POLICY IF EXISTS "Users can update their own pricing pages" ON pricing_pages;
    DROP POLICY IF EXISTS "Users can delete their own pricing pages" ON pricing_pages;
    DROP POLICY IF EXISTS "Organization members can access pricing pages" ON pricing_pages;
    DROP POLICY IF EXISTS "Users can manage pricing tiers for their pages" ON pricing_tiers;
    DROP POLICY IF EXISTS "Users can manage their AB tests" ON ab_tests;
    DROP POLICY IF EXISTS "Users can manage test variants for their tests" ON test_variants;
    DROP POLICY IF EXISTS "Anyone can create conversions" ON conversions;
    DROP POLICY IF EXISTS "Users can view conversions for their variants" ON conversions;
    DROP POLICY IF EXISTS "Users can manage their stripe connections" ON stripe_connections;
    DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can view organizations they belong to" ON organizations;
    DROP POLICY IF EXISTS "Organization owners can manage organizations" ON organizations;
    DROP POLICY IF EXISTS "Allow users to see their own memberships" ON org_members;
    DROP POLICY IF EXISTS "Allow org owners to manage members" ON org_members;
    DROP POLICY IF EXISTS "Temporary full access to org_members" ON org_members;
END $$;

-- Enable RLS on tables
ALTER TABLE pricing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

-- Simple direct access policies first
CREATE POLICY "Enable all access for authenticated users"
ON pricing_pages FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable all access for authenticated users"
ON pricing_tiers FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM pricing_pages
    WHERE pricing_pages.id = pricing_tiers.pricing_page_id
    AND pricing_pages.user_id = auth.uid()
  )
);

CREATE POLICY "Enable all access for authenticated users"
ON ab_tests FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable all access for authenticated users"
ON test_variants FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM ab_tests
    WHERE ab_tests.id = test_variants.ab_test_id
    AND ab_tests.user_id = auth.uid()
  )
);

CREATE POLICY "Enable all access for authenticated users"
ON conversions FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users"
ON stripe_connections FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable all access for authenticated users"
ON profiles FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable all access for authenticated users"
ON organizations FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users"
ON org_members FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

COMMIT; 
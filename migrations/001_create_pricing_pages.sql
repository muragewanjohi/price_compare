-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pricing_pages table
CREATE TABLE IF NOT EXISTS pricing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    template TEXT NOT NULL,
    settings JSONB NOT NULL DEFAULT '{}',
    published_url TEXT,
    embed_code TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    org_id UUID REFERENCES organizations(id),
    owner_type TEXT NOT NULL DEFAULT 'user' CHECK (owner_type IN ('user', 'organization')),
    stripe_connection_id UUID REFERENCES stripe_connections(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create pricing_tiers table
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pricing_page_id UUID NOT NULL REFERENCES pricing_pages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL NOT NULL,
    interval TEXT NOT NULL CHECK (interval IN ('month', 'year', 'one_time')),
    currency TEXT NOT NULL DEFAULT 'usd',
    features JSONB NOT NULL DEFAULT '[]',
    highlight BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    stripe_price_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create ab_tests table
CREATE TABLE IF NOT EXISTS ab_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    metrics JSONB NOT NULL DEFAULT '[]',
    user_id UUID NOT NULL REFERENCES auth.users(id),
    org_id UUID REFERENCES organizations(id),
    owner_type TEXT NOT NULL DEFAULT 'user' CHECK (owner_type IN ('user', 'organization')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create test_variants table
CREATE TABLE IF NOT EXISTS test_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ab_test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
    pricing_page_id UUID NOT NULL REFERENCES pricing_pages(id),
    name TEXT NOT NULL,
    traffic_percentage INTEGER NOT NULL CHECK (traffic_percentage BETWEEN 0 AND 100),
    is_control BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create conversions table
CREATE TABLE IF NOT EXISTS conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES test_variants(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE pricing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own pricing pages"
    ON pricing_pages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pricing pages"
    ON pricing_pages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pricing pages"
    ON pricing_pages FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pricing pages"
    ON pricing_pages FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_pricing_pages_updated_at
    BEFORE UPDATE ON pricing_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_tiers_updated_at
    BEFORE UPDATE ON pricing_tiers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ab_tests_updated_at
    BEFORE UPDATE ON ab_tests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_variants_updated_at
    BEFORE UPDATE ON test_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 
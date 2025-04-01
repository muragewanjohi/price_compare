-- Drop existing table if it exists
DROP TABLE IF EXISTS pricing_tiers;

-- Create pricing_tiers table
CREATE TABLE pricing_tiers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pricing_page_id UUID NOT NULL REFERENCES pricing_pages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year', 'one_time')),
  currency TEXT NOT NULL DEFAULT 'usd',
  features JSONB DEFAULT '[]'::jsonb,
  highlight BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  stripe_price_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add interval column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'pricing_tiers' AND column_name = 'interval') THEN
    ALTER TABLE pricing_tiers ADD COLUMN interval TEXT NOT NULL DEFAULT 'month';
  END IF;

  -- Add currency column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'pricing_tiers' AND column_name = 'currency') THEN
    ALTER TABLE pricing_tiers ADD COLUMN currency TEXT NOT NULL DEFAULT 'usd';
  END IF;

  -- Add highlight column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'pricing_tiers' AND column_name = 'highlight') THEN
    ALTER TABLE pricing_tiers ADD COLUMN highlight BOOLEAN DEFAULT false;
  END IF;

  -- Add sort_order column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'pricing_tiers' AND column_name = 'sort_order') THEN
    ALTER TABLE pricing_tiers ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
  END IF;

  -- Add stripe_price_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'pricing_tiers' AND column_name = 'stripe_price_id') THEN
    ALTER TABLE pricing_tiers ADD COLUMN stripe_price_id TEXT;
  END IF;

  -- Add metadata column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'pricing_tiers' AND column_name = 'metadata') THEN
    ALTER TABLE pricing_tiers ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add check constraint for interval if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'pricing_tiers' 
    AND constraint_name = 'pricing_tiers_interval_check'
  ) THEN
    ALTER TABLE pricing_tiers ADD CONSTRAINT pricing_tiers_interval_check 
    CHECK (interval IN ('month', 'year', 'one_time'));
  END IF;
END $$;

-- Enable RLS
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON pricing_tiers;

-- Create policies
CREATE POLICY "Enable all access for authenticated users"
ON pricing_tiers FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM pricing_pages
    WHERE pricing_pages.id = pricing_tiers.pricing_page_id
    AND pricing_pages.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM pricing_pages
    WHERE pricing_pages.id = pricing_tiers.pricing_page_id
    AND pricing_pages.user_id = auth.uid()
  )
);

-- Create updated_at trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE table_name = 'pricing_tiers' 
    AND trigger_name = 'set_updated_at'
  ) THEN
    CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON pricing_tiers
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Add comment to table
COMMENT ON TABLE pricing_tiers IS 'Defines pricing tiers within pricing pages';

-- Add comments to columns
COMMENT ON COLUMN pricing_tiers.id IS 'Primary key';
COMMENT ON COLUMN pricing_tiers.pricing_page_id IS 'References pricing_pages.id';
COMMENT ON COLUMN pricing_tiers.name IS 'Tier name';
COMMENT ON COLUMN pricing_tiers.description IS 'Tier description';
COMMENT ON COLUMN pricing_tiers.price IS 'Price amount';
COMMENT ON COLUMN pricing_tiers.interval IS 'month, year, or one_time';
COMMENT ON COLUMN pricing_tiers.currency IS 'Currency code (default: usd)';
COMMENT ON COLUMN pricing_tiers.features IS 'Array of features included';
COMMENT ON COLUMN pricing_tiers.highlight IS 'Whether to highlight this tier';
COMMENT ON COLUMN pricing_tiers.sort_order IS 'Display order';
COMMENT ON COLUMN pricing_tiers.stripe_price_id IS 'Stripe Price ID';
COMMENT ON COLUMN pricing_tiers.metadata IS 'Additional metadata'; 
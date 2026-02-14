-- 1. Create the table
CREATE TABLE IF NOT EXISTS blog_mailing_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_mailing_list_email ON blog_mailing_list(email);
CREATE INDEX IF NOT EXISTS idx_blog_mailing_list_subscribed ON blog_mailing_list(subscribed);

-- 3. Enable RLS
ALTER TABLE blog_mailing_list ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- We drop them first to ensure clean application
DROP POLICY IF EXISTS "Allow public insert" ON blog_mailing_list;
CREATE POLICY "Allow public insert" 
ON blog_mailing_list 
FOR INSERT 
TO anon 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update" ON blog_mailing_list;
CREATE POLICY "Allow public update" 
ON blog_mailing_list 
FOR UPDATE 
TO anon 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select" ON blog_mailing_list;
CREATE POLICY "Allow public select" 
ON blog_mailing_list 
FOR SELECT 
TO anon 
USING (true);

-- 5. Standard Function for updating timestamps
-- This function just sets the NEW.updated_at to current timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Trigger
DROP TRIGGER IF EXISTS update_blog_mailing_list_updated_at ON blog_mailing_list;

CREATE TRIGGER update_blog_mailing_list_updated_at
    BEFORE UPDATE ON blog_mailing_list
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
-- 1. CLEANUP (If you ran previous migrations, this resets them)
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS post_likes;

-- 2. COMMENTS TABLE
CREATE TABLE post_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sanity_post_id text NOT NULL, -- The _id from Sanity
    author_name text NOT NULL,
    author_email text, -- Optional, kept private
    body text NOT NULL,
    approved boolean DEFAULT true, -- Defaulting to true for immediate gratification
    created_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_comments_post_id ON post_comments(sanity_post_id);

-- 3. LIKES TABLE
CREATE TABLE post_likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sanity_post_id text NOT NULL,
    user_identifier text NOT NULL, -- We will store a browser fingerprint here
    created_at timestamptz DEFAULT now(),
    UNIQUE(sanity_post_id, user_identifier) -- Prevents double-liking
);

-- Index for fast counting
CREATE INDEX idx_likes_post_id ON post_likes(sanity_post_id);

-- 4. ROW LEVEL SECURITY (Security Policies)
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to READ comments/likes
CREATE POLICY "Public comments are viewable" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Public likes are viewable" ON post_likes FOR SELECT USING (true);

-- Allow anyone to INSERT comments/likes (Anon users)
CREATE POLICY "Anyone can insert comments" ON post_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert likes" ON post_likes FOR INSERT WITH CHECK (true);
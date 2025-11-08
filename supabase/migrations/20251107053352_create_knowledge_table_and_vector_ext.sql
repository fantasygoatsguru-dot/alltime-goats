-- 1. Enable the pgvector extension. 
-- We include this here to ensure it's enabled on any database where this migration is run.
create extension if not exists vector with schema extensions;


-- 2. Create the RAG knowledge table
create table public.knowledge (
    id bigint generated always as identity primary key,
    content text not null,
    source_id text,
    metadata jsonb,
    embedding extensions.vector(1536)
);


-- 3. Security: Enable Row Level Security (RLS)
-- It's best practice to enable RLS on every table for a defense-in-depth approach.
alter table public.knowledge enable row level security;


-- 4. RLS Policies (Allow Read Access for Anonymous Users)
-- Since the knowledge base is static and public, we allow anonymous (anon) and authenticated users to read.

-- Policy for SELECT access (Anon role)
create policy "knowledge_select_anon"
on public.knowledge
for select
to anon
using (
  true -- Allows anyone to read (read-only public data)
);

-- Policy for SELECT access (Authenticated role)
create policy "knowledge_select_authenticated"
on public.knowledge
for select
to authenticated
using (
  true -- Allows any logged-in user to read (read-only public data)
);
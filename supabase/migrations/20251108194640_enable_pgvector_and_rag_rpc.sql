
create table if not exists public.knowledge (
    id bigint generated always as identity primary key,
    content text not null,
    source_id text,
    metadata jsonb default '{}'::jsonb,
    embedding extensions.vector(1536)
);

-- 3. RLS
alter table public.knowledge enable row level security;
drop policy if exists knowledge_read_anon on public.knowledge;
create policy knowledge_read_anon on public.knowledge for select using (true);

-- 4. RPC function — this is ALL YOU NEED
create or replace function public.match_knowledge(
  query_embedding extensions.vector(1536),
  match_count int default 6,
  filter_metadata jsonb default '{}'::jsonb
)
returns table (
  id bigint,
  content text,
  source_id text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    k.id,
    k.content,
    k.source_id,
    k.metadata,
    1 - (k.embedding <=> query_embedding) as similarity
  from public.knowledge k
  where k.metadata @> filter_metadata
  order by k.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- NO INDEX LINE = NO MEMORY ERROR
-- We will add the index LATER when you have data + Pro tier
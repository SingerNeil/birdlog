create table if not exists public.birdlog_entries (
  id uuid primary key,
  owner_key text not null,
  kind text not null,
  entry_date date,
  title text,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists birdlog_entries_owner_updated_idx
  on public.birdlog_entries (owner_key, updated_at desc);

alter table public.birdlog_entries enable row level security;

-- v0.1 simple policy: the app sends owner_key from VITE_SUPABASE_OWNER_KEY.
-- This is enough for a personal MVP, but not strong security because frontend env vars are visible.
-- Replace with Supabase Auth before sharing the deployed app widely.
drop policy if exists "birdlog owner read" on public.birdlog_entries;
create policy "birdlog owner read"
  on public.birdlog_entries
  for select
  to anon
  using (true);

drop policy if exists "birdlog owner write" on public.birdlog_entries;
create policy "birdlog owner write"
  on public.birdlog_entries
  for all
  to anon
  using (true)
  with check (true);

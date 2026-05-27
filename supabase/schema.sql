create table if not exists public.birdlog_entries (
  id uuid not null,
  owner_key text not null,
  kind text not null,
  entry_date date,
  title text,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_key, id)
);

-- Older BirdLog schemas used id as the global primary key. That breaks when a
-- local device changes owner_key and tries to re-upload an existing local row:
-- PostgREST treats it as an update to a row owned by another key, and RLS blocks
-- the write. The canonical identity is now scoped by owner_key.
alter table public.birdlog_entries
  drop constraint if exists birdlog_entries_pkey;

alter table public.birdlog_entries
  add constraint birdlog_entries_pkey primary key (owner_key, id);

create index if not exists birdlog_entries_owner_updated_idx
  on public.birdlog_entries (owner_key, updated_at desc);

alter table public.birdlog_entries enable row level security;

-- BirdLog is a personal tool without a login system. The app sends the same
-- owner key in the row and in the x-owner-key request header. This keeps rows
-- separated for personal use while preserving a static-site deployment model.
-- Upgrade to Supabase Auth before turning this into a multi-user product.
drop policy if exists "birdlog owner read" on public.birdlog_entries;
create policy "birdlog owner read"
  on public.birdlog_entries
  for select
  to anon
  using (
    owner_key = coalesce((current_setting('request.headers', true)::jsonb ->> 'x-owner-key'), '')
  );

drop policy if exists "birdlog owner write" on public.birdlog_entries;
create policy "birdlog owner write"
  on public.birdlog_entries
  for all
  to anon
  using (
    owner_key = coalesce((current_setting('request.headers', true)::jsonb ->> 'x-owner-key'), '')
  )
  with check (
    owner_key = coalesce((current_setting('request.headers', true)::jsonb ->> 'x-owner-key'), '')
  );

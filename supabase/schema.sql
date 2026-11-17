-- Academic CV Studio — Supabase setup
-- Execute in Supabase SQL Editor for a PERSONAL/OWNER-ONLY deployment.
-- IMPORTANT: Replace 'hafizuddin@upc.edu' with the authorized login email
-- before first use if you fork or deploy this for another person.
--
-- Private drafts: only the authorized owner can read/write.
-- Public snapshots: visitors can read ONLY when published=true.
-- No service-role key is needed in the browser.

begin;

create table if not exists public.cv_drafts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);

create table if not exists public.cv_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 3 and 50),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Explicit grants, with RLS controlling row-level access.
revoke all on table public.cv_drafts from anon, authenticated;
revoke all on table public.cv_profiles from anon, authenticated;
grant select, insert, update on table public.cv_drafts to authenticated;
grant select, insert, update on table public.cv_profiles to authenticated;
grant select on table public.cv_profiles to anon;

alter table public.cv_drafts enable row level security;
alter table public.cv_profiles enable row level security;

-- Drop & recreate so re-running this script updates policies cleanly.
drop policy if exists "Owners read drafts" on public.cv_drafts;
drop policy if exists "Owners insert drafts" on public.cv_drafts;
drop policy if exists "Owners update drafts" on public.cv_drafts;
drop policy if exists "Owners read public profiles" on public.cv_profiles;
drop policy if exists "Visitors read published profiles" on public.cv_profiles;
drop policy if exists "Owners insert public profiles" on public.cv_profiles;
drop policy if exists "Owners update public profiles" on public.cv_profiles;

create policy "Owners read drafts" on public.cv_drafts
for select to authenticated
using ((select auth.uid()) = user_id and lower(coalesce((select auth.jwt())->>'email', '')) = 'hafizuddin@upc.edu');

create policy "Owners insert drafts" on public.cv_drafts
for insert to authenticated
with check ((select auth.uid()) = user_id and lower(coalesce((select auth.jwt())->>'email', '')) = 'hafizuddin@upc.edu');

create policy "Owners update drafts" on public.cv_drafts
for update to authenticated
using ((select auth.uid()) = user_id and lower(coalesce((select auth.jwt())->>'email', '')) = 'hafizuddin@upc.edu')
with check ((select auth.uid()) = user_id and lower(coalesce((select auth.jwt())->>'email', '')) = 'hafizuddin@upc.edu');

create policy "Owners read public profiles" on public.cv_profiles
for select to authenticated
using ((select auth.uid()) = user_id and lower(coalesce((select auth.jwt())->>'email', '')) = 'hafizuddin@upc.edu');

create policy "Visitors read published profiles" on public.cv_profiles
for select to anon, authenticated
using (published = true);

create policy "Owners insert public profiles" on public.cv_profiles
for insert to authenticated
with check ((select auth.uid()) = user_id and lower(coalesce((select auth.jwt())->>'email', '')) = 'hafizuddin@upc.edu');

create policy "Owners update public profiles" on public.cv_profiles
for update to authenticated
using ((select auth.uid()) = user_id and lower(coalesce((select auth.jwt())->>'email', '')) = 'hafizuddin@upc.edu')
with check ((select auth.uid()) = user_id and lower(coalesce((select auth.jwt())->>'email', '')) = 'hafizuddin@upc.edu');

-- Keep updated_at accurate without exposing this function to clients.
create or replace function public.cv_updated_at()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.cv_updated_at() from public;

drop trigger if exists cv_drafts_updated_at on public.cv_drafts;
create trigger cv_drafts_updated_at
before update on public.cv_drafts
for each row execute function public.cv_updated_at();

drop trigger if exists cv_profiles_updated_at on public.cv_profiles;
create trigger cv_profiles_updated_at
before update on public.cv_profiles
for each row execute function public.cv_updated_at();

commit;

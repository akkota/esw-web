-- ESW web platform tables (shared Supabase project with Gears bot)
-- Browser uses anon + authenticated RLS. Bot uses service_role.

create extension if not exists "pgcrypto";

do $$ begin
  create type profile_role as enum ('member', 'staff', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type resource_category as enum (
    'budget',
    'sponsorship',
    'career',
    'discord',
    'other'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type habit_log_status as enum ('pending', 'verified', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type habit_verified_by as enum ('web_staff', 'discord');
exception when duplicate_object then null;
end $$;

-- =========================
-- PROFILES
-- =========================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  discord_user_id text,
  school text,
  role profile_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_discord on profiles(discord_user_id);
create index if not exists idx_profiles_role on profiles(role);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, discord_user_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    case
      when new.raw_app_meta_data->>'provider' = 'discord'
        then coalesce(new.raw_user_meta_data->>'provider_id', new.raw_user_meta_data->>'sub')
      else null
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    discord_user_id = coalesce(
      public.profiles.discord_user_id,
      case
        when new.raw_app_meta_data->>'provider' = 'discord'
          then coalesce(new.raw_user_meta_data->>'provider_id', new.raw_user_meta_data->>'sub')
        else null
      end
    ),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================
-- RESOURCE PAGES
-- =========================

create table if not exists resource_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  body text not null default '',
  category resource_category not null default 'other',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_resource_pages_published on resource_pages(published);

-- =========================
-- HABIT CHALLENGES
-- =========================

create table if not exists habit_actions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  active boolean not null default true
);

create table if not exists habit_windows (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_habit_windows_active on habit_windows(active, starts_at, ends_at);

create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  action_id uuid not null references habit_actions(id) on delete restrict,
  window_id uuid not null references habit_windows(id) on delete cascade,
  note text,
  image_path text not null,
  status habit_log_status not null default 'pending',
  verified_by habit_verified_by,
  verified_at timestamptz,
  verified_by_user_id uuid references profiles(id),
  discord_message_id text,
  discord_channel_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_habit_logs_status on habit_logs(status, created_at desc);
create index if not exists idx_habit_logs_user on habit_logs(user_id, created_at desc);
create index if not exists idx_habit_logs_window on habit_logs(window_id, status);
create index if not exists idx_habit_logs_pending_discord
  on habit_logs(status, discord_message_id)
  where status = 'pending';

-- Guild setting for challenge posts (Gears bot)
alter table guild_settings
  add column if not exists habit_challenge_channel_id text;

-- =========================
-- SEED DATA
-- =========================

insert into habit_actions (slug, name, description, sort_order) values
  ('reusable-bottle', 'Reusable water bottle', 'Brought a reusable bottle instead of single-use plastic.', 10),
  ('transit', 'Bus, bike, or walk', 'Chose transit, bike, or walking over a car trip.', 20),
  ('gratitude', 'Gratitude practice', 'Named three things you are grateful for today.', 30),
  ('recycle-compost', 'Recycle or compost', 'Recycled or composted instead of tossing in trash.', 40),
  ('garden', 'Plant or garden', 'Planted, watered, or tended a garden / edible plant.', 50)
on conflict (slug) do nothing;

insert into habit_windows (title, starts_at, ends_at, active)
select
  'August 2026 Sustainability Sprint',
  date_trunc('month', now()),
  date_trunc('month', now()) + interval '1 month' - interval '1 second',
  true
where not exists (select 1 from habit_windows where active = true);

insert into resource_pages (slug, title, category, published, body) values
(
  'project-budget-tracker',
  'Project Budget Tracker',
  'budget',
  true,
  E'# Project Budget Tracker\n\nUse this guide to keep chapter project spending clear and shareable with HQ.\n\n## Setup\n1. Duplicate a simple spreadsheet with columns: Date, Category, Item, Amount, Receipt link, Notes.\n2. Categories to start with: Materials, Travel, Food, Printing, Software, Other.\n3. Add a running total and a remaining budget formula.\n\n## Tips\n- Upload receipt photos to a shared drive folder named by project.\n- Review the sheet at every board meeting.\n- Flag anything over $50 for chapter lead approval before buying.\n\n## Template columns\n| Date | Category | Item | Amount | Paid by | Reimbursed? | Receipt |\n| --- | --- | --- | --- | --- | --- | --- |\n'
),
(
  'sponsorship-guide',
  'Sponsorship Guide',
  'sponsorship',
  true,
  E'# Sponsorship Guide\n\nA short playbook for asking local partners to support your chapter.\n\n## Before you ask\n- Know your ask (money, materials, venue, or mentorship).\n- Have a one-page overview of ESW + your chapter.\n- Prepare what sponsors get (logo on shirt, shoutout, demo day invite).\n\n## Outreach steps\n1. List 10 local companies aligned with sustainability.\n2. Find a real contact (alumni help a lot).\n3. Send a short email + offer a 15-minute call.\n4. Follow up once after a week.\n\n## Keep it simple\nSponsors care about clarity, not long decks. Lead with impact and a concrete ask.\n'
),
(
  'resume-interview-prep',
  'Resume & Interview Prep',
  'career',
  true,
  E'# Resume & Interview Prep\n\n## Resume\n- Lead with impact: what you built, for whom, and the result.\n- Prefer bullets like \"Reduced material waste 20% by redesigning X\" over vague duties.\n- Keep to one page if you are early-career.\n\n## Interview\n- Prepare 3 project stories using Situation → Action → Result.\n- Be ready to explain tradeoffs (cost, materials, community needs).\n- Ask the interviewer one thoughtful question about their sustainability work.\n\n## ESW angle\nHighlight chapter leadership, project delivery, and collaboration across majors.\n'
)
on conflict (slug) do nothing;

-- =========================
-- STORAGE
-- =========================
-- Create bucket via dashboard or:
-- insert into storage.buckets (id, name, public) values ('habit-proofs', 'habit-proofs', false)
-- on conflict do nothing;

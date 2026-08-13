-- RLS for ESW web tables
-- Bot service_role bypasses RLS.

alter table profiles enable row level security;
alter table resource_pages enable row level security;
alter table habit_actions enable row level security;
alter table habit_windows enable row level security;
alter table habit_logs enable row level security;

alter table profiles force row level security;
alter table resource_pages force row level security;
alter table habit_actions force row level security;
alter table habit_windows force row level security;
alter table habit_logs force row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$;

-- Profiles
drop policy if exists "profiles_select_own_or_staff" on profiles;
create policy "profiles_select_own_or_staff" on profiles
  for select to authenticated
  using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "profiles_staff_update" on profiles;
create policy "profiles_staff_update" on profiles
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Resources
drop policy if exists "resources_public_read" on resource_pages;
create policy "resources_public_read" on resource_pages
  for select to anon, authenticated
  using (published = true or public.is_staff());

drop policy if exists "resources_staff_all" on resource_pages;
create policy "resources_staff_all" on resource_pages
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Habit catalog / windows
drop policy if exists "habit_actions_read" on habit_actions;
create policy "habit_actions_read" on habit_actions
  for select to anon, authenticated
  using (active = true or public.is_staff());

drop policy if exists "habit_windows_read" on habit_windows;
create policy "habit_windows_read" on habit_windows
  for select to anon, authenticated
  using (true);

drop policy if exists "habit_actions_staff" on habit_actions;
create policy "habit_actions_staff" on habit_actions
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "habit_windows_staff" on habit_windows;
create policy "habit_windows_staff" on habit_windows
  for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Habit logs
drop policy if exists "habit_logs_select" on habit_logs;
create policy "habit_logs_select" on habit_logs
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_staff()
    or status = 'verified'
  );

drop policy if exists "habit_logs_public_verified" on habit_logs;
create policy "habit_logs_public_verified" on habit_logs
  for select to anon
  using (status = 'verified');

drop policy if exists "habit_logs_insert_own" on habit_logs;
create policy "habit_logs_insert_own" on habit_logs
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "habit_logs_staff_update" on habit_logs;
create policy "habit_logs_staff_update" on habit_logs
  for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

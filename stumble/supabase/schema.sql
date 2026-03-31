-- Stumble database schema
-- Run this in your Supabase SQL editor

-- Users table (extends Supabase auth.users)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  university text,
  vibe_summary text,
  created_at timestamptz default now()
);

-- Quiz answers
create table if not exists public.quiz_answers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  question_id integer not null,
  answer text not null,
  created_at timestamptz default now()
);

-- Matches (3-way weekly matches)
create table if not exists public.matches (
  id uuid default gen_random_uuid() primary key,
  user_1_id uuid references public.users(id) on delete cascade not null,
  user_2_id uuid references public.users(id) on delete cascade not null,
  user_3_id uuid references public.users(id) on delete cascade,
  icebreaker_prompt text,
  week_number integer not null,
  created_at timestamptz default now()
);

-- Messages
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.users enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- Users policies
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- Quiz answers policies
create policy "Users can manage own answers" on public.quiz_answers
  for all using (auth.uid() = user_id);

-- Matches policies — users can see matches they're part of
create policy "Users can view own matches" on public.matches
  for select using (
    auth.uid() = user_1_id or
    auth.uid() = user_2_id or
    auth.uid() = user_3_id
  );

-- Messages policies — users can see/send messages in their matches
create policy "Users can view match messages" on public.messages
  for select using (
    exists (
      select 1 from public.matches m
      where m.id = match_id and (
        m.user_1_id = auth.uid() or
        m.user_2_id = auth.uid() or
        m.user_3_id = auth.uid()
      )
    )
  );
create policy "Users can send messages in own matches" on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.matches m
      where m.id = match_id and (
        m.user_1_id = auth.uid() or
        m.user_2_id = auth.uid() or
        m.user_3_id = auth.uid()
      )
    )
  );

-- Allow matched users to view each other's profiles
create policy "Users can view matched users profiles" on public.users
  for select using (
    auth.uid() = id or
    exists (
      select 1 from public.matches m
      where (m.user_1_id = auth.uid() or m.user_2_id = auth.uid() or m.user_3_id = auth.uid())
        and (m.user_1_id = id or m.user_2_id = id or m.user_3_id = id)
    )
  );

-- Realtime: enable for messages
alter publication supabase_realtime add table public.messages;

-- Trigger: auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, university)
  values (
    new.id,
    new.email,
    split_part(new.email, '@', 2)
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

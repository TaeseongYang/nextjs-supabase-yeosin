-- profiles 테이블: auth.users와 1:1로 연결되는 프로필 정보
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS 활성화
alter table public.profiles enable row level security;

-- 본인 프로필만 조회 가능
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 본인 프로필만 수정 가능
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- updated_at 자동 갱신 트리거
create function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = '';

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- auth.users 신규 가입 시 profiles 자동 생성 트리거
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = '';

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

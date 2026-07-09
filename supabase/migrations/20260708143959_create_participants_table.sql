create table public.participants (
  id uuid primary key default gen_random_uuid(),
  gender text not null check (gender in ('female', 'male')),
  age integer not null check (age > 0 and age <= 120),
  has_online_experience text not null check (has_online_experience in ('yes', 'no')),
  created_at timestamptz not null default now()
);

alter table public.participants enable row level security;

-- 의도적으로 SELECT/INSERT/UPDATE/DELETE 정책을 전혀 만들지 않는다.
-- anon/authenticated는 RLS 기본 거부로 이 테이블에 어떤 접근도 할 수 없고,
-- service_role만 RLS를 우회해 INSERT할 수 있다(Server Action 내부에서만 사용).
-- 익명 응답을 어디서도 조회하지 않으며 관리자 화면 조회 요구사항도 없다.

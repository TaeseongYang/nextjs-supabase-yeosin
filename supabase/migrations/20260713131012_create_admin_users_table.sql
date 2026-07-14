create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- participants 테이블과 동일한 패턴: 의도적으로 정책을 전혀 만들지 않는다.
-- anon/authenticated는 RLS 기본 거부로 어떤 접근도 할 수 없고,
-- service_role 클라이언트(Server Action 내부)만 RLS를 우회해 조회할 수 있다.

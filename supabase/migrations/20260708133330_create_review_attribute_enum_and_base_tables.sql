-- review_attribute enum: 리뷰 속성 태그(의료진/이용서비스/가격/시술효과/시술통증) 5종 고정
-- lib/types/attribute.ts의 REVIEW_ATTRIBUTES와 값/순서가 정확히 일치해야 한다.
create type public.review_attribute as enum ('medical_staff', 'service', 'price', 'effect', 'pain');

-- categories: 시술 카테고리 (FK 없는 독립 테이블)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_key text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories_public_select"
  on public.categories for select
  to anon, authenticated
  using (true);

-- hospitals: 병원 (FK 없는 독립 테이블)
create table public.hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null,
  created_at timestamptz not null default now()
);

alter table public.hospitals enable row level security;

create policy "hospitals_public_select"
  on public.hospitals for select
  to anon, authenticated
  using (true);

-- INSERT/UPDATE/DELETE 정책은 의도적으로 만들지 않는다.
-- RLS 기본 거부 원칙에 따라 anon/authenticated는 쓰기 불가하며,
-- 관리자 CRUD는 Task 014/015에서 service_role 서버 전용 클라이언트로만 수행한다.

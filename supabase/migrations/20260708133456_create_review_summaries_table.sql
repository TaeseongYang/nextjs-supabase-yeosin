-- review_summaries: 상품별 리뷰 요약 (attribute가 null이면 전체 요약)
create table public.review_summaries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.treatment_products(id) on delete cascade,
  attribute public.review_attribute,
  positive_ratio smallint not null check (positive_ratio between 0 and 100),
  negative_ratio smallint not null check (negative_ratio between 0 and 100),
  positive_bullets text[] not null default '{}',
  negative_bullets text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint ratio_sum_not_over_100 check (positive_ratio + negative_ratio <= 100)
);

-- (product_id, attribute) 조합의 unique 보장.
-- Postgres에서 NULL은 서로 다르게 취급되어 단순 unique 제약으로는
-- attribute가 null인 행(전체 요약)의 중복을 막지 못하므로 부분 unique 인덱스 2개로 분리한다.
create unique index uq_review_summaries_attr
  on public.review_summaries(product_id, attribute) where attribute is not null;
create unique index uq_review_summaries_all
  on public.review_summaries(product_id) where attribute is null;

alter table public.review_summaries enable row level security;

create policy "review_summaries_public_select"
  on public.review_summaries for select
  to anon, authenticated
  using (true);

-- updated_at 자동 갱신 트리거: profiles 마이그레이션에서 정의된 handle_updated_at()을 재사용한다.
create trigger on_review_summaries_updated
  before update on public.review_summaries
  for each row execute procedure public.handle_updated_at();

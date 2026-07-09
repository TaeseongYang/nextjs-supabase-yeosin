-- reviews: 개별 리뷰 (treatment_products 참조, 상품 삭제 시 cascade)
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.treatment_products(id) on delete cascade,
  author_label text not null,
  rating smallint not null check (rating between 1 and 5),
  content text not null,
  created_at date not null default current_date
);

create index idx_reviews_product on public.reviews(product_id);

alter table public.reviews enable row level security;

create policy "reviews_public_select"
  on public.reviews for select
  to anon, authenticated
  using (true);

-- review_attribute_tags: 리뷰 ↔ 속성 다대다 매핑 (복합 기본키)
create table public.review_attribute_tags (
  review_id uuid not null references public.reviews(id) on delete cascade,
  attribute public.review_attribute not null,
  primary key (review_id, attribute)
);

create index idx_review_attribute_tags_attribute on public.review_attribute_tags(attribute);

alter table public.review_attribute_tags enable row level security;

create policy "review_attribute_tags_public_select"
  on public.review_attribute_tags for select
  to anon, authenticated
  using (true);

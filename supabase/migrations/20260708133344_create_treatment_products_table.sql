-- treatment_products: 시술 상품 (categories/hospitals 참조)
create table public.treatment_products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  hospital_id uuid not null references public.hospitals(id) on delete restrict,
  name text not null,
  original_price integer not null check (original_price >= 0),
  discount_price integer not null check (discount_price >= 0),
  includes_vat boolean not null default false,
  includes_anesthesia boolean not null default false,
  includes_aftercare boolean not null default false,
  side_effect_notice text not null default '',
  thumbnail_url text not null default '',
  detail_image_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint discount_not_greater_than_original check (discount_price <= original_price)
);

create index idx_treatment_products_category on public.treatment_products(category_id);
create index idx_treatment_products_hospital on public.treatment_products(hospital_id);

alter table public.treatment_products enable row level security;

create policy "treatment_products_public_select"
  on public.treatment_products for select
  to anon, authenticated
  using (true);

-- updated_at 자동 갱신 트리거: profiles 마이그레이션에서 정의된 handle_updated_at()을 재사용한다.
create trigger on_treatment_products_updated
  before update on public.treatment_products
  for each row execute procedure public.handle_updated_at();

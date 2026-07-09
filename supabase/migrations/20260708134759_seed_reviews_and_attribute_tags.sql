-- reviews + review_attribute_tags 시드: lib/dummy-data/reviews.ts 22건 원본 그대로
-- product_id는 treatment_products.name 서브쿼리로 재조회, temp table로 dummy id -> uuid 매핑 유지

create temp table _review_id_map (dummy_id text primary key, id uuid not null);

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '김**', 5, '피부가 확실히 촉촉해지고 톤이 밝아진 느낌이에요. 상담부터 시술까지 친절하게 안내해주셨습니다.', date '2026-06-01'
  from public.treatment_products p where p.name = '수분 물광 리프팅 시술'
  returning id
)
insert into _review_id_map select 'rev-1', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '이**', 4, '효과는 좋았는데 대기 시간이 조금 길었어요. 그래도 결과물엔 만족합니다.', date '2026-06-05'
  from public.treatment_products p where p.name = '수분 물광 리프팅 시술'
  returning id
)
insert into _review_id_map select 'rev-2', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '박**', 3, '가격 대비 효과가 아주 크진 않았지만 통증은 거의 없었어요.', date '2026-06-10'
  from public.treatment_products p where p.name = '수분 물광 리프팅 시술'
  returning id
)
insert into _review_id_map select 'rev-3', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '최**', 5, '레이저 시술인데도 생각보다 아프지 않았고 피부 재생 효과가 뛰어났어요.', date '2026-06-03'
  from public.treatment_products p where p.name = '듀얼 토닝 피부 재생 레이저'
  returning id
)
insert into _review_id_map select 'rev-4', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '정**', 4, '의료진이 꼼꼼하게 피부 상태를 확인하고 시술해주셔서 신뢰가 갔습니다.', date '2026-06-08'
  from public.treatment_products p where p.name = '듀얼 토닝 피부 재생 레이저'
  returning id
)
insert into _review_id_map select 'rev-5', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '한**', 5, '자연스러운 쌍꺼풀 라인이 마음에 들어요. 붓기도 예상보다 빨리 빠졌습니다.', date '2026-05-20'
  from public.treatment_products p where p.name = '자연유착 쌍꺼풀 수술'
  returning id
)
insert into _review_id_map select 'rev-6', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '윤**', 4, '상담 실장님이 친절하셨고 수술 과정도 자세히 설명해주셨어요.', date '2026-05-25'
  from public.treatment_products p where p.name = '자연유착 쌍꺼풀 수술'
  returning id
)
insert into _review_id_map select 'rev-7', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '장**', 3, '회복 기간이 생각보다 길었지만 결과는 만족스럽습니다.', date '2026-05-28'
  from public.treatment_products p where p.name = '눈매교정 절개 수술'
  returning id
)
insert into _review_id_map select 'rev-8', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '임**', 5, '코 라인이 자연스럽고 원장님이 꼼꼼하게 디자인해주셨어요.', date '2026-06-12'
  from public.treatment_products p where p.name = '코끝 성형 실리콘 보형물 수술'
  returning id
)
insert into _review_id_map select 'rev-9', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '오**', 4, '턱선이 갸름해지는 효과가 있었고 시술 시간도 짧았어요.', date '2026-06-15'
  from public.treatment_products p where p.name = '사각턱 보톡스 윤곽 시술'
  returning id
)
insert into _review_id_map select 'rev-10', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '강**', 5, '수술 전 상담이 매우 자세했고 사후관리 시스템도 체계적이었습니다.', date '2026-05-10'
  from public.treatment_products p where p.name = '코헤시브 가슴성형 수술'
  returning id
)
insert into _review_id_map select 'rev-11', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '조**', 4, '지방흡입 후 라인이 확실히 매끈해졌어요. 다만 가격이 부담스러웠습니다.', date '2026-05-15'
  from public.treatment_products p where p.name = '복부 지방흡입 바디라인 시술'
  returning id
)
insert into _review_id_map select 'rev-12', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '신**', 4, '이마 주름이 확실히 펴졌고 시술 시간도 짧아서 부담 없었어요.', date '2026-06-18'
  from public.treatment_products p where p.name = '이마 보톡스 주름 개선 시술'
  returning id
)
insert into _review_id_map select 'rev-13', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '권**', 3, '볼륨감은 좋아졌는데 멍이 며칠 지속돼서 조금 불편했어요.', date '2026-06-20'
  from public.treatment_products p where p.name = '볼륨 히알루론산 필러'
  returning id
)
insert into _review_id_map select 'rev-14', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '황**', 5, '탄력이 눈에 띄게 좋아졌고 가격도 합리적이었습니다.', date '2026-06-22'
  from public.treatment_products p where p.name = '실 리프팅 탄력 개선 시술'
  returning id
)
insert into _review_id_map select 'rev-15', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '안**', 4, '제모 효과가 확실하고 직원분들이 친절하게 응대해주셨어요.', date '2026-06-25'
  from public.treatment_products p where p.name = '레이저 제모 전신 패키지'
  returning id
)
insert into _review_id_map select 'rev-16', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '송**', 5, '여러 번 받으니 확실히 털이 얇아지고 나는 속도도 느려졌어요.', date '2026-06-28'
  from public.treatment_products p where p.name = '레이저 제모 전신 패키지'
  returning id
)
insert into _review_id_map select 'rev-17', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '배**', 4, '부분 제모라 시술 시간이 짧고 통증도 견딜만했어요.', date '2026-07-01'
  from public.treatment_products p where p.name = '고주파 부분 제모 시술'
  returning id
)
insert into _review_id_map select 'rev-18', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '노**', 3, '가격은 합리적인데 원하는 효과를 보려면 재방문이 꽤 필요했어요.', date '2026-07-03'
  from public.treatment_products p where p.name = '고주파 부분 제모 시술'
  returning id
)
insert into _review_id_map select 'rev-19', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '홍**', 5, '상담부터 시술까지 설명이 자세해서 안심하고 받을 수 있었어요.', date '2026-07-05'
  from public.treatment_products p where p.name = '고주파 부분 제모 시술'
  returning id
)
insert into _review_id_map select 'rev-20', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '유**', 5, '니들 제모라 확실히 재발이 적다고 느꼈고 관리도 꼼꼼했어요.', date '2026-07-06'
  from public.treatment_products p where p.name = '니들 제모 정밀 관리 패키지'
  returning id
)
insert into _review_id_map select 'rev-21', id from ins;

with ins as (
  insert into public.reviews (product_id, author_label, rating, content, created_at)
  select p.id, '구**', 3, '효과는 좋지만 시술 부위가 며칠 동안 붉어져서 불편했어요.', date '2026-07-08'
  from public.treatment_products p where p.name = '니들 제모 정밀 관리 패키지'
  returning id
)
insert into _review_id_map select 'rev-22', id from ins;

-- review_attribute_tags: 22개 리뷰의 attributeTags 배열을 unnest해서 반복 (총 42건)
insert into public.review_attribute_tags (review_id, attribute)
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['medical_staff','effect']) as x(attr) where m.dummy_id = 'rev-1'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['service','effect']) as x(attr) where m.dummy_id = 'rev-2'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['price','pain']) as x(attr) where m.dummy_id = 'rev-3'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['effect','pain']) as x(attr) where m.dummy_id = 'rev-4'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['medical_staff']) as x(attr) where m.dummy_id = 'rev-5'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['effect','pain']) as x(attr) where m.dummy_id = 'rev-6'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['service','medical_staff']) as x(attr) where m.dummy_id = 'rev-7'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['effect','pain']) as x(attr) where m.dummy_id = 'rev-8'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['medical_staff','effect']) as x(attr) where m.dummy_id = 'rev-9'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['effect']) as x(attr) where m.dummy_id = 'rev-10'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['service','medical_staff']) as x(attr) where m.dummy_id = 'rev-11'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['effect','price']) as x(attr) where m.dummy_id = 'rev-12'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['effect','pain']) as x(attr) where m.dummy_id = 'rev-13'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['effect','pain']) as x(attr) where m.dummy_id = 'rev-14'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['effect','price']) as x(attr) where m.dummy_id = 'rev-15'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['service','effect']) as x(attr) where m.dummy_id = 'rev-16'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['effect','pain']) as x(attr) where m.dummy_id = 'rev-17'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['pain','effect']) as x(attr) where m.dummy_id = 'rev-18'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['price','effect']) as x(attr) where m.dummy_id = 'rev-19'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['medical_staff','service']) as x(attr) where m.dummy_id = 'rev-20'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['effect','medical_staff']) as x(attr) where m.dummy_id = 'rev-21'
union all
select m.id, x.attr::public.review_attribute
from _review_id_map m, unnest(array['pain','effect']) as x(attr) where m.dummy_id = 'rev-22';

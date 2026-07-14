-- 평점 체계를 5점 만점(1~5, 정수)에서 10점 만점(0~10, 소수점 둘째 자리까지)으로 변경.
-- rating 컬럼을 smallint -> numeric(4,2)로 바꾸고, 기존 5점 만점 값은 2배로 스케일링해
-- 10점 만점 기준의 상대적 품질 분포를 그대로 유지한다.
alter table public.reviews
  drop constraint reviews_rating_check;

alter table public.reviews
  alter column rating type numeric(4, 2) using (rating * 2)::numeric(4, 2);

alter table public.reviews
  add constraint reviews_rating_check check (rating between 0 and 10);

-- upsert_review_with_tags RPC의 p_rating 파라미터 타입도 함께 맞춘다.
-- 파라미터 타입이 바뀌면 시그니처가 달라지므로 기존 함수를 먼저 제거한다.
drop function if exists public.upsert_review_with_tags(
  uuid, uuid, text, smallint, text, date, public.review_attribute[]
);

create or replace function public.upsert_review_with_tags(
  p_review_id uuid,
  p_product_id uuid,
  p_author_label text,
  p_rating numeric(4, 2),
  p_content text,
  p_created_at date,
  p_attribute_tags public.review_attribute[]
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_review_id uuid;
begin
  if p_review_id is null then
    insert into public.reviews (product_id, author_label, rating, content, created_at)
    values (p_product_id, p_author_label, p_rating, p_content, p_created_at)
    returning id into v_review_id;
  else
    update public.reviews
    set author_label = p_author_label,
        rating = p_rating,
        content = p_content,
        created_at = p_created_at
    where id = p_review_id
    returning id into v_review_id;
  end if;

  delete from public.review_attribute_tags where review_id = v_review_id;

  insert into public.review_attribute_tags (review_id, attribute)
  select v_review_id, tag from unnest(p_attribute_tags) as tag;

  return v_review_id;
end;
$$;

revoke execute on function public.upsert_review_with_tags from public;

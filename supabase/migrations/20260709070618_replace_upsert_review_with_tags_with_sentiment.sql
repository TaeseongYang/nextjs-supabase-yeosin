-- upsert_review_with_tags RPC 시그니처 변경: attribute만 담던 review_attribute[] 배열을
-- jsonb 배열([{"attribute":"...", "sentiment":"..."}])로 교체한다. Postgres composite type
-- 배열은 Supabase JS에서 전달 시 캐스팅이 간헐적으로 실패할 위험이 있어 jsonb + 함수 내부
-- jsonb_array_elements 파싱 방식을 채택한다.
drop function if exists public.upsert_review_with_tags(
  uuid, uuid, text, numeric(4,2), text, date, public.review_attribute[]
);

create or replace function public.upsert_review_with_tags(
  p_review_id uuid,
  p_product_id uuid,
  p_author_label text,
  p_rating numeric(4, 2),
  p_content text,
  p_created_at date,
  p_attribute_tags jsonb
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

  insert into public.review_attribute_tags (review_id, attribute, sentiment)
  select
    v_review_id,
    (elem->>'attribute')::public.review_attribute,
    (elem->>'sentiment')::public.review_sentiment
  from jsonb_array_elements(p_attribute_tags) as elem;

  return v_review_id;
end;
$$;

revoke execute on function public.upsert_review_with_tags from public;

-- 주의: 위의 "revoke ... from public"만으로는 이 프로젝트에서 anon/authenticated
-- 개별 롤의 EXECUTE 권한이 실제로 제거되지 않는 것이 확인되었다(has_function_privilege로
-- 검증, 20260709021459 마이그레이션에서도 동일 이슈 선례 있음). 아래에서 명시적으로 재확인한다.
revoke execute on function public.upsert_review_with_tags(uuid, uuid, text, numeric(4,2), text, date, jsonb) from anon;
revoke execute on function public.upsert_review_with_tags(uuid, uuid, text, numeric(4,2), text, date, jsonb) from authenticated;

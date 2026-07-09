-- 리뷰 + 속성 태그를 원자적으로 저장하기 위한 RPC 함수.
-- Supabase JS가 멀티 테이블 트랜잭션을 지원하지 않으므로, reviews UPSERT와
-- review_attribute_tags 재작성(delete + insert)을 하나의 함수 트랜잭션으로 묶는다.
-- p_review_id가 null이면 신규 리뷰를 생성(id는 gen_random_uuid() 기본값으로 서버에서 생성),
-- 아니면 기존 리뷰를 수정한다.
create or replace function public.upsert_review_with_tags(
  p_review_id uuid,
  p_product_id uuid,
  p_author_label text,
  p_rating smallint,
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

-- 매우 중요한 보안 요구사항: security definer 함수는 기본적으로 PUBLIC(anon/authenticated 포함)에게
-- 실행 권한이 부여되므로, 반드시 명시적으로 REVOKE해야 한다. 이걸 빼먹으면 anon 키로도
-- 이 함수를 호출해 리뷰를 임의로 조작할 수 있는 심각한 보안 구멍이 생긴다.
-- 이 함수는 service_role 키를 사용하는 lib/supabase/service.ts의 createServiceClient()를
-- 통해서만 호출되어야 한다(service_role은 REVOKE와 무관하게 항상 호출 가능).
revoke execute on function public.upsert_review_with_tags from public;

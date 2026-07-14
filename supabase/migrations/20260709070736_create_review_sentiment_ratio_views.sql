-- 상품×속성별 긍정/부정 비율 뷰. neutral은 분모에서 완전히 제외하고
-- positive/negative 개수만으로 비율(%)을 계산한다(긍정+부정으로 평가된 것만 대상).
-- positive+negative가 0건이면 비율은 null(집계 불가)로 남긴다.
create view public.review_attribute_sentiment_ratios as
select
  r.product_id,
  t.attribute,
  count(*) filter (where t.sentiment = 'positive') as positive_count,
  count(*) filter (where t.sentiment = 'negative') as negative_count,
  count(*) filter (where t.sentiment in ('positive', 'negative')) as rated_count,
  case
    when count(*) filter (where t.sentiment in ('positive', 'negative')) = 0 then null
    else round(
      100.0 * count(*) filter (where t.sentiment = 'positive')
      / count(*) filter (where t.sentiment in ('positive', 'negative'))
    )::smallint
  end as positive_ratio,
  case
    when count(*) filter (where t.sentiment in ('positive', 'negative')) = 0 then null
    else round(
      100.0 * count(*) filter (where t.sentiment = 'negative')
      / count(*) filter (where t.sentiment in ('positive', 'negative'))
    )::smallint
  end as negative_ratio
from public.review_attribute_tags t
join public.reviews r on r.id = t.review_id
group by r.product_id, t.attribute;

-- 상품 전체(attribute 구분 없이) 요약 뷰: 모든 속성 태그의 긍정/부정을 합산(태그 1건=1건,
-- 중복 포함)해서 계산한다.
create view public.review_overall_sentiment_ratios as
select
  r.product_id,
  count(*) filter (where t.sentiment = 'positive') as positive_count,
  count(*) filter (where t.sentiment = 'negative') as negative_count,
  count(*) filter (where t.sentiment in ('positive', 'negative')) as rated_count,
  case
    when count(*) filter (where t.sentiment in ('positive', 'negative')) = 0 then null
    else round(
      100.0 * count(*) filter (where t.sentiment = 'positive')
      / count(*) filter (where t.sentiment in ('positive', 'negative'))
    )::smallint
  end as positive_ratio,
  case
    when count(*) filter (where t.sentiment in ('positive', 'negative')) = 0 then null
    else round(
      100.0 * count(*) filter (where t.sentiment = 'negative')
      / count(*) filter (where t.sentiment in ('positive', 'negative'))
    )::smallint
  end as negative_ratio
from public.review_attribute_tags t
join public.reviews r on r.id = t.review_id
group by r.product_id;

-- 뷰가 SELECT하는 세션의 RLS를 기저 테이블(reviews, review_attribute_tags)에 그대로
-- 적용받도록 security_invoker를 명시한다. 두 테이블 모두 이미 anon/authenticated에게
-- select를 허용하는 "_public_select" 정책이 있으므로 뷰도 동일하게 공개 조회 가능해진다.
alter view public.review_attribute_sentiment_ratios set (security_invoker = true);
alter view public.review_overall_sentiment_ratios set (security_invoker = true);

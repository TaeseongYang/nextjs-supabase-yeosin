-- positive_ratio/negative_ratio는 이제 review_attribute_tags 집계로 매 조회 시점에
-- 계산하므로 review_summaries에서 완전히 제거한다. positive_bullets/negative_bullets는
-- 여전히 관리자가 수동 입력하는 텍스트이므로 테이블 자체는 유지한다.
alter table public.review_summaries
  drop constraint ratio_sum_not_over_100;

alter table public.review_summaries
  drop column positive_ratio,
  drop column negative_ratio;

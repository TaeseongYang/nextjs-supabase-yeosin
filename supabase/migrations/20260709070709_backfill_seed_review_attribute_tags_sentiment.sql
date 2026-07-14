-- 시드 리뷰 22건(20260708134759)의 review_attribute_tags.sentiment를 리뷰 본문 내용에
-- 맞게 채운다. 컬럼 추가 시점의 기본값 'neutral'을 리뷰 내용 기반 판단으로 override한다.
-- author_label + created_at 조합은 시드 데이터 내에서 유일하므로 이를 키로 원본 리뷰를 찾는다.

update public.review_attribute_tags t
set sentiment = v.sentiment::public.review_sentiment
from (values
  ('김**', date '2026-06-01', 'medical_staff', 'positive'),
  ('김**', date '2026-06-01', 'effect', 'positive'),
  ('이**', date '2026-06-05', 'service', 'negative'),
  ('이**', date '2026-06-05', 'effect', 'positive'),
  ('박**', date '2026-06-10', 'price', 'negative'),
  ('박**', date '2026-06-10', 'pain', 'positive'),
  ('최**', date '2026-06-03', 'effect', 'positive'),
  ('최**', date '2026-06-03', 'pain', 'positive'),
  ('정**', date '2026-06-08', 'medical_staff', 'positive'),
  ('한**', date '2026-05-20', 'effect', 'positive'),
  ('한**', date '2026-05-20', 'pain', 'positive'),
  ('윤**', date '2026-05-25', 'service', 'positive'),
  ('윤**', date '2026-05-25', 'medical_staff', 'positive'),
  ('장**', date '2026-05-28', 'effect', 'positive'),
  ('장**', date '2026-05-28', 'pain', 'negative'),
  ('임**', date '2026-06-12', 'medical_staff', 'positive'),
  ('임**', date '2026-06-12', 'effect', 'positive'),
  ('오**', date '2026-06-15', 'effect', 'positive'),
  ('강**', date '2026-05-10', 'service', 'positive'),
  ('강**', date '2026-05-10', 'medical_staff', 'positive'),
  ('조**', date '2026-05-15', 'effect', 'positive'),
  ('조**', date '2026-05-15', 'price', 'negative'),
  ('신**', date '2026-06-18', 'effect', 'positive'),
  ('신**', date '2026-06-18', 'pain', 'positive'),
  ('권**', date '2026-06-20', 'effect', 'positive'),
  ('권**', date '2026-06-20', 'pain', 'negative'),
  ('황**', date '2026-06-22', 'effect', 'positive'),
  ('황**', date '2026-06-22', 'price', 'positive'),
  ('안**', date '2026-06-25', 'service', 'positive'),
  ('안**', date '2026-06-25', 'effect', 'positive'),
  ('송**', date '2026-06-28', 'effect', 'positive'),
  ('송**', date '2026-06-28', 'pain', 'positive'),
  ('배**', date '2026-07-01', 'pain', 'positive'),
  ('배**', date '2026-07-01', 'effect', 'positive'),
  ('노**', date '2026-07-03', 'price', 'positive'),
  ('노**', date '2026-07-03', 'effect', 'negative'),
  ('홍**', date '2026-07-05', 'medical_staff', 'positive'),
  ('홍**', date '2026-07-05', 'service', 'positive'),
  ('유**', date '2026-07-06', 'effect', 'positive'),
  ('유**', date '2026-07-06', 'medical_staff', 'positive'),
  ('구**', date '2026-07-08', 'pain', 'negative'),
  ('구**', date '2026-07-08', 'effect', 'positive')
) as v(author_label, created_at, attribute, sentiment)
join public.reviews r
  on r.author_label = v.author_label and r.created_at = v.created_at
where t.review_id = r.id
  and t.attribute = v.attribute::public.review_attribute;

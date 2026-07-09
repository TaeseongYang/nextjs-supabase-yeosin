-- review_summaries 시드: lib/dummy-data/review-summaries.ts 36건 원본 그대로
-- prod-1, prod-2, prod-3, prod-12, prod-17, prod-18 6개 상품만 전체(attribute=null)+5개 속성 풀세트

-- prod-1: 수분 물광 리프팅 시술
insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, null, 82, 18,
  array['피부 톤이 밝아지고 촉촉해졌다는 후기가 많아요','시술 후 통증이 거의 없다는 평가가 많습니다'],
  array['가격이 다소 부담스럽다는 의견이 있어요']
from public.treatment_products p where p.name = '수분 물광 리프팅 시술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'medical_staff'::public.review_attribute, 88, 12,
  array['상담부터 시술까지 친절하고 꼼꼼했다는 후기가 많아요'],
  array['담당의가 자주 바뀐다는 의견이 일부 있어요']
from public.treatment_products p where p.name = '수분 물광 리프팅 시술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'service'::public.review_attribute, 75, 25,
  array['예약과 안내 시스템이 편리했다는 후기가 많아요'],
  array['대기 시간이 길었다는 의견이 있어요']
from public.treatment_products p where p.name = '수분 물광 리프팅 시술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'price'::public.review_attribute, 60, 40,
  array['이벤트 할인가가 합리적이라는 후기가 있어요'],
  array['정가 기준으로는 비싸다는 의견이 많아요']
from public.treatment_products p where p.name = '수분 물광 리프팅 시술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'effect'::public.review_attribute, 90, 10,
  array['피부 결과 톤 개선 효과가 뚜렷하다는 후기가 많아요'],
  array['효과 유지 기간이 짧다는 의견이 일부 있어요']
from public.treatment_products p where p.name = '수분 물광 리프팅 시술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'pain'::public.review_attribute, 85, 15,
  array['통증이 거의 없어 편하게 시술받았다는 후기가 많아요'],
  array['부위에 따라 따끔거림이 있었다는 의견이 있어요']
from public.treatment_products p where p.name = '수분 물광 리프팅 시술';

-- prod-2: 듀얼 토닝 피부 재생 레이저
insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, null, 78, 22,
  array['재생 효과가 빠르고 자연스럽다는 후기가 많아요'],
  array['시술 후 홍조가 며칠 지속된다는 의견이 있어요']
from public.treatment_products p where p.name = '듀얼 토닝 피부 재생 레이저';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'medical_staff'::public.review_attribute, 80, 20,
  array['피부 상태를 꼼꼼히 진단해준다는 후기가 많아요'],
  array['설명이 다소 빠르게 진행됐다는 의견이 있어요']
from public.treatment_products p where p.name = '듀얼 토닝 피부 재생 레이저';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'service'::public.review_attribute, 70, 30,
  array['사후 관리 안내가 자세했다는 후기가 있어요'],
  array['재방문 예약이 번거로웠다는 의견이 있어요']
from public.treatment_products p where p.name = '듀얼 토닝 피부 재생 레이저';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'price'::public.review_attribute, 65, 35,
  array['패키지 할인이 합리적이라는 후기가 있어요'],
  array['여러 번 받아야 효과가 커서 총비용이 부담된다는 의견이 있어요']
from public.treatment_products p where p.name = '듀얼 토닝 피부 재생 레이저';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'effect'::public.review_attribute, 85, 15,
  array['잡티와 톤 개선 효과가 뛰어나다는 후기가 많아요'],
  array['즉각적인 변화는 크지 않다는 의견이 있어요']
from public.treatment_products p where p.name = '듀얼 토닝 피부 재생 레이저';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'pain'::public.review_attribute, 80, 20,
  array['따끔거림이 적어 참을만 하다는 후기가 많아요'],
  array['예민한 부위는 통증이 있었다는 의견이 있어요']
from public.treatment_products p where p.name = '듀얼 토닝 피부 재생 레이저';

-- prod-3: 자연유착 쌍꺼풀 수술
insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, null, 88, 12,
  array['자연스러운 라인과 회복 속도에 만족한다는 후기가 많아요','상담이 꼼꼼했다는 평가가 많습니다'],
  array['붓기 빠지는 기간이 예상보다 길었다는 의견이 있어요']
from public.treatment_products p where p.name = '자연유착 쌍꺼풀 수술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'medical_staff'::public.review_attribute, 92, 8,
  array['원장님의 디자인 감각이 좋다는 후기가 많아요'],
  array['상담 시간이 짧게 느껴졌다는 의견이 일부 있어요']
from public.treatment_products p where p.name = '자연유착 쌍꺼풀 수술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'service'::public.review_attribute, 84, 16,
  array['실장님 응대가 친절했다는 후기가 많아요'],
  array['수술 당일 대기 시간이 길었다는 의견이 있어요']
from public.treatment_products p where p.name = '자연유착 쌍꺼풀 수술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'price'::public.review_attribute, 70, 30,
  array['비용 대비 결과가 만족스럽다는 후기가 있어요'],
  array['추가 비용이 발생했다는 의견이 일부 있어요']
from public.treatment_products p where p.name = '자연유착 쌍꺼풀 수술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'effect'::public.review_attribute, 90, 10,
  array['자연스러운 눈매 라인에 만족한다는 후기가 많아요'],
  array['좌우 비대칭이 남아있다는 의견이 드물게 있어요']
from public.treatment_products p where p.name = '자연유착 쌍꺼풀 수술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'pain'::public.review_attribute, 75, 25,
  array['생각보다 통증이 적었다는 후기가 많아요'],
  array['붓기로 인한 불편함이 며칠 있었다는 의견이 있어요']
from public.treatment_products p where p.name = '자연유착 쌍꺼풀 수술';

-- prod-12: 레이저 제모 전신 패키지
insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, null, 80, 20,
  array['여러 번 받을수록 털이 얇아지고 나는 속도가 느려진다는 후기가 많아요','전신 패키지라 부위별로 따로 예약할 필요가 없어 편하다는 평가가 많습니다'],
  array['효과를 보려면 재방문 횟수가 생각보다 많이 필요하다는 의견이 있어요']
from public.treatment_products p where p.name = '레이저 제모 전신 패키지';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'medical_staff'::public.review_attribute, 78, 22,
  array['부위별 피부 상태를 확인하고 출력을 조절해준다는 후기가 많아요'],
  array['담당자가 매번 바뀐다는 의견이 일부 있어요']
from public.treatment_products p where p.name = '레이저 제모 전신 패키지';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'service'::public.review_attribute, 82, 18,
  array['직원분들이 친절하게 응대해준다는 후기가 많아요'],
  array['예약 변경이 번거롭다는 의견이 있어요']
from public.treatment_products p where p.name = '레이저 제모 전신 패키지';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'price'::public.review_attribute, 68, 32,
  array['전신 패키지치고 합리적인 가격이라는 후기가 있어요'],
  array['추가 회차 비용이 부담된다는 의견이 많아요']
from public.treatment_products p where p.name = '레이저 제모 전신 패키지';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'effect'::public.review_attribute, 85, 15,
  array['제모 효과가 확실하다는 후기가 많아요'],
  array['부위에 따라 효과 차이가 있다는 의견이 있어요']
from public.treatment_products p where p.name = '레이저 제모 전신 패키지';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'pain'::public.review_attribute, 83, 17,
  array['통증이 적어 편하게 받았다는 후기가 많아요'],
  array['예민한 부위는 따끔거림이 있었다는 의견이 있어요']
from public.treatment_products p where p.name = '레이저 제모 전신 패키지';

-- prod-17: 고주파 부분 제모 시술
insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, null, 76, 24,
  array['부분 제모라 시술 시간이 짧고 부담이 적다는 후기가 많아요'],
  array['원하는 효과를 보려면 재방문이 꽤 필요하다는 의견이 있어요']
from public.treatment_products p where p.name = '고주파 부분 제모 시술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'medical_staff'::public.review_attribute, 84, 16,
  array['상담부터 시술까지 설명이 자세하다는 후기가 많아요'],
  array['상담 시간이 짧게 느껴졌다는 의견이 일부 있어요']
from public.treatment_products p where p.name = '고주파 부분 제모 시술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'service'::public.review_attribute, 79, 21,
  array['예약 안내가 편리했다는 후기가 있어요'],
  array['대기 시간이 있었다는 의견이 있어요']
from public.treatment_products p where p.name = '고주파 부분 제모 시술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'price'::public.review_attribute, 72, 28,
  array['부분 제모 기준으로 가격이 합리적이라는 후기가 있어요'],
  array['재방문이 잦아 총비용이 늘어난다는 의견이 있어요']
from public.treatment_products p where p.name = '고주파 부분 제모 시술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'effect'::public.review_attribute, 74, 26,
  array['털이 얇아지고 나는 속도가 느려졌다는 후기가 많아요'],
  array['효과를 체감하기까지 시간이 걸린다는 의견이 많아요']
from public.treatment_products p where p.name = '고주파 부분 제모 시술';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'pain'::public.review_attribute, 81, 19,
  array['통증이 견딜만하다는 후기가 많아요'],
  array['부위에 따라 따끔거림이 있었다는 의견이 있어요']
from public.treatment_products p where p.name = '고주파 부분 제모 시술';

-- prod-18: 니들 제모 정밀 관리 패키지
insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, null, 79, 21,
  array['니들 제모라 재발이 적다는 후기가 많아요','관리가 꼼꼼하다는 평가가 많습니다'],
  array['시술 부위가 며칠간 붉어진다는 의견이 있어요']
from public.treatment_products p where p.name = '니들 제모 정밀 관리 패키지';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'medical_staff'::public.review_attribute, 86, 14,
  array['모낭 하나하나 꼼꼼히 관리해준다는 후기가 많아요'],
  array['시술 시간이 길게 느껴졌다는 의견이 일부 있어요']
from public.treatment_products p where p.name = '니들 제모 정밀 관리 패키지';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'service'::public.review_attribute, 77, 23,
  array['사후관리 안내가 자세했다는 후기가 있어요'],
  array['재방문 예약이 번거로웠다는 의견이 있어요']
from public.treatment_products p where p.name = '니들 제모 정밀 관리 패키지';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'price'::public.review_attribute, 62, 38,
  array['정밀 관리 대비 합리적인 가격이라는 후기가 있어요'],
  array['다른 제모 시술보다 비싸다는 의견이 많아요']
from public.treatment_products p where p.name = '니들 제모 정밀 관리 패키지';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'effect'::public.review_attribute, 88, 12,
  array['재발이 적고 효과가 오래간다는 후기가 많아요'],
  array['부위에 따라 여러 회차가 필요하다는 의견이 있어요']
from public.treatment_products p where p.name = '니들 제모 정밀 관리 패키지';

insert into public.review_summaries (product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets)
select p.id, 'pain'::public.review_attribute, 68, 32,
  array['마취 후 진행돼 통증이 크지 않았다는 후기가 있어요'],
  array['시술 후 붉은기와 따가움이 며칠 지속됐다는 의견이 많아요']
from public.treatment_products p where p.name = '니들 제모 정밀 관리 패키지';

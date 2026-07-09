-- treatment_products 시드: lib/dummy-data/products.ts 18개 원본 그대로
-- category_id/hospital_id는 categories.slug / hospitals.name 서브쿼리로 재조회

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '수분 물광 리프팅 시술', 300000, 199000, true, false, true,
  '시술 부위에 일시적인 붉어짐이나 미세한 붓기가 있을 수 있습니다.', '/placeholder-product-1.jpg',
  array['/placeholder-detail-1-1.jpg','/placeholder-detail-1-2.jpg']
from public.categories c, public.hospitals h where c.slug = 'skin' and h.name = '강남서울피부과의원';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '듀얼 토닝 피부 재생 레이저', 250000, 149000, true, false, true,
  '시술 직후 일시적인 홍조가 나타날 수 있으며 자외선 차단이 필요합니다.', '/placeholder-product-2.jpg',
  array['/placeholder-detail-2-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'skin' and h.name = '판교연세피부과의원';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '자연유착 쌍꺼풀 수술', 1500000, 990000, true, true, true,
  '수술 후 1~2주간 붓기 및 멍이 발생할 수 있습니다.', '/placeholder-product-3.jpg',
  array['/placeholder-detail-3-1.jpg','/placeholder-detail-3-2.jpg']
from public.categories c, public.hospitals h where c.slug = 'eyes' and h.name = '신사라인성형외과';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '눈매교정 절개 수술', 2200000, 1690000, true, true, true,
  '개인차에 따라 회복 기간이 2~4주 소요될 수 있습니다.', '/placeholder-product-4.jpg',
  array['/placeholder-detail-4-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'eyes' and h.name = '압구정휴먼성형외과';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '코끝 성형 실리콘 보형물 수술', 2800000, 2190000, true, true, true,
  '수술 부위 부기가 완전히 빠지기까지 약 1개월이 소요될 수 있습니다.', '/placeholder-product-5.jpg',
  array['/placeholder-detail-5-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'nose' and h.name = '신사라인성형외과';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '사각턱 보톡스 윤곽 시술', 200000, 99000, true, false, false,
  '일시적인 저작 시 불편감이 있을 수 있습니다.', '/placeholder-product-6.jpg',
  array['/placeholder-detail-6-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'contour' and h.name = '압구정휴먼성형외과';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '코헤시브 가슴성형 수술', 8000000, 6500000, true, true, true,
  '수술 후 정기적인 경과 관찰이 필요합니다.', '/placeholder-product-7.jpg',
  array['/placeholder-detail-7-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'breast' and h.name = '청담뷰티클리닉';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '복부 지방흡입 바디라인 시술', 3500000, 2790000, true, true, true,
  '시술 후 압박복 착용 등 관리 지침 준수가 필요합니다.', '/placeholder-product-8.jpg',
  array['/placeholder-detail-8-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'body' and h.name = '부산센텀미소성형외과';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '이마 보톡스 주름 개선 시술', 150000, 79000, true, false, false,
  '드물게 두통이나 멍이 발생할 수 있습니다.', '/placeholder-product-9.jpg',
  array['/placeholder-detail-9-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'botox-filler' and h.name = '강남서울피부과의원';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '볼륨 히알루론산 필러', 350000, 259000, true, false, false,
  '시술 부위 붓기 및 멍이 며칠간 지속될 수 있습니다.', '/placeholder-product-10.jpg',
  array['/placeholder-detail-10-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'botox-filler' and h.name = '홍대엘르피부과의원';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '실 리프팅 탄력 개선 시술', 900000, 590000, true, true, true,
  '시술 부위 당김감이 1~2주간 지속될 수 있습니다.', '/placeholder-product-11.jpg',
  array['/placeholder-detail-11-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'lifting' and h.name = '청담뷰티클리닉';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '레이저 제모 전신 패키지', 600000, 299000, true, false, false,
  '시술 직후 일시적 홍반이 나타날 수 있습니다.', '/placeholder-product-12.jpg',
  array['/placeholder-detail-12-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'hair-removal' and h.name = '대구더클리어피부과';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '고주파 부분 제모 시술', 250000, 129000, true, false, false,
  '시술 부위에 일시적인 따끔거림이나 붉어짐이 있을 수 있습니다.', '/placeholder-product-17.jpg',
  array['/placeholder-detail-17-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'hair-removal' and h.name = '청담뷰티클리닉';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '니들 제모 정밀 관리 패키지', 450000, 259000, true, true, true,
  '시술 후 모낭 주변 붉은기가 며칠간 지속될 수 있습니다.', '/placeholder-product-18.jpg',
  array['/placeholder-detail-18-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'hair-removal' and h.name = '홍대엘르피부과의원';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '모발이식 M자 탈모 개선술', 4500000, 3490000, true, true, true,
  '이식 부위 딱지 및 일시적 통증이 발생할 수 있습니다.', '/placeholder-product-13.jpg',
  array['/placeholder-detail-13-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'hair-transplant' and h.name = '신사라인성형외과';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '치아미백 스케일링 패키지', 180000, 99000, true, false, false,
  '시술 후 일시적으로 시린 느낌이 있을 수 있습니다.', '/placeholder-product-14.jpg',
  array['/placeholder-detail-14-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'dental' and h.name = '홍대엘르피부과의원';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '울쎄라 안티에이징 시술', 1200000, 890000, true, false, true,
  '시술 중 일시적인 열감과 통증이 있을 수 있습니다.', '/placeholder-product-15.jpg',
  array['/placeholder-detail-15-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'anti-aging' and h.name = '판교연세피부과의원';

insert into public.treatment_products (category_id, hospital_id, name, original_price, discount_price, includes_vat, includes_anesthesia, includes_aftercare, side_effect_notice, thumbnail_url, detail_image_urls)
select c.id, h.id, '인모드 탄력 안티에이징 리프팅', 800000, 550000, true, false, true,
  '시술 부위 일시적인 열감이 있을 수 있습니다.', '/placeholder-product-16.jpg',
  array['/placeholder-detail-16-1.jpg']
from public.categories c, public.hospitals h where c.slug = 'anti-aging' and h.name = '부산센텀미소성형외과';

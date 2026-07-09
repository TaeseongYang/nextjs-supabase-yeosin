-- categories 시드: lib/dummy-data/categories.ts 12개 원본 그대로 (cat-9가 첫 항목, 제모 우선 노출 순서 반영)
insert into public.categories (name, icon_key, slug) values
  ('제모','wind','hair-removal'),
  ('피부','sparkles','skin'),
  ('눈성형','eye','eyes'),
  ('코성형','triangle','nose'),
  ('안면윤곽','scan-face','contour'),
  ('가슴성형','heart','breast'),
  ('바디라인','dumbbell','body'),
  ('보톡스/필러','syringe','botox-filler'),
  ('리프팅','trending-up','lifting'),
  ('모발이식','scissors','hair-transplant'),
  ('치아교정/미백','smile','dental'),
  ('안티에이징','leaf','anti-aging');

-- hospitals 시드: lib/dummy-data/hospitals.ts 8개 원본 그대로
insert into public.hospitals (name, region) values
  ('강남서울피부과의원','서울 강남구'),
  ('신사라인성형외과','서울 강남구'),
  ('청담뷰티클리닉','서울 강남구'),
  ('압구정휴먼성형외과','서울 강남구'),
  ('판교연세피부과의원','경기 성남시'),
  ('부산센텀미소성형외과','부산 해운대구'),
  ('대구더클리어피부과','대구 수성구'),
  ('홍대엘르피부과의원','서울 마포구');

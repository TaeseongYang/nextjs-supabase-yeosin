-- 상품 썸네일/상세 이미지를 저장할 공개 Storage 버킷 생성.
-- 일반 사용자 페이지(/products/[productId])가 인증 없이 이미지를 조회해야 하므로
-- public 버킷으로 생성한다 (Task 008 anon 상품 조회 공개 정책과 동일한 맥락).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- 공개 조회(SELECT)는 anon/authenticated 모두 허용 (public 버킷이므로 실질적으로는
-- 버킷 설정만으로도 공개 URL 접근이 가능하지만, storage.objects 자체의 RLS도 명시적으로 허용한다).
create policy "product_images_public_select"
on storage.objects
for select
to public
using (bucket_id = 'product-images');

-- 업로드/수정/삭제(INSERT/UPDATE/DELETE)는 이 프로젝트의 일관된 패턴대로
-- anon/authenticated에게 권한을 주지 않는다. 관리자 쓰기는 서버의
-- createServiceClient()(service_role)로만 수행하며, service_role은 RLS를
-- 완전히 우회하므로 별도의 허용 정책이 필요 없다.

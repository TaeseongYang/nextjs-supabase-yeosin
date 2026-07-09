-- get_advisors(security) WARN(public_bucket_allows_listing): public 버킷은 별도 SELECT 정책
-- 없이도 개별 객체의 공개 URL 접근이 가능하다. product_images_public_select 정책은
-- storage.objects에 대한 broad SELECT(목록 조회 포함)를 anon/authenticated에게 허용해
-- 버킷 내 전체 파일 목록이 노출될 수 있으므로 제거한다. 이 프로젝트는 상품 이미지를
-- 항상 알려진 public URL로만 참조하며 버킷 목록 조회 기능이 필요 없다.
drop policy if exists "product_images_public_select" on storage.objects;

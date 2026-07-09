-- 직전 마이그레이션(20260709021411)의 `revoke ... from public`만으로는 anon/authenticated의
-- 실행 권한이 제거되지 않는 것을 실측으로 확인했다(has_function_privilege가 true 반환).
-- Supabase 프로젝트는 public 스키마에 신규 함수 생성 시 anon/authenticated 롤에
-- EXECUTE 권한이 개별적으로(default privileges) 자동 부여되는 것으로 보이며,
-- PUBLIC pseudo-role에 대한 REVOKE는 이 개별 GRANT를 취소하지 못한다.
-- 따라서 anon/authenticated 각각에 대해 명시적으로 REVOKE해야 한다.
-- 이 함수는 service_role(RLS 우회, lib/supabase/service.ts의 createServiceClient())을
-- 통해서만 호출되어야 하므로, anon/authenticated의 직접 RPC 호출을 반드시 차단한다.
revoke execute on function public.upsert_review_with_tags(uuid, uuid, text, smallint, text, date, public.review_attribute[]) from public;
revoke execute on function public.upsert_review_with_tags(uuid, uuid, text, smallint, text, date, public.review_attribute[]) from anon;
revoke execute on function public.upsert_review_with_tags(uuid, uuid, text, smallint, text, date, public.review_attribute[]) from authenticated;

-- 20260709070618 마이그레이션의 "revoke execute ... from public"만으로는 anon/authenticated
-- 개별 롤의 EXECUTE 권한이 실제로 제거되지 않는 것이 get_advisors + has_function_privilege로
-- 확인되었다(이 프로젝트의 anon/authenticated가 PUBLIC과 별개로 직접 권한을 상속받는 것으로
-- 보임 — 20260709021459 마이그레이션명(revoke_upsert_review_with_tags_from_anon_authenticated)이
-- 이전에도 동일한 이슈를 다뤘던 선례). 함수를 재생성할 때마다 anon/authenticated에 대한
-- EXECUTE를 명시적으로 revoke해야 한다.
revoke execute on function public.upsert_review_with_tags(uuid, uuid, text, numeric, text, date, jsonb) from anon;
revoke execute on function public.upsert_review_with_tags(uuid, uuid, text, numeric, text, date, jsonb) from authenticated;

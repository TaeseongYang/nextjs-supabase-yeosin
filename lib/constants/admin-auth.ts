// 관리자 로그인 세션을 표시하는 쿠키 이름.
// proxy.ts(서버 가드)와 Server Action(lib/actions/admin-auth.ts) 양쪽에서 공유한다.
export const ADMIN_SESSION_COOKIE = "admin_session";

// 세션 유효 기간(12시간). 만료되면 재로그인이 필요하다.
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

// 관리자가 실험 환경 A/B 중 어느 쪽을 미리보기 중인지 기록하는 쿠키 이름.
// 참여자 그룹 쿠키(PARTICIPANT_GROUP_COOKIE)와 별개로 관리되며,
// lib/utils/experiment-group.ts에서 참여자 쿠키보다 우선해서 읽는다.
export const ADMIN_GROUP_COOKIE = "admin_experiment_group";

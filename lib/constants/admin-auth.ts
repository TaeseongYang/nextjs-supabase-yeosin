// 관리자 로그인 세션을 표시하는 쿠키 이름.
// proxy.ts(서버 가드)와 Server Action(lib/actions/admin-auth.ts) 양쪽에서 공유한다.
export const ADMIN_SESSION_COOKIE = "admin_session";

// 세션 유효 기간(12시간). 만료되면 재로그인이 필요하다.
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

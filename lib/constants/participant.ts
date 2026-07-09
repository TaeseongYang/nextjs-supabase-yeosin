// 실험 참여자 인적사항 입력 완료 여부를 표시하는 쿠키 이름.
// proxy.ts(서버 가드)와 Server Action(app/actions/participant.ts) 양쪽에서 공유한다.
export const PARTICIPANT_INFO_COOKIE = "participant_info_submitted";

// 실험 참여자 정보를 입력해야만 접근 가능한, 즉 실험 환경(홈)에 해당하는 경로 prefix 목록.
// 이 경로들은 proxy.ts에서 PARTICIPANT_INFO_COOKIE가 없으면 "/"(인적사항 입력 화면)로 리다이렉트된다.
export const EXPERIMENT_PATH_PREFIXES = [
  "/categories",
  "/products",
  "/hospitals",
  "/events",
  "/mypage",
] as const;

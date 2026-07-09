// 주의: 이 파일은 다른 lib/queries/*.ts와 달리 createClient()(anon 키)가 아니라
// createServiceClient()(service_role 키, RLS 우회)를 사용한다.
// participants 테이블은 RLS는 활성화되어 있지만 SELECT를 포함한 어떤 정책도 없어서
// anon/authenticated 키로는 조회가 원천 차단되기 때문이다(RLS 기본 거부).
// service_role 키가 클라이언트 번들에 노출되면 안 되므로, 이 파일은 반드시
// async Server Component(또는 다른 서버 전용 코드)에서만 import해야 하며
// "use client" 컴포넌트에서 절대 import하지 않는다. (이 프로젝트에는 server-only
// 패키지가 설치되어 있지 않아 빌드 타임에 강제되지 않으므로 각별히 주의할 것.)
import { createServiceClient } from "@/lib/supabase/service";

export interface ParticipantResponse {
  id: string;
  gender: "female" | "male";
  age: number;
  hasOnlineExperience: "yes" | "no";
  createdAt: string;
}

/**
 * 관리자 화면(app/admin/participants)에서 실험 참여자 인적사항 응답을
 * 최신 제출순(created_at desc)으로 조회한다. 개별 삭제는 lib/actions/participants.ts의
 * deleteParticipantResponse를 사용한다(수정 기능은 없음).
 */
export async function getParticipantResponses(): Promise<
  ParticipantResponse[]
> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("participants")
    .select("id, gender, age, has_online_experience, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    gender: row.gender as ParticipantResponse["gender"],
    age: row.age,
    hasOnlineExperience:
      row.has_online_experience as ParticipantResponse["hasOnlineExperience"],
    createdAt: row.created_at,
  }));
}

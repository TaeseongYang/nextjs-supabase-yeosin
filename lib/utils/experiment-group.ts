import { cookies } from "next/headers";

import { ADMIN_GROUP_COOKIE } from "@/lib/constants/admin-auth";
import {
  EXPERIMENT_GROUP_VALUES,
  PARTICIPANT_GROUP_COOKIE,
  type ExperimentGroup,
} from "@/lib/constants/participant";

function isExperimentGroup(
  value: string | undefined,
): value is ExperimentGroup {
  return (
    value !== undefined &&
    (EXPERIMENT_GROUP_VALUES as readonly string[]).includes(value)
  );
}

// 관리자 쿠키(있으면 그룹을 강제 전환한 상태)를 참여자 쿠키보다 우선하고,
// 둘 다 없으면 "a"(기존에 유일했던 요약형 화면)로 폴백한다.
// 값이 예상 밖 문자열이면(수동 조작 등) 무시하고 다음 우선순위로 넘어간다.
export function resolveExperimentGroup(
  participantGroupCookie: string | undefined,
  adminGroupCookie: string | undefined,
): ExperimentGroup {
  if (isExperimentGroup(adminGroupCookie)) return adminGroupCookie;
  if (isExperimentGroup(participantGroupCookie)) return participantGroupCookie;
  return "a";
}

export async function getExperimentGroup(): Promise<ExperimentGroup> {
  const cookieStore = await cookies();
  return resolveExperimentGroup(
    cookieStore.get(PARTICIPANT_GROUP_COOKIE)?.value,
    cookieStore.get(ADMIN_GROUP_COOKIE)?.value,
  );
}

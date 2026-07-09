import { z } from "zod";

export const GENDER_OPTIONS = [
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
] as const;

// 온라인에서 시술 정보를 검색/구매해본 경험 여부 선택지.
// 참여자 입력 폼과 관리자 응답 목록(app/admin/participants)에서 공통으로 사용한다.
export const HAS_ONLINE_EXPERIENCE_OPTIONS = [
  { value: "yes", label: "예" },
  { value: "no", label: "아니오" },
] as const;

export const participantSchema = z.object({
  gender: z.enum(["female", "male"]),
  age: z.number().int().positive().max(120),
  hasOnlineExperience: z.enum(["yes", "no"]),
});

export type ParticipantFormInput = z.infer<typeof participantSchema>;

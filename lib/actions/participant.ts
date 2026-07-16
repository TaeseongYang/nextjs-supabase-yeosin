"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  PARTICIPANT_GROUP_COOKIE,
  PARTICIPANT_INFO_COOKIE,
} from "@/lib/constants/participant";
import { createServiceClient } from "@/lib/supabase/service";
import { participantSchema } from "@/lib/validations/participant-schema";

// 실험 참여자 인적사항을 서버에서 검증하고, 통과 시 응답값을 DB에 저장한 뒤
// 완료 여부를 httpOnly 쿠키에 기록한다.
// 쿠키는 proxy.ts에서 실험 환경(홈) 경로 접근을 서버 사이드에서 가드하는 "제출 여부" 플래그이고,
// 응답값 자체(성별/나이/온라인 경험)는 실험 데이터 분석을 위해 participants 테이블에 영속화한다.
// (이름 등 개인식별 정보는 계속 수집하지 않는다.)
export async function submitParticipantInfo(formData: FormData) {
  const result = participantSchema.safeParse({
    gender: formData.get("gender"),
    age: Number(formData.get("age")),
    hasOnlineExperience: formData.get("hasOnlineExperience"),
    experimentGroup: formData.get("experimentGroup"),
  });

  if (!result.success) {
    return {
      success: false as const,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  // participants 테이블은 RLS 정책이 전혀 없어(SELECT 포함) anon/authenticated 키로는
  // 접근이 불가능하므로, RLS를 우회하는 service_role 클라이언트로만 INSERT한다.
  const serviceClient = createServiceClient();
  const { error } = await serviceClient.from("participants").insert({
    gender: result.data.gender,
    age: result.data.age,
    has_online_experience: result.data.hasOnlineExperience,
    experiment_group: result.data.experimentGroup,
  });

  if (error) {
    return {
      success: false as const,
      fieldErrors: {
        _form: ["저장 중 오류가 발생했습니다. 다시 시도해주세요."],
      },
    };
  }

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    // 세션 종료 후에도 유지되어야 재접속 시 재입력을 요구하지 않는다 (30일).
    maxAge: 60 * 60 * 24 * 30,
  };
  cookieStore.set(PARTICIPANT_INFO_COOKIE, "1", cookieOptions);
  cookieStore.set(
    PARTICIPANT_GROUP_COOKIE,
    result.data.experimentGroup,
    cookieOptions,
  );

  redirect("/categories");
}

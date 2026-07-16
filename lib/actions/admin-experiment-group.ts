"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_GROUP_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/lib/constants/admin-auth";
import type { ExperimentGroup } from "@/lib/constants/participant";

// 관리자 대시보드의 "실험 환경 A/B 보기" 버튼이 호출하는 액션.
// 관리자 전용 그룹 쿠키를 심어 실험 환경 화면을 원하는 그룹으로 강제 전환한 뒤
// /categories로 이동시킨다. 인적사항 입력 없이도 두 환경을 자유롭게 오갈 수 있게 하기 위함이다.
export async function setAdminExperimentGroup(group: ExperimentGroup) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_GROUP_COOKIE, group, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  redirect("/categories");
}

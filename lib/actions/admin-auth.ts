"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/lib/constants/admin-auth";
import { createServiceClient } from "@/lib/supabase/service";
import { createAdminSessionToken } from "@/lib/utils/admin-session";
import { adminAuthSchema } from "@/lib/validations/admin-auth-schema";

// 관리자 로그인. admin_users 테이블(별도 RLS 정책 없음 → service_role 전용)에서
// username으로 조회한 password_hash와 입력값을 bcrypt로 대조한다.
// 성공 시 서명된 세션 쿠키(ADMIN_SESSION_COOKIE)를 발급해 proxy.ts가 실험 경로/
// /admin 접근을 허용하는 데 사용한다.
export async function signInAdmin(formData: FormData) {
  const result = adminAuthSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      success: false as const,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const serviceClient = createServiceClient();
  const { data: adminUser } = await serviceClient
    .from("admin_users")
    .select("password_hash")
    .eq("username", result.data.username)
    .maybeSingle();

  const isValid = adminUser
    ? await bcrypt.compare(result.data.password, adminUser.password_hash)
    : false;

  if (!isValid) {
    return {
      success: false as const,
      fieldErrors: {
        _form: ["아이디 또는 비밀번호가 올바르지 않습니다."],
      },
    };
  }

  const token = await createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  redirect("/admin");
}

// 관리자 로그아웃. 세션 쿠키만 삭제하면 되므로 별도의 폼 상태나 검증이 필요 없다.
export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

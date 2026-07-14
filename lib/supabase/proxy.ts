import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import {
  EXPERIMENT_PATH_PREFIXES,
  PARTICIPANT_INFO_COOKIE,
} from "../constants/participant";
import { ADMIN_SESSION_COOKIE } from "../constants/admin-auth";
import { verifyAdminSessionToken } from "../utils/admin-session";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip proxy check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // 실험 참여자 인적사항 입력 가드.
  // "/"(인적사항 입력 화면)에서 서버 액션(submitParticipantInfo)이 정보를 검증하고
  // PARTICIPANT_INFO_COOKIE를 심어야만 실험 환경(홈: /categories 등) 접근을 허용한다.
  // 클라이언트 라우팅(router.push)만으로는 URL 직접 접근을 막을 수 없으므로 여기서 서버 사이드로 강제한다.
  // 관리자 세션(ADMIN_SESSION_COOKIE)이 유효한 경우에도 참여자 정보 입력 없이 통과시킨다
  // (관리자가 매번 인적사항을 입력하지 않고 실험 환경을 확인할 수 있어야 하기 때문).
  const hasSubmittedParticipantInfo = Boolean(
    request.cookies.get(PARTICIPANT_INFO_COOKIE)?.value,
  );
  const hasValidAdminSession = await verifyAdminSessionToken(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );
  const isExperimentPath = EXPERIMENT_PATH_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (
    isExperimentPath &&
    !hasSubmittedParticipantInfo &&
    !hasValidAdminSession
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("error", "access_denied");
    return NextResponse.redirect(url);
  }

  // /admin(로그인 페이지 제외)은 관리자 세션이 유효해야만 접근 가능하다.
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isAdminLoginPath = request.nextUrl.pathname.startsWith("/admin/login");

  if (isAdminPath && !isAdminLoginPath && !hasValidAdminSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  const publicPathPrefixes = [
    "/categories",
    "/products",
    "/hospitals",
    "/events",
    "/mypage",
    "/admin",
  ];

  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !publicPathPrefixes.some((prefix) =>
      request.nextUrl.pathname.startsWith(prefix),
    )
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

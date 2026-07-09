import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * service_role 키는 RLS를 완전히 우회하므로 반드시 "use server" 파일에서만 import한다.
 * (클라이언트 번들에 노출되면 anon/authenticated 제약을 무시하고 모든 테이블에
 * 접근 가능한 키가 유출되므로 절대 Client Component에서 import하지 않는다.)
 *
 * Fluid compute 환경을 고려해 전역 변수에 담지 않고 호출마다 새로 생성한다.
 */
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

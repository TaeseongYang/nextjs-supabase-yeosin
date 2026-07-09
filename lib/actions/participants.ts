"use server";

import { revalidatePath } from "next/cache";

import { createServiceClient } from "@/lib/supabase/service";

// participants 테이블은 RLS 정책이 전혀 없어(SELECT/INSERT/UPDATE/DELETE 모두) anon/authenticated
// 키로는 접근이 불가능하므로, RLS를 우회하는 service_role 클라이언트로만 DELETE한다.
// participants는 다른 테이블과 FK로 연결되어 있지 않은 독립 테이블이라 cascade 삭제를 고려할 필요가 없다.
export async function deleteParticipantResponse(
  participantId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("participants")
    .delete()
    .eq("id", participantId);
  if (error) {
    return { success: false, error: "삭제 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/participants");
  return { success: true };
}

import { createClient } from "@/lib/supabase/server";
import type { Hospital } from "@/lib/types/domain";

/**
 * 관리자 상품 등록/수정 폼의 병원 선택 옵션을 위해 전체 병원 목록을 조회한다.
 */
export async function getHospitals(): Promise<Hospital[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hospitals")
    .select("id, name, region")
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    region: row.region,
  }));
}

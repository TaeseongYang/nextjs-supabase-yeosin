import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types/domain";

/**
 * 카테고리 홈(F001)에 노출할 전체 카테고리 목록을 생성 순서대로 조회한다.
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, icon_key, slug")
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    iconKey: row.icon_key,
    slug: row.slug,
  }));
}

/**
 * 단일 카테고리를 id로 조회한다.
 * categoryId가 uuid 형식이 아니면 Postgres가 22P02(invalid_text_representation)를
 * 던지는데, 이 경우도 "존재하지 않는 카테고리"로 취급해 null을 반환한다.
 */
export async function getCategoryById(
  categoryId: string,
): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, icon_key, slug")
    .eq("id", categoryId)
    .maybeSingle();
  if (error) {
    if (error.code === "22P02") return null;
    throw error;
  }
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    iconKey: data.icon_key,
    slug: data.slug,
  };
}

import { createClient } from "@/lib/supabase/server";
import type { ReviewSummary } from "@/lib/types/domain";
import type { ReviewAttributeType } from "@/lib/types/attribute";

/**
 * 특정 상품의 전체 리뷰 요약(attribute=null, F004)을 조회한다.
 * Task 008에서 만든 부분 unique 인덱스(uq_review_summaries_all)가
 * product_id당 attribute=null 행이 최대 1개만 존재함을 보장하므로 maybeSingle()이 안전하다.
 * productId가 uuid 형식이 아니면 Postgres가 22P02(invalid_text_representation)를
 * 던지는데, 이 경우도 "요약 없음"으로 취급해 null을 반환한다.
 */
export async function getOverallReviewSummary(
  productId: string,
): Promise<ReviewSummary | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("review_summaries")
    .select(
      "id, product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets",
    )
    .eq("product_id", productId)
    .is("attribute", null)
    .maybeSingle();
  if (error) {
    if (error.code === "22P02") return null;
    throw error;
  }
  if (!data) return null;
  return {
    id: data.id,
    productId: data.product_id,
    attribute: data.attribute,
    positiveRatio: data.positive_ratio,
    negativeRatio: data.negative_ratio,
    positiveBullets: data.positive_bullets,
    negativeBullets: data.negative_bullets,
  };
}

/**
 * 특정 상품의 모든 리뷰 요약(전체 F004 + 속성별 F005)을 한 번에 조회한다.
 * 관리자 요약 관리 화면(탭 UI)에서 탭별 초기값을 구성하기 위해 사용한다.
 * productId가 uuid 형식이 아니면 Postgres가 22P02(invalid_text_representation)를
 * 던지는데, 이 경우도 "요약 없음"으로 취급해 빈 배열을 반환한다.
 */
export async function getReviewSummariesByProduct(
  productId: string,
): Promise<ReviewSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("review_summaries")
    .select(
      "id, product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets",
    )
    .eq("product_id", productId);
  if (error) {
    if (error.code === "22P02") return [];
    throw error;
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    productId: row.product_id,
    attribute: row.attribute,
    positiveRatio: row.positive_ratio,
    negativeRatio: row.negative_ratio,
    positiveBullets: row.positive_bullets,
    negativeBullets: row.negative_bullets,
  }));
}

/**
 * 특정 상품의 속성별 리뷰 요약(F005)을 조회한다.
 * Task 008에서 만든 부분 unique 인덱스(uq_review_summaries_attr: product_id, attribute
 * where attribute is not null)가 이 조합의 유일성을 보장하므로 maybeSingle()이 안전하다.
 * productId가 uuid 형식이 아니면 Postgres가 22P02(invalid_text_representation)를
 * 던지는데, 이 경우도 "요약 없음"으로 취급해 null을 반환한다.
 */
export async function getReviewSummaryByAttribute(
  productId: string,
  attribute: ReviewAttributeType,
): Promise<ReviewSummary | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("review_summaries")
    .select(
      "id, product_id, attribute, positive_ratio, negative_ratio, positive_bullets, negative_bullets",
    )
    .eq("product_id", productId)
    .eq("attribute", attribute)
    .maybeSingle();
  if (error) {
    if (error.code === "22P02") return null;
    throw error;
  }
  if (!data) return null;
  return {
    id: data.id,
    productId: data.product_id,
    attribute: data.attribute,
    positiveRatio: data.positive_ratio,
    negativeRatio: data.negative_ratio,
    positiveBullets: data.positive_bullets,
    negativeBullets: data.negative_bullets,
  };
}

import { createClient } from "@/lib/supabase/server";
import type { ReviewSummary, ReviewSentimentRatio } from "@/lib/types/domain";
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
    .select("id, product_id, attribute, positive_bullets, negative_bullets")
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
    .select("id, product_id, attribute, positive_bullets, negative_bullets")
    .eq("product_id", productId);
  if (error) {
    if (error.code === "22P02") return [];
    throw error;
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    productId: row.product_id,
    attribute: row.attribute,
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
    .select("id, product_id, attribute, positive_bullets, negative_bullets")
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
    positiveBullets: data.positive_bullets,
    negativeBullets: data.negative_bullets,
  };
}

/**
 * 상품 전체 긍정/부정 비율(모든 속성 태그 합산, F004)을 review_overall_sentiment_ratios
 * 뷰에서 조회한다. PostgREST가 group by/집계를 지원하지 않으므로 DB 뷰로 미리 집계해둔
 * 결과를 단순 select하는 방식을 사용한다.
 */
export async function getOverallSentimentRatio(
  productId: string,
): Promise<ReviewSentimentRatio | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("review_overall_sentiment_ratios")
    .select(
      "positive_count, negative_count, rated_count, positive_ratio, negative_ratio",
    )
    .eq("product_id", productId)
    .maybeSingle();
  if (error) {
    if (error.code === "22P02") return null;
    throw error;
  }
  if (!data) return null;
  return {
    attribute: null,
    positiveCount: data.positive_count ?? 0,
    negativeCount: data.negative_count ?? 0,
    ratedCount: data.rated_count ?? 0,
    positiveRatio: data.positive_ratio,
    negativeRatio: data.negative_ratio,
  };
}

/**
 * 상품의 특정 속성 긍정/부정 비율(F005)을 review_attribute_sentiment_ratios 뷰에서 조회한다.
 */
export async function getAttributeSentimentRatio(
  productId: string,
  attribute: ReviewAttributeType,
): Promise<ReviewSentimentRatio | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("review_attribute_sentiment_ratios")
    .select(
      "attribute, positive_count, negative_count, rated_count, positive_ratio, negative_ratio",
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
    attribute: data.attribute,
    positiveCount: data.positive_count ?? 0,
    negativeCount: data.negative_count ?? 0,
    ratedCount: data.rated_count ?? 0,
    positiveRatio: data.positive_ratio,
    negativeRatio: data.negative_ratio,
  };
}

/**
 * 관리자 요약 관리 화면(탭 UI)의 모든 탭(전체+5속성) 비율을 한 번에 조회한다.
 * review_attribute_sentiment_ratios는 attribute별 행만 갖고 전체 합산 행이 없으므로,
 * overall은 review_overall_sentiment_ratios에서 별도로 가져와 병합한다.
 */
export async function getAllSentimentRatiosByProduct(
  productId: string,
): Promise<ReviewSentimentRatio[]> {
  const supabase = await createClient();
  const [{ data: overallRow }, { data: attrRows }] = await Promise.all([
    supabase
      .from("review_overall_sentiment_ratios")
      .select(
        "positive_count, negative_count, rated_count, positive_ratio, negative_ratio",
      )
      .eq("product_id", productId)
      .maybeSingle(),
    supabase
      .from("review_attribute_sentiment_ratios")
      .select(
        "attribute, positive_count, negative_count, rated_count, positive_ratio, negative_ratio",
      )
      .eq("product_id", productId),
  ]);

  const results: ReviewSentimentRatio[] = [];
  if (overallRow) {
    results.push({
      attribute: null,
      positiveCount: overallRow.positive_count ?? 0,
      negativeCount: overallRow.negative_count ?? 0,
      ratedCount: overallRow.rated_count ?? 0,
      positiveRatio: overallRow.positive_ratio,
      negativeRatio: overallRow.negative_ratio,
    });
  }
  for (const row of attrRows ?? []) {
    if (!row.attribute) continue;
    results.push({
      attribute: row.attribute,
      positiveCount: row.positive_count ?? 0,
      negativeCount: row.negative_count ?? 0,
      ratedCount: row.rated_count ?? 0,
      positiveRatio: row.positive_ratio,
      negativeRatio: row.negative_ratio,
    });
  }
  return results;
}

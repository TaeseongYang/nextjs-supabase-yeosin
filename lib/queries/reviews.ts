import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/lib/types/domain";
import type { ReviewAttributeType } from "@/lib/types/attribute";

/**
 * 특정 상품의 개별 리뷰 목록(F007)을 최신순으로 조회한다.
 * productId가 uuid 형식이 아니면 Postgres가 22P02(invalid_text_representation)를
 * 던지는데, 이 경우도 "리뷰 없음"으로 취급해 빈 배열을 반환한다.
 */
export async function getReviewsByProduct(
  productId: string,
): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, product_id, author_label, rating, content, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) {
    if (error.code === "22P02") return [];
    throw error;
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    productId: row.product_id,
    authorLabel: row.author_label,
    rating: row.rating,
    content: row.content,
    createdAt: row.created_at,
    attributeTags: [], // 이 페이지들은 attributeTags를 쓰지 않으므로 review_attribute_tags 조인을 생략한다.
  }));
}

/**
 * 관리자 개별 리뷰 관리 화면(F007 CRUD)을 위해 특정 상품의 리뷰를 속성 태그까지
 * 포함해 최신순으로 조회한다. 일반 사용자 화면용 getReviewsByProduct와 달리
 * review_attribute_tags를 review_id 목록으로 재조회해 각 리뷰에 매핑한다.
 * productId가 uuid 형식이 아니면 Postgres가 22P02를 던지는데, 이 경우도
 * "리뷰 없음"으로 취급해 빈 배열을 반환한다.
 */
export async function getReviewsByProductWithTags(
  productId: string,
): Promise<Review[]> {
  const supabase = await createClient();
  const { data: reviewRows, error } = await supabase
    .from("reviews")
    .select("id, product_id, author_label, rating, content, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) {
    if (error.code === "22P02") return [];
    throw error;
  }
  if (!reviewRows || reviewRows.length === 0) return [];

  const reviewIds = reviewRows.map((row) => row.id);
  const { data: tagRows, error: tagError } = await supabase
    .from("review_attribute_tags")
    .select("review_id, attribute")
    .in("review_id", reviewIds);
  if (tagError) throw tagError;

  const tagsByReviewId = new Map<string, ReviewAttributeType[]>();
  for (const tagRow of tagRows ?? []) {
    const existing = tagsByReviewId.get(tagRow.review_id) ?? [];
    existing.push(tagRow.attribute);
    tagsByReviewId.set(tagRow.review_id, existing);
  }

  return reviewRows.map((row) => ({
    id: row.id,
    productId: row.product_id,
    authorLabel: row.author_label,
    rating: row.rating,
    content: row.content,
    createdAt: row.created_at,
    attributeTags: tagsByReviewId.get(row.id) ?? [],
  }));
}

/**
 * 특정 상품에서 특정 속성 태그가 붙은 리뷰 목록(F007, 속성 필터)을 최신순으로 조회한다.
 * review_attribute_tags에서 review_id 목록을 먼저 가져온 뒤 reviews를
 * product_id + in()으로 재필터링하는 2단계 조회 방식을 사용한다(PostgREST 중첩 조인 미사용).
 * productId가 uuid 형식이 아니면 Postgres가 22P02(invalid_text_representation)를
 * 던지는데, 이 경우도 "리뷰 없음"으로 취급해 빈 배열을 반환한다.
 */
export async function getReviewsByProductAndAttribute(
  productId: string,
  attribute: ReviewAttributeType,
): Promise<Review[]> {
  const supabase = await createClient();

  const { data: tagRows, error: tagError } = await supabase
    .from("review_attribute_tags")
    .select("review_id")
    .eq("attribute", attribute);
  if (tagError) throw tagError;

  const taggedReviewIds = (tagRows ?? []).map((row) => row.review_id);
  if (taggedReviewIds.length === 0) return [];

  const { data: reviewRows, error: reviewError } = await supabase
    .from("reviews")
    .select("id, product_id, author_label, rating, content, created_at")
    .eq("product_id", productId)
    .in("id", taggedReviewIds)
    .order("created_at", { ascending: false });
  if (reviewError) {
    if (reviewError.code === "22P02") return [];
    throw reviewError;
  }

  return (reviewRows ?? []).map((row) => ({
    id: row.id,
    productId: row.product_id,
    authorLabel: row.author_label,
    rating: row.rating,
    content: row.content,
    createdAt: row.created_at,
    attributeTags: [], // 이 페이지는 attributeTags 배열 자체를 표시하지 않으므로 review_attribute_tags 재조인을 생략한다.
  }));
}

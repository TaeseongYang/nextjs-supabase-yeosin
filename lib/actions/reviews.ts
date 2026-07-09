"use server";

import { revalidatePath } from "next/cache";

import { createServiceClient } from "@/lib/supabase/service";
import { reviewSchema } from "@/lib/validations/review-schema";

/**
 * 개별 리뷰(F007)를 신규 등록/수정한다. reviewId가 null이면 신규,
 * 아니면 수정으로 처리하며, 실제 저장은 reviews + review_attribute_tags를
 * 원자적으로 갱신하는 upsert_review_with_tags RPC(service_role 전용)로 위임한다.
 */
export async function saveReview(reviewId: string | null, formData: FormData) {
  const raw = {
    productId: formData.get("productId"),
    authorLabel: formData.get("authorLabel"),
    rating: Number(formData.get("rating")),
    content: formData.get("content"),
    attributeTags: JSON.parse(String(formData.get("attributeTags") ?? "[]")),
  };
  const result = reviewSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false as const,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const createdAt = String(
    formData.get("createdAt") || new Date().toISOString().slice(0, 10),
  );
  const supabase = createServiceClient();
  const { productId, authorLabel, rating, content, attributeTags } =
    result.data;

  // Supabase가 생성하는 RPC 인자 타입은 실제로는 nullable(uuid | null)인
  // p_review_id를 non-nullable string으로 표기한다(생성기의 알려진 제약).
  // DB 함수 시그니처상 p_review_id는 null 허용이므로 여기서만 타입을 보정한다.
  const { error } = await supabase.rpc("upsert_review_with_tags", {
    p_review_id: reviewId as unknown as string,
    p_product_id: productId,
    p_author_label: authorLabel,
    p_rating: rating,
    p_content: content,
    p_created_at: createdAt,
    p_attribute_tags: attributeTags,
  });

  if (error) {
    return {
      success: false as const,
      fieldErrors: {
        _form: ["저장 중 오류가 발생했습니다. 다시 시도해주세요."],
      },
    };
  }

  revalidatePath(`/admin/products/${productId}/reviews`);
  revalidatePath(`/products/${productId}`);
  revalidatePath(`/products/${productId}/reviews`, "layout");
  return { success: true as const };
}

// review_attribute_tags는 reviews에 on delete cascade로 연결되어 있으므로
// 여기서 별도로 삭제할 필요가 없다(Task 008 스키마 설계 참고).
export async function deleteReview(reviewId: string, productId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
  if (error) {
    return { success: false as const, error: "삭제 중 오류가 발생했습니다." };
  }

  revalidatePath(`/admin/products/${productId}/reviews`);
  revalidatePath(`/products/${productId}`);
  revalidatePath(`/products/${productId}/reviews`, "layout");
  return { success: true as const };
}

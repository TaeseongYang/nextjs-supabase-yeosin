"use server";

import { revalidatePath } from "next/cache";

import { createServiceClient } from "@/lib/supabase/service";
import { reviewSummarySchema } from "@/lib/validations/review-summary-schema";
import type { ReviewAttributeType } from "@/lib/types/attribute";

/**
 * 리뷰 요약(전체 F004 또는 속성별 F005)을 등록/수정한다.
 * review_summaries 테이블은 부분 unique 인덱스 두 개(uq_review_summaries_all,
 * uq_review_summaries_attr)를 갖는데, PostgREST의 upsert() onConflict가 부분 unique
 * 인덱스를 안정적으로 타겟팅하기 어려워 select 후 update/insert로 분기하는 방식을 사용한다.
 */
export async function upsertReviewSummary(formData: FormData) {
  const rawAttribute = formData.get("attribute");
  const raw = {
    productId: formData.get("productId"),
    // 빈 문자열/null -> null(전체 요약)
    attribute: rawAttribute
      ? (String(rawAttribute) as ReviewAttributeType)
      : null,
    positiveRatio: Number(formData.get("positiveRatio")),
    negativeRatio: Number(formData.get("negativeRatio")),
    positiveBullets: JSON.parse(
      String(formData.get("positiveBullets") ?? "[]"),
    ),
    negativeBullets: JSON.parse(
      String(formData.get("negativeBullets") ?? "[]"),
    ),
  };

  const result = reviewSummarySchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false as const,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  // 스키마에 없는 커스텀 검증: 긍정/부정 비율 합은 100을 초과할 수 없다.
  if (result.data.positiveRatio + result.data.negativeRatio > 100) {
    return {
      success: false as const,
      fieldErrors: {
        _form: ["긍정+부정 비율의 합은 100을 초과할 수 없습니다."],
      },
    };
  }

  const supabase = createServiceClient();
  const {
    productId,
    attribute,
    positiveRatio,
    negativeRatio,
    positiveBullets,
    negativeBullets,
  } = result.data;

  let query = supabase
    .from("review_summaries")
    .select("id")
    .eq("product_id", productId);
  query = attribute
    ? query.eq("attribute", attribute)
    : query.is("attribute", null);
  const { data: existing, error: selectError } = await query.maybeSingle();
  if (selectError) {
    return {
      success: false as const,
      fieldErrors: { _form: ["조회 중 오류가 발생했습니다."] },
    };
  }

  const payload = {
    positive_ratio: positiveRatio,
    negative_ratio: negativeRatio,
    positive_bullets: positiveBullets,
    negative_bullets: negativeBullets,
  };

  const { error } = existing
    ? await supabase
        .from("review_summaries")
        .update(payload)
        .eq("id", existing.id)
    : await supabase
        .from("review_summaries")
        .insert({ product_id: productId, attribute, ...payload });

  if (error) {
    return {
      success: false as const,
      fieldErrors: {
        _form: ["저장 중 오류가 발생했습니다. 다시 시도해주세요."],
      },
    };
  }

  // 탭 전환 UI이므로 redirect하지 않고 같은 페이지에 머문다.
  // "/products/[productId]/reviews/[attribute]"까지 함께 무효화하기 위해
  // reviews 경로는 layout 타입으로 하위 동적 세그먼트 트리 전체를 재검증한다.
  revalidatePath(`/admin/products/${productId}/summaries`);
  revalidatePath(`/products/${productId}`);
  revalidatePath(`/products/${productId}/reviews`, "layout");
  return { success: true as const };
}

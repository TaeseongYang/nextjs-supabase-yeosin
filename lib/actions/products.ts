"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServiceClient } from "@/lib/supabase/service";
import { productSchema } from "@/lib/validations/product-schema";

// 시술 상품 등록/수정 폼(FormData)을 productSchema로 검증한다.
// boolean 필드는 폼에서 "true"/"false" 문자열로 전달되고, detailImageUrls는
// JSON 문자열로 직렬화되어 전달된다(참고: lib/actions/participant.ts의 FormData 패턴).
function parseProductFormData(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    hospitalId: formData.get("hospitalId"),
    originalPrice: Number(formData.get("originalPrice")),
    discountPrice: Number(formData.get("discountPrice")),
    includesVat: formData.get("includesVat") === "true",
    includesAnesthesia: formData.get("includesAnesthesia") === "true",
    includesAftercare: formData.get("includesAftercare") === "true",
    sideEffectNotice: formData.get("sideEffectNotice"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    detailImageUrls: JSON.parse(
      String(formData.get("detailImageUrls") ?? "[]"),
    ),
  });
}

// 관리자 CRUD는 인증 없이 서버 측(Server Action) 신뢰 컨텍스트에서 수행되는 것을 전제로 하므로
// (Task 008 RLS 정책 설계 참고) RLS를 우회하는 service_role 클라이언트로 INSERT/UPDATE/DELETE한다.
export async function createProduct(formData: FormData) {
  const result = parseProductFormData(formData);
  if (!result.success) {
    return {
      success: false as const,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("treatment_products").insert({
    name: result.data.name,
    category_id: result.data.categoryId,
    hospital_id: result.data.hospitalId,
    original_price: result.data.originalPrice,
    discount_price: result.data.discountPrice,
    includes_vat: result.data.includesVat,
    includes_anesthesia: result.data.includesAnesthesia,
    includes_aftercare: result.data.includesAftercare,
    side_effect_notice: result.data.sideEffectNotice,
    thumbnail_url: result.data.thumbnailUrl,
    detail_image_urls: result.data.detailImageUrls,
  });
  if (error) {
    return {
      success: false as const,
      fieldErrors: { _form: ["저장 중 오류가 발생했습니다."] },
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/categories/${result.data.categoryId}`);
  redirect("/admin");
}

export async function updateProduct(
  productId: string,
  previousCategoryId: string,
  formData: FormData,
) {
  const result = parseProductFormData(formData);
  if (!result.success) {
    return {
      success: false as const,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("treatment_products")
    .update({
      name: result.data.name,
      category_id: result.data.categoryId,
      hospital_id: result.data.hospitalId,
      original_price: result.data.originalPrice,
      discount_price: result.data.discountPrice,
      includes_vat: result.data.includesVat,
      includes_anesthesia: result.data.includesAnesthesia,
      includes_aftercare: result.data.includesAftercare,
      side_effect_notice: result.data.sideEffectNotice,
      thumbnail_url: result.data.thumbnailUrl,
      detail_image_urls: result.data.detailImageUrls,
    })
    .eq("id", productId);
  if (error) {
    return {
      success: false as const,
      fieldErrors: { _form: ["저장 중 오류가 발생했습니다."] },
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/products/${productId}`);
  revalidatePath(`/categories/${previousCategoryId}`);
  if (previousCategoryId !== result.data.categoryId) {
    revalidatePath(`/categories/${result.data.categoryId}`);
  }
  redirect("/admin");
}

// 상품 삭제 시 연결된 reviews/review_summaries는 애플리케이션 코드에서 따로 지우지 않는다.
// Task 008에서 treatment_products 삭제 시 on delete cascade로 자동 연쇄 삭제되도록
// DB 레벨에서 이미 보장되어 있다.
export async function deleteProduct(
  productId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("treatment_products")
    .delete()
    .eq("id", productId);
  if (error) {
    return { success: false, error: "삭제 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin");
  revalidatePath("/categories", "layout");
  return { success: true };
}

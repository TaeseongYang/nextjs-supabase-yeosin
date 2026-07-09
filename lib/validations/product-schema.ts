import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  hospitalId: z.string().min(1),
  originalPrice: z.number().nonnegative(),
  discountPrice: z.number().nonnegative(),
  includesVat: z.boolean(),
  includesAnesthesia: z.boolean(),
  includesAftercare: z.boolean(),
  sideEffectNotice: z.string(),
  // Supabase Storage 공개 URL(https://...) 형식이 기본이지만, 기존 시드 데이터가
  // "/placeholder-product-1.jpg" 같은 절대 경로 문자열을 그대로 쓰고 있어(Task 003) 수정
  // 폼에서 이미지를 교체하지 않고 저장하는 경우도 지원하기 위해 절대 경로 문자열도 허용한다.
  thumbnailUrl: z
    .string()
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("/") ||
        z.string().url().safeParse(value).success,
      {
        message: "올바른 이미지 URL이 아닙니다.",
      },
    ),
  detailImageUrls: z.array(
    z
      .string()
      .refine(
        (value) =>
          value.startsWith("/") || z.string().url().safeParse(value).success,
        {
          message: "올바른 이미지 URL이 아닙니다.",
        },
      ),
  ),
});

export type ProductFormInput = z.infer<typeof productSchema>;

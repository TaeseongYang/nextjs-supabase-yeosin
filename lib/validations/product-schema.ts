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
  thumbnailUrl: z.string().url().or(z.literal("")),
  detailImageUrls: z.array(z.string()),
});

export type ProductFormInput = z.infer<typeof productSchema>;

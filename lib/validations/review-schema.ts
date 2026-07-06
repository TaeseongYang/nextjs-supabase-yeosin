import { z } from "zod";
import { REVIEW_ATTRIBUTES } from "@/lib/types/attribute";

export const reviewSchema = z.object({
  productId: z.string().min(1),
  authorLabel: z.string().min(1),
  rating: z.number().min(1).max(5),
  content: z.string().min(1),
  attributeTags: z.array(z.enum(REVIEW_ATTRIBUTES)),
});

export type ReviewFormInput = z.infer<typeof reviewSchema>;

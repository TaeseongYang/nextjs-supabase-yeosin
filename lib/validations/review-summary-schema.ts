import { z } from "zod";
import { REVIEW_ATTRIBUTES } from "@/lib/types/attribute";

export const reviewSummarySchema = z.object({
  productId: z.string().min(1),
  attribute: z.enum(REVIEW_ATTRIBUTES).nullable(),
  bullets: z.array(z.string().min(1)),
});

export type ReviewSummaryFormInput = z.infer<typeof reviewSummarySchema>;

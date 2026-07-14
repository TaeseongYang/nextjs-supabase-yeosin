import { z } from "zod";
import { REVIEW_ATTRIBUTES, REVIEW_SENTIMENTS } from "@/lib/types/attribute";

const attributeTagSchema = z.object({
  attribute: z.enum(REVIEW_ATTRIBUTES),
  sentiment: z.enum(REVIEW_SENTIMENTS),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  authorLabel: z.string().min(1),
  rating: z.number().min(0).max(10),
  content: z.string().min(1),
  attributeTags: z.array(attributeTagSchema),
});

export type ReviewFormInput = z.infer<typeof reviewSchema>;

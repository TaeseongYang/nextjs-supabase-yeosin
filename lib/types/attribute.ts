export const REVIEW_ATTRIBUTES = [
  "medical_staff",
  "service",
  "price",
  "effect",
  "pain",
] as const;

export type ReviewAttributeType = (typeof REVIEW_ATTRIBUTES)[number];

export const ATTRIBUTE_LABELS: Record<ReviewAttributeType, string> = {
  medical_staff: "의료진",
  service: "이용서비스",
  price: "가격",
  effect: "시술효과",
  pain: "시술통증",
};

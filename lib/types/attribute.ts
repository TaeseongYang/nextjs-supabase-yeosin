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

export const REVIEW_SENTIMENTS = ["positive", "negative", "neutral"] as const;

export type ReviewSentimentType = (typeof REVIEW_SENTIMENTS)[number];

export const SENTIMENT_LABELS: Record<ReviewSentimentType, string> = {
  positive: "긍정",
  negative: "부정",
  neutral: "중립",
};

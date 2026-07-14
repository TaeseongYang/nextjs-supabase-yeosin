import type { ReviewAttributeType, ReviewSentimentType } from "./attribute";

export interface Category {
  id: string;
  name: string;
  iconKey: string;
  slug: string;
}

export interface Hospital {
  id: string;
  name: string;
  region: string;
}

export interface TreatmentProduct {
  id: string;
  categoryId: string;
  hospitalId: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  includesVat: boolean;
  includesAnesthesia: boolean;
  includesAftercare: boolean;
  sideEffectNotice: string;
  thumbnailUrl: string;
  detailImageUrls: string[];
}

export interface ReviewAttributeTag {
  attribute: ReviewAttributeType;
  sentiment: ReviewSentimentType;
}

export interface Review {
  id: string;
  productId: string;
  authorLabel: string;
  rating: number;
  content: string;
  createdAt: string;
  attributeTags: ReviewAttributeTag[];
}

export interface ReviewSummary {
  id: string;
  productId: string;
  attribute: ReviewAttributeType | null;
  positiveBullets: string[];
  negativeBullets: string[];
}

// review_attribute_sentiment_ratios/review_overall_sentiment_ratios 뷰에서 조회한
// 긍정/부정 집계 결과. positive+negative 태그가 0건이면 ratio는 null(집계 불가).
export interface ReviewSentimentRatio {
  attribute: ReviewAttributeType | null;
  positiveCount: number;
  negativeCount: number;
  ratedCount: number;
  positiveRatio: number | null;
  negativeRatio: number | null;
}

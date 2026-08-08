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
  bullets: string[];
}

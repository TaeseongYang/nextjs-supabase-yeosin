import type { ReviewAttributeType } from "./attribute";

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

export interface Review {
  id: string;
  productId: string;
  authorLabel: string;
  rating: number;
  content: string;
  createdAt: string;
  attributeTags: ReviewAttributeType[];
}

export interface ReviewSummary {
  id: string;
  productId: string;
  attribute: ReviewAttributeType | null;
  positiveRatio: number;
  negativeRatio: number;
  positiveBullets: string[];
  negativeBullets: string[];
}

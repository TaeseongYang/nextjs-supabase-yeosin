import type { ReviewAttributeType, ReviewSentimentType } from "./attribute";

export interface AdminProfile {
  id: string;
  email: string;
  role: "admin";
}

export interface ProductFormViewModel {
  name: string;
  categoryId: string;
  hospitalName: string;
  hospitalRegion: string;
  originalPrice: number;
  discountPrice: number;
  includesVat: boolean;
  includesAnesthesia: boolean;
  includesAftercare: boolean;
  sideEffectNotice: string;
  thumbnailUrl: string;
  detailImageUrls: string[];
}

export interface ReviewSummaryFormViewModel {
  productId: string;
  attribute: ReviewAttributeType | null;
  positiveBullets: string[];
  negativeBullets: string[];
}

export interface ReviewFormViewModel {
  productId: string;
  authorLabel: string;
  rating: number;
  content: string;
  attributeTags: {
    attribute: ReviewAttributeType;
    sentiment: ReviewSentimentType;
  }[];
}

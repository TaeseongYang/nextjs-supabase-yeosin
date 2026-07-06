import type { ReviewAttributeType } from "./attribute";

export interface AdminProfile {
  id: string;
  email: string;
  role: "admin";
}

export interface ProductFormViewModel {
  name: string;
  categoryId: string;
  hospitalId: string;
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
  positiveRatio: number;
  negativeRatio: number;
  positiveBullets: string[];
  negativeBullets: string[];
}

export interface ReviewFormViewModel {
  productId: string;
  authorLabel: string;
  rating: number;
  content: string;
  attributeTags: ReviewAttributeType[];
}

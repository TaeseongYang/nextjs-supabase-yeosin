import type { ReviewAttributeType } from "./attribute";

export interface ProductCardViewModel {
  id: string;
  name: string;
  hospitalName: string;
  region: string;
  thumbnailUrl: string;
  reviewCount: number;
  averageRating: number;
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
}

export interface DonutChartDatum {
  label: string;
  value: number;
  colorToken: "positive" | "negative";
}

export interface ReviewSummaryViewModel {
  attribute: ReviewAttributeType | null;
  attributeLabel: string;
  donutData: DonutChartDatum[];
  positiveBullets: string[];
  negativeBullets: string[];
}

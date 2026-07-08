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

// age는 입력 중 빈 문자열을 허용해야 하므로 string으로 관리하고 제출 시 Number()로 변환한다.
// gender/hasOnlineExperience는 미선택 초기 상태를 표현하기 위해 빈 문자열("")을 허용한다.
export interface ParticipantFormViewModel {
  gender: "female" | "male" | "";
  age: string;
  hasOnlineExperience: "yes" | "no" | "";
}

import type { ReviewSummary } from "@/lib/types/domain";
import { REVIEW_ATTRIBUTES } from "@/lib/types/attribute";

/**
 * 상품별 리뷰 요약 더미 데이터.
 * attribute가 null이면 전체 요약, ReviewAttributeType 값이면 해당 속성별 요약이다.
 * prod-1, prod-2, prod-3 세 상품은 전체 요약 + 5개 속성별 요약을 모두 갖춘 세트로 구성해
 * 도넛 차트/속성 필터 UI 검증에 충분한 데이터를 제공한다.
 * 나머지 상품(prod-4 이후)은 리뷰만 있고 요약이 없는 케이스로 남겨 '요약 없음' 빈 상태를 검증한다.
 * positiveRatio + negativeRatio는 100을 넘지 않도록 작성한다.
 */
export const dummyReviewSummaries: ReviewSummary[] = [
  // prod-1: 수분 물광 리프팅 시술
  {
    id: "sum-prod-1-all",
    productId: "prod-1",
    attribute: null,
    positiveRatio: 82,
    negativeRatio: 18,
    positiveBullets: [
      "피부 톤이 밝아지고 촉촉해졌다는 후기가 많아요",
      "시술 후 통증이 거의 없다는 평가가 많습니다",
    ],
    negativeBullets: ["가격이 다소 부담스럽다는 의견이 있어요"],
  },
  {
    id: "sum-prod-1-medical_staff",
    productId: "prod-1",
    attribute: "medical_staff",
    positiveRatio: 88,
    negativeRatio: 12,
    positiveBullets: ["상담부터 시술까지 친절하고 꼼꼼했다는 후기가 많아요"],
    negativeBullets: ["담당의가 자주 바뀐다는 의견이 일부 있어요"],
  },
  {
    id: "sum-prod-1-service",
    productId: "prod-1",
    attribute: "service",
    positiveRatio: 75,
    negativeRatio: 25,
    positiveBullets: ["예약과 안내 시스템이 편리했다는 후기가 많아요"],
    negativeBullets: ["대기 시간이 길었다는 의견이 있어요"],
  },
  {
    id: "sum-prod-1-price",
    productId: "prod-1",
    attribute: "price",
    positiveRatio: 60,
    negativeRatio: 40,
    positiveBullets: ["이벤트 할인가가 합리적이라는 후기가 있어요"],
    negativeBullets: ["정가 기준으로는 비싸다는 의견이 많아요"],
  },
  {
    id: "sum-prod-1-effect",
    productId: "prod-1",
    attribute: "effect",
    positiveRatio: 90,
    negativeRatio: 10,
    positiveBullets: ["피부 결과 톤 개선 효과가 뚜렷하다는 후기가 많아요"],
    negativeBullets: ["효과 유지 기간이 짧다는 의견이 일부 있어요"],
  },
  {
    id: "sum-prod-1-pain",
    productId: "prod-1",
    attribute: "pain",
    positiveRatio: 85,
    negativeRatio: 15,
    positiveBullets: ["통증이 거의 없어 편하게 시술받았다는 후기가 많아요"],
    negativeBullets: ["부위에 따라 따끔거림이 있었다는 의견이 있어요"],
  },

  // prod-2: 듀얼 토닝 피부 재생 레이저
  {
    id: "sum-prod-2-all",
    productId: "prod-2",
    attribute: null,
    positiveRatio: 78,
    negativeRatio: 22,
    positiveBullets: ["재생 효과가 빠르고 자연스럽다는 후기가 많아요"],
    negativeBullets: ["시술 후 홍조가 며칠 지속된다는 의견이 있어요"],
  },
  {
    id: "sum-prod-2-medical_staff",
    productId: "prod-2",
    attribute: "medical_staff",
    positiveRatio: 80,
    negativeRatio: 20,
    positiveBullets: ["피부 상태를 꼼꼼히 진단해준다는 후기가 많아요"],
    negativeBullets: ["설명이 다소 빠르게 진행됐다는 의견이 있어요"],
  },
  {
    id: "sum-prod-2-service",
    productId: "prod-2",
    attribute: "service",
    positiveRatio: 70,
    negativeRatio: 30,
    positiveBullets: ["사후 관리 안내가 자세했다는 후기가 있어요"],
    negativeBullets: ["재방문 예약이 번거로웠다는 의견이 있어요"],
  },
  {
    id: "sum-prod-2-price",
    productId: "prod-2",
    attribute: "price",
    positiveRatio: 65,
    negativeRatio: 35,
    positiveBullets: ["패키지 할인이 합리적이라는 후기가 있어요"],
    negativeBullets: [
      "여러 번 받아야 효과가 커서 총비용이 부담된다는 의견이 있어요",
    ],
  },
  {
    id: "sum-prod-2-effect",
    productId: "prod-2",
    attribute: "effect",
    positiveRatio: 85,
    negativeRatio: 15,
    positiveBullets: ["잡티와 톤 개선 효과가 뛰어나다는 후기가 많아요"],
    negativeBullets: ["즉각적인 변화는 크지 않다는 의견이 있어요"],
  },
  {
    id: "sum-prod-2-pain",
    productId: "prod-2",
    attribute: "pain",
    positiveRatio: 80,
    negativeRatio: 20,
    positiveBullets: ["따끔거림이 적어 참을만 하다는 후기가 많아요"],
    negativeBullets: ["예민한 부위는 통증이 있었다는 의견이 있어요"],
  },

  // prod-3: 자연유착 쌍꺼풀 수술
  {
    id: "sum-prod-3-all",
    productId: "prod-3",
    attribute: null,
    positiveRatio: 88,
    negativeRatio: 12,
    positiveBullets: [
      "자연스러운 라인과 회복 속도에 만족한다는 후기가 많아요",
      "상담이 꼼꼼했다는 평가가 많습니다",
    ],
    negativeBullets: ["붓기 빠지는 기간이 예상보다 길었다는 의견이 있어요"],
  },
  {
    id: "sum-prod-3-medical_staff",
    productId: "prod-3",
    attribute: "medical_staff",
    positiveRatio: 92,
    negativeRatio: 8,
    positiveBullets: ["원장님의 디자인 감각이 좋다는 후기가 많아요"],
    negativeBullets: ["상담 시간이 짧게 느껴졌다는 의견이 일부 있어요"],
  },
  {
    id: "sum-prod-3-service",
    productId: "prod-3",
    attribute: "service",
    positiveRatio: 84,
    negativeRatio: 16,
    positiveBullets: ["실장님 응대가 친절했다는 후기가 많아요"],
    negativeBullets: ["수술 당일 대기 시간이 길었다는 의견이 있어요"],
  },
  {
    id: "sum-prod-3-price",
    productId: "prod-3",
    attribute: "price",
    positiveRatio: 70,
    negativeRatio: 30,
    positiveBullets: ["비용 대비 결과가 만족스럽다는 후기가 있어요"],
    negativeBullets: ["추가 비용이 발생했다는 의견이 일부 있어요"],
  },
  {
    id: "sum-prod-3-effect",
    productId: "prod-3",
    attribute: "effect",
    positiveRatio: 90,
    negativeRatio: 10,
    positiveBullets: ["자연스러운 눈매 라인에 만족한다는 후기가 많아요"],
    negativeBullets: ["좌우 비대칭이 남아있다는 의견이 드물게 있어요"],
  },
  {
    id: "sum-prod-3-pain",
    productId: "prod-3",
    attribute: "pain",
    positiveRatio: 75,
    negativeRatio: 25,
    positiveBullets: ["생각보다 통증이 적었다는 후기가 많아요"],
    negativeBullets: ["붓기로 인한 불편함이 며칠 있었다는 의견이 있어요"],
  },
];

// attribute가 null이 아닌 경우 REVIEW_ATTRIBUTES에 정의된 값만 사용했는지,
// positiveRatio + negativeRatio가 100을 넘지 않는지 개발 시점에 검증한다.
const validAttributeSet = new Set<string>(REVIEW_ATTRIBUTES);
dummyReviewSummaries.forEach((summary) => {
  if (summary.attribute !== null && !validAttributeSet.has(summary.attribute)) {
    throw new Error(`잘못된 리뷰 요약 속성입니다: ${summary.attribute}`);
  }
  if (summary.positiveRatio + summary.negativeRatio > 100) {
    throw new Error(`리뷰 요약 비율 합이 100을 초과합니다: ${summary.id}`);
  }
});

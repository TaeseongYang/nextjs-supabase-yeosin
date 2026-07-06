import type { Review } from "@/lib/types/domain";
import { REVIEW_ATTRIBUTES } from "@/lib/types/attribute";

/**
 * 상품 상세/리뷰 종합 페이지에서 사용되는 개별 리뷰 더미 데이터.
 * productId는 products.ts에 정의된 id와 참조 무결성을 유지한다.
 * attributeTags 값은 REVIEW_ATTRIBUTES 상수(lib/types/attribute.ts)의 키만 사용한다.
 */
export const dummyReviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    authorLabel: "김**",
    rating: 5,
    content:
      "피부가 확실히 촉촉해지고 톤이 밝아진 느낌이에요. 상담부터 시술까지 친절하게 안내해주셨습니다.",
    createdAt: "2026-06-01",
    attributeTags: ["medical_staff", "effect"],
  },
  {
    id: "rev-2",
    productId: "prod-1",
    authorLabel: "이**",
    rating: 4,
    content:
      "효과는 좋았는데 대기 시간이 조금 길었어요. 그래도 결과물엔 만족합니다.",
    createdAt: "2026-06-05",
    attributeTags: ["service", "effect"],
  },
  {
    id: "rev-3",
    productId: "prod-1",
    authorLabel: "박**",
    rating: 3,
    content: "가격 대비 효과가 아주 크진 않았지만 통증은 거의 없었어요.",
    createdAt: "2026-06-10",
    attributeTags: ["price", "pain"],
  },
  {
    id: "rev-4",
    productId: "prod-2",
    authorLabel: "최**",
    rating: 5,
    content:
      "레이저 시술인데도 생각보다 아프지 않았고 피부 재생 효과가 뛰어났어요.",
    createdAt: "2026-06-03",
    attributeTags: ["effect", "pain"],
  },
  {
    id: "rev-5",
    productId: "prod-2",
    authorLabel: "정**",
    rating: 4,
    content:
      "의료진이 꼼꼼하게 피부 상태를 확인하고 시술해주셔서 신뢰가 갔습니다.",
    createdAt: "2026-06-08",
    attributeTags: ["medical_staff"],
  },
  {
    id: "rev-6",
    productId: "prod-3",
    authorLabel: "한**",
    rating: 5,
    content:
      "자연스러운 쌍꺼풀 라인이 마음에 들어요. 붓기도 예상보다 빨리 빠졌습니다.",
    createdAt: "2026-05-20",
    attributeTags: ["effect", "pain"],
  },
  {
    id: "rev-7",
    productId: "prod-3",
    authorLabel: "윤**",
    rating: 4,
    content: "상담 실장님이 친절하셨고 수술 과정도 자세히 설명해주셨어요.",
    createdAt: "2026-05-25",
    attributeTags: ["service", "medical_staff"],
  },
  {
    id: "rev-8",
    productId: "prod-4",
    authorLabel: "장**",
    rating: 3,
    content: "회복 기간이 생각보다 길었지만 결과는 만족스럽습니다.",
    createdAt: "2026-05-28",
    attributeTags: ["effect", "pain"],
  },
  {
    id: "rev-9",
    productId: "prod-5",
    authorLabel: "임**",
    rating: 5,
    content: "코 라인이 자연스럽고 원장님이 꼼꼼하게 디자인해주셨어요.",
    createdAt: "2026-06-12",
    attributeTags: ["medical_staff", "effect"],
  },
  {
    id: "rev-10",
    productId: "prod-6",
    authorLabel: "오**",
    rating: 4,
    content: "턱선이 갸름해지는 효과가 있었고 시술 시간도 짧았어요.",
    createdAt: "2026-06-15",
    attributeTags: ["effect"],
  },
  {
    id: "rev-11",
    productId: "prod-7",
    authorLabel: "강**",
    rating: 5,
    content: "수술 전 상담이 매우 자세했고 사후관리 시스템도 체계적이었습니다.",
    createdAt: "2026-05-10",
    attributeTags: ["service", "medical_staff"],
  },
  {
    id: "rev-12",
    productId: "prod-8",
    authorLabel: "조**",
    rating: 4,
    content:
      "지방흡입 후 라인이 확실히 매끈해졌어요. 다만 가격이 부담스러웠습니다.",
    createdAt: "2026-05-15",
    attributeTags: ["effect", "price"],
  },
  {
    id: "rev-13",
    productId: "prod-9",
    authorLabel: "신**",
    rating: 4,
    content: "이마 주름이 확실히 펴졌고 시술 시간도 짧아서 부담 없었어요.",
    createdAt: "2026-06-18",
    attributeTags: ["effect", "pain"],
  },
  {
    id: "rev-14",
    productId: "prod-10",
    authorLabel: "권**",
    rating: 3,
    content: "볼륨감은 좋아졌는데 멍이 며칠 지속돼서 조금 불편했어요.",
    createdAt: "2026-06-20",
    attributeTags: ["effect", "pain"],
  },
  {
    id: "rev-15",
    productId: "prod-11",
    authorLabel: "황**",
    rating: 5,
    content: "탄력이 눈에 띄게 좋아졌고 가격도 합리적이었습니다.",
    createdAt: "2026-06-22",
    attributeTags: ["effect", "price"],
  },
  {
    id: "rev-16",
    productId: "prod-12",
    authorLabel: "안**",
    rating: 4,
    content: "제모 효과가 확실하고 직원분들이 친절하게 응대해주셨어요.",
    createdAt: "2026-06-25",
    attributeTags: ["service", "effect"],
  },
];

// attributeTags에 REVIEW_ATTRIBUTES에 정의되지 않은 값이 섞여 있지 않은지 개발 시점에 검증한다.
// (타입 레벨에서도 걸러지지만, 더미 데이터 무결성을 명시적으로 한 번 더 보증한다.)
const validAttributeSet = new Set<string>(REVIEW_ATTRIBUTES);
dummyReviews.forEach((review) => {
  review.attributeTags.forEach((tag) => {
    if (!validAttributeSet.has(tag)) {
      throw new Error(`잘못된 리뷰 속성 태그입니다: ${tag}`);
    }
  });
});

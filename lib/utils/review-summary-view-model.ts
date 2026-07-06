import type { ReviewSummary } from "@/lib/types/domain";
import type { ReviewSummaryViewModel } from "@/lib/types/view-models";
import { ATTRIBUTE_LABELS } from "@/lib/types/attribute";

/**
 * 리뷰 요약(ReviewSummary) 더미 데이터를 화면에서 바로 사용할 수 있는
 * ReviewSummaryViewModel로 변환한다.
 * attribute가 null이면 전체 요약을 의미하므로 attributeLabel을 '전체'로 고정하고,
 * 그 외에는 ATTRIBUTE_LABELS에서 라벨을 조회한다.
 *
 * 요약이 존재하지 않는 경우(find 결과 undefined) 처리는 이 함수의 책임이 아니라
 * 호출 측(페이지)의 책임이다 — 이 함수는 항상 유효한 ReviewSummary가 있을 때만 호출된다.
 *
 * Task 010(Supabase 실연동)에서 이 함수는 더미 데이터 전용 임시 어댑터로
 * 대체될 예정이므로 과도한 범용화(캐싱 등)는 하지 않는다.
 */
export function buildReviewSummaryViewModel(
  summary: ReviewSummary,
): ReviewSummaryViewModel {
  return {
    attribute: summary.attribute,
    attributeLabel:
      summary.attribute === null ? "전체" : ATTRIBUTE_LABELS[summary.attribute],
    donutData: [
      { label: "긍정", value: summary.positiveRatio, colorToken: "positive" },
      { label: "부정", value: summary.negativeRatio, colorToken: "negative" },
    ],
    positiveBullets: summary.positiveBullets,
    negativeBullets: summary.negativeBullets,
  };
}

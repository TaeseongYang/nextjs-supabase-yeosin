import type { ReviewSummary, ReviewSentimentRatio } from "@/lib/types/domain";
import type { ReviewSummaryViewModel } from "@/lib/types/view-models";
import { ATTRIBUTE_LABELS } from "@/lib/types/attribute";

/**
 * 리뷰 요약(bullets, 관리자 수동 입력)과 감성 비율(review_attribute_tags 자동 집계)을
 * 조합해 화면에서 바로 사용할 수 있는 ReviewSummaryViewModel로 변환한다.
 * attribute가 null이면 전체 요약을 의미하므로 attributeLabel을 '전체'로 고정하고,
 * 그 외에는 ATTRIBUTE_LABELS에서 라벨을 조회한다.
 * ratio가 null이면(긍정/부정으로 평가된 태그가 아직 없음) 도넛 차트는 0%로 표시한다.
 *
 * 요약이 존재하지 않는 경우(find 결과 undefined) 처리는 이 함수의 책임이 아니라
 * 호출 측(페이지)의 책임이다 — 이 함수는 항상 유효한 ReviewSummary가 있을 때만 호출된다.
 */
export function buildReviewSummaryViewModel(
  summary: ReviewSummary,
  ratio: ReviewSentimentRatio | null,
): ReviewSummaryViewModel {
  return {
    attribute: summary.attribute,
    attributeLabel:
      summary.attribute === null ? "전체" : ATTRIBUTE_LABELS[summary.attribute],
    donutData: [
      {
        label: "긍정",
        value: ratio?.positiveRatio ?? 0,
        colorToken: "positive",
      },
      {
        label: "부정",
        value: ratio?.negativeRatio ?? 0,
        colorToken: "negative",
      },
    ],
    positiveBullets: summary.positiveBullets,
    negativeBullets: summary.negativeBullets,
  };
}

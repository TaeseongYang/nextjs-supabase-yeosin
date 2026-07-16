import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, Star } from "lucide-react";

import { ReviewOverallSummaryCard } from "@/components/review/overall-summary-card";
import { ReviewCard } from "@/components/review/review-card";
import { ConsultButton } from "@/components/layout/consult-button";
import { Card, CardContent } from "@/components/ui/card";
import { buildReviewSummaryViewModel } from "@/lib/utils/review-summary-view-model";
import { getExperimentGroup } from "@/lib/utils/experiment-group";
import { getProductById } from "@/lib/queries/products";
import { getReviewsByProduct } from "@/lib/queries/reviews";
import {
  getOverallReviewSummary,
  getOverallSentimentRatio,
} from "@/lib/queries/review-summaries";

interface ProductReviewsPageProps {
  params: Promise<{ productId: string }>;
}

async function ProductReviews({ params }: ProductReviewsPageProps) {
  const { productId } = await params;
  const result = await getProductById(productId);
  if (!result) notFound();

  const group = await getExperimentGroup();

  const productReviews = await getReviewsByProduct(productId);
  const reviewCount = productReviews.length;
  const averageRating =
    reviewCount === 0
      ? 0
      : productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

  // 실험 환경 B(목록형)는 요약을 보여주지 않으므로 요약 조회 자체를 건너뛴다.
  // 전체 요약(attribute === null)만 조회한다. 요약이 없는 상품도 존재한다.
  // bullets(수동 입력)와 ratio(태그 감성 자동 집계)를 병렬로 조회해 함께 조합한다.
  const [overallSummary, overallRatio] =
    group === "a"
      ? await Promise.all([
          getOverallReviewSummary(productId),
          getOverallSentimentRatio(productId),
        ])
      : [null, null];
  const overallViewModel = overallSummary
    ? buildReviewSummaryViewModel(overallSummary, overallRatio)
    : null;

  return (
    <div className="pb-20">
      {/* 상단 헤더 바: 뒤로가기 버튼은 좌측 고정, 제목은 헤더 바 전체 너비 기준 중앙 정렬 */}
      <div className="relative flex items-center border-b p-4">
        <Link
          href={`/products/${productId}`}
          aria-label="상품 상세로 돌아가기"
          className="flex size-9 items-center justify-center rounded-full border bg-background text-foreground"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold">
          리뷰
        </h1>
      </div>

      {/* 평점 요약 박스: 별 아이콘 + 평균 평점 숫자 + 설명 텍스트 */}
      <div className="p-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Star className="size-8 fill-primary text-primary" />
            <span className="text-2xl font-bold">
              {averageRating.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">
              총 {reviewCount}개의 후기 평점이에요
            </span>
          </CardContent>
        </Card>
      </div>

      {/* 실험 환경 A(요약형)에서만 AI 요약 카드를 보여준다. B(목록형)는 아래 개별 리뷰 목록만 노출한다. */}
      {group === "a" && (
        <ReviewOverallSummaryCard
          productId={productId}
          viewModel={overallViewModel}
        />
      )}

      <div className="flex flex-col gap-2 px-4 pt-5">
        {productReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      <ConsultButton />
    </div>
  );
}

export default function ProductReviewsPage(props: ProductReviewsPageProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ProductReviews {...props} />
    </Suspense>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, Star, ThumbsDown, ThumbsUp } from "lucide-react";

import { AttributeTag } from "@/components/product/attribute-tag";
import { ReviewCard } from "@/components/review/review-card";
import { ConsultButton } from "@/components/layout/consult-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildReviewSummaryViewModel } from "@/lib/utils/review-summary-view-model";
import {
  dummyProducts,
  dummyReviews,
  dummyReviewSummaries,
} from "@/lib/dummy-data";
import { REVIEW_ATTRIBUTES } from "@/lib/types/attribute";

interface ProductReviewsPageProps {
  params: Promise<{ productId: string }>;
}

async function ProductReviews({ params }: ProductReviewsPageProps) {
  const { productId } = await params;
  const product = dummyProducts.find((p) => p.id === productId);
  if (!product) notFound();

  const productReviews = dummyReviews.filter((r) => r.productId === productId);
  const reviewCount = productReviews.length;
  const averageRating =
    reviewCount === 0
      ? 0
      : productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

  // 전체 요약(attribute === null)만 조회한다. prod-4 이후 상품은 요약 자체가 없을 수 있다.
  const overallSummary = dummyReviewSummaries.find(
    (s) => s.productId === productId && s.attribute === null,
  );
  const overallViewModel = overallSummary
    ? buildReviewSummaryViewModel(overallSummary)
    : null;

  // 참고 디자인처럼 긍정/부정 bullet 배열을 하나의 문단으로 이어붙인다.
  const positiveParagraph = overallViewModel?.positiveBullets.join(" ") ?? "";
  const negativeParagraph = overallViewModel?.negativeBullets.join(" ") ?? "";

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
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              총 {reviewCount}개의 후기 평점이에요
            </span>
          </CardContent>
        </Card>
      </div>

      {/* AI 요약 카드: 요약 문단 + 키워드 안내 문구 + 키워드 태그 목록을 하나의 카드로 통합 */}
      <div className="px-4">
        {overallViewModel ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">AI가 요약한 후기</span>
                <Badge variant="secondary" className="text-[10px]">
                  Beta
                </Badge>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                  <ThumbsUp className="size-4" />
                  긍정
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {positiveParagraph}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                  <ThumbsDown className="size-4" />
                  부정
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {negativeParagraph}
                </p>
              </div>
              <div className="pt-1">
                <p className="text-sm font-medium">
                  어떤 키워드에 관심이 있으신가요?
                </p>
                <p className="text-xs text-muted-foreground">
                  선택한 키워드의 요약 결과를 보여드려요
                </p>
                <div className="flex gap-3 overflow-x-auto pt-3">
                  {REVIEW_ATTRIBUTES.map((attr) => (
                    <Link
                      key={attr}
                      href={`/products/${productId}/reviews/${attr}`}
                    >
                      <AttributeTag attribute={attr} />
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col gap-4 p-4">
              <p className="text-sm text-muted-foreground">
                아직 등록된 리뷰 요약이 없습니다.
              </p>
              <div className="pt-1">
                <p className="text-sm font-medium">
                  어떤 키워드에 관심이 있으신가요?
                </p>
                <p className="text-xs text-muted-foreground">
                  선택한 키워드의 요약 결과를 보여드려요
                </p>
                <div className="flex gap-3 overflow-x-auto pt-3">
                  {REVIEW_ATTRIBUTES.map((attr) => (
                    <Link
                      key={attr}
                      href={`/products/${productId}/reviews/${attr}`}
                    >
                      <AttributeTag attribute={attr} />
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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

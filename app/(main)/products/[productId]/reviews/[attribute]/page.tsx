import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";

import { AttributeTag } from "@/components/product/attribute-tag";
import { DonutChart } from "@/components/charts/donut-chart";
import { ReviewCard } from "@/components/review/review-card";
import { ConsultButton } from "@/components/layout/consult-button";
import { Card, CardContent } from "@/components/ui/card";
import { buildReviewSummaryViewModel } from "@/lib/utils/review-summary-view-model";
import {
  dummyProducts,
  dummyReviews,
  dummyReviewSummaries,
} from "@/lib/dummy-data";
import {
  REVIEW_ATTRIBUTES,
  ATTRIBUTE_LABELS,
  type ReviewAttributeType,
} from "@/lib/types/attribute";

interface ProductReviewsByAttributePageProps {
  params: Promise<{ productId: string; attribute: string }>;
}

// 라우트 파라미터(string)를 ReviewAttributeType으로 좁히는 타입 가드.
// any 캐스팅이나 무분별한 as 단언 없이, REVIEW_ATTRIBUTES 포함 여부 확인 후에만 타입을 좁힌다.
function isReviewAttributeType(value: string): value is ReviewAttributeType {
  return (REVIEW_ATTRIBUTES as readonly string[]).includes(value);
}

async function ProductReviewsByAttribute({
  params,
}: ProductReviewsByAttributePageProps) {
  const { productId, attribute } = await params;
  if (!isReviewAttributeType(attribute)) notFound();

  const product = dummyProducts.find((p) => p.id === productId);
  if (!product) notFound();

  const summary = dummyReviewSummaries.find(
    (s) => s.productId === productId && s.attribute === attribute,
  );
  const viewModel = summary ? buildReviewSummaryViewModel(summary) : null;
  const filteredReviews = dummyReviews.filter(
    (r) => r.productId === productId && r.attributeTags.includes(attribute),
  );

  return (
    <div className="pb-20">
      {/* 상단 헤더 바: 파일 1(리뷰 종합 뷰)과 동일한 구조를 재사용.
          뒤로가기 버튼은 좌측 고정, 제목(선택된 속성명)은 헤더 바 전체 너비 기준 중앙 정렬 */}
      <div className="relative flex items-center border-b p-4">
        <Link
          href={`/products/${productId}/reviews`}
          aria-label="리뷰 종합 뷰로 돌아가기"
          className="flex size-9 items-center justify-center rounded-full border bg-background text-foreground"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold">
          {ATTRIBUTE_LABELS[attribute]}
        </h1>
      </div>

      {/* 속성별 요약 카드: 도넛 차트(비율 포함) + bullet 목록 + 키워드 태그 목록을
          파일 1의 AI 요약 카드와 동일한 카드 톤(그림자, 패딩, 여백)으로 통합 */}
      <div className="p-4">
        {viewModel ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">AI가 요약한 후기</span>
              </div>
              <DonutChart data={viewModel.donutData} />
              <ul className="list-disc pl-5 text-sm leading-relaxed text-foreground">
                {viewModel.positiveBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
                {viewModel.negativeBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
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
                      <AttributeTag
                        attribute={attr}
                        active={attr === attribute}
                      />
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
                      <AttributeTag
                        attribute={attr}
                        active={attr === attribute}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-2 px-4 pt-5">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            이 속성에 매핑된 리뷰가 없습니다.
          </p>
        )}
      </div>
      <ConsultButton />
    </div>
  );
}

export default function ProductReviewsByAttributePage(
  props: ProductReviewsByAttributePageProps,
) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ProductReviewsByAttribute {...props} />
    </Suspense>
  );
}

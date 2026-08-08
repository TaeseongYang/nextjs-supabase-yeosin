import Link from "next/link";

import { AttributeTag } from "@/components/product/attribute-tag";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { REVIEW_ATTRIBUTES } from "@/lib/types/attribute";
import type { ReviewSummaryViewModel } from "@/lib/types/view-models";

interface ReviewOverallSummaryCardProps {
  productId: string;
  viewModel: ReviewSummaryViewModel | null;
  // 속성별 요약 페이지로 이동하는 키워드 태그 섹션을 노출할지 여부.
  // A(요약형)는 true(속성별 탐색 가능), C(총평형)는 false(총평만 제공, 속성별 진입 차단).
  showAttributeLinks: boolean;
}

// 실험 환경 A(요약형)와 C(총평형) 공통: AI 전체 요약 문단을 카드로 보여준다.
// 속성별(선택) 요약 진입용 키워드 태그는 showAttributeLinks가 true일 때만 함께 노출된다.
// C는 showAttributeLinks=false로 전달되어 키워드 태그가 숨겨지고 총평만 보여준다.
// app/(main)/(with-nav)/products/[productId]/reviews/page.tsx에서 그룹이 A 또는 C일 때 렌더링된다.
export function ReviewOverallSummaryCard({
  productId,
  viewModel,
  showAttributeLinks,
}: ReviewOverallSummaryCardProps) {
  const summaryParagraph = viewModel?.bullets.join(" ") ?? "";

  return (
    <div className="px-4">
      {viewModel ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">AI가 요약한 후기</span>
              <Badge variant="secondary" className="text-[10px]">
                Beta
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {summaryParagraph}
            </p>
            {showAttributeLinks && (
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
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col gap-4 p-4">
            <p className="text-sm text-muted-foreground">
              아직 등록된 리뷰 요약이 없습니다.
            </p>
            {showAttributeLinks && (
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

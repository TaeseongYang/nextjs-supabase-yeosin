import Link from "next/link";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { AttributeTag } from "@/components/product/attribute-tag";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { REVIEW_ATTRIBUTES } from "@/lib/types/attribute";
import type { ReviewSummaryViewModel } from "@/lib/types/view-models";

interface ReviewOverallSummaryCardProps {
  productId: string;
  viewModel: ReviewSummaryViewModel | null;
}

// 실험 환경 A(요약형) 전용: AI 전체 요약 문단 + 속성별(선택) 요약 진입용 키워드 태그를
// 하나의 카드로 통합해 보여준다. app/(main)/(with-nav)/products/[productId]/reviews/page.tsx에서
// 그룹이 A일 때만 렌더링된다.
export function ReviewOverallSummaryCard({
  productId,
  viewModel,
}: ReviewOverallSummaryCardProps) {
  const positiveParagraph = viewModel?.positiveBullets.join(" ") ?? "";
  const negativeParagraph = viewModel?.negativeBullets.join(" ") ?? "";

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
  );
}

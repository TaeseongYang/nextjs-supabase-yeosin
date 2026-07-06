import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/product/rating-stars";
import type { Review } from "@/lib/types/domain";

interface ReviewCardProps {
  review: Review;
}

/**
 * 개별 리뷰 카드(F007).
 * 작성자 식별, 평점, 작성일, 신고 버튼(비활성 표시), 본문을 표시한다.
 * 신고 버튼은 disabled로만 표시하며 실제 신고 기능(onClick 등)은 구현하지 않는다.
 */
export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{review.authorLabel}</span>
            <RatingStars rating={review.rating} size={14} />
          </div>
          <Button variant="ghost" size="sm" disabled>
            신고
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">
          {review.createdAt}
        </span>
        <p className="text-sm text-foreground">{review.content}</p>
      </CardContent>
    </Card>
  );
}

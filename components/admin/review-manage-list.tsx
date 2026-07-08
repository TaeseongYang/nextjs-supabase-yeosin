"use client";

import { useState } from "react";

import { ReviewForm } from "@/components/admin/review-form";
import { AttributeTag } from "@/components/product/attribute-tag";
import { RatingStars } from "@/components/product/rating-stars";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/lib/types/domain";

interface ReviewManageListProps {
  productId: string;
  initialReviews: Review[];
}

// 상품별 개별 리뷰 관리 목록. 수정/삭제/신규 추가 모두 로컬 state 조작으로만
// 처리하며, 실제 영속화는 Task 015(Server Action)에서 구현될 예정이다.
export function ReviewManageList({
  productId,
  initialReviews,
}: ReviewManageListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdate = (review: Review) => {
    setReviews((prev) => prev.map((r) => (r.id === review.id ? review : r)));
    setEditingId(null);
  };

  const handleAdd = (review: Review) => {
    setReviews((prev) => [...prev, review]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            등록된 리뷰가 없습니다.
          </p>
        ) : (
          reviews.map((review) =>
            editingId === review.id ? (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <ReviewForm
                    productId={productId}
                    initialReview={review}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingId(null)}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card key={review.id}>
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {review.authorLabel}
                      </span>
                      <RatingStars rating={review.rating} size={14} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(review.id)}
                      >
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {review.createdAt}
                  </span>
                  <p className="text-sm text-foreground">{review.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {review.attributeTags.map((attribute) => (
                      <AttributeTag key={attribute} attribute={attribute} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ),
          )
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <h2 className="mb-4 text-sm font-semibold">신규 리뷰 추가</h2>
          <ReviewForm productId={productId} onSubmit={handleAdd} />
        </CardContent>
      </Card>
    </div>
  );
}

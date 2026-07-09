"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { ReviewForm } from "@/components/admin/review-form";
import { AttributeTag } from "@/components/product/attribute-tag";
import { RatingStars } from "@/components/product/rating-stars";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteReview } from "@/lib/actions/reviews";
import type { Review } from "@/lib/types/domain";

interface ReviewManageListProps {
  productId: string;
  initialReviews: Review[];
}

// 상품별 개별 리뷰 관리 목록. 신규/수정은 review-form.tsx가 자체적으로 Server
// Action(saveReview)을 호출해 저장하고, 이 컴포넌트는 성공 콜백에서
// router.refresh()로 서버 데이터를 재조회한 뒤 편집 모드를 종료한다.
// 삭제는 window.confirm() 확인 후 deleteReview Server Action을 호출한다.
export function ReviewManageList({
  productId,
  initialReviews,
}: ReviewManageListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!window.confirm("이 리뷰를 삭제하시겠습니까?")) {
      return;
    }
    setDeleteError(null);
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteReview(id, productId);
      setDeletingId(null);
      if (!result.success) {
        setDeleteError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handleFormSuccess = () => {
    setEditingId(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}

      <div className="flex flex-col gap-3">
        {initialReviews.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            등록된 리뷰가 없습니다.
          </p>
        ) : (
          initialReviews.map((review) =>
            editingId === review.id ? (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <ReviewForm
                    productId={productId}
                    initialReview={review}
                    onSuccess={handleFormSuccess}
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
                        disabled={isPending}
                      >
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                        disabled={isPending && deletingId === review.id}
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
          <ReviewForm
            productId={productId}
            onSuccess={() => router.refresh()}
          />
        </CardContent>
      </Card>
    </div>
  );
}

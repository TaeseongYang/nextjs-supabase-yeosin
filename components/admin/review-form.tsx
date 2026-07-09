"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveReview } from "@/lib/actions/reviews";
import { ATTRIBUTE_LABELS, REVIEW_ATTRIBUTES } from "@/lib/types/attribute";
import { reviewSchema } from "@/lib/validations/review-schema";
import type { Review } from "@/lib/types/domain";
import type { ReviewAttributeType } from "@/lib/types/attribute";

interface ReviewFormProps {
  productId: string;
  initialReview?: Review;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function buildEmptyForm(productId: string) {
  return {
    authorLabel: "",
    rating: 5,
    content: "",
    createdAt: new Date().toISOString().slice(0, 10),
    attributeTags: [] as ReviewAttributeType[],
    productId,
  };
}

// 개별 리뷰 신규 추가/수정 폼. zod 검증 통과 후 saveReview 서버 액션(RPC 기반
// 원자적 저장)을 호출한다. 신규 리뷰의 id는 클라이언트에서 생성하지 않고
// RPC 함수 내부에서 gen_random_uuid() 기본값으로 서버가 생성한다.
export function ReviewForm({
  productId,
  initialReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(
    initialReview
      ? {
          authorLabel: initialReview.authorLabel,
          rating: initialReview.rating,
          content: initialReview.content,
          createdAt: initialReview.createdAt,
          attributeTags: initialReview.attributeTags,
          productId,
        }
      : buildEmptyForm(productId),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const toggleAttribute = (attribute: ReviewAttributeType) => {
    setForm((prev) => ({
      ...prev,
      attributeTags: prev.attributeTags.includes(attribute)
        ? prev.attributeTags.filter((a) => a !== attribute)
        : [...prev.attributeTags, attribute],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = reviewSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }

    setFieldErrors({});

    const formData = new FormData();
    formData.set("productId", result.data.productId);
    formData.set("authorLabel", result.data.authorLabel);
    formData.set("rating", String(result.data.rating));
    formData.set("content", result.data.content);
    formData.set("attributeTags", JSON.stringify(result.data.attributeTags));
    formData.set("createdAt", form.createdAt);

    startTransition(async () => {
      const response = await saveReview(initialReview?.id ?? null, formData);
      if (!response.success) {
        setFieldErrors(response.fieldErrors);
        return;
      }

      if (!initialReview) {
        setForm(buildEmptyForm(productId));
      }
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="authorLabel">작성자</Label>
        <Input
          id="authorLabel"
          value={form.authorLabel}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, authorLabel: e.target.value }))
          }
        />
        {fieldErrors.authorLabel && (
          <p className="text-sm text-red-500">{fieldErrors.authorLabel[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="rating">평점 (1~5)</Label>
          <Input
            id="rating"
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))
            }
          />
          {fieldErrors.rating && (
            <p className="text-sm text-red-500">{fieldErrors.rating[0]}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="createdAt">작성일</Label>
          <Input
            id="createdAt"
            type="date"
            value={form.createdAt}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, createdAt: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          value={form.content}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, content: e.target.value }))
          }
        />
        {fieldErrors.content && (
          <p className="text-sm text-red-500">{fieldErrors.content[0]}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label>속성 태그</Label>
        <div className="flex flex-col gap-2">
          {REVIEW_ATTRIBUTES.map((attribute) => (
            <div key={attribute} className="flex items-center gap-2">
              <Checkbox
                id={`attr-${attribute}`}
                checked={form.attributeTags.includes(attribute)}
                onCheckedChange={() => toggleAttribute(attribute)}
              />
              <Label htmlFor={`attr-${attribute}`}>
                {ATTRIBUTE_LABELS[attribute]}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {fieldErrors._form && (
        <p className="text-sm text-red-500">{fieldErrors._form[0]}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "저장 중..." : initialReview ? "수정 완료" : "리뷰 추가"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            취소
          </Button>
        )}
      </div>
    </form>
  );
}

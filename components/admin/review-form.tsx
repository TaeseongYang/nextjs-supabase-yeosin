"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ATTRIBUTE_LABELS, REVIEW_ATTRIBUTES } from "@/lib/types/attribute";
import { reviewSchema } from "@/lib/validations/review-schema";
import type { Review } from "@/lib/types/domain";
import type { ReviewAttributeType } from "@/lib/types/attribute";

interface ReviewFormProps {
  productId: string;
  initialReview?: Review;
  onSubmit: (review: Review) => void;
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

// 개별 리뷰 신규 추가/수정 폼. 실제 INSERT/UPDATE는 Task 015(Server Action)에서
// 구현될 예정이며, 이 단계에서는 zod 검증 후 상위 컴포넌트의 로컬 state만 갱신한다.
export function ReviewForm({
  productId,
  initialReview,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
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
    onSubmit({
      id: initialReview?.id ?? crypto.randomUUID(),
      ...result.data,
      createdAt: form.createdAt,
    });

    if (!initialReview) {
      setForm(buildEmptyForm(productId));
    }
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

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {initialReview ? "수정 완료" : "리뷰 추가"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { upsertReviewSummary } from "@/lib/actions/review-summaries";
import { ATTRIBUTE_LABELS, REVIEW_ATTRIBUTES } from "@/lib/types/attribute";
import { reviewSummarySchema } from "@/lib/validations/review-summary-schema";
import type { ReviewAttributeType } from "@/lib/types/attribute";
import type { ReviewSummary } from "@/lib/types/domain";
import type { ReviewSummaryFormViewModel } from "@/lib/types/admin";

interface ReviewSummaryFormProps {
  productId: string;
  initialSummaries: ReviewSummary[];
}

// 탭 키: "all"(전체 요약) + 5개 속성. null attribute를 문자열 키로 표현하기 위해 사용한다.
type TabKey = "all" | ReviewAttributeType;

const TAB_KEYS: TabKey[] = ["all", ...REVIEW_ATTRIBUTES];

function tabLabel(tab: TabKey): string {
  return tab === "all" ? "전체" : ATTRIBUTE_LABELS[tab];
}

function toAttribute(tab: TabKey): ReviewAttributeType | null {
  return tab === "all" ? null : tab;
}

function buildEmptyForm(
  productId: string,
  attribute: ReviewAttributeType | null,
): ReviewSummaryFormViewModel {
  return {
    productId,
    attribute,
    bullets: [],
  };
}

function buildFormFromSummary(
  productId: string,
  attribute: ReviewAttributeType | null,
  summary: ReviewSummary | undefined,
): ReviewSummaryFormViewModel {
  if (!summary) return buildEmptyForm(productId, attribute);
  return {
    productId,
    attribute: summary.attribute,
    bullets: summary.bullets,
  };
}

// 리뷰 요약 입력 폼. 탭(전체+5속성)마다 독립적인 폼 상태를 갖고, 저장 시
// upsertReviewSummary 서버 액션(select 후 update/insert 분기)을 호출한다.
export function ReviewSummaryForm({
  productId,
  initialSummaries,
}: ReviewSummaryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  // 탭별 폼 상태를 키-값 맵으로 관리해, 탭 전환 시 서로 다른 탭의 입력값이
  // 섞이지 않고 각자 독립적으로 유지되도록 한다.
  const [formsByTab, setFormsByTab] = useState<
    Record<TabKey, ReviewSummaryFormViewModel>
  >(
    () =>
      Object.fromEntries(
        TAB_KEYS.map((tab) => {
          const attribute = toAttribute(tab);
          const summary = initialSummaries.find(
            (s) => s.attribute === attribute,
          );
          return [tab, buildFormFromSummary(productId, attribute, summary)];
        }),
      ) as Record<TabKey, ReviewSummaryFormViewModel>,
  );

  const [fieldErrorsByTab, setFieldErrorsByTab] = useState<
    Partial<Record<TabKey, Record<string, string[]>>>
  >({});
  const [submitSuccessTab, setSubmitSuccessTab] = useState<TabKey | null>(null);

  const form = formsByTab[activeTab];
  const fieldErrors = fieldErrorsByTab[activeTab] ?? {};

  const updateForm = (partial: Partial<ReviewSummaryFormViewModel>) => {
    setFormsByTab((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], ...partial },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccessTab(null);

    // Textarea가 비어 있으면 [""](요소는 있지만 빈 문자열)이 되는데,
    // 이는 "요약 없음"을 의미하므로 스키마 검증 전 빈 배열로 정규화한다.
    const trimmedBullets = form.bullets.filter((b) => b.trim().length > 0);
    const result = reviewSummarySchema.safeParse({
      ...form,
      bullets: trimmedBullets,
    });
    if (!result.success) {
      setFieldErrorsByTab((prev) => ({
        ...prev,
        [activeTab]: result.error.flatten().fieldErrors,
      }));
      return;
    }

    setFieldErrorsByTab((prev) => ({ ...prev, [activeTab]: {} }));

    const formData = new FormData();
    formData.set("productId", result.data.productId);
    if (result.data.attribute) {
      formData.set("attribute", result.data.attribute);
    }
    formData.set("bullets", JSON.stringify(result.data.bullets));

    const submittedTab = activeTab;
    startTransition(async () => {
      const response = await upsertReviewSummary(formData);
      if (!response.success) {
        setFieldErrorsByTab((prev) => ({
          ...prev,
          [submittedTab]: response.fieldErrors,
        }));
        return;
      }
      setSubmitSuccessTab(submittedTab);
    });
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as TabKey)}
    >
      <TabsList>
        {TAB_KEYS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tabLabel(tab)}
          </TabsTrigger>
        ))}
      </TabsList>

      {TAB_KEYS.map((tab) => (
        <TabsContent key={tab} value={tab}>
          {activeTab === tab && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-4">
              <div className="grid gap-2">
                <Label>bullet</Label>
                <Textarea
                  rows={4}
                  value={form.bullets[0] ?? ""}
                  onChange={(e) => updateForm({ bullets: [e.target.value] })}
                />
              </div>

              {fieldErrors._form && (
                <p className="text-sm text-red-500">{fieldErrors._form[0]}</p>
              )}
              {submitSuccessTab === tab && (
                <p className="text-sm text-green-600">저장되었습니다.</p>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "저장 중..." : "저장"}
              </Button>
            </form>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

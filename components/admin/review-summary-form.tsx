"use client";

import { useState } from "react";

import { BulletListInput } from "@/components/admin/bullet-list-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonutChart } from "@/components/charts/donut-chart";
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
    positiveRatio: 0,
    negativeRatio: 0,
    positiveBullets: [],
    negativeBullets: [],
  };
}

// 리뷰 요약 입력 폼. 실제 저장은 Task 015(Server Action)에서 구현될 예정이며,
// 이 단계에서는 zod 검증 후 성공 안내와 로컬 state 반영만 수행한다.
export function ReviewSummaryForm({
  productId,
  initialSummaries,
}: ReviewSummaryFormProps) {
  const [summaries, setSummaries] = useState<ReviewSummary[]>(initialSummaries);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const attribute = toAttribute(activeTab);
  const existing = summaries.find((s) => s.attribute === attribute);
  const form: ReviewSummaryFormViewModel = existing
    ? {
        productId,
        attribute: existing.attribute,
        positiveRatio: existing.positiveRatio,
        negativeRatio: existing.negativeRatio,
        positiveBullets: existing.positiveBullets,
        negativeBullets: existing.negativeBullets,
      }
    : buildEmptyForm(productId, attribute);

  const updateForm = (partial: Partial<ReviewSummaryFormViewModel>) => {
    const next: ReviewSummary = {
      id: existing?.id ?? `sum-${productId}-${activeTab}`,
      productId,
      attribute,
      positiveRatio: form.positiveRatio,
      negativeRatio: form.negativeRatio,
      positiveBullets: form.positiveBullets,
      negativeBullets: form.negativeBullets,
      ...partial,
    };

    setSummaries((prev) => {
      const filtered = prev.filter((s) => s.attribute !== attribute);
      return [...filtered, next];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitSuccess(false);

    const result = reviewSummarySchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }

    // 스키마에 없는 커스텀 검증: 긍정/부정 비율 합은 100을 넘을 수 없다.
    if (form.positiveRatio + form.negativeRatio > 100) {
      setFormError("긍정/부정 비율의 합은 100을 초과할 수 없습니다.");
      return;
    }

    setFieldErrors({});
    setSubmitSuccess(true);
  };

  const donutData = [
    {
      label: "긍정",
      value: form.positiveRatio,
      colorToken: "positive" as const,
    },
    {
      label: "부정",
      value: form.negativeRatio,
      colorToken: "negative" as const,
    },
  ];

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
              <DonutChart data={donutData} />

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="positiveRatio">긍정 비율(%)</Label>
                  <Input
                    id="positiveRatio"
                    type="number"
                    value={form.positiveRatio}
                    onChange={(e) =>
                      updateForm({ positiveRatio: Number(e.target.value) })
                    }
                  />
                  {fieldErrors.positiveRatio && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.positiveRatio[0]}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="negativeRatio">부정 비율(%)</Label>
                  <Input
                    id="negativeRatio"
                    type="number"
                    value={form.negativeRatio}
                    onChange={(e) =>
                      updateForm({ negativeRatio: Number(e.target.value) })
                    }
                  />
                  {fieldErrors.negativeRatio && (
                    <p className="text-sm text-red-500">
                      {fieldErrors.negativeRatio[0]}
                    </p>
                  )}
                </div>
              </div>

              <BulletListInput
                label="긍정 bullet"
                values={form.positiveBullets}
                onChange={(values) => updateForm({ positiveBullets: values })}
              />

              <BulletListInput
                label="부정 bullet"
                values={form.negativeBullets}
                onChange={(values) => updateForm({ negativeBullets: values })}
              />

              {formError && <p className="text-sm text-red-500">{formError}</p>}
              {submitSuccess && (
                <p className="text-sm text-green-600">
                  저장되었습니다. (더미 처리, 실제 저장은 Task 015에서 구현
                  예정)
                </p>
              )}

              <Button type="submit" className="w-full">
                저장
              </Button>
            </form>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

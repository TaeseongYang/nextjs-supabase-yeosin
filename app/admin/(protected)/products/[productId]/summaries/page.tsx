import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ReviewSummaryForm } from "@/components/admin/review-summary-form";
import { getProductById } from "@/lib/queries/products";
import { getReviewSummariesByProduct } from "@/lib/queries/review-summaries";

interface AdminReviewSummaryPageProps {
  params: Promise<{ productId: string }>;
}

async function AdminReviewSummary({ params }: AdminReviewSummaryPageProps) {
  const { productId } = await params;

  const result = await getProductById(productId);
  if (!result) {
    notFound();
  }

  const initialSummaries = await getReviewSummariesByProduct(productId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <h1 className="text-lg font-semibold">
        {result.product.name} 리뷰 요약 관리
      </h1>
      <ReviewSummaryForm
        productId={productId}
        initialSummaries={initialSummaries}
      />
    </div>
  );
}

export default function AdminReviewSummaryPage(
  props: AdminReviewSummaryPageProps,
) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminReviewSummary {...props} />
    </Suspense>
  );
}

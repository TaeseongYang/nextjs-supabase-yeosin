import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ReviewSummaryForm } from "@/components/admin/review-summary-form";
import { dummyProducts, dummyReviewSummaries } from "@/lib/dummy-data";

interface AdminReviewSummaryPageProps {
  params: Promise<{ productId: string }>;
}

async function AdminReviewSummary({ params }: AdminReviewSummaryPageProps) {
  const { productId } = await params;

  const product = dummyProducts.find((p) => p.id === productId);
  if (!product) {
    notFound();
  }

  const initialSummaries = dummyReviewSummaries.filter(
    (summary) => summary.productId === productId,
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">{product.name} 리뷰 요약 관리</h1>
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

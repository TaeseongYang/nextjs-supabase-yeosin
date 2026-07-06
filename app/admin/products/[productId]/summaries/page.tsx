import { Suspense } from "react";

interface AdminReviewSummaryPageProps {
  params: Promise<{ productId: string }>;
}

async function AdminReviewSummary({ params }: AdminReviewSummaryPageProps) {
  const { productId } = await params;
  return <div>상품 {productId} 리뷰 요약 관리 (준비 중)</div>;
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

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ReviewManageList } from "@/components/admin/review-manage-list";
import { dummyProducts, dummyReviews } from "@/lib/dummy-data";

interface AdminReviewListPageProps {
  params: Promise<{ productId: string }>;
}

async function AdminReviewList({ params }: AdminReviewListPageProps) {
  const { productId } = await params;

  const product = dummyProducts.find((p) => p.id === productId);
  if (!product) {
    notFound();
  }

  const initialReviews = dummyReviews.filter(
    (review) => review.productId === productId,
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">{product.name} 개별 리뷰 관리</h1>
      <ReviewManageList productId={productId} initialReviews={initialReviews} />
    </div>
  );
}

export default function AdminReviewListPage(props: AdminReviewListPageProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminReviewList {...props} />
    </Suspense>
  );
}

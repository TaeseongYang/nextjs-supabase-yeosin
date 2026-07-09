import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ReviewManageList } from "@/components/admin/review-manage-list";
import { getProductById } from "@/lib/queries/products";
import { getReviewsByProductWithTags } from "@/lib/queries/reviews";

interface AdminReviewListPageProps {
  params: Promise<{ productId: string }>;
}

async function AdminReviewList({ params }: AdminReviewListPageProps) {
  const { productId } = await params;

  const result = await getProductById(productId);
  if (!result) {
    notFound();
  }

  const initialReviews = await getReviewsByProductWithTags(productId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <h1 className="text-lg font-semibold">
        {result.product.name} 개별 리뷰 관리
      </h1>
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

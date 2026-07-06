import { Suspense } from "react";

interface AdminReviewListPageProps {
  params: Promise<{ productId: string }>;
}

async function AdminReviewList({ params }: AdminReviewListPageProps) {
  const { productId } = await params;
  return <div>상품 {productId} 개별 리뷰 관리 (준비 중)</div>;
}

export default function AdminReviewListPage(props: AdminReviewListPageProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminReviewList {...props} />
    </Suspense>
  );
}

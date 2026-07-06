import { Suspense } from "react";

interface AdminProductFormPageProps {
  params: Promise<{ productId: string }>;
}

async function AdminProductForm({ params }: AdminProductFormPageProps) {
  const { productId } = await params;
  return <div>시술 상품 {productId} 등록/수정 (준비 중)</div>;
}

export default function AdminProductFormPage(props: AdminProductFormPageProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminProductForm {...props} />
    </Suspense>
  );
}

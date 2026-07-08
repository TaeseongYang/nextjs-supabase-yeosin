import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { dummyProducts } from "@/lib/dummy-data";

interface AdminProductFormPageProps {
  params: Promise<{ productId: string }>;
}

async function AdminProductFormContent({ params }: AdminProductFormPageProps) {
  const { productId } = await params;

  // "new"는 신규 등록을 나타내는 특수값이므로 빈 폼을 보여준다.
  if (productId === "new") {
    return <ProductForm />;
  }

  const product = dummyProducts.find((p) => p.id === productId);
  if (!product) {
    notFound();
  }

  return <ProductForm initialProduct={product} />;
}

export default function AdminProductFormPage(props: AdminProductFormPageProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminProductFormContent {...props} />
    </Suspense>
  );
}

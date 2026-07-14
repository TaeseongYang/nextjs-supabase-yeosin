import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/queries/categories";
import { getHospitals } from "@/lib/queries/hospitals";
import { getProductById } from "@/lib/queries/products";

interface AdminProductFormPageProps {
  params: Promise<{ productId: string }>;
}

async function AdminProductFormContent({ params }: AdminProductFormPageProps) {
  const { productId } = await params;
  const [categories, hospitals] = await Promise.all([
    getCategories(),
    getHospitals(),
  ]);

  // "new"는 신규 등록을 나타내는 특수값이므로 빈 폼을 보여준다.
  if (productId === "new") {
    return (
      <div className="mx-auto max-w-3xl">
        <ProductForm categories={categories} hospitals={hospitals} />
      </div>
    );
  }

  const result = await getProductById(productId);
  if (!result) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ProductForm
        categories={categories}
        hospitals={hospitals}
        initialProduct={result.product}
        initialHospital={result.hospital}
      />
    </div>
  );
}

export default function AdminProductFormPage(props: AdminProductFormPageProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdminProductFormContent {...props} />
    </Suspense>
  );
}

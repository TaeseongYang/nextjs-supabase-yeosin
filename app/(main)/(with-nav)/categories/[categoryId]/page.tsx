import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductCard } from "@/components/product/product-card";
import { buildProductCardViewModels } from "@/lib/utils/product-view-model";
import { getCategoryById } from "@/lib/queries/categories";
import { getProductsByCategory } from "@/lib/queries/products";

interface CategoryProductListPageProps {
  params: Promise<{ categoryId: string }>;
}

async function CategoryProductList({ params }: CategoryProductListPageProps) {
  const { categoryId } = await params;
  const category = await getCategoryById(categoryId);
  if (!category) notFound();

  const { products, hospitals, reviews } =
    await getProductsByCategory(categoryId);
  const productViewModels = buildProductCardViewModels(
    products,
    hospitals,
    reviews,
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">{category.name}</h1>
      {productViewModels.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          등록된 상품이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {productViewModels.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryProductListPage(
  props: CategoryProductListPageProps,
) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CategoryProductList {...props} />
    </Suspense>
  );
}

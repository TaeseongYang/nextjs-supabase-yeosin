import { Suspense } from "react";

import { ProductCard } from "@/components/product/product-card";
import { buildProductCardViewModels } from "@/lib/utils/product-view-model";
import {
  dummyCategories,
  dummyHospitals,
  dummyProducts,
  dummyReviews,
} from "@/lib/dummy-data";

interface CategoryProductListPageProps {
  params: Promise<{ categoryId: string }>;
}

async function CategoryProductList({ params }: CategoryProductListPageProps) {
  const { categoryId } = await params;
  const category = dummyCategories.find((c) => c.id === categoryId);

  const categoryProducts = dummyProducts.filter(
    (p) => p.categoryId === categoryId,
  );
  const products = buildProductCardViewModels(
    categoryProducts,
    dummyHospitals,
    dummyReviews,
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">{category?.name ?? "카테고리"}</h1>
      {products.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          등록된 상품이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
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

import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ImageIcon } from "lucide-react";

import { PriceDisplay } from "@/components/product/price-display";
import { RatingStars } from "@/components/product/rating-stars";
import { IncludedBadges } from "@/components/product/included-badges";
import { ConsultButton } from "@/components/layout/consult-button";
import { dummyProducts, dummyHospitals, dummyReviews } from "@/lib/dummy-data";

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

async function ProductDetail({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  const product = dummyProducts.find((p) => p.id === productId);
  if (!product) notFound();

  const hospital = dummyHospitals.find((h) => h.id === product.hospitalId);
  const productReviews = dummyReviews.filter((r) => r.productId === productId);
  const reviewCount = productReviews.length;
  const averageRating =
    reviewCount === 0
      ? 0
      : productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
  const discountRate = Math.round(
    (1 - product.discountPrice / product.originalPrice) * 100,
  );

  return (
    <div className="pb-20">
      <div className="flex h-48 items-center justify-center bg-muted">
        <ImageIcon className="size-10 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <h1 className="text-lg font-semibold">{product.name}</h1>
        <p className="text-sm text-muted-foreground">
          {hospital?.name} · {hospital?.region}
        </p>
        <PriceDisplay
          originalPrice={product.originalPrice}
          discountPrice={product.discountPrice}
          discountRate={discountRate}
        />
        <IncludedBadges
          includesVat={product.includesVat}
          includesAnesthesia={product.includesAnesthesia}
          includesAftercare={product.includesAftercare}
        />
        <p className="text-sm text-muted-foreground">
          {product.sideEffectNotice}
        </p>
        <Link
          href={`/products/${productId}/reviews`}
          className="flex items-center gap-2"
        >
          <RatingStars rating={averageRating} />
          <span className="text-sm">리뷰 {reviewCount}개</span>
        </Link>
      </div>
      <div className="flex flex-col gap-2 border-t p-4">
        <h2 className="text-base font-semibold">상세 정보</h2>
        {product.detailImageUrls.map((imageUrl) => (
          <div
            key={imageUrl}
            className="flex h-64 items-center justify-center bg-muted"
          >
            <ImageIcon className="size-10 text-muted-foreground" />
          </div>
        ))}
      </div>
      <ConsultButton />
    </div>
  );
}

export default function ProductDetailPage(props: ProductDetailPageProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ProductDetail {...props} />
    </Suspense>
  );
}

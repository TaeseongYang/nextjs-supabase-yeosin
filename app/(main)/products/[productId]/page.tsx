import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ImageIcon } from "lucide-react";

import { PriceDisplay } from "@/components/product/price-display";
import { RatingStars } from "@/components/product/rating-stars";
import { IncludedBadges } from "@/components/product/included-badges";
import { ConsultButton } from "@/components/layout/consult-button";
import { getProductById } from "@/lib/queries/products";
import { getReviewsByProduct } from "@/lib/queries/reviews";

interface ProductDetailPageProps {
  params: Promise<{ productId: string }>;
}

async function ProductDetail({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  const result = await getProductById(productId);
  if (!result) notFound();
  const { product, hospital } = result;

  const productReviews = await getReviewsByProduct(productId);
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
      {product.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- 프로젝트 전반이 next/image 대신 <img>를 사용
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-muted">
          <ImageIcon className="size-10 text-muted-foreground" />
        </div>
      )}
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
          // eslint-disable-next-line @next/next/no-img-element -- 프로젝트 전반이 next/image 대신 <img>를 사용
          <img
            key={imageUrl}
            src={imageUrl}
            alt="상세 이미지"
            className="w-full object-cover"
          />
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

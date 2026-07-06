import Link from "next/link";
import { ImageIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PriceDisplay } from "@/components/product/price-display";
import { RatingStars } from "@/components/product/rating-stars";
import type { ProductCardViewModel } from "@/lib/types/view-models";

interface ProductCardProps {
  product: ProductCardViewModel;
}

/**
 * 카테고리 상품 리스트에서 사용되는 상품 카드 컴포넌트.
 * public/에 실제 이미지 자산이 없으므로 썸네일은 아이콘+배경색 플레이스홀더로 대체한다.
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card>
        <div className="flex h-32 items-center justify-center rounded-t-xl bg-muted">
          <ImageIcon className="size-8 text-muted-foreground" />
        </div>
        <CardContent className="flex flex-col gap-2 p-4">
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-muted-foreground">
            {product.hospitalName} · {product.region}
          </p>
          <div className="flex items-center gap-1">
            <RatingStars rating={product.averageRating} size={14} />
            <span className="text-xs text-muted-foreground">
              리뷰 {product.reviewCount}개
            </span>
          </div>
          <PriceDisplay
            originalPrice={product.originalPrice}
            discountPrice={product.discountPrice}
            discountRate={product.discountRate}
          />
        </CardContent>
      </Card>
    </Link>
  );
}

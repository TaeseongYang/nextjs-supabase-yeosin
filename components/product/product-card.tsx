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
 * 카테고리 상품 리스트에서 사용되는 상품 카드 컴포넌트(Server Component).
 * 썸네일 URL이 있으면(Supabase Storage 업로드 이미지 포함) 실제 이미지를 표시하고,
 * 없으면(빈 문자열, 신규 상품 미등록 등) 아이콘 플레이스홀더로 대체한다.
 * 참고: onError 기반 깨진 이미지 폴백은 Client Component 이벤트 핸들러가 필요해
 * 이 Server Component에서는 사용하지 않는다(placeholder 시드 데이터는 깨진 이미지로
 * 그대로 노출되는 것이 이 프로젝트의 의도된 동작이다).
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card>
        {product.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- 프로젝트 전반이 next/image 대신 <img>를 사용
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="h-32 w-full rounded-t-xl object-cover"
          />
        ) : (
          <div className="flex h-32 items-center justify-center rounded-t-xl bg-muted">
            <ImageIcon className="size-8 text-muted-foreground" />
          </div>
        )}
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

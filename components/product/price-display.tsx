import { Badge } from "@/components/ui/badge";

interface PriceDisplayProps {
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
}

/**
 * 정가/할인가/할인율을 함께 표시하는 컴포넌트.
 * discountRate 계산 로직은 이 컴포넌트의 책임이 아니며(view-models.ts의 파생 필드),
 * props로 전달받은 값을 그대로 표시만 한다.
 */
export function PriceDisplay({
  originalPrice,
  discountPrice,
  discountRate,
}: PriceDisplayProps) {
  return (
    <div className="flex flex-col gap-1">
      {discountRate > 0 && (
        <span className="text-sm text-muted-foreground line-through">
          {originalPrice.toLocaleString()}원
        </span>
      )}
      <div className="flex items-center gap-2">
        {discountRate > 0 && (
          <Badge variant="destructive">{discountRate}%</Badge>
        )}
        <span className="text-lg font-bold text-foreground">
          {discountPrice.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}

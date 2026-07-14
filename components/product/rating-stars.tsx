import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
}

/**
 * 0~10점 평점을 별 아이콘 1개 + 숫자(소수점 둘째 자리)로 표시하는 컴포넌트.
 * 별 5개를 나열해 부분 채움으로 점수를 표현하던 기존 방식은 10점 만점 체계와
 * 맞지 않아, 쿠팡/여기어때 등에서 흔히 쓰는 "별 1개 + 숫자" 표기로 대체했다.
 */
export function RatingStars({ rating, size = 16 }: RatingStarsProps) {
  return (
    <div className="inline-flex items-center gap-1">
      <Star size={size} className="fill-primary text-primary" aria-hidden />
      <span className="text-sm font-medium">{rating.toFixed(2)}</span>
    </div>
  );
}

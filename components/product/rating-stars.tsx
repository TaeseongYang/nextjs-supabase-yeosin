import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
}

const STAR_COUNT = 5;

/**
 * 5점 만점 별점을 소수점 단위까지 부드럽게(부분 채움) 표시하는 컴포넌트.
 * 배경에 빈 별 5개를 깔고, 그 위에 rating 비율만큼만 보이는 채워진 별 5개를
 * overflow-hidden 레이어로 겹쳐 그려 부분 채움을 표현한다.
 */
export function RatingStars({ rating, size = 16 }: RatingStarsProps) {
  return (
    <div
      className="inline-flex gap-0.5"
      role="img"
      aria-label={`5점 만점에 ${rating}점`}
    >
      {Array.from({ length: STAR_COUNT }).map((_, index) => {
        const fillPercentage = Math.min(
          Math.max((rating - index) * 100, 0),
          100,
        );
        return (
          <div
            key={index}
            className="relative"
            style={{ width: size, height: size }}
          >
            {/* 배경 레이어: 빈 별 */}
            <Star
              size={size}
              className="absolute inset-0 text-muted-foreground"
              aria-hidden
            />
            {/* 전경 레이어: 별 하나 단위로 rating 비율만큼만 노출 */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
              aria-hidden
            >
              <Star size={size} className="fill-primary text-primary" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

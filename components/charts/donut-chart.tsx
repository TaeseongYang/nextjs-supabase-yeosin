import type { DonutChartDatum } from "@/lib/types/view-models";

interface DonutChartProps {
  data: DonutChartDatum[];
  size?: number;
}

// colorToken별로 실제 렌더링에 사용할 stroke 색상(CSS 변수)을 매핑한다.
// positive는 --primary(브랜드 강조색), negative는 --destructive(경고색)를 재사용해
// 별도의 차트 전용 색상 토큰을 만들지 않는다.
const STROKE_BY_TOKEN: Record<DonutChartDatum["colorToken"], string> = {
  positive: "hsl(var(--primary))",
  negative: "hsl(var(--destructive))",
};

/**
 * 긍정/부정 2분류 비율을 시각화하는 SVG 기반 도넛 차트.
 * 인터랙션이 없는 순수 시각화 컴포넌트이므로 Server Component로 구현한다.
 */
export function DonutChart({ data, size = 120 }: DonutChartProps) {
  const total = data.reduce((sum, datum) => sum + datum.value, 0);
  const strokeWidth = size * 0.18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // 각 datum의 비율만큼 원주를 채우고, 이전 세그먼트들의 누적 비율만큼 회전시켜
  // 세그먼트들이 겹치지 않고 이어지도록 한다.
  let cumulativeRatio = 0;
  const segments = data.map((datum) => {
    const ratio = total > 0 ? datum.value / total : 0;
    const dashArray = `${circumference * ratio} ${circumference * (1 - ratio)}`;
    const dashOffset = -circumference * cumulativeRatio;
    cumulativeRatio += ratio;

    return {
      ...datum,
      ratio,
      dashArray,
      dashOffset,
    };
  });

  return (
    <div className="flex items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="긍정/부정 리뷰 비율 도넛 차트"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {segments.map((segment) => (
          <circle
            key={segment.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={STROKE_BY_TOKEN[segment.colorToken]}
            strokeWidth={strokeWidth}
            strokeDasharray={segment.dashArray}
            strokeDashoffset={segment.dashOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      {/* 색상만으로 의미를 전달하지 않도록 라벨과 수치를 텍스트로 병기한다 */}
      <ul className="flex flex-col gap-1 text-sm">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STROKE_BY_TOKEN[segment.colorToken] }}
            />
            <span className="text-foreground">
              {segment.label} {Math.round(segment.ratio * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

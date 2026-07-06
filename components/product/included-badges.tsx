import { Badge } from "@/components/ui/badge";

interface IncludedBadgesProps {
  includesVat: boolean;
  includesAnesthesia: boolean;
  includesAftercare: boolean;
}

/**
 * lib/types/attribute.ts의 ATTRIBUTE_LABELS 하드코딩 lookup 패턴과 동일하게
 * 포함 항목 라벨을 상수로 분리한다.
 */
const INCLUDED_ITEM_LABELS = {
  vat: "VAT 포함",
  anesthesia: "마취비 포함",
  aftercare: "사후관리비 포함",
} as const;

/**
 * VAT/마취비/사후관리비 포함 여부를 뱃지로 표시하는 컴포넌트.
 * 포함된 항목만 렌더링하며, 전부 false면 아무것도 렌더링하지 않는다.
 */
export function IncludedBadges({
  includesVat,
  includesAnesthesia,
  includesAftercare,
}: IncludedBadgesProps) {
  const candidates: (string | false)[] = [
    includesVat && INCLUDED_ITEM_LABELS.vat,
    includesAnesthesia && INCLUDED_ITEM_LABELS.anesthesia,
    includesAftercare && INCLUDED_ITEM_LABELS.aftercare,
  ];
  const items = candidates.filter((label): label is string => Boolean(label));

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((label) => (
        <Badge key={label} variant="secondary">
          {label}
        </Badge>
      ))}
    </div>
  );
}

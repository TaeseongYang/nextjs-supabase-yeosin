import { Badge } from "@/components/ui/badge";
import {
  ATTRIBUTE_LABELS,
  type ReviewAttributeType,
} from "@/lib/types/attribute";

interface AttributeTagProps {
  attribute: ReviewAttributeType;
  active?: boolean;
}

/**
 * 리뷰 속성(의료진/이용서비스/가격/시술효과/시술통증) 태그를 표시하는 컴포넌트.
 * 라벨 문자열은 하드코딩하지 않고 ATTRIBUTE_LABELS에서 조회한다.
 * active props로 선택 여부를 강조 표시(속성별 리뷰 필터 UI에서 사용 예정).
 */
export function AttributeTag({ attribute, active = false }: AttributeTagProps) {
  return (
    <Badge variant={active ? "default" : "secondary"}>
      {ATTRIBUTE_LABELS[attribute]}
    </Badge>
  );
}

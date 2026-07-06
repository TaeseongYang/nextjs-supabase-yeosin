import { Button } from "@/components/ui/button";

/**
 * 하단 고정 '상담받기' 버튼.
 * 상품 상세/리뷰 종합/속성별 리뷰 필터 페이지 등에서 공통으로 재사용한다.
 * Task 005에서 확정된 요구사항에 따라 onClick 등 이벤트 핸들러를 부착하지 않는다
 * (클릭 시 별도 동작 없음 — 회귀 금지).
 */
export function ConsultButton() {
  return (
    <div className="sticky bottom-0 border-t bg-background p-4">
      <Button className="w-full" size="lg">
        상담받기
      </Button>
    </div>
  );
}

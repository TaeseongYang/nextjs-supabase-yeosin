import type { Category } from "@/lib/types/domain";

/**
 * 카테고리 홈 아이콘 그리드에 노출되는 12개 시술 카테고리 더미 데이터.
 * iconKey는 Lucide React 아이콘 매핑용 키 문자열이며, 실제 아이콘 컴포넌트
 * 매핑은 카테고리 홈 UI 구현(Task 004)에서 처리한다.
 */
export const dummyCategories: Category[] = [
  { id: "cat-9", name: "제모", iconKey: "wind", slug: "hair-removal" },
  { id: "cat-1", name: "피부", iconKey: "sparkles", slug: "skin" },
  { id: "cat-2", name: "눈성형", iconKey: "eye", slug: "eyes" },
  { id: "cat-3", name: "코성형", iconKey: "triangle", slug: "nose" },
  { id: "cat-4", name: "안면윤곽", iconKey: "scan-face", slug: "contour" },
  { id: "cat-5", name: "가슴성형", iconKey: "heart", slug: "breast" },
  { id: "cat-6", name: "바디라인", iconKey: "dumbbell", slug: "body" },
  {
    id: "cat-7",
    name: "보톡스/필러",
    iconKey: "syringe",
    slug: "botox-filler",
  },
  { id: "cat-8", name: "리프팅", iconKey: "trending-up", slug: "lifting" },
  {
    id: "cat-10",
    name: "모발이식",
    iconKey: "scissors",
    slug: "hair-transplant",
  },
  { id: "cat-11", name: "치아교정/미백", iconKey: "smile", slug: "dental" },
  { id: "cat-12", name: "안티에이징", iconKey: "leaf", slug: "anti-aging" },
];

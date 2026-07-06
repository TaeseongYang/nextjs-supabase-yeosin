import type { Hospital } from "@/lib/types/domain";

/**
 * 상품 카드/상세에서 참조되는 병원 더미 데이터.
 */
export const dummyHospitals: Hospital[] = [
  { id: "hosp-1", name: "강남서울피부과의원", region: "서울 강남구" },
  { id: "hosp-2", name: "신사라인성형외과", region: "서울 강남구" },
  { id: "hosp-3", name: "청담뷰티클리닉", region: "서울 강남구" },
  { id: "hosp-4", name: "압구정휴먼성형외과", region: "서울 강남구" },
  { id: "hosp-5", name: "판교연세피부과의원", region: "경기 성남시" },
  { id: "hosp-6", name: "부산센텀미소성형외과", region: "부산 해운대구" },
  { id: "hosp-7", name: "대구더클리어피부과", region: "대구 수성구" },
  { id: "hosp-8", name: "홍대엘르피부과의원", region: "서울 마포구" },
];

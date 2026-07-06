import type { TreatmentProduct, Hospital, Review } from "@/lib/types/domain";
import type { ProductCardViewModel } from "@/lib/types/view-models";

/**
 * 상품/병원/리뷰 더미 데이터를 조합해 상품 카드 뷰모델 배열을 생성한다.
 * 카테고리 필터링은 호출 측(페이지)에서 미리 수행한 뒤 이 함수에 전달한다.
 *
 * Task 010(Supabase 실연동)에서 이 함수는 더미 데이터 전용 임시 어댑터로
 * 대체될 예정이므로 과도한 범용화(캐싱 등)는 하지 않는다.
 */
export function buildProductCardViewModels(
  products: TreatmentProduct[],
  hospitals: Hospital[],
  reviews: Review[],
): ProductCardViewModel[] {
  return products.map((product) => {
    const hospital = hospitals.find((h) => h.id === product.hospitalId);
    const productReviews = reviews.filter((r) => r.productId === product.id);
    const reviewCount = productReviews.length;
    const averageRating =
      reviewCount === 0
        ? 0
        : productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
    const discountRate = Math.round(
      (1 - product.discountPrice / product.originalPrice) * 100,
    );

    return {
      id: product.id,
      name: product.name,
      hospitalName: hospital?.name ?? "",
      region: hospital?.region ?? "",
      thumbnailUrl: product.thumbnailUrl,
      reviewCount,
      averageRating,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      discountRate,
    };
  });
}

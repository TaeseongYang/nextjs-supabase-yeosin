import { createClient } from "@/lib/supabase/server";
import type { TreatmentProduct, Hospital, Review } from "@/lib/types/domain";

interface ProductsWithRelations {
  products: TreatmentProduct[];
  hospitals: Hospital[];
  reviews: Review[];
}

export interface ProductWithHospital {
  product: TreatmentProduct;
  hospital: Hospital | null;
}

/**
 * 카테고리별 상품 리스트(F002)에 필요한 상품/병원/리뷰를 함께 조회한다.
 * categoryId가 uuid 형식이 아니면 Postgres가 22P02(invalid_text_representation)를
 * 던지는데, 이 경우도 "상품 없음"으로 취급해 빈 배열들을 반환한다.
 */
export async function getProductsByCategory(
  categoryId: string,
): Promise<ProductsWithRelations> {
  const supabase = await createClient();
  const { data: productRows, error: productError } = await supabase
    .from("treatment_products")
    .select("*")
    .eq("category_id", categoryId);
  if (productError) {
    if (productError.code === "22P02") {
      return { products: [], hospitals: [], reviews: [] };
    }
    throw productError;
  }

  const products: TreatmentProduct[] = (productRows ?? []).map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    hospitalId: row.hospital_id,
    name: row.name,
    originalPrice: row.original_price,
    discountPrice: row.discount_price,
    includesVat: row.includes_vat,
    includesAnesthesia: row.includes_anesthesia,
    includesAftercare: row.includes_aftercare,
    sideEffectNotice: row.side_effect_notice,
    thumbnailUrl: row.thumbnail_url,
    detailImageUrls: row.detail_image_urls,
  }));

  if (products.length === 0)
    return { products: [], hospitals: [], reviews: [] };

  const hospitalIds = [...new Set(products.map((p) => p.hospitalId))];
  const productIds = products.map((p) => p.id);

  const [
    { data: hospitalRows, error: hospitalError },
    { data: reviewRows, error: reviewError },
  ] = await Promise.all([
    supabase.from("hospitals").select("id, name, region").in("id", hospitalIds),
    supabase
      .from("reviews")
      .select("id, product_id, author_label, rating, content, created_at")
      .in("product_id", productIds),
  ]);
  if (hospitalError) throw hospitalError;
  if (reviewError) throw reviewError;

  const hospitals: Hospital[] = (hospitalRows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    region: row.region,
  }));
  const reviews: Review[] = (reviewRows ?? []).map((row) => ({
    id: row.id,
    productId: row.product_id,
    authorLabel: row.author_label,
    rating: row.rating,
    content: row.content,
    createdAt: row.created_at,
    attributeTags: [], // 이 페이지는 attributeTags를 쓰지 않으므로 review_attribute_tags 조인을 생략한다.
  }));

  return { products, hospitals, reviews };
}

/**
 * 상품 상세(F003)에 필요한 상품과 소속 병원을 함께 조회한다.
 * productId가 uuid 형식이 아니면 Postgres가 22P02(invalid_text_representation)를
 * 던지는데, 이 경우도 "상품 없음"으로 취급해 null을 반환한다.
 */
export async function getProductById(
  productId: string,
): Promise<ProductWithHospital | null> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("treatment_products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();
  if (error) {
    if (error.code === "22P02") return null;
    throw error;
  }
  if (!row) return null;

  const product: TreatmentProduct = {
    id: row.id,
    categoryId: row.category_id,
    hospitalId: row.hospital_id,
    name: row.name,
    originalPrice: row.original_price,
    discountPrice: row.discount_price,
    includesVat: row.includes_vat,
    includesAnesthesia: row.includes_anesthesia,
    includesAftercare: row.includes_aftercare,
    sideEffectNotice: row.side_effect_notice,
    thumbnailUrl: row.thumbnail_url,
    detailImageUrls: row.detail_image_urls,
  };

  const { data: hospitalRow, error: hospitalError } = await supabase
    .from("hospitals")
    .select("id, name, region")
    .eq("id", product.hospitalId)
    .maybeSingle();
  if (hospitalError) throw hospitalError;

  return {
    product,
    hospital: hospitalRow
      ? {
          id: hospitalRow.id,
          name: hospitalRow.name,
          region: hospitalRow.region,
        }
      : null,
  };
}

export interface AdminProductByCategoryItem {
  id: string;
  name: string;
  hospitalName: string;
}

export interface AdminCategoryGroup {
  categoryId: string;
  categoryName: string;
  products: AdminProductByCategoryItem[];
}

/**
 * 관리자 대시보드의 상품 목록을 카테고리별로 그룹화해 조회한다.
 * 상품이 있는 카테고리만 노출하면 "이 카테고리는 아직 상품이 없다"는 사실을
 * 관리자가 인지하기 어려우므로, categories 테이블의 12개 카테고리를 전부 기준으로 삼아
 * 상품이 0개인 카테고리도 빈 목록(그룹)으로 함께 반환한다.
 * 정렬은 카테고리 생성 순서(categories.created_at), 카테고리 내 상품은 상품 생성 순서를 따른다.
 */
export async function getAdminProductsByCategory(): Promise<
  AdminCategoryGroup[]
> {
  const supabase = await createClient();

  const [
    { data: categoryRows, error: catErr },
    { data: productRows, error: prodErr },
  ] = await Promise.all([
    supabase.from("categories").select("id, name").order("created_at"),
    supabase
      .from("treatment_products")
      .select("id, name, category_id, hospital_id")
      .order("created_at"),
  ]);
  if (catErr) throw catErr;
  if (prodErr) throw prodErr;

  const hospitalIds = [
    ...new Set((productRows ?? []).map((p) => p.hospital_id)),
  ];
  const { data: hospitalRows, error: hosErr } =
    hospitalIds.length > 0
      ? await supabase
          .from("hospitals")
          .select("id, name")
          .in("id", hospitalIds)
      : { data: [], error: null };
  if (hosErr) throw hosErr;

  const hospitalNameMap = new Map(
    (hospitalRows ?? []).map((h) => [h.id, h.name]),
  );

  const productsByCategoryId = new Map<string, AdminProductByCategoryItem[]>();
  for (const p of productRows ?? []) {
    const list = productsByCategoryId.get(p.category_id) ?? [];
    list.push({
      id: p.id,
      name: p.name,
      hospitalName: hospitalNameMap.get(p.hospital_id) ?? "",
    });
    productsByCategoryId.set(p.category_id, list);
  }

  return (categoryRows ?? []).map((c) => ({
    categoryId: c.id,
    categoryName: c.name,
    products: productsByCategoryId.get(c.id) ?? [],
  }));
}

"use server";

import { createServiceClient } from "@/lib/supabase/service";

const PRODUCT_IMAGES_BUCKET = "product-images";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, storage 버킷의 file_size_limit과 동일하게 맞춘다.
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export type UploadProductImageResult =
  { success: true; url: string } | { success: false; error: string };

// 파일 확장자를 원본 파일명에서 최대한 안전하게 추출한다. 확장자가 없거나
// 비정상적으로 길면(경로 조작 등) 빈 문자열로 처리해 랜덤 이름만 사용한다.
function extractExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) return "";
  const ext = fileName.slice(lastDot + 1).toLowerCase();
  if (ext.length === 0 || ext.length > 10 || !/^[a-z0-9]+$/.test(ext))
    return "";
  return ext;
}

/**
 * 관리자 상품 폼에서 선택한 이미지 파일을 Supabase Storage(product-images 버킷)에
 * 업로드하고 공개 URL을 반환한다. service_role 클라이언트로 업로드하므로
 * anon/authenticated에게는 쓰기 권한을 부여하지 않는다(RLS 정책은 SELECT만 허용).
 * 파일명 충돌을 피하기 위해 crypto.randomUUID() 기반의 랜덤 파일명을 사용한다.
 */
export async function uploadProductImage(
  file: File,
): Promise<UploadProductImageResult> {
  if (!file || file.size === 0) {
    return { success: false, error: "파일을 선택해주세요." };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "이미지 파일(JPEG, PNG, WEBP, GIF)만 업로드할 수 있습니다.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: "파일 용량은 5MB를 초과할 수 없습니다." };
  }

  const extension = extractExtension(file.name);
  const fileName = `${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;

  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { success: false, error: "이미지 업로드 중 오류가 발생했습니다." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}

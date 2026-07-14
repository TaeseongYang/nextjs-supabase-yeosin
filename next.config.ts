import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    serverActions: {
      // lib/actions/product-images.ts의 MAX_FILE_SIZE_BYTES(5MB)와 동일하게 맞춘다.
      // Server Actions의 기본 body 제한은 1MB라 상세 이미지 업로드 시 초과 에러가 발생했다.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;

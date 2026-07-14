import { ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/constants/admin-auth";

// proxy.ts(Edge 런타임)에서도 동작해야 하므로 Node 전용 crypto 대신
// Edge/Node 양쪽에서 쓸 수 있는 Web Crypto API(crypto.subtle)로 HMAC-SHA256 서명을 구현한다.
// 별도의 세션 테이블 없이 "발급 시각 + 서명"만으로 무상태 검증한다.

function getSecretKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET 환경 변수가 설정되어 있지 않습니다.");
  }
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// 세션 쿠키 값 형식: "<issuedAtMs>.<hmacHex>"
export async function createAdminSessionToken(): Promise<string> {
  const issuedAt = Date.now().toString();
  const key = await getSecretKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(issuedAt),
  );
  return `${issuedAt}.${toHex(signature)}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;

  const [issuedAt, signatureHex] = token.split(".");
  if (!issuedAt || !signatureHex) return false;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs)) return false;

  const ageSeconds = (Date.now() - issuedAtMs) / 1000;
  if (ageSeconds < 0 || ageSeconds > ADMIN_SESSION_MAX_AGE_SECONDS)
    return false;

  const key = await getSecretKey();
  const expectedSignature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(issuedAt),
  );

  return toHex(expectedSignature) === signatureHex;
}

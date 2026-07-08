# Task 007: 관리자 로그인 및 대시보드 UI 완성

## 고수준 명세

Phase 2(더미 데이터 기반 UI 완성)의 마지막 작업으로, `app/admin/*` 하위 6개 placeholder 페이지를 실제 UI로 교체한다. 관리자 로그인, 대시보드(시술 상품 목록), 시술 상품 등록/수정 폼, 리뷰 요약 입력 폼, 개별 리뷰 관리 폼을 모두 더미 데이터(`lib/dummy-data`)로 채우고, 제출은 zod 스키마 검증 후 로컬 state 반영까지만 수행한다. 실제 Supabase 인증(`supabase.auth`)과 실제 INSERT/UPDATE/DELETE 영속화는 각각 Task 013, Task 014~015에서 구현할 예정이며 이 Task의 범위에 포함하지 않는다.

## 관련 파일

- `app/admin/login/page.tsx`, `components/admin/admin-login-form.tsx` — 관리자 로그인 폼(더미 제출)
- `app/admin/page.tsx` — 관리자 대시보드(시술 상품 16개 목록 + 관리 진입 링크)
- `app/admin/products/[productId]/page.tsx`, `components/admin/product-form.tsx` — 상품 등록/수정 폼
- `app/admin/products/[productId]/summaries/page.tsx`, `components/admin/review-summary-form.tsx`, `components/admin/bullet-list-input.tsx` — 리뷰 요약 입력 폼
- `app/admin/products/[productId]/reviews/page.tsx`, `components/admin/review-manage-list.tsx`, `components/admin/review-form.tsx` — 개별 리뷰 관리 폼
- `lib/validations/product-schema.ts`, `lib/validations/review-summary-schema.ts`, `lib/validations/review-schema.ts` — 폼 검증 zod 스키마 (Task 001에서 정의, 이번 Task에서 사용)
- `lib/supabase/proxy.ts` — `/admin` 하위 라우트를 임시 공개 처리(Task 013 전까지)
- `components/ui/select.tsx`, `components/ui/textarea.tsx` — 신규 설치된 shadcn 컴포넌트

## 수락 기준

- `/admin/login`에서 이메일/비밀번호 제출 시 로딩 표시 후 `/admin`으로 이동한다.
- `/admin`에서 더미 상품 16개가 병원명/카테고리명과 함께 목록으로 보이고, 각 행의 "수정"/"리뷰 요약"/"개별 리뷰" 링크와 "신규 상품 등록" 버튼이 올바른 경로로 이동한다.
- `/admin/products/new`는 빈 폼을, `/admin/products/prod-1`은 기존 값이 채워진 폼을 보여주며, 존재하지 않는 상품 ID는 404 처리된다.
- `/admin/products/[productId]/summaries`에서 전체+5속성 탭 전환 시 각 속성의 초기값이 채워지고 도넛 차트가 실시간 반영되며, 긍정/부정 비율 합이 100을 초과하면 에러가 표시된다.
- `/admin/products/[productId]/reviews`에서 기존 리뷰 목록이 보이고, 신규 리뷰 추가/수정/삭제가 즉시 목록에 반영된다.
- `npm run typecheck`, `npm run lint`, `npm run build` 전체 통과.

## 구현 단계

- [x] 관리자 로그인 UI 구현 (`components/admin/admin-login-form.tsx` 신규, 더미 제출 + `router.push('/admin')`)
- [x] 관리자 대시보드 UI 구현 (`dummyProducts`+`dummyHospitals`+`dummyCategories` 조합 목록, 상품별 관리 진입 링크 3종)
- [x] 시술 상품 등록/수정 폼 UI 구현 (shadcn Select/Textarea 설치, `productSchema.safeParse` 검증, `productId==='new'` 신규/기존 분기)
- [x] 리뷰 요약 입력 폼 UI 구현 (전체+5속성 탭, `BulletListInput`, `DonutChart` 실시간 미리보기, 비율 합 100 초과 커스텀 검증)
- [x] 개별 리뷰 관리 폼 UI 구현 (리뷰 목록 수정/삭제, 신규 리뷰 추가 폼, `reviewSchema.safeParse` 검증)
- [x] 전체 관리자 플로우 및 기존 일반 사용자 플로우 수동 확인, Task 문서/로드맵 마무리

## 수동 확인 체크리스트

이 Task는 순수 UI 작업(더미 데이터, 실제 영속화 없음)이므로 API 연동 Task의 "테스트 체크리스트"(Playwright 필수) 대신 아래 수동 확인 체크리스트로 대체한다. 실제로는 Playwright MCP를 활용해 확인했다.

- [x] `/admin/login`에서 이메일/비밀번호 입력 후 제출 시 로딩 상태를 거쳐 `/admin`으로 이동 확인
- [x] `/admin`에서 시술 상품 16개가 병원명·카테고리명과 함께 렌더링되고, "신규 상품 등록" 버튼이 `/admin/products/new`로 이동 확인
- [x] `/admin/products/new` 빈 폼에 상품명/카테고리/병원/가격/체크박스/부작용 안내를 입력 후 제출 시 성공 메시지와 함께 `/admin`으로 복귀 확인
- [x] `/admin/products/prod-1/summaries`에서 "전체" 탭 초기값(긍정 82%/부정 18%)과 "의료진" 탭 전환 시 값(88%/12%)이 `dummyReviewSummaries`와 일치하고 도넛 차트가 함께 갱신됨을 확인
- [x] `/admin/products/prod-1/reviews`에서 신규 리뷰 추가 시 목록에 즉시 반영됨을 확인
- [x] `/admin/products/nonexistent-id` 접근 시 404 페이지 확인
- [x] 기존 일반 사용자 플로우(`/` → `/categories/cat-1` → `/products/prod-1` → `/products/prod-1/reviews` → `/products/prod-1/reviews/medical_staff`) 회귀 없이 정상 동작, 콘솔 에러 0건 확인
- [x] `npm run typecheck`, `npm run lint`, `npm run build` 전체 통과 확인

## 변경 사항

신규 파일: `components/admin/admin-login-form.tsx`, `components/admin/product-form.tsx`, `components/admin/review-summary-form.tsx`, `components/admin/bullet-list-input.tsx`, `components/admin/review-manage-list.tsx`, `components/admin/review-form.tsx`, `components/ui/select.tsx`, `components/ui/textarea.tsx`(shadcn 설치).

수정 파일: `app/admin/login/page.tsx`, `app/admin/page.tsx`, `app/admin/products/[productId]/page.tsx`, `app/admin/products/[productId]/summaries/page.tsx`, `app/admin/products/[productId]/reviews/page.tsx`(6개 placeholder 페이지를 실제 UI로 교체), `lib/supabase/proxy.ts`(`publicPathPrefixes`에 `/admin`을 추가해 Task 013 전까지 관리자 라우트 전체를 임시 공개 처리 — 기존에는 `/admin/login`만 공개되어 있어 더미 로그인 후 `/admin` 대시보드 진입 시 인증 미들웨어에 의해 `/auth/login`으로 리다이렉트되는 문제가 있었음, Task 013에서 실제 관리자 인증이 붙으면 이 항목을 제거하고 `profiles.role` 기반 보호 로직으로 교체 예정).

검증 방법: `npm run typecheck`/`npm run lint`/`npm run build` 전체 통과. 개발 서버 기동 후 Playwright MCP로 로그인 → 대시보드(16개 상품) → 신규 상품 등록/제출 → 리뷰 요약 탭 전환(전체 82%/18%, 의료진 88%/12% 확인) → 개별 리뷰 추가까지 전체 관리자 플로우를 직접 수행. 이어서 기존 일반 사용자 플로우(홈 → 카테고리 → 상품 상세 → 리뷰 종합 → 속성별 리뷰)도 회귀 없이 동작함을 재확인. 존재하지 않는 상품 ID로 404 처리 확인. 전 과정 콘솔 에러 0건.

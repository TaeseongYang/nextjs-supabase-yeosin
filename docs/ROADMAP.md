# 소다랩(SoDA LAB) 개발 로드맵

의료 미용 시술을 카테고리별로 탐색·비교하고, 속성별 리뷰 요약을 통해 신뢰도 높은 판단을 돕는 모바일 웹 서비스.

## 개요

소다랩은 미용 시술을 알아보는 일반 소비자를 위한 시술 비교 서비스로 다음 기능을 제공합니다:

- **카테고리 기반 탐색**: 12개 시술 카테고리 아이콘 그리드로 서비스에 진입하고 관심 시술을 선택
- **병원별 상품 비교**: 카테고리 내 병원 상품을 가격·평점·리뷰 수와 함께 카드로 비교
- **속성별 리뷰 요약(핵심 차별점)**: 의료진/이용서비스/가격/시술효과/시술통증 5개 속성별로 관리자가 사전 입력한 요약(도넛 차트 + bullet)과 해당 속성에 매핑된 개별 리뷰만 필터링해 노출
- **상담받기 버튼**: 결제·폼 없이 버튼 UI만 노출 (클릭 시 별도 동작 없음)
- **관리자 대시보드**: 병원의 오프라인 요청(이메일·전화 등)을 근거로 관리자가 로그인 후 시술 정보·가격·별점·리뷰 요약·개별 리뷰를 직접 입력·수정하면 Supabase에 자동 반영

> 이 저장소는 Next.js 15(App Router) + React 19 + TypeScript + Supabase(`@supabase/ssr`) + Tailwind CSS v3 + shadcn/ui 스타터킷을 기반으로 합니다. Supabase 쿠키 기반 인증 흐름, `profiles` 테이블, ESLint/Prettier/Husky, shadcn/ui 설정은 **이미 완료된 기반**으로 간주하고 별도 Phase에 포함하지 않습니다.
>
> **개발 순서 방침**: UI/UX를 더미 데이터로 먼저 빠르게 완성해 화면 구조와 사용자 플로우를 검증·보완한 뒤, Supabase 스키마 설계와 실제 데이터 연동을 진행합니다. 이에 따라 데이터베이스 마이그레이션·RLS 설정은 Phase 2(UI 완성) 이후인 Phase 3에서 수행합니다.

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림
- **Playwright MCP 테스트 수행 절차 (API/비즈니스 로직 Task 한정)**:
  1. 개발 서버가 실행 중인지 확인 후 `mcp__playwright__browser_navigate`로 앱 접속
  2. 구현한 기능의 핵심 Happy Path 시나리오 테스트 (정상 동작 확인)
  3. 에러 시나리오 테스트 (잘못된 입력, 권한 없음, 네트워크 오류 등)
  4. `mcp__playwright__browser_console_messages`로 콘솔 에러 없음 확인
  5. `mcp__playwright__browser_network_requests`로 API 응답 코드 및 데이터 구조 검증
  6. 테스트 결과(통과/실패 여부, 발견된 문제)를 작업 파일 "## 테스트 체크리스트"에 기록
  7. **테스트 실패 시**: 즉시 수정 후 재테스트 — 통과할 때까지 다음 단계 진행 불가

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- ✅ **Task 001: 타입 정의 및 도메인 인터페이스 설계** - 우선순위
  - [x] 도메인 타입 정의 (`Category`, `Hospital`, `TreatmentProduct`, `Review`, `ReviewAttribute`, `ReviewSummary`) — 이 단계에서는 Supabase 스키마와 무관하게 프론트엔드 전용 타입으로 정의
  - [x] 화면 조합용 파생 타입 정의 (상품 카드 뷰모델, 리뷰 요약 뷰모델, 도넛 차트 데이터 구조)
  - [x] 속성 태그 상수/enum 및 라벨 매핑 정의
  - [x] 관리자 전용 타입 정의 (`AdminProfile`, 시술 상품/리뷰 요약/개별 리뷰 CRUD 폼 뷰모델)
  - [x] Zod 스키마 정의 (관리자 CRUD 폼 검증용: 시술 상품 등록/수정, 리뷰 요약 입력, 개별 리뷰 삽입)
  - 변경 사항: `lib/types/domain.ts`, `lib/types/attribute.ts`, `lib/types/view-models.ts`, `lib/types/admin.ts`, `lib/types/index.ts`(barrel export) 신설. `zod` 패키지 설치 및 `lib/validations/product-schema.ts`, `review-summary-schema.ts`, `review-schema.ts` 작성. `npm run typecheck`, `npm run lint` 통과.

- ✅ **Task 002: 라우트 구조 및 레이아웃 골격 생성**
  - [x] App Router 전체 라우트 구조 생성: 홈(`/`), 상품 리스트(`/categories/[categoryId]`), 상품 상세(`/products/[productId]`), 리뷰 종합(`/products/[productId]/reviews`), 속성별 리뷰(`/products/[productId]/reviews/[attribute]`), 자리표시 탭(`/hospitals`, `/events`, `/mypage`)
  - [x] 관리자 전용 라우트 구조 생성: 관리자 로그인(`/admin/login`), 대시보드(`/admin`), 시술 상품 관리(`/admin/products`, `/admin/products/[productId]`), 리뷰 요약 관리(`/admin/products/[productId]/summaries`), 개별 리뷰 관리(`/admin/products/[productId]/reviews`)
  - [x] 모든 페이지의 빈 껍데기 파일 생성
  - [x] 모바일 웹 기준 공통 레이아웃 및 하단 탭 내비게이션 골격 구현 (F008 골격)
  - [x] 관리자 레이아웃 골격 구현 (일반 사용자 레이아웃과 분리된 `/admin` 전용 레이아웃)
  - 변경 사항: 일반 사용자 라우트를 `app/(main)/` 라우트 그룹으로 신설(기존 `app/page.tsx` 스타터킷 히어로/튜토리얼 제거 후 카테고리 홈 placeholder로 대체), 하단 탭 내비게이션(`components/layout/bottom-nav.tsx`) 및 `app/(main)/layout.tsx` 구현. `app/admin/layout.tsx` 및 관리자 6개 페이지 생성. 검증 과정에서 `lib/supabase/proxy.ts`의 기본 인증 가드가 신규 공개 라우트를 로그인 페이지로 리다이렉트시키는 문제와, `cacheComponents` 환경에서 `usePathname` 사용 컴포넌트가 Suspense 없이 렌더링되어 발생한 콘솔 에러를 함께 수정. 일반 사용자 8개 라우트 200 응답, 관리자 라우트는 `/admin/login`만 공개이고 나머지는 의도된 인증 보호(307) 확인, `npm run typecheck`/`lint`/Prettier 통과, 콘솔 에러 0건 확인.

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 003: 공통 컴포넌트 및 더미 데이터 유틸리티 구현**
  - shadcn/ui 기반 공통 컴포넌트 확보 (Card, Badge, Button, Tabs 등 필요한 원자 컴포넌트 추가)
  - 도넛 차트 컴포넌트 구현 (긍정/부정 비율 시각화, 리뷰 요약 전용)
  - 별점/평점 표시 컴포넌트, 가격 표시 컴포넌트(정가/할인가/할인율), 속성 태그 컴포넌트 구현
  - 더미 데이터 시드 유틸리티 작성 (카테고리 12종, 병원, 상품, 리뷰, 속성 매핑, 관리자 입력 요약 더미) — Task 001의 프론트엔드 타입에 맞춘 하드코딩 데이터

- ✅ **Task 004: 카테고리 홈 및 하단 탭 내비게이션 UI 완성 (F001, F008)**
  - [x] 12개 카테고리 아이콘+라벨 그리드 UI 구현 (Lucide React 아이콘 매핑)
  - [x] 카테고리 클릭 시 상품 리스트로 이동하는 네비게이션 연결
  - [x] 하단 탭(홈/병원/이벤트/마이페이지) UI 완성 및 활성 탭 표시
  - [x] 병원/이벤트/마이페이지 자리표시 페이지 "준비 중" 안내 UI
  - 변경 사항: `lib/constants/category-icons.ts`(iconKey → lucide-react 아이콘 하드코딩 매핑, `ATTRIBUTE_LABELS`와 동일 패턴), `components/category/category-icon-grid.tsx`(12개 카테고리 아이콘+라벨 그리드, `Category.id` 기준 `/categories/[categoryId]` 링크) 신설. `app/(main)/page.tsx`를 `dummyCategories` + `CategoryIconGrid`로 교체. `components/layout/coming-soon.tsx`(공통 준비중 컴포넌트) 신설 후 `hospitals`/`events`/`mypage` 3개 페이지에 각각 Building2/Calendar/User 아이콘과 함께 적용. `components/layout/bottom-nav.tsx`의 활성 탭 링크에 `aria-current="page"` 접근성 속성 추가. `npm run typecheck`, `npm run lint`, `npm run build` 전체 통과. Playwright MCP로 홈(12개 카테고리 렌더링 및 `/categories/cat-N` 이동), hospitals/events/mypage(준비중 UI), 하단 탭 `aria-current` 부여를 직접 확인, 콘솔 에러 0건.

- ✅ **Task 005: 시술 상품 리스트 및 상세 페이지 UI 완성 (F002, F003)**
  - [x] 상품 카드 리스트 UI: 썸네일/상품명/병원명·지역/리뷰 수/평점/정가·할인가·할인율 (더미 데이터)
  - [x] 상품 상세 UI: 옵션명·가격, VAT/마취비/사후관리비 포함 여부 뱃지, 부작용 안내 텍스트, 상세 이미지
  - [x] 평점·리뷰 개수 진입 버튼, 하단 고정 "상담받기" 버튼 UI (클릭 시 별도 동작 없는 버튼만 구현 — 폼/페이지 이동 없음)
  - [x] 반응형 및 모바일 최적화, 리스트 → 상세 네비게이션 검증
  - 변경 사항: `lib/utils/product-view-model.ts`(`buildProductCardViewModels` — 상품/병원/리뷰 더미 데이터를 조합해 병원명·지역 조회, 리뷰 수·평균 평점 집계, 할인율 반올림 파생) 신설. `components/product/product-card.tsx`(썸네일은 `public/`에 실제 이미지 자산이 없어 `ImageIcon`+`bg-muted` 플레이스홀더로 대체, `PriceDisplay`/`RatingStars` 재사용) 신설. `app/(main)/categories/[categoryId]/page.tsx`를 `dummyProducts` 카테고리 필터링 + 뷰모델 조합 + `ProductCard` 1열 리스트로 교체(상품 없을 시 안내 문구, 기존 Suspense 패턴 유지). `components/product/included-badges.tsx`(`IncludedBadges` — VAT/마취비/사후관리비 포함 여부를 `Badge`로 표시, `ATTRIBUTE_LABELS`와 동일한 라벨 상수 lookup 패턴, 전부 미포함 시 `null` 반환) 신설. `app/(main)/products/[productId]/page.tsx`를 상품 상세 UI(가격, 포함 뱃지, 부작용 안내, 리뷰 진입 링크, `sticky bottom-0` 상담받기 버튼 — `onClick` 등 이벤트 핸들러 없음, `notFound()` 처리)로 교체. `npm run typecheck`/`lint`/`build` 전체 통과. Playwright MCP로 `/categories/cat-1` 카드 리스트 → `/products/prod-1` 상세 이동 → 리뷰 진입 링크로 `/products/prod-1/reviews` 이동 → 상담받기 버튼 클릭 시 별도 동작 없음 → 존재하지 않는 `/products/prod-999` 접근 시 404(`This page could not be found.`) 확인, 콘솔 에러 0건(이미지 404 없음) 확인.

- ✅ **Task 006: 리뷰 종합 뷰 및 속성별 리뷰 필터 페이지 UI 완성 (F004, F005, F007)**
  - [x] 리뷰 종합 뷰 UI: 총 리뷰 수/평균 평점, 전체 긍정·부정 도넛 차트, 긍정·부정 bullet 요약, 속성 태그 5종, 개별 리뷰 카드 리스트, 하단 고정 버튼 (더미 데이터)
  - [x] 개별 리뷰 카드(F007) UI: 작성자 식별/평점/작성일/신고 버튼(비활성 표시)/본문
  - [x] 속성별 리뷰 필터 UI: 선택 속성명, 속성별 도넛 차트+bullet, 속성 매핑 리뷰만 필터링 노출, 속성 전환, "전체 요약 보기" 복귀 버튼
  - [x] 종합 뷰 ↔ 속성별 뷰 간 네비게이션 및 속성 전환 플로우 검증
  - 변경 사항: `lib/utils/review-summary-view-model.ts`(`buildReviewSummaryViewModel` — `ReviewSummary`를 도넛 차트/bullet용 `ReviewSummaryViewModel`로 변환, attribute가 null이면 '전체' 라벨) 신설. `components/review/review-card.tsx`(`ReviewCard` — 작성자/평점(`RatingStars`)/작성일/본문 및 비활성 신고 버튼, `onClick` 없음) 신설. `components/layout/consult-button.tsx`(`ConsultButton` — 하단 고정 상담받기 버튼 공통 컴포넌트, 이벤트 핸들러 없음) 신설 후 `app/(main)/products/[productId]/page.tsx`의 기존 인라인 sticky 버튼 블록을 이 컴포넌트로 교체(불필요해진 `Button` import 정리). `app/(main)/products/[productId]/reviews/page.tsx`(리뷰 종합 뷰: 리뷰 수/평균 평점, 전체 요약 도넛+bullet 또는 빈 상태 문구, 속성 태그 5종 링크, 리뷰 카드 리스트, `ConsultButton`)와 `app/(main)/products/[productId]/reviews/[attribute]/page.tsx`(속성별 필터 뷰: `isReviewAttributeType` 타입 가드로 라우트 파라미터를 `ReviewAttributeType`으로 안전하게 좁힘 — any/무분별한 as 단언 없음, 속성별 요약 도넛+bullet 또는 빈 상태, 매핑된 리뷰만 필터링 또는 빈 상태, "전체 요약 보기" 복귀 링크, `ConsultButton`)를 placeholder에서 완성 UI로 교체. `npm run typecheck`/`lint`/`build` 전체 통과. dev 서버 재시작(`.next` 캐시 삭제 포함) 후 Playwright MCP로 `/products/prod-1/reviews`(전체 요약 도넛 82%/18%·bullet·리뷰 3개) → 시술효과 태그 클릭 시 `/products/prod-1/reviews/effect`(90%/10%, effect 매핑 리뷰 2개) 이동 → 의료진 태그 전환 시 `/products/prod-1/reviews/medical_staff`(88%/12%, 매핑 리뷰 1개) → "전체 요약 보기" 클릭 시 `/products/prod-1/reviews` 복귀 → 요약 없는 상품 `/products/prod-4/reviews`에서 "아직 등록된 리뷰 요약이 없습니다" 빈 상태 확인 → 매핑 리뷰 없는 `/products/prod-4/reviews/price`에서 "이 속성에 매핑된 리뷰가 없습니다" 빈 상태 확인까지 전체 플로우 검증, 콘솔 에러 0건 확인.

- **Task 007: 관리자 로그인 및 대시보드 UI 완성**
  - 관리자 로그인 페이지 UI 구현 (`/admin/login`, 이메일/비밀번호 폼)
  - 관리자 대시보드 UI 구현 (`/admin`): 시술 상품 목록, 상품별 리뷰 요약/개별 리뷰 관리 진입 링크
  - 시술 상품 등록/수정 폼 UI 구현 (`/admin/products/[productId]`): 상품명, 가격(정가/할인가), 포함 항목 뱃지, 부작용 안내, 이미지, 병원/카테고리 선택 (더미 데이터 기반, 제출 처리는 더미)
  - 리뷰 요약 입력 폼 UI 구현 (`/admin/products/[productId]/summaries`): 속성 선택(전체/5개 속성), 긍정·부정 비율, bullet 목록 입력
  - 개별 리뷰 삽입/관리 폼 UI 구현 (`/admin/products/[productId]/reviews`): 작성자 식별, 평점, 작성일, 본문, 속성 태그 매핑 선택, 목록에서 수정/삭제
  - 전체 사용자 플로우(홈 → 리스트 → 상세 → 리뷰 → 속성별 리뷰)와 전체 관리자 플로우(로그인 → 대시보드 → 상품 등록 → 요약 입력 → 리뷰 삽입)가 더미 데이터로 끊김 없이 동작하는지 검증 및 UI 보완

### Phase 3: 데이터베이스 및 핵심 기능 구현 (더미 데이터 → 실제 Supabase 연동)

> Phase 2에서 검증·보완된 UI/UX를 기준으로 이 단계에서 Supabase 스키마를 확정하고 실제 데이터 연동을 진행합니다.

- **Task 008: Supabase 스키마 마이그레이션 및 RLS 정책 구축** - 우선순위
  - `categories`, `hospitals`, `treatment_products`, `reviews`, `review_attribute_tags`, `review_summaries` 테이블 마이그레이션 작성 및 적용 (Phase 2 더미 데이터 구조와 Task 001 타입 정의를 근거로 스키마 확정)
  - 외래키 관계 설정 (`treatment_products` → `hospitals`/`categories`, `reviews` → `treatment_products`, `review_attribute_tags` → `reviews`, `review_summaries` → `treatment_products`)
  - 속성 enum 타입 정의 (의료진/이용서비스/가격/시술효과/시술통증) 및 `review_summaries.attribute` nullable 처리(전체 요약은 null)
  - `profiles` 테이블에 `role` 컬럼(`admin` | `user`, 기본값 `user`) 추가 마이그레이션 작성 (기존 `handle_new_user` 트리거와의 호환 확인)
  - 신규 테이블 RLS 정책 추가 (CLAUDE.md 컨벤션 준수): 조회는 공개 SELECT 허용, INSERT/UPDATE/DELETE는 `profiles.role = 'admin'`인 인증 사용자만 허용
  - `mcp__supabase__generate_typescript_types`로 `lib/supabase/database.types.ts` 재생성, Task 001의 프론트엔드 타입을 DB 타입 기반으로 정합화

- **Task 009: 시드 데이터 준비 및 최초 관리자 계정 생성** - 우선순위
  - `categories`(12종), `hospitals`, `treatment_products` 실데이터 시드 SQL 작성 및 적용
  - `reviews` 및 `review_attribute_tags`(다대다 매핑) 시드 데이터 작성 및 적용
  - **`review_summaries` 시드 데이터 작성**: 상품별 전체 요약(attribute=null)과 5개 속성별 요약을 관리자가 직접 입력한 값 형태로 시드 (긍정/부정 비율, bullet 목록). AI 자동 생성 아님
  - 최초 관리자 계정 생성 및 해당 `profiles.role`을 `admin`으로 설정 (Supabase Auth 사용자 생성 + 마이그레이션 또는 스크립트로 role 갱신)
  - 시드 데이터가 화면 검증에 충분한지 (도넛 차트/bullet/필터링) 확인

- **Task 010: 카테고리 홈 및 상품 리스트 데이터 연동 (F001, F002)**
  - `categories` 조회로 카테고리 홈 렌더링, 더미 데이터를 실제 쿼리로 교체
  - `treatment_products` + `hospitals` 조인 조회로 카테고리별 상품 리스트 렌더링
  - 상품별 리뷰 수/평균 평점 집계 쿼리 연동
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 데이터 연동 테스트:
    - [ ] 카테고리 홈이 실제 12개 카테고리로 렌더링됨 확인
    - [ ] 카테고리 클릭 시 해당 카테고리 상품만 노출 확인
    - [ ] 존재하지 않는 카테고리 ID 접근 시 적절한 처리(빈 상태/404) 확인
    - [ ] 콘솔 에러 및 네트워크 오류 없음, 쿼리 응답 정상 확인

- **Task 011: 상품 상세 및 리뷰 데이터 연동 (F003, F004, F007)**
  - `treatment_products` 상세 조회로 옵션/가격/포함 뱃지/부작용/이미지 렌더링
  - `review_summaries`(attribute=null) 전체 요약 조회로 도넛 차트+bullet 렌더링
  - `reviews` 조회로 개별 리뷰 카드 리스트 렌더링, 총 리뷰 수/평균 평점 집계 연동
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 상세/리뷰 연동 테스트:
    - [ ] 상품 상세 정보 및 포함 뱃지 정확히 렌더링 확인
    - [ ] 전체 리뷰 요약 도넛 차트/bullet가 관리자 입력값과 일치 확인
    - [ ] 개별 리뷰 리스트 및 평균 평점/리뷰 수 정확성 확인
    - [ ] 존재하지 않는 상품 ID 접근 시 404 처리 확인
    - [ ] 콘솔 에러 및 네트워크 오류 없음 확인

- **Task 012: 속성별 리뷰 필터 데이터 연동 (F005, F007)**
  - `review_summaries`(attribute=선택 속성) 조회로 속성별 도넛 차트+bullet 렌더링
  - `review_attribute_tags` 조인으로 선택 속성에 매핑된 개별 리뷰만 필터링 조회
  - 속성 전환 및 "전체 요약 보기" 복귀 데이터 흐름 연동
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 속성 필터 테스트:
    - [ ] 속성 태그 선택 시 해당 속성 요약(관리자 입력값)으로 정확히 전환 확인
    - [ ] 선택 속성에 매핑된 리뷰만 필터링되어 노출 확인
    - [ ] 다른 속성으로 전환 및 전체 요약 복귀 정상 동작 확인
    - [ ] 매핑된 리뷰가 없는 속성 선택 시 빈 상태 처리 확인
    - [ ] 콘솔 에러 및 네트워크 오류 없음 확인

- **Task 013: 관리자 인증 및 접근 제어 구현**
  - `/admin/login`에 Supabase Auth 이메일/비밀번호 로그인 연결 (`supabase.auth.signInWithPassword`)
  - `/admin` 하위 전체 라우트에 대해 `profiles.role !== 'admin'`인 경우 접근 차단 후 `/admin/login`으로 리다이렉트하는 서버 사이드 가드 구현 (Server Component 또는 Route Handler에서 `getClaims()` 기반 확인)
  - 관리자 로그아웃 기능 연결
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 관리자 인증 테스트:
    - [ ] 관리자 계정 로그인 성공 시 `/admin` 대시보드 진입 확인
    - [ ] 일반 사용자 계정 또는 미인증 상태로 `/admin` 접근 시 로그인 페이지로 리다이렉트 확인
    - [ ] 잘못된 자격증명 입력 시 에러 메시지 확인
    - [ ] 로그아웃 후 `/admin` 재접근 시 차단 확인
    - [ ] 콘솔 에러 및 네트워크 오류 없음 확인

- **Task 014: 시술 상품 관리자 CRUD 기능 구현**
  - `/admin/products`에서 `treatment_products` 목록 조회, 신규 등록/수정/삭제를 Server Action으로 연결 (병원/카테고리 선택 포함)
  - 상품명, 가격(정가/할인가), 포함 항목 뱃지, 부작용 안내, 이미지 등 Task 007 폼 UI에 실제 INSERT/UPDATE/DELETE 연결
  - 등록·수정 즉시 일반 사용자 화면(`/products/[productId]` 등)에 반영되는지 확인 (관리자가 Supabase에 직접 접속하지 않고 폼 제출만으로 자동 반영)
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 CRUD 테스트:
    - [ ] 신규 시술 상품 등록 후 목록/상세 화면에 정상 반영 확인
    - [ ] 기존 상품 수정 시 변경 사항이 즉시 반영 확인
    - [ ] 상품 삭제 시 목록에서 제거 및 연관 리뷰 처리 확인
    - [ ] 필수값 누락 시 폼 검증 에러 확인
    - [ ] 콘솔 에러 없음, INSERT/UPDATE/DELETE 응답 상태코드 정상 확인

- **Task 015: 리뷰 요약 및 개별 리뷰 관리자 CRUD 기능 구현 (F004, F005, F007)**
  - `/admin/products/[productId]/summaries`에서 `review_summaries`(전체 요약 및 5개 속성별 요약) 입력·수정을 Server Action으로 연결
  - `/admin/products/[productId]/reviews`에서 개별 리뷰 삽입/수정/삭제 및 `review_attribute_tags` 매핑 편집을 Server Action으로 연결
  - 입력한 요약·리뷰가 일반 사용자 화면(리뷰 종합 뷰, 속성별 리뷰 필터)에 자동 반영되는지 확인
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 리뷰 관리 테스트:
    - [ ] 리뷰 요약(전체/속성별) 입력 후 사용자 화면 도넛 차트/bullet에 정상 반영 확인
    - [ ] 개별 리뷰 삽입 후 리뷰 리스트 및 평균 평점/리뷰 수에 정상 반영 확인
    - [ ] 리뷰의 속성 태그 매핑 변경 시 속성별 필터 결과에 정상 반영 확인
    - [ ] 리뷰 삭제 시 목록 및 집계에서 정상 제외 확인
    - [ ] 콘솔 에러 없음, 관련 API 응답 상태코드 정상 확인

- **Task 016: 핵심 사용자·관리자 여정 통합 테스트**
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 사용한 전체 여정 E2E 테스트:
    - [ ] 일반 사용자: 카테고리 홈 → 상품 리스트 → 상품 상세 → 리뷰 종합 → 속성별 리뷰 → 상담받기 버튼(무동작 확인) 전체 플로우
    - [ ] 하단 탭 내비게이션(홈/자리표시 탭) 이동 정상 동작 확인
    - [ ] 관리자: 로그인 → 시술 상품 등록/수정 → 리뷰 요약 입력 → 개별 리뷰 삽입 → 사용자 화면에서 즉시 반영 확인까지 전체 플로우
    - [ ] 에러/엣지 케이스: 빈 리뷰 상품, 매핑 없는 속성, 잘못된 ID, 관리자 권한 없는 접근 등
    - [ ] 모바일/반응형 환경에서 사용자 주요 플로우 동작 확인

### Phase 4: 마무리 및 배포

- **Task 017: 품질 점검 및 배포 준비**
  - `npm run lint` / `npm run typecheck` / `npm run format:check` 전체 통과 확인
  - Supabase advisor(`get_advisors`)로 신규 테이블 및 `profiles.role` 기반 RLS/보안 경고 점검 및 해소
  - 빈 상태/로딩 상태/에러 상태 UI 마무리 (사용자·관리자 화면 모두), 이미지 최적화
  - Vercel 배포 설정 및 환경 변수 구성, 배포 후 스모크 테스트 (사용자 플로우 + 관리자 로그인/CRUD 플로우)

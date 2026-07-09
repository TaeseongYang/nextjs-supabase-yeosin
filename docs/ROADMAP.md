# 소다랩(SoDA LAB) 개발 로드맵

의료 미용 시술을 카테고리별로 탐색·비교하고, 속성별 리뷰 요약을 통해 신뢰도 높은 판단을 돕는 모바일 웹 서비스.

## 개요

소다랩은 미용 시술을 알아보는 일반 소비자를 위한 시술 비교 서비스로 다음 기능을 제공합니다:

- **카테고리 기반 탐색**: 12개 시술 카테고리 아이콘 그리드로 서비스에 진입하고 관심 시술을 선택
- **병원별 상품 비교**: 카테고리 내 병원 상품을 가격·평점·리뷰 수와 함께 카드로 비교
- **속성별 리뷰 요약(핵심 차별점)**: 의료진/이용서비스/가격/시술효과/시술통증 5개 속성별로 관리자가 사전 입력한 요약(도넛 차트 + bullet)과 해당 속성에 매핑된 개별 리뷰만 필터링해 노출
- **상담받기 버튼**: 결제·폼 없이 버튼 UI만 노출 (클릭 시 별도 동작 없음)
- **관리자 대시보드**: 병원의 오프라인 요청(이메일·전화 등)을 근거로 관리자가 `/admin`에서 시술 정보·가격·별점·리뷰 요약·개별 리뷰를 직접 입력·수정하면 Supabase에 자동 반영 (실험용 플랫폼 특성상 관리자 인증 없이 접근 가능)
- **실험 참여자 인적사항 입력**: 개발 완료 후 진행할 사용자 실험을 위해, 앱 첫 진입 시(`/`) 이름을 제외한 성별·나이·온라인 시술 정보 검색/구매 경험을 입력받는 화면을 항상 노출 (저장 로직 없이 UI만 구현, 제출 후 카테고리 홈(`/categories`)으로 이동)

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
  - [x] 관리자 전용 라우트 구조 생성: 대시보드(`/admin`), 시술 상품 관리(`/admin/products`, `/admin/products/[productId]`), 리뷰 요약 관리(`/admin/products/[productId]/summaries`), 개별 리뷰 관리(`/admin/products/[productId]/reviews`) — 관리자 로그인 라우트는 이후 Task 007에서 인증 없는 실험용 플랫폼으로 방향이 확정되며 제거됨
  - [x] 모든 페이지의 빈 껍데기 파일 생성
  - [x] 모바일 웹 기준 공통 레이아웃 및 하단 탭 내비게이션 골격 구현 (F008 골격)
  - [x] 관리자 레이아웃 골격 구현 (일반 사용자 레이아웃과 분리된 `/admin` 전용 레이아웃)
  - 변경 사항: 일반 사용자 라우트를 `app/(main)/` 라우트 그룹으로 신설(기존 `app/page.tsx` 스타터킷 히어로/튜토리얼 제거 후 카테고리 홈 placeholder로 대체), 하단 탭 내비게이션(`components/layout/bottom-nav.tsx`) 및 `app/(main)/layout.tsx` 구현. `app/admin/layout.tsx` 및 관리자 6개 페이지 생성. 검증 과정에서 `lib/supabase/proxy.ts`의 기본 인증 가드가 신규 공개 라우트를 로그인 페이지로 리다이렉트시키는 문제와, `cacheComponents` 환경에서 `usePathname` 사용 컴포넌트가 Suspense 없이 렌더링되어 발생한 콘솔 에러를 함께 수정. 일반 사용자 8개 라우트 200 응답, 관리자 라우트는 `/admin/login`만 공개이고 나머지는 의도된 인증 보호(307) 확인, `npm run typecheck`/`lint`/Prettier 통과, 콘솔 에러 0건 확인. (※ 이 검증 스냅샷은 Task 002 당시 상태로, 이후 Task 007에서 관리자 인증이 없는 실험용 플랫폼으로 방향이 확정되어 `/admin/login`은 삭제되고 `/admin` 하위 전체가 공개 경로로 변경됨 — 아래 Task 007 참고.)

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- ✅ **Task 003: 공통 컴포넌트 및 더미 데이터 유틸리티 구현**
  - [x] shadcn/ui 기반 공통 컴포넌트 확보 (Card, Badge, Button, Tabs 등 필요한 원자 컴포넌트 추가)
  - [x] 도넛 차트 컴포넌트 구현 (긍정/부정 비율 시각화, 리뷰 요약 전용)
  - [x] 별점/평점 표시 컴포넌트, 가격 표시 컴포넌트(정가/할인가/할인율), 속성 태그 컴포넌트 구현
  - [x] 더미 데이터 시드 유틸리티 작성 (카테고리 12종, 병원, 상품, 리뷰, 속성 매핑, 관리자 입력 요약 더미) — Task 001의 프론트엔드 타입에 맞춘 하드코딩 데이터
  - 변경 사항: `components/charts/donut-chart.tsx`(긍정/부정 2분류 SVG 도넛 차트), `components/product/rating-stars.tsx`, `components/product/price-display.tsx`, `components/product/attribute-tag.tsx` 신설. `lib/dummy-data/`(`categories.ts` 12종, `hospitals.ts`, `products.ts`, `reviews.ts`, `review-summaries.ts`, `index.ts` barrel export)로 더미 데이터 구축. 이후 세션에서 카테고리 홈 진입 순서를 제모(cat-9) 우선으로 조정하고, 제모 상품(`prod-17`, `prod-18`)과 해당 리뷰·리뷰 요약(전체+5속성 세트)을 `prod-1`과 동일한 패턴으로 보강해 제모 카테고리도 리뷰 요약 UI 검증이 가능하도록 확장.

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

- ✅ **Task 007: 관리자 대시보드 UI 완성**
  - [x] 관리자 대시보드 UI 구현 (`/admin`): 시술 상품 목록(테이블), 상품별 리뷰 요약/개별 리뷰 관리 진입 링크
  - [x] 시술 상품 등록/수정 폼 UI 구현 (`/admin/products/[productId]`): 상품명, 가격(정가/할인가), 포함 항목 뱃지, 부작용 안내, 이미지, 병원/카테고리 선택 (더미 데이터 기반, 제출 처리는 더미)
  - [x] 리뷰 요약 입력 폼 UI 구현 (`/admin/products/[productId]/summaries`): 속성 선택(전체/5개 속성), 긍정·부정 비율, bullet 목록 입력
  - [x] 개별 리뷰 삽입/관리 폼 UI 구현 (`/admin/products/[productId]/reviews`): 작성자 식별, 평점, 작성일, 본문, 속성 태그 매핑 선택, 목록에서 수정/삭제
  - [x] 전체 사용자 플로우(홈 → 리스트 → 상세 → 리뷰 → 속성별 리뷰)와 전체 관리자 플로우(대시보드 → 상품 등록 → 요약 입력 → 리뷰 삽입)가 더미 데이터로 끊김 없이 동작하는지 검증 및 UI 보완
  - [x] 관리자 로그인 제거 및 전체 화면 레이아웃 전환: 실험용 플랫폼 특성상 관리자 인증이 불필요하다고 판단해 더미 로그인 폼/페이지를 완전히 삭제하고 `/admin` 진입 시 바로 대시보드가 보이도록 변경. 관리자 레이아웃도 일반 사용자용 모바일 폭(`max-w-md`) 제한을 없애고 전체 화면 폭을 쓰도록 전환
  - [x] 넓어진 화면에 맞춘 관리자 UI 재구성: 대시보드 상품 목록을 카드 리스트에서 `Table` 컴포넌트 기반 표로 교체, 상품 등록/수정 폼의 카테고리·병원·가격 등 필드를 2열 그리드로 배치해 입력 폼 세로 길이 단축
  - 변경 사항: `components/admin/product-form.tsx`(`productSchema` 검증, shadcn Select/Textarea 신규 설치), `components/admin/review-summary-form.tsx` + `components/admin/bullet-list-input.tsx`(전체+5속성 탭 전환, `DonutChart` 실시간 미리보기, `reviewSummarySchema` 검증 + 비율 합 100 초과 커스텀 체크), `components/admin/review-manage-list.tsx` + `components/admin/review-form.tsx`(리뷰 목록 수정/삭제, 신규 추가, `reviewSchema` 검증) 신설. `app/admin/page.tsx`, `app/admin/products/[productId]/page.tsx`, `app/admin/products/[productId]/summaries/page.tsx`, `app/admin/products/[productId]/reviews/page.tsx` placeholder를 실제 UI로 교체(상품/요약/리뷰 페이지는 `notFound()` 처리 포함). 검증 과정에서 `lib/supabase/proxy.ts`의 `publicPathPrefixes`에 `/admin`을 추가해 인증 미들웨어가 `/admin`을 `/auth/login`으로 리다이렉트시키는 문제를 해소. 이후 관리자 인증을 사용하지 않는 실험용 플랫폼으로 방향을 확정하여, 애초에 더미로만 존재하던 `app/admin/login/page.tsx`·`components/admin/admin-login-form.tsx`를 삭제하고 `/admin`을 항상 공개 경로로 유지. 후속 세션에서 `app/admin/layout.tsx`의 `max-w-md` 제한을 제거해 전체 화면 폭으로 전환하고, `components/ui/table.tsx`(shadcn 신규 설치)로 대시보드를 표 형태로 재구성, `product-form.tsx`의 카테고리/병원/가격 필드를 2열 그리드로 재배치, 에러 메시지 색상을 다크모드 대응 토큰(`text-destructive`)으로 통일. `npm run typecheck`/`lint`/`build` 전체 통과. Playwright MCP로 대시보드(16개 이상 상품, 표 형태) → 신규 상품 등록/제출 → 리뷰 요약 탭 전환(전체 82%/18%, 의료진 88%/12% 확인) → 개별 리뷰 추가까지 전체 관리자 플로우와, `/admin/login` 접근 시 404, 기존 일반 사용자 플로우(홈→카테고리→상품 상세→리뷰 종합→속성별 리뷰) 회귀 없음, 존재하지 않는 상품 ID 404 처리를 확인, 콘솔 에러 0건. 상세 내용은 `tasks/007-admin-ui.md` 참고. 이로써 Phase 2(UI/UX 완성)가 모두 마무리되었다.

- ✅ **Task 018: 실험 참여자 인적사항 입력 화면 구현**
  - > 이 작업은 Phase 2 완료 이후 우선순위로 추가 삽입된 작업이라 워크플로우 규칙("우선순위 작업은 마지막 완료된 작업 다음에 삽입")에 따라 번호가 008보다 큰 018로 부여되었다. 위치는 Phase 2(UI 완성)의 마지막이 맞으며, 실제 저장 로직은 Phase 3의 Supabase 연동과 함께 처리한다.
  - [x] `/`을 실험 참여자 인적사항 입력 화면으로 전환(이름 제외, 성별·나이·온라인 시술 정보 검색/구매 경험 수집), 기존 카테고리 홈(F001)은 `/categories`로 이동
  - [x] 성별·온라인 경험 선택 UI를 카드형 토글 버튼으로, 나이는 숫자 입력으로 구성한 `Card` 기반 폼 UI
  - [x] 필수값 미입력 시 zod 검증 에러 표시, 제출 성공 시 저장 없이 `/categories`로 이동
  - [x] `BottomNav` "홈" 탭이 `/categories`를 가리키도록 수정(탭 이동 중 인적사항 입력 화면이 재노출되지 않도록)
  - 변경 사항: `lib/validations/participant-schema.ts`(성별/나이/온라인 경험 zod 스키마), `lib/types/view-models.ts`에 `ParticipantFormViewModel` 추가, `components/participant/participant-info-form.tsx`(`product-form.tsx`와 동일한 `useState` + zod `safeParse` 패턴, 저장 로직 없이 UI 전용) 신설. `components/ui/radio-group.tsx` 신규 설치 후 카드형 토글 버튼으로 커스텀 스타일링. `app/(main)/page.tsx`를 인적사항 입력 화면으로 교체, 기존 카테고리 홈 내용은 `app/(main)/categories/page.tsx`로 이전. `components/layout/bottom-nav.tsx`의 "홈" 탭 href를 `/`에서 `/categories`로 변경. 이번 Task는 UI만 구현하며 Supabase/storage 등 실제 데이터 저장은 Phase 3 Supabase 연동 작업과 함께 한꺼번에 처리할 예정. `npm run typecheck`/`lint` 통과. Playwright MCP로 `/` 접속 시 폼 렌더링, 필수값 미입력 에러 표시, 정상 입력 후 `/categories` 이동, 하단 탭 "홈" 클릭 시 인적사항 화면 재노출 없이 `/categories`로 이동 확인, 콘솔 에러 0건.

### Phase 3: 데이터베이스 및 핵심 기능 구현 (더미 데이터 → 실제 Supabase 연동)

> Phase 2에서 검증·보완된 UI/UX를 기준으로 이 단계에서 Supabase 스키마를 확정하고 실제 데이터 연동을 진행합니다.
>
> **Task 013 결번 안내**: 당초 Task 013은 관리자 인증(로그인) 구현 작업으로 예약되어 있었으나, Task 007에서 이 서비스를 관리자 인증이 없는 실험용 플랫폼으로 방향을 확정하면서 해당 작업 자체가 폐기되었습니다. 이에 따라 Task 013은 결번이며 `/admin`은 항상 공개 경로로 유지됩니다(과거 계획에서 언급되던 "Task 013에서 `profiles.role` 기반 관리자 보호" 항목은 더 이상 유효하지 않음).

- ✅ **Task 008: Supabase 스키마 마이그레이션 및 RLS 정책 구축** - 우선순위
  - [x] `categories`, `hospitals`, `treatment_products`, `reviews`, `review_attribute_tags`, `review_summaries` 테이블 마이그레이션 작성 및 적용 (Phase 2 더미 데이터 구조와 Task 001 타입 정의를 근거로 스키마 확정)
  - [x] 외래키 관계 설정 (`treatment_products` → `hospitals`/`categories`, `reviews` → `treatment_products`, `review_attribute_tags` → `reviews`, `review_summaries` → `treatment_products`)
  - [x] 속성 enum 타입 정의 (의료진/이용서비스/가격/시술효과/시술통증) 및 `review_summaries.attribute` nullable 처리(전체 요약은 null)
  - [x] 신규 테이블 RLS 정책 추가 (CLAUDE.md 컨벤션 준수): 이 서비스는 관리자 인증이 없는 실험용 플랫폼이므로(Task 007에서 확정) 조회용 공개 SELECT를 허용하고, 관리자 CRUD(INSERT/UPDATE/DELETE)는 인증이 아닌 서버 측(Server Action) 신뢰 컨텍스트에서 수행하는 것을 전제로 정책을 설계 — `profiles.role` 기반 관리자 권한 분기는 도입하지 않는다
  - [x] `mcp__supabase__generate_typescript_types`로 `lib/supabase/database.types.ts` 재생성, Task 001의 프론트엔드 타입을 DB 타입 기반으로 정합화
  - 변경 사항: 마이그레이션 4건을 순차 적용해 6개 테이블(`categories`, `hospitals`, `treatment_products`, `reviews`, `review_attribute_tags`, `review_summaries`)과 `review_attribute` enum(`medical_staff`/`service`/`price`/`effect`/`pain`, `lib/types/attribute.ts`의 `REVIEW_ATTRIBUTES`와 순서 일치 확인)을 생성. `treatment_products.category_id`/`hospital_id`는 `on delete restrict`, `reviews`/`review_summaries`의 `product_id`와 `review_attribute_tags.review_id`는 `on delete cascade`(상품 삭제 시 연쇄 삭제 확정 정책). `review_summaries`는 단순 `unique` 제약 대신 부분 unique 인덱스 2개(`uq_review_summaries_attr`: `attribute is not null`, `uq_review_summaries_all`: `attribute is null`)로 `(product_id, attribute)` 유일성을 보장(Postgres에서 NULL은 서로 다르게 취급되어 단순 unique로는 전체 요약 중복을 막지 못함). `treatment_products`/`review_summaries`의 `updated_at`은 기존 `handle_updated_at()` 트리거 함수(프로필 마이그레이션에서 정의된 범용 함수)를 재사용해 자동 갱신. RLS는 6개 테이블 모두 활성화하고 `anon`/`authenticated`에 공개 SELECT 정책만 부여했으며 INSERT/UPDATE/DELETE 정책은 의도적으로 만들지 않음(Postgres RLS 기본 거부 원칙 — 관리자 쓰기는 Task 014/015에서 `service_role` 서버 전용 클라이언트로 별도 처리 예정). 마이그레이션 파일 4개(`supabase/migrations/20260708133330_create_review_attribute_enum_and_base_tables.sql` 외 3건)를 원격 적용과 동일한 내용으로 로컬에도 생성해 정합성 확보. `mcp__supabase__generate_typescript_types`로 `lib/supabase/database.types.ts` 재생성해 6개 테이블 Row/Insert/Update 타입과 `Enums.review_attribute` 반영 확인. `get_advisors` 점검 결과 신규 테이블/정책에 대한 경고 없음(기존 `handle_new_user`/`handle_updated_at` SECURITY DEFINER 함수 및 Auth 설정 관련 경고는 이번 작업 범위 밖). execute_sql로 enum 오탈자 거부(`22P02`), 체크 제약(`discount_not_greater_than_original`) 위반 거부, 부분 unique 인덱스 2종 위반 거부(`23505`), `updated_at` 트리거 자동 갱신을 모두 실측 검증(테스트 데이터는 검증 후 삭제).

- ✅ **Task 009: 시드 데이터 준비** - 우선순위
  - [x] `categories`(12종), `hospitals`, `treatment_products` 실데이터 시드 SQL 작성 및 적용
  - [x] `reviews` 및 `review_attribute_tags`(다대다 매핑) 시드 데이터 작성 및 적용
  - [x] **`review_summaries` 시드 데이터 작성**: 상품별 전체 요약(attribute=null)과 5개 속성별 요약을 관리자가 직접 입력한 값 형태로 시드 (긍정/부정 비율, bullet 목록). AI 자동 생성 아님
  - [x] 시드 데이터가 화면 검증에 충분한지 (도넛 차트/bullet/필터링) 확인
  - 변경 사항: `lib/dummy-data/`(`categories.ts`, `hospitals.ts`, `products.ts`, `reviews.ts`, `review-summaries.ts`)의 하드코딩 더미 데이터를 SQL INSERT 시드로 변환해 마이그레이션 4건(`20260708134505_seed_categories_and_hospitals.sql`, `20260708134558_seed_treatment_products.sql`, `20260708134759_seed_reviews_and_attribute_tags.sql`, `20260708134938_seed_review_summaries.sql`)으로 순차 적용. `categories`(12종)·`hospitals`(8곳)는 자체 값만으로 INSERT. `treatment_products`(18건)는 더미 데이터의 `categoryId`/`hospitalId`(`cat-N`/`hosp-N`) 참조를 `categories.slug`/`hospitals.name` 서브쿼리로 재조회해 실제 UUID로 치환(모든 행 `category_id`/`hospital_id` not null 검증 완료). `reviews`(22건)는 `product_id`를 `treatment_products.name` 서브쿼리로 재조회하되, 더미 데이터의 `rev-N` id가 이후 `review_attribute_tags`(42건, 다대다 매핑) 시드에서 재사용돼야 해서 `INSERT ... RETURNING`을 세션 범위 `temp table`(`_review_id_map`)에 적재한 뒤 같은 마이그레이션 파일 안에서 함께 조인 처리(파일을 분리하면 temp table이 사라지므로 reviews와 attribute_tags를 반드시 한 트랜잭션으로 묶음). `review_summaries`(36건)는 prod-1/2/3/12/17/18 6개 상품만 전체 요약(`attribute` null)과 5개 속성별 요약을 갖춘 세트로 시드하고 나머지 12개 상품은 의도적으로 요약을 비워 '요약 없음' 빈 상태 UI를 검증할 수 있게 함. prod-13~16(모발이식/치아미백/울쎄라/인모드)은 의도적으로 리뷰를 넣지 않아 '리뷰 없음' 빈 상태도 함께 검증 가능. `apply_migration`으로 원격에 반영한 직후 동일 SQL 내용으로 로컬 `supabase/migrations/`에도 파일을 생성했으며, 로컬 파일명 타임스탬프를 `list_migrations`가 반환한 실제 원격 버전 번호와 일치시켜 원격-로컬 정합성을 확보. 최종 건수 실측 검증: `categories`=12, `hospitals`=8, `treatment_products`=18, `reviews`=22, `review_attribute_tags`=42, `review_summaries`=36(모두 원본 더미 데이터 건수와 일치), 상품별 리뷰 수 분포(prod-1/17: 3건, prod-2/3/12/18: 2건, 그 외 8개 상품: 1건, prod-13~16: 0건)와 `review_summaries`의 상품별 6건(전체+5속성) 분포까지 원본과 일치 확인. `positive_ratio + negative_ratio > 100`인 행 0건 확인. `get_advisors(security)` 점검 결과 이번 시드 작업으로 인한 신규 경고 없음(기존 `handle_new_user`/`handle_updated_at`/`rls_auto_enable` SECURITY DEFINER 함수 및 Auth leaked password protection 경고는 Task 008 때와 동일하게 이번 작업 범위 밖).

- ✅ **Task 010: 카테고리 홈 및 상품 리스트 데이터 연동 (F001, F002)**
  - [x] `categories` 조회로 카테고리 홈 렌더링, 더미 데이터를 실제 쿼리로 교체
  - [x] `treatment_products` + `hospitals` 조인 조회로 카테고리별 상품 리스트 렌더링
  - [x] 상품별 리뷰 수/평균 평점 집계 쿼리 연동
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 데이터 연동 테스트:
    - [x] 카테고리 홈이 실제 12개 카테고리로 렌더링됨 확인
    - [x] 카테고리 클릭 시 해당 카테고리 상품만 노출 확인
    - [x] 존재하지 않는 카테고리 ID 접근 시 적절한 처리(빈 상태/404) 확인
    - [x] 콘솔 에러 및 네트워크 오류 없음, 쿼리 응답 정상 확인
  - 변경 사항: `lib/queries/categories.ts`(`getCategories`, `getCategoryById`)와 `lib/queries/products.ts`(`getProductsByCategory` — 상품 조회 후 `hospitalId`/`productId` 집합으로 `hospitals`/`reviews`를 병렬 조회해 조합) 신설. 두 쿼리 함수 모두 잘못된 형식의 uuid로 조회 시 PostgREST가 던지는 Postgres 에러를 "존재하지 않음"으로 취급해 각각 `null`/빈 배열을 반환하도록 처리 — 실측 결과 애초 계획서에 가정했던 `22P03`이 아니라 `22P02`(`invalid_text_representation`, 메시지: `invalid input syntax for type uuid`)였으며, 이 값으로 분기 처리해 예외가 페이지까지 전파되지 않도록 함(Node 스크립트로 `@supabase/supabase-js` 실제 응답을 직접 실행해 확인). `app/(main)/categories/page.tsx`를 async Server Component로 전환해 `dummyCategories` import를 제거하고 `getCategories()` 호출로 교체. `app/(main)/categories/[categoryId]/page.tsx`는 `dummyCategories.find`를 `getCategoryById(categoryId)` + `notFound()`(category가 null일 때, 기존 "카테고리" fallback 제목 + 빈 상품 문구 방식을 폐기하고 `app/(main)/products/[productId]/page.tsx`의 기존 `notFound()` 패턴에 맞춤)로, `dummyProducts.filter` + 수동 조합을 `getProductsByCategory(categoryId)` 호출로 교체하고 기존 `buildProductCardViewModels(products, hospitals, reviews)`(`lib/utils/product-view-model.ts`, 시그니처 변경 없이 그대로 재사용)에 결과를 전달. 두 페이지에서 `lib/dummy-data`(`dummyCategories`, `dummyProducts`, `dummyHospitals`, `dummyReviews`) import를 완전히 제거. `npm run typecheck`/`lint` 통과. Playwright MCP로 실험 참여자 정보 입력(`/`) 제출 후 `/categories`에서 실제 12개 카테고리(UUID 기반 링크)가 렌더링됨을 확인, 제모 카테고리(`a518aaf5-4671-4eb6-ba40-049f93de09a3`) 클릭 시 해당 카테고리 상품 3건(레이저 제모 전신 패키지/고주파 부분 제모 시술/니들 제모 정밀 관리 패키지, 병원명·지역·평점·리뷰 수·가격 정상 표시)만 노출됨을 확인, 존재하지 않는 uuid(`00000000-0000-0000-0000-000000000000`)와 uuid 형식이 아닌 문자열(`invalid-id`) 모두 예외 없이 Next.js 표준 404(`This page could not be found.`)로 처리됨을 확인, `mcp__supabase__get_logs`(api)로 `categories`/`treatment_products`/`hospitals`/`reviews` 쿼리가 모두 200 응답(`invalid-id` 조회만 의도된 400)임을 확인, 콘솔 에러 0건 확인. `get_advisors(security)` 점검 결과 이번 작업으로 인한 신규 경고 없음(기존 `handle_new_user`/`handle_updated_at`/`rls_auto_enable` SECURITY DEFINER 함수 및 Auth leaked password protection 경고는 Task 008/009 때와 동일하게 이번 작업 범위 밖).

- ✅ **Task 011: 상품 상세 및 리뷰 데이터 연동 (F003, F004, F007)**
  - [x] `treatment_products` 상세 조회로 옵션/가격/포함 뱃지/부작용/이미지 렌더링
  - [x] `review_summaries`(attribute=null) 전체 요약 조회로 도넛 차트+bullet 렌더링
  - [x] `reviews` 조회로 개별 리뷰 카드 리스트 렌더링, 총 리뷰 수/평균 평점 집계 연동
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 상세/리뷰 연동 테스트:
    - [x] 상품 상세 정보 및 포함 뱃지 정확히 렌더링 확인
    - [x] 전체 리뷰 요약 도넛 차트/bullet가 관리자 입력값과 일치 확인
    - [x] 개별 리뷰 리스트 및 평균 평점/리뷰 수 정확성 확인
    - [x] 존재하지 않는 상품 ID 접근 시 404 처리 확인
    - [x] 콘솔 에러 및 네트워크 오류 없음 확인
  - 변경 사항: `lib/queries/products.ts`에 `getProductById`(`ProductWithHospital` 반환 — `treatment_products`를 `id`로 단건 조회 후 `hospitalId`로 `hospitals` 재조회해 조합, Task 010의 `getCategoryById`와 동일하게 `error.code === "22P02"`(uuid 형식 아닌 값)를 "상품 없음"으로 취급해 `null` 반환) 추가, 기존 `getProductsByCategory`는 변경 없이 유지. `lib/queries/reviews.ts`(`getReviewsByProduct` — 특정 상품의 `reviews`를 `created_at` 최신순으로 조회, 동일한 `22P02` 분기로 빈 배열 반환) 신설. `lib/queries/review-summaries.ts`(`getOverallReviewSummary` — `review_summaries`에서 `product_id` + `attribute is null` 조건으로 전체 요약만 조회, Task 008의 부분 unique 인덱스(`uq_review_summaries_all`)가 상품당 전체 요약 1개만 보장하므로 `maybeSingle()` 사용) 신설. `app/(main)/products/[productId]/page.tsx`와 `app/(main)/products/[productId]/reviews/page.tsx`의 `dummyProducts`/`dummyHospitals`/`dummyReviews`/`dummyReviewSummaries` import를 제거하고 위 3개 쿼리 함수 호출로 교체(리뷰 수/평균 평점 reduce 계산과 `buildReviewSummaryViewModel` 변환 로직 자체는 그대로 유지). `npm run typecheck`/`lint` 전체 통과. Playwright MCP로 리뷰 요약이 있는 상품("고주파 부분 제모 시술")에서 정가 250,000원→할인가 129,000원(할인율 48%), VAT 포함 뱃지만 표시, 부작용 안내 문구, 평균 평점 4.0·리뷰 3개가 정확히 렌더링됨을 확인, 리뷰 페이지에서 AI 요약 긍정/부정 bullet 문구가 DB 값("부분 제모라 시술 시간이 짧고 부담이 적다는 후기가 많아요" 등)과 정확히 일치하고 리뷰 3건이 작성일 최신순(2026-07-05→07-03→07-01)으로 정렬됨을 확인. 요약 없는 상품("눈매교정 절개 수술")의 리뷰 페이지에서 "아직 등록된 리뷰 요약이 없습니다" 빈 상태 카드 확인. 리뷰가 아예 없는 4개 상품(모발이식/치아미백/울쎄라/인모드) 중 "모발이식 M자 탈모 개선술"의 상세·리뷰 페이지 모두 에러 없이 리뷰 0개·빈 요약 상태로 정상 렌더링 확인. 존재하지 않는 uuid(`00000000-0000-0000-0000-000000000000`)와 uuid 형식이 아닌 문자열(`not-a-uuid`) 모두 상세/리뷰 페이지 양쪽에서 Next.js 표준 404 확인. `mcp__playwright__browser_console_messages`로 콘솔 에러 0건, `mcp__supabase__get_logs`(api)로 신규 쿼리(`treatment_products`/`hospitals`/`reviews`/`review_summaries`)가 모두 200 응답(`not-a-uuid` 조회만 의도된 400)임을 확인. `get_advisors(security)` 점검 결과 이번 작업으로 인한 신규 경고 없음(기존 `handle_new_user`/`handle_updated_at`/`rls_auto_enable` SECURITY DEFINER 함수 및 Auth leaked password protection 경고는 Task 008/009/010 때와 동일하게 이번 작업 범위 밖).

- ✅ **Task 019: 실험 참여자 응답 데이터 DB 저장**
  - > 이 작업은 Phase 3 진행 중 우선순위로 추가 삽입된 작업이라 워크플로우 규칙("우선순위 작업은 마지막 완료된 작업 다음에 삽입")에 따라 번호가 012보다 큰 019로 부여되었다(018은 Task 018에서 이미 사용). 위치는 Task 011 다음이 맞으며, Task 012~016 진행 전에 실험 참여자 응답 저장이 먼저 검증되어야 Task 016 통합 테스트("인적사항 입력 → 카테고리 홈" 플로우)가 실제 저장 결과까지 포함해 완결된다.
  - [x] Task 018(Phase 2)에서 UI만 구현하고 "저장 로직 없이" 미룬 실험 참여자 인적사항(성별/나이/온라인 시술 정보 검색·구매 경험)을 실제로 DB에 저장하도록 `submitParticipantInfo` 서버 액션을 확장. 기존에는 제출 완료 여부만 httpOnly 쿠키(`participant_info_submitted`)에 기록되고 응답값 자체는 버려지고 있었음 — 실험 데이터 분석 목적상 응답값 저장이 필요하다고 판단
  - [x] 신규 `participants` 테이블(FK 없는 독립 테이블) 마이그레이션 작성 및 적용. 이름 등 개인식별 정보는 계속 수집하지 않음(익명 응답)
  - [x] RLS 정책: 관리자 인증이 없는 실험용 플랫폼 원칙에 따라 이 테이블도 anon/authenticated에 어떠한 정책도 부여하지 않고(SELECT 포함), `service_role` 서버 전용 클라이언트(신규 `lib/supabase/service.ts`, Task 014/015에서도 재사용 예정)를 통해서만 Server Action 내부에서 INSERT
  - [x] 기존 zod 스키마(`lib/validations/participant-schema.ts`)와 서버 액션 구조, 쿠키 기반 재입력 방지 가드(`proxy.ts`)는 무수정 유지 — 쿠키는 "제출 여부" 플래그, DB는 "응답값 영속화"로 책임 분리
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 저장 검증 테스트:
    - [x] 정상 제출 시 `participants` 테이블에 입력값과 일치하는 행이 실제로 INSERT됨을 `execute_sql`로 확인
    - [x] 필수값 누락 시 기존 클라이언트 zod 검증 동작(서버 요청 없이 에러 표시) 유지 확인
    - [x] 제출 후 `/categories` 이동 및 재방문 시 쿠키 가드로 인적사항 화면이 재노출되지 않는 기존 동작 회귀 없음 확인
    - [x] 콘솔 에러 없음, INSERT 실패 시 일반 에러 문구(`_form`) 표시 확인
  - 변경 사항: `supabase/migrations/20260708143959_create_participants_table.sql`(FK 없는 독립 테이블, `gender`/`has_online_experience`는 각각 `check` 제약으로 허용값 제한, `age`는 `0 < age <= 120` `check` 제약, RLS 활성화만 하고 SELECT/INSERT/UPDATE/DELETE 정책은 의도적으로 전혀 만들지 않음 — anon/authenticated는 RLS 기본 거부로 완전 차단) 신설. `lib/supabase/service.ts`(`createServiceClient` — `@supabase/supabase-js`의 `createClient`를 `SUPABASE_SERVICE_ROLE_KEY`로 생성해 RLS를 우회하는 서버 전용 클라이언트, Fluid compute 고려해 전역 변수 미사용, Task 014/015 관리자 CRUD에서도 재사용 예정) 신설. `lib/actions/participant.ts`의 `submitParticipantInfo`에 zod 검증 통과 후 `createServiceClient()`로 `participants` 테이블 INSERT(camelCase `hasOnlineExperience` → snake_case `has_online_experience` 매핑) 추가, INSERT 실패 시 `{ success: false, fieldErrors: { _form: [...] } }` 반환 후 쿠키 설정/`redirect`는 INSERT 성공 시에만 실행되도록 분기, 기존 쿠키 로직·주석 스타일은 그대로 유지. `components/participant/participant-info-form.tsx`에 `fieldErrors._form` 조건부 렌더링(기존 필드 에러와 동일한 `text-sm text-destructive` 스타일, 제출 버튼 위 `submitSuccess` 문구 아래 위치) 추가. `mcp__supabase__generate_typescript_types`로 `lib/supabase/database.types.ts` 재생성해 `participants` 테이블 Row/Insert/Update 타입 반영. `npm run typecheck`/`lint` 전체 통과. Playwright MCP로 `/`에서 성별(여성)/나이(29)/온라인 경험(예) 정상 입력 후 제출 시 `/categories`로 이동하고 `execute_sql`로 `participants` 최신 행이 입력값과 정확히 일치함을 확인(`gender: female, age: 29, has_online_experience: yes`), 필수값 누락 시 서버 요청 없이 클라이언트 zod 에러만 표시되는 기존 동작 유지 확인, 쿠키 설정 상태로 `/categories`에 직접 접근 시 `/`로 리다이렉트되지 않고 정상 렌더링되어 쿠키 가드 기존 동작 회귀 없음 확인, 콘솔 에러 0건 확인. `get_logs`(api)로 `POST 201 /rest/v1/participants` 성공 확인. `get_advisors(security)` 점검 결과 `participants` 테이블에 대해 의도한 대로 `rls_enabled_no_policy`(INFO 레벨) 경고만 신규로 발생(다른 6개 테이블과 달리 SELECT 정책도 없는 것이 설계 의도이므로 별도 조치하지 않음), 그 외 경고는 기존 `handle_new_user`/`handle_updated_at`/`rls_auto_enable` SECURITY DEFINER 함수 및 Auth leaked password protection으로 Task 008/009/010/011 때와 동일하게 이번 작업 범위 밖. (※ 검증 중 `/`가 쿠키 유무와 무관하게 항상 인적사항 입력 화면을 보여주는 것을 확인했는데, 이는 Task 018에서 확정된 기존 설계이며 `proxy.ts`에는 애초에 `/`→`/categories` 자동 리다이렉트 로직이 없어 이번 작업의 회귀가 아님. 별개로 `/categories` 목록 페이지에서 `getCategories()`가 Suspense 밖에서 uncached data에 접근한다는 콘솔 경고가 있었으나, 이는 Task 010에서 이미 존재하던 이슈로 이번 Task 019 변경 범위 밖이라 손대지 않음.)

- ✅ **Task 012: 속성별 리뷰 필터 데이터 연동 (F005, F007)**
  - [x] `review_summaries`(attribute=선택 속성) 조회로 속성별 도넛 차트+bullet 렌더링
  - [x] `review_attribute_tags` 조인으로 선택 속성에 매핑된 개별 리뷰만 필터링 조회
  - [x] 속성 전환 및 "전체 요약 보기" 복귀 데이터 흐름 연동
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 속성 필터 테스트:
    - [x] 속성 태그 선택 시 해당 속성 요약(관리자 입력값)으로 정확히 전환 확인
    - [x] 선택 속성에 매핑된 리뷰만 필터링되어 노출 확인
    - [x] 다른 속성으로 전환 및 전체 요약 복귀 정상 동작 확인
    - [x] 매핑된 리뷰가 없는 속성 선택 시 빈 상태 처리 확인
    - [x] 콘솔 에러 및 네트워크 오류 없음 확인
  - 변경 사항: `lib/queries/review-summaries.ts`에 `getReviewSummaryByAttribute`(`review_summaries`에서 `product_id` + `attribute`(선택 속성) 조건으로 조회, Task 008의 부분 unique 인덱스 `uq_review_summaries_attr`가 이 조합의 유일성을 보장하므로 `maybeSingle()` 사용, 기존 `getOverallReviewSummary`는 무수정 유지) 추가. `lib/queries/reviews.ts`에 `getReviewsByProductAndAttribute`(Task 010/011부터 이어온 "명시적 다단계 쿼리" 스타일을 그대로 따라 PostgREST 중첩 조인 없이 2단계 조회 — `review_attribute_tags`에서 해당 속성의 `review_id` 목록을 먼저 조회한 뒤, `reviews`를 `product_id` + `id in()`으로 재필터링해 다른 상품의 동일 속성 태그가 섞이지 않도록 함, 기존 `getReviewsByProduct`는 무수정 유지) 추가. `app/(main)/products/[productId]/reviews/[attribute]/page.tsx`의 `dummyProducts`/`dummyReviews`/`dummyReviewSummaries` import를 제거하고 `getProductById`(Task 011, 상품 존재 확인 용도로만 사용)와 위 2개 쿼리 함수 호출로 교체(`isReviewAttributeType` 타입 가드, `buildReviewSummaryViewModel` 변환 로직, 빈 상태 분기 UI는 전부 무수정 유지). `npm run typecheck`/`lint` 전체 통과. Playwright MCP로 정상 케이스("고주파 부분 제모 시술"의 `effect` 속성: 긍정 74%/부정 26%, bullet 각 1개, 매핑 리뷰 2건이 사전 확인한 DB 값과 완전히 일치)와 빈 리뷰 케이스("레이저 제모 전신 패키지"의 `medical_staff` 속성: 요약 카드는 긍정 78%/부정 22%로 정상 표시되지만 "이 속성에 매핑된 리뷰가 없습니다" 문구 노출)를 실측 데이터와 대조해 확인. 속성 탭 전환(`medical_staff`→`service`, 82%/18%·리뷰 1건으로 정확히 갱신) 및 "전체 요약 보기" 클릭 시 `/products/[productId]/reviews` 정상 복귀 확인. 요약이 아예 없는 상품("인모드 탄력 안티에이징 리프팅")의 속성별 페이지에서 "아직 등록된 리뷰 요약이 없습니다" 빈 상태 확인. 존재하지 않는 productId(`00000000-0000-0000-0000-000000000000`) 접근 시 404, 잘못된 attribute 값(`invalid-attr`)은 `isReviewAttributeType`에서 DB 조회 없이 즉시 404 처리됨을 확인. `mcp__playwright__browser_console_messages`로 대상 페이지 콘솔 에러 0건 확인(별도 `/categories` 라우트의 `connection()` outside Suspense 경고는 Task 011에서 이미 존재하던 기존 이슈로 이번 작업 범위 밖). `mcp__supabase__get_logs`(api)로 `review_summaries`(`attribute=eq.*`)와 `review_attribute_tags`(`select=review_id&attribute=eq.*`) 신규 쿼리 및 후속 `reviews`(`id=in.(...)`) 재필터링 쿼리가 모두 200 응답임을 확인. `get_advisors(security)` 점검 결과 이번 작업으로 인한 신규 경고 없음(기존 `participants` RLS 정책 없음 INFO, `handle_new_user`/`handle_updated_at`/`rls_auto_enable` SECURITY DEFINER 함수, Auth leaked password protection 경고는 Task 008~011/019 때와 동일하게 이번 작업 범위 밖).

- ✅ **Task 014: 시술 상품 관리자 CRUD 기능 구현**
  - [x] `/admin/products`에서 `treatment_products` 목록 조회, 신규 등록/수정/삭제를 Server Action으로 연결 (병원/카테고리 선택 포함)
  - [x] 상품명, 가격(정가/할인가), 포함 항목 뱃지, 부작용 안내, 이미지 등 Task 007 폼 UI에 실제 INSERT/UPDATE/DELETE 연결
  - [x] 등록·수정 즉시 일반 사용자 화면(`/products/[productId]` 등)에 반영되는지 확인 (관리자가 Supabase에 직접 접속하지 않고 폼 제출만으로 자동 반영)
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 CRUD 테스트:
    - [x] 신규 시술 상품 등록 후 목록/상세 화면에 정상 반영 확인
    - [x] 기존 상품 수정 시 변경 사항이 즉시 반영 확인
    - [x] 상품 삭제 시 목록에서 제거 및 연관 리뷰 처리 확인
    - [x] 필수값 누락 시 폼 검증 에러 확인
    - [x] 콘솔 에러 없음, INSERT/UPDATE/DELETE 응답 상태코드 정상 확인
  - 변경 사항: `lib/queries/hospitals.ts`(`getHospitals` — 관리자 폼의 병원 선택 옵션용 전체 병원 목록 조회) 신설. `lib/queries/products.ts`에 `getAdminProductList`(`AdminProductListItem` 반환 — 상품/카테고리/병원을 Task 010~012와 동일한 명시적 다단계 쿼리로 조합) 추가, 기존 `getProductsByCategory`/`getProductById`는 무수정 유지. `lib/actions/products.ts`(신규 Server Action 파일 — `createProduct`/`updateProduct`/`deleteProduct`, Task 019의 `lib/actions/participant.ts`와 동일한 `"use server"` + zod `safeParse` + `{success:false, fieldErrors}` 반환 패턴)를 신설해 `createServiceClient()`(Task 019에서 이미 구축된 service_role 서버 전용 클라이언트, 관리자 CRUD가 인증 없는 서버 측 신뢰 컨텍스트에서 수행된다는 Task 008 RLS 설계 전제를 그대로 따름)로 INSERT/UPDATE/DELETE. `createProduct`/`updateProduct`는 성공 시 `/admin`과 관련 카테고리/상세 경로를 `revalidatePath`한 뒤 `/admin`으로 `redirect`, `deleteProduct`는 상품 삭제 후 `/admin`과 `/categories`(layout)를 재검증하고 `{success}` 객체를 반환(별도 페이지 이동 없이 클라이언트에서 처리). 상품 삭제 시 연결된 `reviews`/`review_summaries`는 애플리케이션 코드에서 별도로 지우지 않음 — Task 008에서 이미 `on delete cascade`로 DB 레벨 보장. `components/admin/delete-product-button.tsx`(신규 클라이언트 컴포넌트 — `useTransition` + `window.confirm()` 경고 다이얼로그 + `deleteProduct` 호출, 실패 시 `alert()`) 신설 후 `app/admin/page.tsx`의 각 행 액션 버튼 옆에 배치, 더미 데이터 조합 로직을 `getAdminProductList()` 호출로 교체. `app/admin/products/[productId]/page.tsx`를 `dummyProducts.find` 대신 `getCategories()`/`getHospitals()`/`getProductById()`(Task 011에서 이미 구현됨) 조합으로 교체, "new"는 기존과 동일하게 빈 폼 처리. `components/admin/product-form.tsx`를 Task 019의 `participant-info-form.tsx`와 동일한 `useTransition` + `FormData` 패턴으로 전면 전환: `dummyCategories`/`dummyHospitals` import를 제거하고 `categories`/`hospitals` props로 Select 옵션 렌더링, `handleSubmit`은 클라이언트 zod `safeParse`로 즉시 검증한 뒤 통과 시 `FormData`(boolean은 `"true"`/`"false"` 문자열, `detailImageUrls`는 `JSON.stringify`)를 구성해 `initialProduct` 유무에 따라 `createProduct`/`updateProduct`를 `startTransition` 내부에서 호출, 실패 시 `fieldErrors`(`_form` 포함)를 상태에 반영. `npm run typecheck`/`lint` 전체 통과. Playwright MCP로 신규 상품("테스트 상품 등록 검증용", 피부 카테고리) 등록 후 대시보드 목록(19건)·`/categories/[피부]`·`/products/[신규id]` 상세 페이지에 정가/할인가/VAT 뱃지/부작용 안내가 정확히 반영됨을 확인, 해당 상품을 수정해 상품명 변경과 카테고리를 피부→제모로 변경한 뒤 이전 카테고리 페이지에서 사라지고 새 카테고리 페이지에 나타나며 상세 페이지 이름도 갱신됨을 확인, 대시보드에서 삭제 버튼 클릭 시 "연결된 리뷰와 리뷰 요약도 함께 삭제됩니다" 경고가 담긴 `window.confirm()` 다이얼로그가 뜨고 확인 시 목록에서 제거되며 삭제된 상품 상세 페이지가 404로 처리됨을 확인. cascade 삭제는 별도로 리뷰 1건·리뷰 요약 1건을 가진 임시 상품을 `execute_sql`로 생성해 관리자 삭제 버튼으로 삭제한 뒤 `execute_sql`로 상품/리뷰/리뷰요약 모두 0건으로 연쇄 삭제됐음을 실측 확인. 상품명을 비운 채 제출 시 서버 요청 없이 클라이언트 zod 에러만 표시되는 기존 동작 유지 확인. `mcp__playwright__browser_console_messages`로 전 과정 콘솔 에러 0건 확인. `mcp__supabase__get_logs`(api)로 `POST 201`/`PATCH 204`/`DELETE 204` 모두 정상 응답 확인. `get_advisors(security)` 점검 결과 이번 작업으로 인한 신규 경고 없음(기존 `participants` RLS 정책 없음 INFO, `handle_new_user`/`handle_updated_at`/`rls_auto_enable` SECURITY DEFINER 함수, Auth leaked password protection 경고는 Task 008~012/019 때와 동일하게 이번 작업 범위 밖). 검증 완료 후 테스트로 생성한 상품은 관리자 삭제 기능으로 정리되어 최종 `treatment_products`=18/`reviews`=22/`review_summaries`=36/`review_attribute_tags`=42로 원본 시드 건수와 정확히 일치함을 확인.

- ✅ **Task 015: 리뷰 요약 및 개별 리뷰 관리자 CRUD 기능 구현 (F004, F005, F007)**
  - [x] `/admin/products/[productId]/summaries`에서 `review_summaries`(전체 요약 및 5개 속성별 요약) 입력·수정을 Server Action으로 연결
  - [x] `/admin/products/[productId]/reviews`에서 개별 리뷰 삽입/수정/삭제 및 `review_attribute_tags` 매핑 편집을 Server Action으로 연결
  - [x] 입력한 요약·리뷰가 일반 사용자 화면(리뷰 종합 뷰, 속성별 리뷰 필터)에 자동 반영되는지 확인
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 활용한 리뷰 관리 테스트:
    - [x] 리뷰 요약(전체/속성별) 입력 후 사용자 화면 도넛 차트/bullet에 정상 반영 확인
    - [x] 개별 리뷰 삽입 후 리뷰 리스트 및 평균 평점/리뷰 수에 정상 반영 확인
    - [x] 리뷰의 속성 태그 매핑 변경 시 속성별 필터 결과에 정상 반영 확인
    - [x] 리뷰 삭제 시 목록 및 집계에서 정상 제외 확인
    - [x] 콘솔 에러 없음, 관련 API 응답 상태코드 정상 확인
  - 변경 사항: reviews + review_attribute_tags를 원자적으로 저장하기 위한 Postgres RPC 함수 `upsert_review_with_tags`(`p_review_id`가 null이면 INSERT, 아니면 UPDATE 후 태그를 delete+insert로 재작성, `security definer` + `search_path = ''`)를 신설(마이그레이션 `20260709021411_create_upsert_review_with_tags_function.sql`). Supabase가 신규 함수 생성 시 `anon`/`authenticated`에 EXECUTE 권한을 개별 GRANT하며 `revoke ... from public`만으로는 이를 철회하지 못함을 실측으로 확인해, `anon`/`authenticated` 각각에 명시적 REVOKE를 추가하는 후속 마이그레이션(`20260709021459_revoke_upsert_review_with_tags_from_anon_authenticated.sql`)을 별도 적용 — `has_function_privilege('anon'/'authenticated', ..., 'execute')`가 `false`, `service_role`은 `true`임을 실측 검증. `lib/supabase/database.types.ts`를 `generate_typescript_types`로 재생성(`Functions.upsert_review_with_tags` 타입 추가). `lib/queries/review-summaries.ts`에 `getReviewSummariesByProduct`(상품의 전체+속성별 요약을 한 번에 조회, 관리자 탭 초기값 구성용) 추가, 기존 `getOverallReviewSummary`/`getReviewSummaryByAttribute`는 무수정 유지. `lib/queries/reviews.ts`에 `getReviewsByProductWithTags`(관리자 리뷰 관리 화면 전용 — 일반 사용자용 `getReviewsByProduct`와 달리 `review_attribute_tags`를 `review_id in()`으로 재조회해 각 리뷰에 실제 속성 태그를 매핑) 추가, 기존 `getReviewsByProduct`/`getReviewsByProductAndAttribute`는 무수정 유지. `lib/actions/review-summaries.ts`(신규 — `upsertReviewSummary`)와 `lib/actions/reviews.ts`(신규 — `saveReview`/`deleteReview`)를 Task 014의 `"use server"` + zod `safeParse` + `createServiceClient()` 패턴으로 작성. `review_summaries`는 부분 unique 인덱스(`uq_review_summaries_all`/`uq_review_summaries_attr`) 때문에 PostgREST `upsert()`의 `onConflict` 대신 select 후 update/insert로 분기하는 방식을 사용, 비율 합 100 초과는 zod 스키마 밖 커스텀 체크로 별도 차단. `saveReview`는 `upsert_review_with_tags` RPC를 호출(Supabase 생성 타입이 `p_review_id`를 실제로는 nullable인데 non-nullable `string`으로 표기하는 제약이 있어 `as unknown as string`으로 보정), `deleteReview`는 `review_attribute_tags`의 `on delete cascade`를 신뢰해 별도 태그 삭제 없이 `reviews`만 삭제. 두 액션 모두 상품 상세/리뷰 종합 뿐 아니라 속성별 페이지(`/products/[productId]/reviews/[attribute]`)까지 무효화하기 위해 `revalidatePath(.../reviews, "layout")` 사용. `app/admin/products/[productId]/summaries/page.tsx`, `app/admin/products/[productId]/reviews/page.tsx`의 `dummyProducts`/`dummyReviewSummaries`/`dummyReviews` import를 제거하고 `getProductById`/`getReviewSummariesByProduct`/`getReviewsByProductWithTags` 조합으로 교체(상품 없으면 `notFound()`). `components/admin/review-summary-form.tsx`를 탭별 독립 폼 상태(`formsByTab`)를 갖는 구조로 재작성해 `useTransition` + `upsertReviewSummary` 호출로 전환, 더미 id 생성 로직 제거. `components/admin/review-form.tsx`는 `crypto.randomUUID()` 클라이언트 ID 생성을 제거하고 `useTransition` + `saveReview(initialReview?.id ?? null, formData)` 호출로 전환, `onSubmit` prop을 `onSuccess`(콜백에서 review 객체를 받지 않음)로 변경. `components/admin/review-manage-list.tsx`는 삭제 시 `window.confirm()` 확인 후 `deleteReview` 호출, 신규/수정은 `review-form.tsx`에 위임하고 `onSuccess`에서 `router.refresh()` + 편집모드 종료만 담당하도록 단순화. `npm run typecheck`/`lint` 전체 통과. Playwright MCP로 "수분 물광 리프팅 시술" 상품 기준 6개 시나리오 모두 확인: 전체 요약 수정(82%/18%→85%/15%) 후 리뷰 종합 페이지에 정확히 반영, 속성별(의료진) 요약 수정(88%/12%→90%/10%) 후 해당 속성 페이지에 정확히 반영, 신규 리뷰 추가 후 관리자 목록·상품 상세 리뷰 목록(3건→4건, 평균 평점 4.0→4.3) 모두 반영, 기존 리뷰 수정 시 내용과 속성 태그가 정확히 갱신, 삭제 시 `confirm` 다이얼로그 노출 후 목록에서 즉시 제거, 잘못된 입력(평점 9는 `<Input max={5}>` 브라우저 네이티브 검증이 우선 차단, 빈 작성자/내용은 zod 에러 메시지 "Too small: expected string to have >=1 characters" 정상 노출, 비율 합 100 초과는 커스텀 에러 메시지 정상 노출) 모두 확인. `mcp__playwright__browser_console_messages` 콘솔 에러/경고 0건 확인. `mcp__supabase__get_logs`(api)로 `POST /rpc/upsert_review_with_tags 200`, `DELETE /reviews 204`, `PATCH /review_summaries 204` 등 전 요청 정상 응답 확인, `get_logs`(postgres)의 유일한 ERROR는 조사 과정에서 실행한 진단 쿼리 오류로 애플리케이션 코드와 무관. `get_advisors(security)` 점검 결과 신규 RPC 함수의 `anon_security_definer_function_executable` WARN은 예상된 항목(REVOKE는 `EXECUTE` 권한 자체를 제거하는 것이지 advisor의 "SECURITY DEFINER 함수가 익스포즈되어 있다"는 정적 경고 자체를 없애지 못함, 실제 호출 가능 여부는 `has_function_privilege` 실측으로 별도 확인 완료)이며 그 외 신규 경고 없음(기존 `participants` RLS 정책 없음 INFO, `handle_new_user`/`handle_updated_at`/`rls_auto_enable` SECURITY DEFINER 함수, Auth leaked password protection 경고는 Task 008~014 때와 동일하게 이번 작업 범위 밖). 테스트 중 추가·수정한 데이터는 모두 원상복구하여 최종 `reviews`=22/`review_attribute_tags`=42/`review_summaries`=36으로 원본 시드 건수와 정확히 일치함을 확인.

- ✅ **Task 016: 핵심 사용자·관리자 여정 통합 테스트**
  - **[테스트 필수 - 완료 조건]** Playwright MCP를 사용한 전체 여정 E2E 테스트:
    - [x] 일반 사용자: 인적사항 입력(`/`) → 카테고리 홈(`/categories`) → 상품 리스트 → 상품 상세 → 리뷰 종합 → 속성별 리뷰 → 상담받기 버튼(무동작 확인) 전체 플로우
    - [x] 하단 탭 내비게이션(홈/자리표시 탭) 이동 정상 동작 확인
    - [x] 관리자: `/admin` 진입(로그인 없이 바로 대시보드) → 시술 상품 등록/수정 → 리뷰 요약 입력 → 개별 리뷰 삽입 → 사용자 화면에서 즉시 반영 확인까지 전체 플로우
    - [x] 에러/엣지 케이스: 빈 리뷰 상품, 매핑 없는 속성, 잘못된 ID 등
    - [x] 모바일/반응형 환경에서 사용자 주요 플로우 동작 확인
  - 변경 사항: Task 001~015가 구축한 소다랩 서비스 전체를 Playwright MCP로 실제 브라우저 조작해 3단계(016-1/016-2/016-3)로 나눠 관통 검증. 신규 코드 구현 없이 순수 E2E 검증이며, 시작 전 baseline DB 건수(`categories`=12/`hospitals`=8/`treatment_products`=18/`reviews`=22/`review_attribute_tags`=42/`review_summaries`=36)를 기록. **016-1(일반 사용자 플로우)**: `/` 인적사항 폼(성별 여성/나이 28/온라인경험 예) 입력 후 제출 → `/categories` 이동 확인, 12개 카테고리 전부 렌더링 확인 → 제모 카테고리 → "고주파 부분 제모 시술"(리뷰 3개) 상품 상세에서 가격(250,000원)/할인율(48%)/할인가(129,000원)/VAT 포함 뱃지/부작용 안내 문구 확인 → 리뷰 종합 뷰에서 평균평점 4.0·총 3개 리뷰·AI 요약(긍정/부정 bullet)·리뷰 리스트 확인 → "시술효과" 속성 태그 클릭 시 도넛차트(긍정 74%/부정 26%)와 매핑된 리뷰 2건만 필터링되어 노출, "리뷰 종합 뷰로 돌아가기"로 정상 복귀 → 상담받기 버튼 클릭 전후 네트워크 요청 22건으로 동일(신규 요청 0건, 무동작 확인) → 하단 탭 4개(홈/병원/이벤트/마이페이지) 각각 클릭 시 정확한 URL 이동과 `aria-current="page"` 속성 부여를 `getAttribute`로 실측 확인(홈→`/categories`, 병원/이벤트/마이페이지는 "준비 중입니다" 안내 UI). **016-2(관리자 플로우 및 교차 검증)**: `/admin`에 로그인 없이 진입해 18개 상품 목록 확인 → "Task016 통합테스트 상품"(피부 카테고리, 강남서울피부과의원, 정가 200,000원/할인가 150,000원)을 신규 등록 → 대시보드 목록 반영 직후 `/categories/[skin카테고리id]`에서 신규 상품 카드(할인율 25%) 노출 확인(교차 검증 1) → 상품명을 "Task016 통합테스트 상품(수정됨)"으로 수정 후 `/products/[신규id]` 상세에 즉시 반영 확인(교차 검증 2) → `/admin/products/[신규id]/summaries`에서 전체 요약(긍정 80%/부정 20%, bullet 각 1개) 저장 후 `/products/[신규id]/reviews`에 정확히 반영 확인(교차 검증 3) → 개별 리뷰 1건(작성자 "테**", 평점 5, 속성 태그 "가격") 삽입 후 사용자 리뷰 종합 뷰(평균평점 5.0/리뷰 1개)와 `/reviews/price` 속성 필터 페이지(리뷰 리스트에 반영, 속성 요약은 미입력 상태라 "아직 등록된 리뷰 요약이 없습니다" 정상 노출)에 반영 확인(교차 검증 4) → 해당 리뷰 삭제 후 사용자 화면에서 평균평점 0.0/리뷰 0개로 정상 제외 확인 → 신규 상품을 관리자 대시보드에서 삭제 시 "이 상품을 삭제하면 연결된 리뷰와 리뷰 요약도 함께 삭제됩니다. 계속하시겠습니까?" cascade 경고 `confirm` 다이얼로그 노출 및 승인 후 목록에서 제거, `/products/[신규id]` 접근 시 404 확인 → `execute_sql`로 DB 건수가 baseline과 정확히 일치함(테스트 데이터 완전 정리) 실측. **016-3(에러/엣지 케이스, 모바일 반응형)**: 리뷰 0건 상품("모발이식 M자 탈모 개선술") 상세/리뷰 페이지에서 리뷰 0개·"아직 등록된 리뷰 요약이 없습니다" 확인, 리뷰 1건·요약 0건 상품("눈매교정 절개 수술")도 동일 문구 정상 노출(리뷰 리스트는 정상 표시), 매핑 리뷰 없는 속성("레이저 제모 전신 패키지"의 `medical_staff`, 요약 78%/22%는 노출되나 "이 속성에 매핑된 리뷰가 없습니다" 확인) 모두 정상 처리 — 존재하지 않는 productId(`00000000-0000-0000-0000-000000000000`)와 비UUID 문자열(`invalid-id`) 각각 상세/리뷰 페이지에서 404, 잘못된 attribute 파라미터(`invalid-attr`)도 404 확인 — 관리자 상품 등록 폼(빈 값 제출 시 "Too small: expected string to have >=1 characters" 클라이언트 zod 에러만 표시, 신규 네트워크 요청 0건), 리뷰 요약 폼(긍정 비율 -5 입력 시 "Too small: expected number to be >=0", 원본 값 76%/24% 그대로 유지), 개별 리뷰 폼(작성자/내용 빈 값 시 동일 패턴) 3곳 모두 서버 요청 없이 클라이언트 검증만 동작함을 네트워크 탭으로 확인 — `mcp__playwright__browser_resize`로 375×667 모바일 뷰포트 전환 후 인적사항 입력→카테고리(12개 그리드)→상품 리스트(세로 카드)→상품 상세→리뷰 종합까지 핵심 경로 재실행, 레이아웃 깨짐 없이 하단 탭 고정 노출과 상담받기 버튼 스크롤 후에도 하단 고정(sticky) 정상 동작을 스크린샷으로 확인. 전 과정 `mcp__playwright__browser_console_messages` 콘솔 에러 0건, API 응답 200(또는 204/404 의도된 상태코드) 확인. 테스트 중 개발 서버의 Jest worker 프로세스가 일시적으로 크래시해 500 에러가 1회 발생했으나 이는 Turbopack dev 서버 자체의 일시적 문제로 애플리케이션 코드 버그가 아님을 확인(서버 재시작 후 즉시 정상화되어 재현 불가, 코드 수정 없음). 최종 `execute_sql` 재확인 결과 `categories`=12/`hospitals`=8/`treatment_products`=18/`reviews`=22/`review_attribute_tags`=42/`review_summaries`=36으로 원본 시드 건수와 정확히 일치.

### Phase 4: 마무리 및 배포

- **Task 017: 품질 점검 및 배포 준비**
  - `npm run lint` / `npm run typecheck` / `npm run format:check` 전체 통과 확인
  - Supabase advisor(`get_advisors`)로 신규 테이블 RLS/보안 경고 점검 및 해소
  - 빈 상태/로딩 상태/에러 상태 UI 마무리 (사용자·관리자 화면 모두), 이미지 최적화
  - Vercel 배포 설정 및 환경 변수 구성, 배포 후 스모크 테스트 (사용자 플로우 + 관리자 CRUD 플로우)

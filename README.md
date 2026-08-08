# 소다랩 (SoDA LAB)

의료 미용 시술을 카테고리별로 탐색하고, 병원별 시술 상품의 가격·평점·리뷰를 비교한 뒤 상담을 신청할 수 있는 모바일 웹 서비스입니다. Next.js 15(App Router)와 Supabase로 구현되었습니다.

가장 큰 차별점은 **속성별 리뷰 요약**입니다. "의료진 / 이용서비스 / 가격 / 시술효과 / 시술통증" 5개 속성마다 관리자가 직접 입력해 둔 요약(bullet)과 해당 속성에 매핑된 개별 리뷰만 필터링해 보여줍니다. 이와 동시에, 리뷰 요약 화면을 사용자에게 어떤 방식으로 보여주는 것이 효과적인지 검증하기 위한 **A/B/C 실험 플랫폼**이기도 합니다.

## 실험 개요

서비스 진입 시 참여자는 간단한 인적사항(성별/나이/온라인 시술 정보 검색 경험)을 입력하고, 아래 세 가지 실험 환경 중 하나로 배정되어 이후 모든 리뷰 화면을 해당 환경으로 경험합니다.

| 그룹 | 이름   | 리뷰 종합 화면                                 | 속성별 요약 화면(`/reviews/[attribute]`) |
| ---- | ------ | ---------------------------------------------- | ---------------------------------------- |
| A    | 요약형 | 전체 요약 카드 + 속성별 키워드 태그 노출       | 접근 가능                                |
| B    | 목록형 | 요약 카드 없이 개별 리뷰 목록만 노출           | 접근 시 리뷰 종합 화면으로 리다이렉트    |
| C    | 총평형 | 전체 요약 카드만 노출(속성별 키워드 태그 숨김) | 접근 시 리뷰 종합 화면으로 리다이렉트    |

그룹 판정은 `participant_experiment_group` 쿠키를 기준으로 하며(`lib/utils/experiment-group.ts`), 관리자는 별도의 `admin_experiment_group` 쿠키로 로그인 없이 세 환경을 자유롭게 미리볼 수 있습니다(관리자 대시보드의 "실험 환경 A/B/C 보기" 버튼).

> 리뷰 요약은 화면에 "AI가 요약한 후기"로 표기되지만, MVP 단계에서는 자동 생성이 아니라 **관리자가 직접 입력·관리하는 값**입니다.

## 주요 기능

**참여자(일반 사용자) 플로우**

- 실험 참여자 정보 입력 → 실험 그룹 배정 (`/`)
- 카테고리 홈 → 카테고리별 시술 상품 리스트 → 상품 상세 (`/categories`, `/products/[productId]`)
- 리뷰 종합 화면 / 속성별 리뷰 요약 화면 (`/products/[productId]/reviews`, `/products/[productId]/reviews/[attribute]`)
- 상담 신청 버튼 (결제 연동 없이 접수까지만)
- 하단 탭 내비게이션(홈/병원/이벤트/마이페이지 — 이벤트·마이페이지는 자리만 존재)

**관리자 플로우** (`/admin`, 자체 `admin_users` 테이블 + bcrypt 기반 인증)

- 카테고리별 시술 상품 등록·수정·삭제
- 상품별 개별 리뷰 관리
- 상품별 리뷰 요약(전체 + 속성별 5종) 관리 — bullet 입력
- 실험 참여자 응답 조회·삭제
- 실험 환경 A/B/C 미리보기 전환

## 기술 스택

- **프레임워크**: Next.js 15(App Router), React 19, TypeScript
- **백엔드**: Supabase(PostgreSQL, Auth, Storage), `@supabase/ssr` 쿠키 기반 세션
- **UI**: Tailwind CSS 4, shadcn/ui(new-york), Radix UI, lucide-react, next-themes(다크모드)
- **폼/검증**: Zod
- **관리자 인증**: bcryptjs 기반 자체 세션(Supabase Auth와 별개)
- **도구**: ESLint, Prettier, Husky + lint-staged(pre-commit 자동 lint/format)

## 로컬 실행

1. [Supabase 대시보드](https://database.new)에서 프로젝트를 생성합니다.
2. `supabase/migrations/`의 마이그레이션을 적용합니다(Supabase CLI 또는 Supabase MCP 도구 사용).
3. 프로젝트 루트에 `.env.local`을 만들고 아래 값을 채웁니다.

   ```env
   NEXT_PUBLIC_SUPABASE_URL=[Supabase 프로젝트 URL]
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[Supabase publishable(anon) key]
   ```

   두 값 모두 [Supabase 프로젝트의 API 설정](https://supabase.com/dashboard/project/_?showConnect=true)에서 확인할 수 있습니다.

4. 의존성을 설치하고 개발 서버를 실행합니다.

   ```bash
   npm install
   npm run dev
   ```

   [localhost:3000](http://localhost:3000)에서 실행됩니다.

## 명령어

```bash
npm run dev           # 개발 서버 실행
npm run build         # 프로덕션 빌드
npm run start         # 프로덕션 서버 실행
npm run lint           # ESLint 검사
npm run lint:fix       # ESLint 자동 수정
npm run typecheck      # TypeScript 타입 체크 (tsc --noEmit)
npm run format         # Prettier 전체 적용
npm run format:check   # Prettier 포맷 검사만 수행
```

별도의 테스트 러너는 구성되어 있지 않습니다.

## 프로젝트 구조

`src/` 없이 루트에 `app/`, `components/`, `lib/`가 위치합니다.

- `app/` — 참여자용 페이지(`(main)/(with-nav)/`), 관리자용 페이지(`admin/`), Supabase Auth 튜토리얼 잔재(`auth/`, `protected/`)
- `components/` — `admin/`, `product/`, `review/`, `category/`, `participant/`, `layout/`(도메인별) + `ui/`(shadcn/ui 원자 컴포넌트)
- `lib/` — `actions/`(Server Actions), `queries/`(읽기 전용 조회), `types/`, `validations/`(Zod 스키마), `utils/`, `constants/`, `supabase/`(클라이언트 3종 + 타입)
- `supabase/migrations/` — SQL 마이그레이션
- `docs/` — 기획 문서(`LEANCANVAS.md`, `prd/`, `ROADMAP.md`)

아키텍처 세부사항(미들웨어가 `proxy.ts`인 이유, Supabase 클라이언트 3종의 용도 구분, 데이터베이스 RLS 패턴 등)은 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

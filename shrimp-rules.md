# AI Agent 작업 규칙 (shrimp-rules.md)

이 문서는 AI Agent가 이 저장소에서 코드를 수정/추가할 때 반드시 따라야 하는 프로젝트 전용 규칙만 담는다. Next.js, React, TypeScript, Supabase 자체의 일반 지식은 다루지 않는다. 일반적인 아키텍처 설명은 `CLAUDE.md`를 참조할 것 — 여기서는 "무엇을, 어떻게 수정해야 하는가"만 정의한다.

## 1. 디렉토리 구조 규칙

- 이 저장소는 `src/` 디렉토리를 사용하지 않는다. `app/`, `components/`, `lib/`는 모두 프로젝트 루트에 위치한다. 새 파일을 만들 때 `src/app/...` 같은 경로를 생성하지 말 것.
- import 경로 별칭은 `@/*` → 프로젝트 루트. 예: `@/lib/supabase/server`, `@/components/ui/button`.
- `docs/guides/*.md` (`project-structure.md`, `nextjs-15.md`, `component-patterns.md`, `forms-react-hook-form.md`, `styling-guide.md`)는 `src/` 기반 범용 템플릿 문서다. 이 문서들의 **경로 예시(`src/app/...` 등)를 그대로 복사하지 말 것**. 네이밍 규칙, 컴포넌트 분리 원칙, 폼 패턴 같은 "원칙"만 취하고 실제 경로는 이 저장소 구조(`app/`, `components/`, `lib/`)에 맞게 변환해서 적용한다.
- `docs/ROADMAP.md`, `docs/LEANCANVAS.md`, `docs/prd/*.md`는 제품 기획 문서다. 코드 변경 시 자동으로 갱신 대상이 아니지만, 사용자가 로드맵/PRD 갱신을 요청하면 이 경로의 파일을 수정한다.

## 2. Supabase 클라이언트 선택 규칙

파일을 생성/수정하기 전에 실행 컨텍스트를 먼저 판별하고 아래 표에 따라 정확히 하나만 사용한다. 세 클라이언트를 혼용하거나 새로운 4번째 클라이언트 생성 파일을 추가하지 말 것.

| 실행 컨텍스트                                    | 사용할 파일/함수                                                          | 비고                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Client Component (`'use client'`)                | `lib/supabase/client.ts`의 `createClient()` (`createBrowserClient`)       |                                                                                                       |
| Server Component / Route Handler / Server Action | `lib/supabase/server.ts`의 `createClient()` (async, `createServerClient`) | 매 함수 호출마다 새로 생성. 전역/모듈 스코프 변수에 캐싱 금지 (Fluid compute 대응, 파일 내 주석 참고) |
| Proxy(미들웨어)                                  | `lib/supabase/proxy.ts`의 `updateSession()` — `proxy.ts`(루트)에서 호출   | 새 미들웨어 로직 추가 시 `proxy.ts`를 만들지 말고 `lib/supabase/proxy.ts` 내부를 수정                 |

- 세 클라이언트 모두 `createServerClient`/`createBrowserClient` 제네릭에 `lib/supabase/database.types.ts`의 `Database` 타입을 반드시 전달한다. 제네릭을 생략한 새 클라이언트 생성 코드를 작성하지 말 것.
- 인증 상태 확인은 반드시 `supabase.auth.getClaims()`를 사용한다. `getUser()` 또는 `getSession()`을 새로 추가하는 코드에 쓰지 말 것 — 이 프로젝트는 구버전 API에서 `getClaims()`로 마이그레이션이 완료된 상태다.

## 3. `proxy.ts` / 미들웨어 수정 시 절대 규칙

- 이 프로젝트에서 Next.js 미들웨어 역할은 루트의 **`proxy.ts`**가 담당한다 (`middleware.ts` 파일을 별도로 만들지 말 것 — 중복 실행되거나 무시된다).
- `lib/supabase/proxy.ts`의 `updateSession()` 내부에서, `createServerClient(...)` 호출과 `const { data } = await supabase.auth.getClaims()` 호출 **사이에 그 어떤 코드도 추가하지 말 것**. 이 구간에 로직을 넣으면 세션이 랜덤하게 끊기는 버그가 재발한다.
- `updateSession()`의 반환값(`supabaseResponse`)을 그대로 반환해야 한다. 새 `NextResponse`를 만들어야 하는 경우 파일 내 주석에 명시된 4단계 절차(request 전달 → cookies 복사 → 필요한 필드만 수정 → 반환)를 그대로 따를 것. 쿠키 복사 단계를 생략하지 말 것.
- 인증이 필요 없는 경로를 추가로 열어주려면 `updateSession()` 내부의 리다이렉트 조건문(`pathname.startsWith(...)` 체크)에 조건을 추가한다. `proxy.ts`(루트)의 `matcher`는 정적 자원 제외 목적이므로, 인증 예외 경로 추가 목적으로 `matcher`를 수정하지 말 것.

## 4. 데이터베이스 변경 워크플로우

새 테이블/컬럼/함수를 추가할 때는 아래 순서를 모두 따른다. 이 중 하나라도 생략하면 안 된다.

1. `mcp__supabase__list_tables`로 기존 스키마를 먼저 확인한다.
2. `supabase/migrations/`에 새 SQL 마이그레이션 파일을 추가한다 (파일명 형식: `YYYYMMDDHHMMSS_설명.sql`, 기존 `20260706000000_create_profiles_table.sql` 참고). **기존 마이그레이션 파일 내용을 수정하지 말 것** — 이미 적용된 마이그레이션은 새 마이그레이션으로만 변경한다.
3. 새 테이블에는 반드시 다음 패턴을 적용한다 (`profiles` 테이블 참고):
   - `alter table ... enable row level security;`로 RLS 활성화
   - 본인 행만 접근 가능한 `select`/`update` 등 정책 추가
   - 트리거 함수가 필요하면 `security definer`와 `set search_path = ''`를 반드시 명시
4. `mcp__supabase__apply_migration`으로 원격에 반영한다 (원격에 직접 반영되므로 실행 전 사용자에게 확인).
5. `mcp__supabase__generate_typescript_types`로 `lib/supabase/database.types.ts`를 재생성한다. **이 파일을 손으로 직접 편집하지 말 것** — 항상 재생성 도구를 사용한다.
6. 스키마 관련 코드를 작성한 후 `mcp__supabase__get_advisors`로 보안/성능 어드바이저를 확인한다.

## 5. UI 컴포넌트 규칙

- `components/ui/`는 shadcn/ui가 생성한 원자 컴포넌트다. 이 디렉토리의 파일을 직접 대폭 수정하지 말고, 변경이 필요하면 `npx shadcn@latest add <name>`으로 재설치하는 방식을 우선 고려한다. 사소한 스타일 조정 정도만 직접 편집한다.
- `components/` 루트와 `components/tutorial/`은 이 프로젝트 고유의 조합 컴포넌트다. 새 조합 컴포넌트는 이 두 위치 중 성격에 맞는 곳에 추가한다 (범용 재사용 조합 → `components/` 루트, 튜토리얼/온보딩 전용 → `components/tutorial/`).
- 다크모드는 `next-themes` + Tailwind `class` 전략을 사용 중이다. 새 컴포넌트에 다크모드 대응 스타일을 추가할 때 `dark:` variant를 사용하고, 별도의 테마 컨텍스트나 CSS-in-JS 방식을 새로 도입하지 말 것.

## 6. 코드 품질 / 커밋 전 확인

- Git `pre-commit` 훅(Husky + lint-staged)은 staged된 파일에 대해서만 `eslint --fix` + `prettier --write`를 실행한다. **`npm run typecheck`는 훅에 포함되어 있지 않다** — 여러 파일에 걸친 변경(특히 타입 정의 변경, Supabase 타입 재생성 후)을 마친 뒤에는 커밋 전 반드시 `npm run typecheck`를 수동으로 실행해서 프로젝트 전체 타입 오류를 확인한다.
- ESLint 설정은 `next/core-web-vitals`, `next/typescript` 기반이다 (`eslint.config.mjs`). 이 설정을 완화하는 규칙 추가(예: `any` 허용, `no-unused-vars` off)는 사용자의 명시적 요청 없이 하지 말 것.

## 7. 환경 변수 관련 주의

- `.env.local`에는 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`가 필요하다. `lib/utils.ts`의 `hasEnvVars`가 두 값의 존재 여부를 체크한다.
- `hasEnvVars`가 `false`일 때 `lib/supabase/proxy.ts`의 `updateSession()`은 인증 체크를 건너뛴다 (튜토리얼 목적의 임시 우회). 인증 관련 버그를 조사할 때 이 우회 로직부터 확인할 것 — 실제 원인이 아닌데 여기서 시간을 소모하지 말고, `.env.local` 값이 설정되어 있는지 먼저 확인한다.

## 8. 금지 행동 요약

| 하지 말아야 할 것                                                       | 대신 할 것                                          |
| ----------------------------------------------------------------------- | --------------------------------------------------- |
| `middleware.ts` 신규 생성                                               | 루트 `proxy.ts` + `lib/supabase/proxy.ts` 수정      |
| Server Component에서 클라이언트를 전역 변수에 캐싱                      | 함수 내부에서 매번 `createClient()` 호출            |
| `supabase.auth.getUser()` / `getSession()` 신규 사용                    | `supabase.auth.getClaims()` 사용                    |
| `lib/supabase/database.types.ts` 수동 편집                              | `mcp__supabase__generate_typescript_types`로 재생성 |
| 기존 마이그레이션 SQL 파일 수정                                         | 새 마이그레이션 파일 추가                           |
| RLS 없이 새 테이블 생성                                                 | `enable row level security` + 정책 함께 추가        |
| `updateSession()`의 `createServerClient`~`getClaims()` 사이에 코드 삽입 | 그 구간은 그대로 두고 로직은 앞/뒤에 배치           |
| `docs/guides/*.md`의 `src/...` 경로를 그대로 복사                       | 원칙만 취하고 실제 경로는 저장소 구조에 맞게 변환   |

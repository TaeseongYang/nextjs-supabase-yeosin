# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js 15 (App Router) + Supabase 기반 스타터 킷. `@supabase/ssr`을 사용한 쿠키 기반 인증이 App Router의 Server Component, Client Component, Route Handler, Server Action, Middleware 전반에 걸쳐 동작하도록 구성되어 있다. UI는 shadcn/ui(new-york 스타일) + Tailwind CSS.

## 명령어

```bash
npm run dev           # 개발 서버 실행 (localhost:3000)
npm run build         # 프로덕션 빌드
npm run start         # 프로덕션 서버 실행
npm run lint          # ESLint 검사 (next/core-web-vitals, next/typescript)
npm run lint:fix      # ESLint 자동 수정
npm run typecheck     # TypeScript 타입 체크 (tsc --noEmit)
npm run format        # Prettier로 전체 포맷 적용
npm run format:check  # Prettier 포맷 검사만 수행
```

별도의 테스트 러너는 구성되어 있지 않다.

Git `pre-commit` 훅(Husky + lint-staged)이 staged된 `.ts/.tsx/.js/.jsx` 파일에 `eslint --fix` + `prettier --write`를, `.json/.md/.css` 등에는 `prettier --write`를 자동 실행한다(`.husky/pre-commit`, `package.json`의 `lint-staged` 필드 참고). 전체 프로젝트 타입체크(`npm run typecheck`)는 커밋 속도 때문에 훅에는 포함되지 않으며 수동 또는 CI에서 실행한다.

## 아키텍처

### 디렉토리 구조상 주의점

이 저장소는 `src/` 없이 루트에 `app/`, `components/`, `lib/`가 바로 위치한다. 경로 별칭은 `@/*` → 프로젝트 루트(`tsconfig.json`)이며, `components.json`의 별칭(`@/components`, `@/lib`, `@/components/ui`)도 동일 규칙을 따른다.

`docs/guides/` 아래 문서들(`project-structure.md`, `nextjs-15.md` 등)은 `src/` 구조를 전제로 한 범용 템플릿 가이드로, 이 저장소의 실제 구조와 다르다. 참고할 때 경로 예시는 무시하고 원칙(네이밍, 컴포넌트 분리, 폼 패턴 등)만 적용할 것.

### Middleware가 `proxy.ts`로 명명됨

Next.js의 표준 `middleware.ts` 대신 프로젝트 루트의 **`proxy.ts`**가 그 역할을 한다. 내부에서 `lib/supabase/proxy.ts`의 `updateSession()`을 호출하며, 이 함수가 Supabase 세션 쿠키 갱신과 미인증 사용자의 `/auth/login` 리다이렉트를 처리한다. `updateSession` 내부의 `createServerClient` 호출과 `supabase.auth.getClaims()` 사이에는 절대 다른 코드를 넣지 말 것 (세션이 랜덤하게 끊기는 버그의 원인이 된다 — 파일 내 주석 참고).

### Supabase 클라이언트 생성 패턴 (3가지, 용도가 다름)

- `lib/supabase/client.ts` — `createBrowserClient()`, Client Component(`'use client'`)에서 사용
- `lib/supabase/server.ts` — `createServerClient()` (async, `cookies()` 사용), Server Component/Route Handler/Server Action에서 사용. Fluid compute 환경 고려해 전역 변수에 담지 말고 함수 내부에서 매번 새로 생성
- `lib/supabase/proxy.ts` — `updateSession()`, proxy(middleware) 전용

세 클라이언트 모두 `lib/supabase/database.types.ts`의 `Database` 타입을 제네릭으로 사용한다. 스키마 변경 시 Supabase MCP의 `generate_typescript_types`로 재생성.

### 인증 흐름

- `app/auth/` 하위에 로그인/회원가입/비밀번호 재설정 등 페이지가 있고, `app/auth/confirm/route.ts`가 이메일 OTP 검증(`verifyOtp`) 후 리다이렉트를 처리
- `app/protected/`는 인증된 사용자만 접근 가능한 예시 페이지 (`proxy.ts`의 matcher가 `/auth`로 시작하지 않는 모든 경로를 보호)
- 인증 상태 확인은 `supabase.auth.getClaims()`를 사용 (구버전 `getUser()`/`getSession()` 아님)

### 데이터베이스

`supabase/migrations/`에 SQL 마이그레이션 파일 관리. 현재 `profiles` 테이블이 `auth.users`와 1:1로 연결되며, RLS로 본인 행만 조회/수정 가능하도록 제한. `auth.users`에 신규 가입 시 트리거(`handle_new_user`)가 자동으로 `profiles` 행을 생성한다. 새 테이블 추가 시 이 패턴(RLS 정책 + `security definer` 트리거 함수 + `search_path = ''`)을 따를 것.

Supabase MCP 도구(`mcp__supabase__*`)를 사용해 마이그레이션 적용, 타입 생성, 로그/어드바이저 확인이 가능하다. 스키마 변경 전 `list_tables`로 기존 구조 확인, 원격에 직접 반영되므로 `apply_migration` 신중히 사용.

### 환경 변수

`.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 필요. `lib/utils.ts`의 `hasEnvVars`로 존재 여부 체크(둘 다 없으면 proxy가 인증 체크를 건너뜀 — 튜토리얼 목적, 실제 운영 전 제거 고려).

### UI 컴포넌트

`components/ui/`는 shadcn/ui로 생성된 원자 컴포넌트(수정 시 `npx shadcn@latest add <name>`으로 재설치 고려), `components/` 루트와 `components/tutorial/`은 이 프로젝트 고유의 조합 컴포넌트. 다크모드는 `next-themes` + Tailwind `class` 전략.

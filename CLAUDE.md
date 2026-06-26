@AGENTS.md
@SPEC.md
@SETUP.md

# Landing Page Boilerplate

외주 랜딩페이지/홈페이지를 빠르게 찍어내기 위한 보일러플레이트.
섹션 템플릿, 모바일 대응, 다크모드, 애니메이션이 기본 탑재되어 있다.

> **상세 가이드**: 킥오프/섹션 조합은 SPEC.md, 셋업 체크리스트는 SETUP.md 참고

## ⚠️ 이 프로젝트(초이스 행정사)의 실제 설계 — 작업 전 `docs/` 먼저 읽기

이 저장소는 위 보일러플레이트에서 출발했지만 **실제 구조가 다르다**(예: 섹션은 `components/site/sections.tsx` 단일 파일, 디자인시스템은 `components/site/ds.tsx`). 아래 보일러플레이트 설명보다 **`docs/`의 내용을 우선**한다. 구현/리뷰 시작 전 관련 문서를 읽을 것:

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — 실제 디렉터리·데이터 모델·내비게이션·스타일·애니메이션·렌더링 구조
- **[docs/PATTERNS.md](docs/PATTERNS.md)** — 자주 하는 작업의 정해진 구현 방식(Cookbook): DS 컴포넌트, CONTACT, 새 페이지/섹션, 폼/액션, 커밋·배포
- **[docs/BLOG.md](docs/BLOG.md)** — 블로그 데이터 모델(HTML 본문)과 **관리자+Supabase 연동 로드맵**
- **[docs/BLOG-SEO.md](docs/BLOG-SEO.md)** — 블로그 SEO/AEO: 데이터 모델·JSON-LD·공개 렌더(구현됨)
- **[docs/BLOG-AUTHORING.md](docs/BLOG-AUTHORING.md)** — 어드민 작성 포맷·UX 설계(미구현, **AI 없이 + 극단적 단순함** 원칙)
- **[docs/DECISIONS.md](docs/DECISIONS.md)** — 의도적 설계 결정 & 보류 항목(되돌리지 말 것 / 재분석하지 말 것)

코드를 바꾼 뒤 위 문서의 사실이 달라지면 해당 문서도 함께 갱신한다.

## 자동 작업 모드 (중요 — 항상 적용)

**랜딩페이지/홈페이지 관련 요청이 들어오면 `.omc/skills/landing-start/SKILL.md`를 즉시 읽고 그 로직에 따라 자동으로 모드를 선택해서 실행한다. 사용자에게 모드를 물어보지 않는다.**

- 정보가 부족하면 → 자동으로 인터뷰 진행 후 구현
- 정보가 충분하면 → 자동으로 구현 시작
- 섹션이 많으면 → 자동으로 병렬 실행
- 여러 파일 에러 수정 → ultrawork
- 완성까지 반드시 → ralph

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (base-nova, neutral)
- **Icons**: Lucide React
- **Animation**: Framer Motion + `<FadeIn>` 래퍼
- **Theme**: next-themes (다크모드, class 기반)
- **Lint/Format**: Biome + lefthook (git hook 관리)
- **Type-check**: tsgo (`@typescript/native-preview`) — tsc보다 빠름
- **Package Manager**: pnpm
- **Deploy**: Vercel

## Project Structure
```
src/
  config/site.ts          # ★ 사이트 전역 설정 — 프로젝트마다 이 파일만 바꾸면 됨
  app/
    layout.tsx            # Root layout (metadata는 site.ts 참조)
    page.tsx              # Home — 섹션 컴포넌트 조합
    globals.css           # Tailwind + shadcn CSS variables
    actions/contact.ts    # Contact 폼 Server Action
    sitemap.ts / robots.ts / not-found.tsx / error.tsx
  components/
    sections/             # 랜딩 섹션 템플릿 (21종) — 파일 상단 ★ 설정만 교체
    common/               # FadeIn, FloatingCta, Marquee, GoogleAnalytics
    layout/               # Header, Footer
    ui/                   # shadcn/ui (직접 수정 X)
    providers.tsx         # ThemeProvider
  lib/utils.ts            # cn()
  lib/button-variants.ts  # buttonVariants (서버 컴포넌트에서 사용 가능한 순수 유틸)
  hooks/ / types/
```

## Commands
- `pnpm dev` — 개발 서버
- `pnpm build` — 프로덕션 빌드
- `pnpm lint` / `pnpm lint:fix` — Biome lint
- `pnpm format` — Biome 포맷팅
- `pnpm check-types` — 타입 검사 (tsgo, 빠름)
- `pnpm check-types:legacy` — tsc 기반 타입 검사 (fallback)
- `pnpm knip` — 미사용 export/import/의존성 감지 (push 전 자동 실행)

## Code Conventions

### 함수 & Export
- 화살표 함수 사용. function 선언문 금지
- named export만 사용: `export const Component = () => { ... }`
- default export 금지 (Next.js page/layout 등 프레임워크 요구 시 제외)

### TypeScript
- `type`만 사용. `interface` 금지
- 섹션 데이터 타입은 파일 상단에 인라인 정의 (별도 파일 X)
- 공유 타입만 `types/index.ts`에 추가
- `any` 금지 → `unknown` 사용
- Props 네이밍: `{컴포넌트명}Props` (e.g. `FeatureCardProps`)

### 네이밍
- 폴더: kebab-case (`common/`, `sections/`, `layout/`)
- 컴포넌트 파일: kebab-case (`feature-card.tsx`, `floating-cta.tsx`)
- 훅 파일: `use-` 접두사 + kebab-case (`use-scroll-lock.ts`)
- 유틸 파일: kebab-case (`utils.ts`, `format-date.ts`)
- Server Action 파일: kebab-case (`contact.ts`, `newsletter.ts`)
- 컴포넌트 export명: PascalCase (`FadeIn`, `FloatingCta`)
- 훅 export명: camelCase + `use` 접두사 (`useScrollLock`)
- 유틸 함수 export명: camelCase (`formatDate`, `cn`)
- 타입명: PascalCase (`ContactFormData`, `FeatureCardProps`)
- 이벤트 핸들러: `handle` 접두사 (`handleClick`, `handleSubmit`)
- Boolean: `is`/`has` 접두사 필수 (`isOpen`, `hasError`)
- 상수: `UPPER_SNAKE_CASE` (`MAX_COUNT`, `API_URL`)
- 1파일 1컴포넌트 원칙 (밀접한 서브 컴포넌트는 같은 파일 허용)

### 컴포넌트
- 서버 컴포넌트 기본. 클라이언트 상태/이벤트 필요 시에만 `"use client"`
- 불필요한 useCallback, useMemo, memo 사용 금지
- useEffect는 정말 필요할 때만
- import alias: `@/*` → `./src/*`

### 코드 스타일
- 비동기: `async/await`만 사용. `.then()` 금지
- null 체크: `??` (nullish coalescing) 우선. `||`는 boolean 로직에서만
- 조건부 렌더링: guard → `if (!x) return null`, 단순 → `{x && <C />}`, 분기 → 삼항
- 주석 언어: 한국어 기본, 억지스러운 번역은 영어 유지
- 불필요한 주석 금지 — 코드가 설명하지 못하는 의도/제약만 주석

### 링크
- 내부: `<Link href="/path">` (next/link)
- 앵커: `<a href="#section">` 또는 `buttonVariants`로 스타일링
- 외부: `target="_blank" rel="noopener noreferrer"` 필수
- **서버 컴포넌트에서 `buttonVariants` 사용 시**: `@/lib/button-variants`에서 import (ui/button.tsx는 `"use client"` 이므로 직접 import 금지)

### Server Action
- 파일 위치: `app/actions/[이름].ts`
- 첫 줄: `"use server"`
- 반환 타입: `{ success: boolean; error?: string }`
- **`useActionState` 호환 시그니처**: `(prevState: Result | null, formData: FormData) => Promise<Result>`
- 유효성 검사: 필수 필드 체크 → early return
- 에러: try/catch 감싸기, 내부 에러 메시지 노출 금지

### 폴더 구조
- `ui/` — shadcn/ui 전용. 직접 수정 금지. `pnpx shadcn@latest add [name]`으로만 추가
- `common/` — 2곳 이상에서 재사용하는 컴포넌트
- `sections/` — 랜딩 섹션 단위. 상단 데이터 배열만 교체
- `layout/` — Header, Footer
- `config/` — site.ts (사이트별 설정)

### 스타일링
- Tailwind 유틸리티 + `cn()` (`@/lib/utils`)
- 색상: CSS variable 기반 (oklch, shadcn 테마)
- 다크모드: `dark:` prefix (class 기반)
- 모바일 퍼스트: sm, md, lg 반응형 필수
- z-index 계층: `z-[100]` dialog/modal → `z-50` header → `z-40` floating CTA

### 애니메이션
- `<FadeIn>` 래퍼 사용 (`@/components/common/fade-in`)
- 스태거: `delay={i * 0.1}`
- 커스텀 필요 시 `motion` 직접 사용
- **접근성**: `useReducedMotion()` 훅으로 `prefers-reduced-motion` 감지 — FadeIn/Marquee/Stats/ParallaxHero에 내장됨

### Lint/Format
- Biome: 탭 인덴트, 더블 쿼트, 세미콜론
- Tailwind 클래스 자동 정렬: `useSortedClasses` (className, cn(), clsx(), cva() 대상)
- lefthook git hook 자동 실행
  - `pre-commit`: biome check/format (staged files만)
  - `commit-msg`: commitlint
  - `pre-push`: knip (미사용 export/import/의존성 전체 검사)
- knip 설정 (`knip.config.ts`): 섹션 템플릿/shadcn/CLI 전용 패키지는 오탐 제외 처리됨

### 환경변수
- 서버 전용: `SUPABASE_URL`, `RESEND_API_KEY` (NEXT_PUBLIC_ 붙이지 않음)
- 클라이언트 노출: `NEXT_PUBLIC_` 접두사 (GA ID, 사이트 URL 등 민감하지 않은 값만)
- `.env.example`에 모든 변수 목록 유지, `.env.local`은 gitignore

### 이미지
- `next.config.ts`에서 모든 외부 도메인 허용 (`hostname: "**"`)
- 배포 시 실제 도메인으로 제한 권장 (보안)
- 항상 `next/image` 사용

### 렌더링 전략 (SSG / ISR / SSR)

Next.js App Router의 기본값은 **SSG** (정적 생성). 대부분의 랜딩페이지는 기본값으로 충분하다.

| 케이스 | 전략 | 설정 |
|--------|------|------|
| 정적 랜딩페이지 (기본) | SSG | 별도 설정 불필요 |
| CMS 데이터 주기적 갱신 (Notion, Sanity 등) | ISR | `export const revalidate = 3600` |
| 실시간 데이터 / 사용자별 다른 콘텐츠 | SSR | `export const dynamic = "force-dynamic"` |

**ISR 예시** (`app/page.tsx` 또는 해당 route):
```ts
export const revalidate = 3600; // 1시간마다 재생성
```

**CMS 데이터를 Server Component에서 fetch하는 패턴**:
```ts
// app/page.tsx (서버 컴포넌트)
export const revalidate = 3600;

export default async function Home() {
  const data = await fetch("https://cms.example.com/api/content").then(r => r.json());
  return <Hero title={data.title} />;
}
```

섹션 컴포넌트가 데이터를 props로 받도록 설계하면 CMS 연동이 쉽다. 현재 섹션들은 파일 상단 상수(`const items = [...]`)를 수정하는 방식이지만, CMS 연동 시 props로 전환하면 된다.

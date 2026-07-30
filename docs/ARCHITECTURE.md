# 아키텍처 — 초이스 행정사 홈페이지

> 이 문서는 **실제 구현 구조**를 설명한다. 루트 `CLAUDE.md`의 "Project Structure" 예시(보일러플레이트 기준의 `sections/`·`common/`·`layout/`)와 다르니, 이 프로젝트에서는 **이 문서를 우선**한다.

## 스택
- Next.js 16 (App Router) · React 19 (stable) · TypeScript
- 스타일: **인라인 style 객체 + CSS 변수(oklch) + `globals.css` 손수 작성 클래스**. Tailwind v4가 설치돼 있지만 `components/site/`에서는 거의 쓰지 않는다(아래 "스타일 모델" 참고).
- shadcn(base-ui) `components/ui/*` — 실제로는 **Select만** 사이트에서 사용.
- 애니메이션: **CSS only**(Framer Motion 없음).
- 패키지: pnpm · Lint/Format: Biome · git hook: lefthook · 타입검사: tsgo · 배포: Vercel(GitHub 연동, `main` push → 자동 배포)

## 디렉터리 (실제)
```
src/
  app/                      # App Router
    page.tsx                # 홈(섹션 조합)
    layout.tsx              # 루트 레이아웃(Header/Footer/FloatRail/ConsultBar/Analytics)
    template.tsx            # ★ 라우트 전환마다 재마운트 → 페이지 페이드(.page-enter)
    globals.css            # ★ 테마 변수(:root/.dark) + 모든 컴포넌트 클래스
    actions/contact.ts      # 문의폼 Server Action(Supabase 저장)
    blog/page.tsx           # 블로그 목록(9/page, searchParams 페이지네이션)
    blog/[id]/page.tsx      # 블로그 상세(SSG, slug=id, .prose 본문)
    {greeting,members,credentials,location,services,reviews,faq,contact,privacy,terms}/page.tsx
    services/[id]/{page,template}.tsx
    sitemap.ts robots.ts opengraph-image.tsx not-found.tsx error.tsx loading.tsx
  components/
    site/                   # ★ 이 프로젝트의 실제 컴포넌트들
      sections.tsx          # ★ 거대 파일("use client") — 대부분의 섹션/공용 UI가 여기 있음
      header.tsx            # 메가메뉴 헤더(JS 상태 기반)
      ds.tsx                # ★ 실사용 디자인시스템: Button/Card/Badge/Input/Textarea/Label/CardTitle/CardBody
      icon.tsx              # lucide 아이콘 래퍼 <Icon n="..." />
      scroll-reveal.tsx     # data-reveal/data-stagger 스크롤 등장(IntersectionObserver)
      blog-card.tsx         # 블로그 카드(서버 컴포넌트, 내부 <Link>)
      service-detail.tsx    # 서비스 상세
      use-go.ts             # 내비게이션 훅(useGo/usePrefetch) + pathToRoute
    ui/                     # shadcn(base-ui). 직접 수정 금지. 사이트에선 Select만 사용
    common/google-analytics.tsx
    providers.tsx           # ThemeProvider(현재 light 고정)
  config/site.ts            # siteConfig(SEO/도메인/OG)
  lib/
    site-data.ts            # ★ 콘텐츠/연락처 데이터 + routePath()
    blog-data.ts            # ★ 블로그 글 데이터(BlogPost) — docs/BLOG.md 참고
    utils.ts                # cn()
  types/index.ts
```

## 데이터 모델 (단일 출처)
콘텐츠는 컴포넌트가 아니라 **`lib/`의 데이터 배열**에서 온다. UI는 데이터를 map 한다.
- `lib/site-data.ts`: `NAV`, `SERVICES`, `CONTACT`(★ 전화·휴대폰·카카오·위챗·이메일·주소·영업시간 단일 출처), `CHANNELS`(CONTACT 파생), `STATS`, `STRENGTHS`, `PROCESS`, `REVIEW_IMAGES`, `FAQ`, `VIDEOS`, `TEAM`, `CREDENTIALS`, `NAVER_BLOG`, `YOUTUBE_CHANNEL`, `routePath()`.
- `lib/blog-data.ts`: `BlogPost` 타입, `BLOG_POSTS`, `BLOG_PAGE_SIZE`, `getBlogPost(slug)`, `formatBlogDate()`.
- `config/site.ts`: `siteConfig`(name/description/url/ogImage/locale).
- **전화·주소·이메일을 새로 쓸 일이 있으면 반드시 `CONTACT`를 참조**한다(하드코딩 금지). docs/PATTERNS.md 참고.

## 내비게이션 모델
- 내부 이동은 대부분 `useGo()` → `router.push(routePath(route, param))` (버튼 `onClick`).
- `usePrefetch()`로 hover/focus 시 다음 라우트를 prefetch(헤더 메뉴).
- `routePath(route,param)`(site-data, 정방향) ↔ `pathToRoute(pathname)`(use-go, 역방향)는 짝을 이루는 매핑이다. 라우트 추가 시 **둘 다** 갱신.
- **블로그는 실제 `<Link href>`/`<a>`를 쓴다.** 신규 내부 링크는 SEO를 위해 `<Link>`를 우선 고려한다(기존 버튼 기반은 docs/DECISIONS.md의 '보류' 참고).
- 헤더(`header.tsx`)는 로고(좌) · **동일 너비 메뉴**(중앙, 캐럿 없음) · 전화+무료상담 CTA(우, 데스크탑) 구성. 하위메뉴는 **JS 상태(`openMega`)** 로 연다: hover/focus open, 클릭 시 이동+즉시 닫힘+blur, 영역 이탈 시 180ms 지연 닫힘(hover-intent), Esc 닫힘. 패널은 **단일 공유 풀폭 슬라이드다운 시트**(`position:fixed; top:80px`, `nav` 자손이라 시트 hover 중 `mouseleave` 미발생)로, **활성 메뉴의 하위만** eyebrow 라벨 + 4열 그리드(`.mega-row`)로 보여준다. 투명 헤더(홈 최상단)는 열릴 때 `.mega-open` 으로 솔리드 전환. **헤더에 `backdrop-filter` 금지**(자손 fixed 시트 기준이 어긋남).

## 스타일 모델 (중요)
- 색/간격은 `globals.css`의 **CSS 변수**(oklch). 컴포넌트는 인라인 `style={{ color: "var(--text-heading)" }}` 식으로 변수를 참조.
- **레이아웃 유틸 클래스는 손수 정의**: `.container`(max 1152), `.section`, `.grid-2/3/4`, `.contact-grid` 등 — `globals.css`에 있음. Tailwind 유틸리티 대신 이걸 쓴다.
- **재사용 컴포넌트의 hover/focus/상태는 CSS 클래스로**: `.ds-btn(-primary/outline/secondary/ghost)`, `.ds-field`, `.ds-card`, `.nav-*`, `.mega-*`, `.prose`, `.page-enter`. (JS 상태로 hover 흉내내지 말 것 — 리렌더 유발)
- 다크모드: `.dark` 변수는 정의돼 있으나 인라인에 하드코딩 색(`#fff`, `rgba(...)`)이 많아 **현재 완전 동작 안 함**. `providers.tsx`에서 light 고정. (docs/DECISIONS.md)

## 애니메이션·렌더링
- 스크롤 등장: `ScrollReveal`(layout에 1개) + 마크업의 `data-reveal`/`data-stagger`. CSS `.reveal-ready .is-visible`로 처리, `prefers-reduced-motion` 존중. **새 섹션도 `data-reveal`만 붙이면 등장 애니메이션 적용됨.**
- 페이지 전환: `app/template.tsx`(+ `services/[id]/template.tsx`)가 라우트마다 재마운트되며 `.page-enter` 페이드 재생. (React `<ViewTransition>`/Next 실험 플래그는 stable 스택 부적합이라 미사용 — docs/DECISIONS.md)
- 렌더링: 기본 SSG. 블로그 상세는 `generateStaticParams`로 SSG. 문의폼은 Server Action(`actions/contact.ts`, Supabase). 블로그 페이지네이션은 `searchParams.page`(서버에서 슬라이스).

## 검증·배포
- 커밋 전: `pnpm check-types` · `pnpm lint`(필요시 `pnpm lint:fix`) · `pnpm build`.
- pre-push에서 `knip`(미사용 export 감지)가 돈다 → 죽은 코드 남기지 말 것.
- `main` push → Vercel 자동 배포. (커밋 author 이메일이 Vercel Git 계정과 안 맞으면 **CLI `vercel deploy`는 BLOCKED** — git push 경로로 배포할 것.)

## 보안 (2026-07-30 정리)
- **본문 HTML 살균**: 블로그 상세·RSS 는 `sanitizePostHtml`(`src/lib/sanitize-post-html.ts`, 서버 전용)을 통과한 HTML만 주입한다. 허용목록은 발행글 205건 전수 조사 + 에디터가 만들 수 있는 마크업 기준이며, 도입 시 205건 모두 DOM 동일함을 검증했다. 새 에디터 기능(임베드 등)을 추가하면 이 허용목록도 함께 넓혀야 한다.
- **문의 폼 남용 방어**: 서버에서 입력 길이 상한(`LIMITS`), 허니팟 필드(`website` — 채워지면 성공처럼 응답하고 버림), IP 해시 기준 레이트리밋(10분 5건, `contact_throttle` 테이블). 레이트리밋 조회가 실패하면 **통과**시킨다(정상 문의 유실 방지).
- **CSP**: `next.config.ts` 의 `script-src` 에 `'unsafe-inline'` 이 남아 있다(GA·hydration). 이를 제거하려면 nonce + 요청별 렌더가 필요해 SSG 이점을 잃으므로, XSS 1차 방어는 위 살균으로 둔다(의도적 선택).
- 권한(RLS·회원가입 차단·스토리지)은 choice-admin/docs/ARCHITECTURE.md 의 '권한 모델' 참고.

# 아키텍처 — 초이스 행정사 홈페이지

> 이 문서는 **실제 구현 구조**를 설명한다. 루트 `CLAUDE.md`의 "Project Structure" 예시(보일러플레이트 기준의 `sections/`·`common/`·`layout/`)와 다르니, 이 프로젝트에서는 **이 문서를 우선**한다.

## 스택
- Next.js 16 (App Router) · React 19 (stable) · TypeScript
- 스타일: **Tailwind v4 유틸리티 + CSS 변수(oklch) + `globals.css`의 컴포넌트 클래스**. 인라인 `style` 은 소스에서 **0개**다(아래 "스타일 모델" 참고).
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
    {greeting,members,location,services,reviews,faq,contact,privacy,terms}/page.tsx
    [...slug]/page.tsx      # 없는 URL은 홈으로 리다이렉트(307) — 옛 링크·오타 유입 흡수
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
- **홈 후기(마퀴)는 항상 8~12개다**: `lib/review-images.ts` `getFeaturedReviewImages()` — 관리자가 고른 것(`review_images.is_featured`)을 먼저 쓰고, **8개보다 적으면 남은 노출 후기로 채우고 12개를 넘으면 자른다**. 고른 것이 0건이면 노출본 전체(최대 12개). 노출본이 8개 미만이면 있는 만큼만.
  - 왜 8~12인가: 마퀴가 짧으면 반복이 눈에 보이고, 길면 홈이 무거워진다. 관리자 화면(choice-admin `/home`)이 같은 상·하한을 강제한다(8개에서 빼기 차단 · 12개에서 추가 차단).
  - 스키마 변경 없음 — `is_featured`/`sort_order` 그대로. 순서는 후기 관리의 `sort_order`를 따른다.
- **홈 쇼츠 4칸은 DB에서 온다**: `lib/home-shorts.ts`(`home_shorts` 슬롯 1~4, 60초 `unstable_cache`) → `VideoSection shorts={...}`. 관리자(choice-admin `/home`)에서 링크를 넣어 바꾼다. DB 미설정·조회 실패·전 칸 비어 있으면 `SHORTS`(site-data) 폴백. 스키마 `supabase/migrations/0004_home_shorts.sql`.
  - **홈은 항상 4칸을 채운다.** 지정하지 않은 칸이나 영상이 죽은 칸은 **보관함(`youtube_shorts`) 최신순으로 자동 채운다** → 3개만 나오거나 빈 카드가 생기지 않는다(블로그 대표글과 같은 방식). 채우는 순서: ① 지정 칸(살아 있으면 그 자리) ② 보관함 최신순 ③ `SHORTS` 하드코딩. 그래서 공개 렌더가 보관함을 읽어야 하고, `0007_youtube_shorts_public_read.sql` 로 anon SELECT(숨김 제외)를 열었다(공개된 영상 ID·제목·발행일뿐 · 쓰기는 여전히 차단).
  - **죽은 영상은 서버에서 걸러낸다**(`isPlayable`): 카드가 쓰는 `i.ytimg.com/vi/{id}/oardefault.jpg` 를 HEAD 로 확인해 404 인 칸을 빼고 렌더한다. 관리자가 저장할 때 확인하더라도 **그 뒤에 영상이 삭제·비공개로 바뀔 수 있고**, 그대로 두면 홈에 검은 빈 카드 + 깨진 이미지 alt 텍스트가 노출된다(재생을 눌러도 유튜브 오류). 전부 죽으면 `SHORTS` 폴백. 확인 실패(네트워크)는 통과시킨다 — 멀쩡한 영상을 지우는 쪽이 더 나쁘다.
  - `oardefault.jpg` 는 **쇼츠에만 있다**(일반 영상은 404). 그래서 이 한 번의 확인으로 "존재 + 쇼츠"가 함께 검증된다. 관리자 저장 검사도 같은 URL 을 쓴다.
  - **썸네일만으로는 "재생 가능"을 알 수 없다** — 소유자가 퍼가기를 막거나 비공개로 바꾼 영상도 썸네일은 그대로 있어서 카드는 정상으로 보이고 눌렀을 때만 "동영상을 재생할 수 없음" 이 뜬다. 그래서 **oEmbed**(`youtube.com/oembed?url=…`)로 임베드 가능 여부를 함께 본다(200=가능 · 401/403=퍼가기 차단·비공개 · 400/404=없음). API 키 불필요.
  - 관리자는 이 4칸을 **보관함(`youtube_shorts`, `supabase/migrations/0006_youtube_shorts.sql`)에서 골라** 배정한다. 보관함은 관리자 전용 RLS 라 공개 렌더는 읽지 않는다 — 홈은 `home_shorts` 만 본다.
  - 관리자 "보관함 갱신"은 `app/api/youtube/shorts`(공개 RSS + `/shorts/{id}` 리다이렉트로 쇼츠 판별, API 키 없음, 10분 캐시, 어드민 오리진만 CORS 허용)를 호출한다. 채널 교체 시 `YOUTUBE_CHANNEL_ID`도 갱신.

## 내비게이션 모델
- 내부 이동은 대부분 `useGo()` → `router.push(routePath(route, param))` (버튼 `onClick`).
- `usePrefetch()`로 hover/focus 시 다음 라우트를 prefetch(헤더 메뉴).
- `routePath(route,param)`(site-data, 정방향) ↔ `pathToRoute(pathname)`(use-go, 역방향)는 짝을 이루는 매핑이다. 라우트 추가 시 **둘 다** 갱신.
- **블로그는 실제 `<Link href>`/`<a>`를 쓴다.** 신규 내부 링크는 SEO를 위해 `<Link>`를 우선 고려한다(기존 버튼 기반은 docs/DECISIONS.md의 '보류' 참고).
- 헤더(`header.tsx`)는 로고(좌) · **동일 너비 메뉴**(중앙, 캐럿 없음) · 전화+무료상담 CTA(우, 데스크탑) 구성. 하위메뉴는 **JS 상태(`openMega`)** 로 연다: hover/focus open, 클릭 시 이동+즉시 닫힘+blur, 영역 이탈 시 180ms 지연 닫힘(hover-intent), Esc 닫힘. 패널은 **단일 공유 풀폭 슬라이드다운 시트**(`position:fixed; top:80px`, `nav` 자손이라 시트 hover 중 `mouseleave` 미발생)로, **활성 메뉴의 하위만** eyebrow 라벨 + 4열 그리드(`.mega-row`)로 보여준다. 투명 헤더(홈 최상단)는 열릴 때 `.mega-open` 으로 솔리드 전환. **헤더에 `backdrop-filter` 금지**(자손 fixed 시트 기준이 어긋남).

## 스타일 모델 (중요)
- **인라인 `style` 금지.** 마크업의 스타일은 전부 Tailwind 유틸리티다(`text-[15px]`, `mt-[24px]`, `text-[color:var(--text-heading)]` …). 값은 여전히 CSS 변수를 참조한다.
- **★ Tailwind 자동 소스 탐색을 끈다**: `@import "tailwindcss" source(none);` + `@source "../";` (= `src/` 만 스캔).
  - 자동 탐색은 저장소 안 거의 모든 파일을 클래스 후보로 훑는다. 그래서 **페이지 HTML(RSC 페이로드)이 섞인 파일이 생기면 깨진 CSS 가 생성되고 빌드가 죽는다** — 실제로 3번 겪었다(`.text-[color:var(--colo"])</script>…`, Playwright 콘솔 로그가 원인).
  - `@source not "…"` 로 그 폴더만 빼는 방식은 **dev 중 새로 생긴 파일에는 안 통했다**(감시자가 다시 집어온다). 허용목록이 확실하다.
  - 전환 시 손실 없음을 확인했다: 사라진 클래스 49개 전부 `src` 밖에서 잘못 잡힌 것(문서의 "backdrop-filter 금지" 문구, `.filter(` 같은 JS 등). CSS 441KB→437KB.
  - **`src/` 밖에 클래스를 쓰는 파일을 새로 만들면 `@source` 를 한 줄 추가**해야 한다.
- **`globals.css` 전체가 `@layer components` 안에 있다.** 레이어 밖 CSS 는 특정성과 무관하게 Tailwind 유틸리티(`@layer utilities`)를 이기기 때문이다. 한 레이어에 모아두면 globals 규칙끼리의 우열은 그대로 두면서(특정성·순서) 호출부 유틸리티가 이긴다 = 예전 인라인 style 이 하던 역할.
  - **새 CSS 는 반드시 그 블록 안에** 넣는다. 밖에 두면 유틸리티가 조용히 죽는다.
  - 레이어 밖에 남는 것: `@theme`/`:root`/`.dark`(변수), `@layer base`, `@keyframes`, 전역 스크롤바, **`.prose` 계열**(본문 조판은 호출부 유틸리티를 이겨야 함).
  - 컨테이너 문맥 오버라이드(`.blog-grid .ds-card` 처럼 "특정 컨테이너 안에서만 다르게")는 컴포넌트 유틸리티를 이겨야 하므로 `!important` + `biome-ignore` 주석을 쓴다. 파일 안 사례 참고.
- **레이아웃 유틸 클래스는 손수 정의**: `.wrap`(max 1600 + 좌우 여백), `.section`, `.grid-2/3/4`, `.contact-grid` 등 — `globals.css`에 있음. 반복되는 레이아웃은 Tailwind 유틸리티 대신 이걸 쓴다.
- 회귀 검증 도구: `scripts/visual/` — `capture.mjs`(17라우트×3뷰포트 전체 스크린샷) · `diff.py`(픽셀 비교) · `geom.mjs`(요소 rect 비교) · `styles.mjs`(계산 스타일 속성별 비교) · `audit.mjs`(죽은 선언·폰트 폴백 점검) · `layerize.py`(레이어 재구성). CSS 를 손대면 **기준 빌드와 픽셀 비교**로 확인한다.
- **히어로 명암 구조 — 되돌리지 말 것**: 사진은 거의 원본 밝기로 두고(`PageHero` 는 `opacity-[0.95]`, 홈 `Hero` 는 opacity 없음), 덮개 그라디언트는 좌측 텍스트 영역만 옅게 깐다(`PageHero` `0.34`→70%에서 투명 · 홈 `Hero` `0.66`→우측 `0.03`). 글자 가독성은 **순백 + `text-shadow`**(`.page-hero-section h1`/`nav`/`.page-hero-sub` + `.home-hero-inner h1`/`p`, 전 해상도)로 따로 확보한다.
  - 예전 구조는 사진 `opacity 0.72` + 그라디언트 `0.72` 로 화면 전체를 어둡게 눌러 가독성을 얻었다. 그래서 **밝은 hero 이미지를 넣어도 어둡게 나왔다**(원본 좌측 110 → 렌더 82).
  - 그림자가 `@media (max-width:960px)` 안에만 있어 **데스크탑에는 적용되지 않았고**, 그 결과 데스크탑만 어두운 오버레이로 버티는 구조였다. 지금은 전 해상도에 적용된다.
  - 서브 문구가 사진 속 흰 서류 위를 지나가는 구간이 최악 지점이다. **오버레이만 걷어내면 그 구간 대비가 무너진다**(3.9:1 → 1.6:1) → 밝기와 가독성은 반드시 분리해서 다룬다.
  - `object-position` 의 x 값은 효과가 없다. hero 는 이미지 **가로 전체**를 쓰고 세로만 크롭하기 때문(밝은 부분을 좌우로 피할 수 없다).
  - **홈 `Hero` 도 같은 문제였다**: 그림자 규칙이 `.page-hero-section` 전용이라 홈에는 안 걸려 있었고, 오버레이 `0.78` 로 버티면서도 본문 최악 대비가 이미 `3.52:1`(기준 4.5:1 미달)이었다. 그래서 오버레이만 줄이면 안 되고 순백+그림자를 함께 넣어야 한다.
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
- **보관기간 자동 정리(Vercel Cron)**: `/api/cron/retention` 이 매일 03:00 KST 에 service_role 로 실행된다(`vercel.json` crons).
  - 문의(contacts): 개인정보처리방침의 "처리 완료 후 3년" 그대로 — `status=done` 은 `updated_at`+3년, 그 외 상태는 `created_at`+3년.
  - 블로그 임시저장 30일 · `contact_throttle` 1일도 함께 정리(관리자 접속 여부와 무관하게 돌아간다).
  - 인증: `CRON_SECRET`(Vercel production·preview + 로컬 `.env.local`). 헤더 불일치면 401 — 외부에서 삭제를 유발할 수 없다.
- **문의 알림 수신(CONTACT_EMAIL)은 환경별로 다르다**: 로컬·development·preview = 개발자 메일, production = 행정사님 메일.
  (개발 중 테스트 문의가 사무소 메일함으로 가지 않게)
- 권한(RLS·회원가입 차단·스토리지)은 choice-admin/docs/ARCHITECTURE.md 의 '권한 모델' 참고.

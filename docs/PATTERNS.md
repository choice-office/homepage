# 구현 패턴 (Cookbook) — 자주 하는 작업을 이 방식대로

> 새 구현 시 **여기 패턴을 그대로 따른다.** 컨벤션 원문은 루트 `CLAUDE.md`, 구조는 `docs/ARCHITECTURE.md`.

## 디자인시스템(DS) 사용 — `components/site/ds.tsx`
사이트 UI는 `ui/`(shadcn)가 아니라 **`ds.tsx`** 를 쓴다.
```tsx
import { Button, Card, CardTitle, CardBody, Badge, Input, Textarea, Label } from "@/components/site/ds";

<Button variant="primary|outline|secondary|ghost" size="sm|md|lg" onClick={...}>텍스트</Button>
<Button href="tel:..." iconStart={<Icon n="phone" .../>}>링크 버튼(a 태그)</Button>
<Card padding="24px" hover>...</Card>         // hover lift는 CSS(.ds-card)로 자동
<Input name="..." placeholder="..." required /> // focus 링은 CSS(.ds-field), 상태 prop 불필요
```
- hover/focus 스타일을 **JS 상태로 만들지 말 것**. `.ds-btn-*:hover`, `.ds-field:focus`가 `globals.css`에 있다. 새 변형이 필요하면 거기에 클래스를 추가.
- 색은 항상 CSS 변수(`var(--text-heading)` 등). 하드코딩 hex는 피한다(다크모드/테마 깨짐).

## 아이콘 — `components/site/icon.tsx`
```tsx
import { Icon } from "@/components/site/icon";
<Icon n="phone-call" className="size-[20px]" />
```
`n` 값은 `icon.tsx`에 등록된 lucide 키만 가능. 없으면 `icon.tsx`에 추가.

## 연락처/주소/전화 표기 — 항상 `CONTACT` 참조
하드코딩 금지. `lib/site-data.ts`의 단일 출처를 쓴다.
```tsx
import { CONTACT } from "@/lib/site-data";
<a href={CONTACT.phone.href}>{CONTACT.phone.display}</a>   // tel: + 표시번호
{CONTACT.email} / {CONTACT.address} / {CONTACT.hours} / {CONTACT.kakao.handle}
```

## 내부 이동(내비게이션)
- 기존 사이트 컴포넌트: `const go = useGo(); <button onClick={() => go("services","e6")}>`.
- **신규 링크는 가능하면 `<Link href={...}>`** (SEO). 블로그가 이 방식.
```tsx
import Link from "next/link";
import { routePath } from "@/lib/site-data";
<Link href={routePath("service","e6")}>…</Link>   // 또는 직접 "/blog/슬러그"
```

## 새 페이지 추가
1. `src/app/<route>/page.tsx` 생성. 서버 컴포넌트 기본.
2. 상단에 `export const metadata`(title/description). 동적이면 `generateMetadata`.
3. 본문은 `<PageHero .../>`(섹션 헤더, 다크) + `<section className="section">…</section>`. `components/site/sections.tsx`의 기존 섹션을 조합.
4. 라우트 매핑 필요하면 `routePath`(site-data)와 `pathToRoute`(use-go) **둘 다** 갱신, `NAV`(필요 시), `sitemap.ts`에 URL 추가.

## 새 섹션 컴포넌트 추가
- `sections.tsx`에 `export const XxxSection = () => (...)` 추가(현 구조 유지). 정적이면 hook 쓰지 말 것.
- 데이터는 컴포넌트 상단 상수 또는 `site-data.ts`에서. 마크업 반복은 `.map()`.
- 등장 애니메이션: 최상위에 `data-reveal`(개별) 또는 `data-stagger`(자식 순차) 부여.
- 레이아웃은 `.wrap`/`.section`/`.grid-3` 클래스 + **Tailwind 유틸리티**. 인라인 `style` 은 쓰지 않는다.

## 그리드/레이아웃 클래스 (globals.css)
`.wrap`(중앙 정렬 컨테이너) · `.section`(상하 패딩) · `.grid-2/3/4` · `.contact-grid`(2열, 모바일 1열). 반응형은 globals.css의 미디어쿼리에서 이미 처리.

## CSS 를 건드릴 때 (필독)
- `globals.css` 는 전체가 `@layer components` 안에 있다. **새 규칙도 그 안에** 넣는다(밖에 두면 호출부 Tailwind 유틸리티가 조용히 무시된다).
- 반대로 호출부 유틸리티를 **이겨야 하는** 문맥 오버라이드는 `!important` + `biome-ignore lint/complexity/noImportantStyles` 주석. biome 자동수정이 `!important` 를 지워 회귀시킨 전례가 있다.
- 이름 유틸리티의 의미를 확인하고 쓴다. 예: `grid-cols-2` 는 `repeat(2, minmax(0,1fr))` 라 열이 항상 균등하고, `grid-cols-[1fr_1fr]` 은 자동 최소폭이 있어 내용이 넓은 열이 더 넓어진다 — 문의 폼이 실제로 이 차이로 어긋났다.
- `cn()`(tailwind-merge)은 `text-*` 가 오면 앞의 `leading-*` 를 지운다. 줄높이를 지키려면 `[line-height:…]` 임의 속성으로 쓴다(`ds.tsx` 참고).
- 바꾼 뒤 확인: `NEXT_DIST_DIR=.next-visual pnpm build` → `next start -p 3001` → `node scripts/visual/capture.mjs after` → `python scripts/visual/diff.py`.

## 폼 + Server Action
- 액션: `app/actions/<name>.ts`, 첫 줄 `"use server"`, 반환 `{ success: boolean; error?: string }`, `useActionState` 호환 시그니처 `(prev, formData) => Promise<Result>`.
- 환경변수 유무로 동작 분기(예: contact.ts는 `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` 있으면 저장, 없으면 placeholder 성공).
- 클라이언트 폼은 input에 `name` 부여, 제출 시 검증 → 액션 호출. shadcn `Select`는 값이 FormData에 안 담기므로 별도 state로 관리해 함께 전송.

## 블로그 글 추가/렌더
→ `docs/BLOG.md` 참고. 요지: `lib/blog-data.ts`의 `BLOG_POSTS`에 `BlogPost`(본문은 HTML 문자열) 추가. 상세는 `.prose`로 렌더(글 중간 이미지 지원).

## 외부 이미지
- `next/image` 사용. 외부 호스트는 `next.config.ts` `images.remotePatterns`에 등록된 도메인만(현재 unsplash, `*.supabase.co`). 새 출처는 거기 추가.
- 블로그 본문 HTML 내 `<img>`는 next/image를 안 거치므로 remotePatterns 무관(단 `.prose img`로 반응형 스타일 적용됨).

## 커밋/배포 루틴
```
pnpm check-types && pnpm lint && pnpm build   # 통과 후
git add -A && git commit ...                  # 커밋 메시지: 한글 시작(commitlint subject-case), conventional 타입(feat/refactor/...)
git push origin main                          # → Vercel 자동 배포
```
- 끝에 `Co-Authored-By: ...` 푸터.
- biome 포맷/정렬 자동수정: `pnpm format`(포맷) / `pnpm lint:fix`(정렬·assist). **단 `lint:fix --unsafe`가 조건부 className 템플릿(`` `a ${x?" b":""}` ``)의 공백을 깨뜨릴 수 있으니, 동적 className은 `cn("a", x && "b")`로 작성.**

# 외주 시작 체크리스트

새 프로젝트마다 이 순서대로 진행.

---

## 1. 레포 복사

```bash
git clone git@github.com:KKIMDoHyun/next-boilerplate.git [프로젝트명]
cd [프로젝트명]
rm -rf .git
git init && git add . && git commit -m "feat: initial commit"
# 새 GitHub 레포 만들고 remote 연결
git remote add origin [새 레포 주소]
git push -u origin main
pnpm install   # lefthook git hook도 자동 설치됨 (prepare 스크립트)
```

---

## 2. 기본 정보 설정

### `package.json`
```json
"name": "클라이언트-프로젝트명"
```

### `src/config/site.ts` ← 핵심. 여기만 바꾸면 Header, Footer, SEO 일괄 반영
```ts
export const siteConfig = {
  name: "클라이언트 사이트명",
  description: "SEO 설명문 (160자 이내)",
  url: "https://실제도메인.com",
  ogImage: "https://실제도메인.com/og.png",
  locale: "ko",       // 영문이면 "en"
};

export const navLinks = [
  { href: "#features", label: "서비스" },
  { href: "#pricing", label: "요금제" },
  { href: "#contact", label: "문의" },
];

export const footerLinks = [
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
];

// ★ 사업자번호/대표자 표기가 필요한 외주는 businessInfo 주석 해제 후 값 입력
// export const businessInfo = {
//   companyName: "주식회사 OOO",
//   ceo: "홍길동",
//   regNo: "000-00-00000",
//   address: "서울시 OO구 OO로 123",
//   tel: "02-1234-5678",
// };
```

### `src/app/layout.tsx`
```tsx
// lang 속성 — 영문이면 "en"으로
<html lang="ko" ...>
```

---

## 3. 섹션 구성

### `src/app/page.tsx` — 필요한 섹션만 남기기
```tsx
// 필요 없는 섹션은 import + 컴포넌트 둘 다 제거

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      {/* <Testimonials /> */}  // 후기 없으면 제거
      {/* <Pricing /> */}       // 가격 없으면 제거
      <FAQ />
      <CTA />
      <Contact />
    </>
  );
}
```

### 각 섹션 파일 — 파일 상단 `★ 설정` 부분만 교체

**기본 섹션**

| 파일 | 바꿀 것 |
|------|---------|
| `sections/hero.tsx` | 헤드라인, 서브텍스트, 버튼 텍스트 |
| `sections/features.tsx` | `features` 배열 (icon, title, description) |
| `sections/testimonials.tsx` | `testimonials` 배열 (quote, author, role) |
| `sections/pricing.tsx` | `plans` 배열 (name, price, features, popular) |
| `sections/faq.tsx` | `faqs` 배열 (question, answer) |
| `sections/cta.tsx` | 헤드라인, 서브텍스트, 버튼 텍스트 |
| `sections/contact.tsx` | 섹션 제목 텍스트 |

**추가 섹션 (SPEC.md 참고)**

| 파일 | 바꿀 것 |
|------|---------|
| `sections/video-hero.tsx` | `defaultProps` (videoSrc, title, subtitle, CTA) |
| `sections/carousel-hero.tsx` | `slides` 배열 (image, title, subtitle, cta) |
| `sections/team.tsx` | `members` 배열 (name, role, image, bio, career) |
| `sections/gallery.tsx` | `items` 배열 (src, alt, caption) |
| `sections/youtube-grid.tsx` | `videos` 배열 (videoId, title), `COLUMNS` 상수 |
| `sections/process.tsx` | `steps` 배열 (icon, title, description) |
| `sections/stats.tsx` | `stats` 배열 (value, prefix, suffix, label) |
| `sections/map.tsx` | `mapConfig.iframeSrc`, `info` 객체 (주소/전화/영업시간) |
| `sections/tabs-section.tsx` | `tabs` 배열 (label, title, description, features, image) |
| `sections/fixed-background-reveal.tsx` | `BACKGROUND_IMAGE`, `OVERLAY`, `HERO_TITLE`, `HERO_SUBTITLE`, `blocks` 배열 |
| `sections/sticky-scroll-reveal.tsx` | `SECTION_TITLE`, `SECTION_SUBTITLE`, `steps` 배열 (eyebrow, title, description, image) |

**공용 컴포넌트 (layout.tsx 또는 page.tsx에 추가)**

| 파일 | 바꿀 것 |
|------|---------|
| `common/floating-cta.tsx` | `buttons` 배열 (href, label), `POSITION` 상수 |
| `common/marquee.tsx` | `textItems` / `logoItems` 배열 |

**아이콘 교체 (features.tsx, process.tsx):**
- [lucide.dev](https://lucide.dev) 에서 원하는 아이콘 검색
- import 이름만 바꾸면 됨

---

## 4. 디자인 설정

### 컬러 — `src/app/globals.css`

1. [shadcn/ui 테마 생성기](https://ui.shadcn.com/themes) 접속
2. Primary 색상 + Radius 선택
3. "Copy code" 클릭
4. `globals.css`의 `:root { ... }` 와 `.dark { ... }` 블록 전체 교체

**직접 수정할 경우 핵심 변수:**
```css
:root {
  --primary: oklch(...);          /* 메인 브랜드 컬러 */
  --primary-foreground: oklch(...); /* primary 위 텍스트 (보통 흰색) */
  --radius: 0.5rem;               /* 0 = 각짐 / 1rem = 둥글둥글 */
}
```

### 폰트 — `src/app/layout.tsx`

**기본값: Noto Sans KR** — 한/영 동시 지원. 별도 수정 불필요.

**영문 전용 프로젝트로 바꾸고 싶을 때:**
```tsx
// Noto_Sans_KR → Geist 로 교체
import { Geist, Geist_Mono } from "next/font/google";

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});
```

**다른 한글 폰트를 쓰고 싶을 때:**
```tsx
// Noto_Sans_KR 자리에 원하는 폰트로 교체
// Google Fonts 지원 한글 폰트: Noto_Sans_KR, Do_Hyeon, Black_Han_Sans 등
import { Do_Hyeon } from "next/font/google";

const fontSans = Do_Hyeon({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400"],
});
```

---

## 5. 환경변수

`.env.example` → `.env.local` 복사 후 설정:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SITE_URL=https://실제도메인.com

# GA4 필요한 경우 — 값 넣으면 layout.tsx에서 자동 활성화됨
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 문의 폼 이메일 발송 (Resend 사용 시)
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=hello@클라이언트도메인.com
```

---

## 6. 문의 폼 연동

`contact.ts` 는 환경변수 유무에 따라 자동으로 동작을 선택한다.

| 환경변수 | 동작 |
|---|---|
| 둘 다 없음 | placeholder 성공 응답 (개발 환경) |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | contacts 테이블에 저장 |
| `RESEND_API_KEY` + `CONTACT_EMAIL` | 알림 이메일 발송 (Supabase 저장에 추가로 실행) |
| 둘 다 있음 | DB 저장 + 알림 이메일 동시 처리 |

**Supabase 저장만 쓸 때** — `.env.local` 에 추가:
```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxx
```
그 다음 Supabase MCP 또는 직접 아래 테이블 생성:
```sql
create table contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);
```

**Resend 알림 이메일 추가할 때** — 패키지 설치 후 `.env.local` 에 추가:
```bash
pnpm add resend
```
```env
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=hello@클라이언트도메인.com
```
> Resend 발신 도메인은 Resend 대시보드에서 **Verified Domain** 으로 등록해야 발송된다.

---

## 7. Supabase MCP 연결 (클라이언트 계정 받았을 때)

Claude Code가 Supabase에 직접 접근해서 테이블 생성, 쿼리 실행, 스키마 관리를 할 수 있게 된다.

### 1단계 — Personal Access Token 발급
1. [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) 접속
2. **Generate new token** → 이름 입력 → 토큰 복사 (`sbp_...`)

### 2단계 — Project Ref 확인
- Supabase 대시보드 URL에서 확인: `https://supabase.com/dashboard/project/<project-ref>`
- 또는 **Project Settings → General → Reference ID**

### 3단계 — 설정 파일 생성
```bash
cp .claude/settings.json.example .claude/settings.json
```

`.claude/settings.json` 열고 토큰과 project-ref 입력:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_실제토큰값",
        "--project-ref",
        "실제프로젝트ref"
      ]
    }
  }
}
```

> `.claude/settings.json`은 `.gitignore`에 포함되어 있어 커밋되지 않는다.

### 4단계 — Claude Code 재시작
설정 적용을 위해 Claude Code를 재시작하면 MCP 연결 완료.

### 연결 후 할 수 있는 것
- "contacts 테이블 만들어줘" → 바로 실행
- "문의 폼 데이터를 Supabase에 저장하게 해줘" → 테이블 생성 + `contact.ts` 수정 한 번에
- 스키마 조회, 데이터 확인, RLS 정책 설정

---

## 8. 최종 확인

```bash
pnpm check-types   # 타입 에러 없는지 (tsgo, 빠름)
pnpm build         # 빌드 에러 없는지
pnpm lint          # lint 에러 없는지
pnpm knip          # 미사용 export/import/의존성 없는지
```

**코드 체크**
- [ ] `src/config/site.ts`의 `url` / `ogImage`가 실제 배포 도메인으로 설정되어 있는지 확인
- [ ] `next.config.ts` → `images.remotePatterns` 의 `hostname: "**"` 을 실제 사용 도메인으로 좁혔는지 확인 (보안)
- [ ] `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` — 상단 `★ 설정` 의 시행일/이메일/전화/책임자명 교체
- [ ] 사업자정보 표기가 필요한 경우 `src/config/site.ts` 의 `businessInfo` 주석 해제 + 값 입력
- [ ] favicon 교체 (`src/app/favicon.ico`)
- [ ] FloatingCta 사용 시 `layout.tsx` 최하단에 추가했는지 확인

**UI/기능 체크**
- [ ] 모바일 (375px) 레이아웃 깨짐 없는지 확인
- [ ] 다크모드 전환 정상 동작
- [ ] shadcn 컴포넌트 애니메이션 (Accordion, Dialog 등) 정상 동작
- [ ] 앵커 링크 (`#features`, `#contact` 등) 클릭 시 스무스 스크롤
- [ ] Skip-to-content 링크 — Tab 키 첫 포커스 시 "본문 바로가기" 노출 확인
- [ ] 문의 폼 제출 동작 확인 (성공/에러 메시지, 재전송 버튼)
- [ ] `/privacy`, `/terms` 직접 방문 시 정상 렌더, Footer 링크 클릭 동작

**SEO/Meta 체크**
- [ ] `src/app/opengraph-image.tsx` — siteConfig 정보가 올바르게 반영되는지 확인
- [ ] `/sitemap.xml` 접속 시 홈 + `/privacy` + `/terms` 세 URL 포함 확인

---

## 9. Vercel 배포

### 1단계 — 프로젝트 연결
1. [vercel.com/new](https://vercel.com/new) 접속
2. GitHub 레포 선택 → **Import**
3. Framework Preset: **Next.js** (자동 감지)
4. Root Directory / Build Command / Output Directory 기본값 유지 → **Deploy**

### 2단계 — 환경변수 입력
배포 후 **Settings → Environment Variables** 에서 `.env.local` 값 입력:

| 변수 | 필수 여부 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | 필수 |
| `NEXT_PUBLIC_GA_ID` | GA4 사용 시 |
| `SUPABASE_URL` | 문의폼 DB 저장 시 |
| `SUPABASE_SERVICE_ROLE_KEY` | 문의폼 DB 저장 시 |
| `RESEND_API_KEY` | 알림 이메일 시 |
| `CONTACT_EMAIL` | 알림 이메일 시 |

환경변수 추가 후 **Redeploy** 필수 (변수는 빌드 시 주입됨).

### 3단계 — 커스텀 도메인 (선택)
**Settings → Domains → Add Domain** → DNS 레코드(CNAME/A) 등록 후 자동 HTTPS 적용.

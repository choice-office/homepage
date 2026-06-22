# Landing Boilerplate — 컴포넌트 스펙

외주 의뢰가 들어왔을 때 빠르게 조합해서 쓰는 컴포넌트 목록.
모든 컴포넌트는 파일 상단 `★ 설정` 주석 부분만 수정하면 동작한다.

---

> 새 프로젝트 시작 순서, 환경변수, Supabase MCP 연결은 **[SETUP.md](./SETUP.md)** 참고.

---

## 프로젝트 킥오프 프롬프트

새 외주 프로젝트 생성 후 Claude Code에 이렇게 요청하면 된다.

```
[클라이언트명] 홈페이지 만들어줘.

레퍼런스: http://example.com
업종: 렌탈샵
사이트명: OOO
설명 (SEO): OOO
메인 컬러: 파란색 계열 / #1a73e8

콘텐츠:
- 서비스: OOO, OOO, OOO
- 연락처: 02-1234-5678
- 주소: 서울시 OO구 OO로 123
- 영업시간: 평일 09-18시
- 팀원: 김OO (대표), 이OO (실장)

필요한 기능:
- 문의 폼 Supabase 저장   ← Supabase 쓸 경우 추가
- 카카오 오픈채팅 플로팅 버튼
```

Claude가 SPEC.md 보고 섹션 조합 결정 → `config/site.ts` + `page.tsx` + 각 섹션 데이터 교체를 한 번에 처리.

**클라이언트한테 미리 받을 것:**

| 항목 | 필수 여부 |
|---|---|
| 레퍼런스 사이트 URL | 권장 |
| 로고, 대표 이미지, 팀 사진 | 필수 (public/ 배치) |
| 실제 텍스트 (서비스 설명, 가격 등) | 필수 |
| Supabase Personal Access Token + Project Ref | Supabase 쓸 경우 |

---

## Supabase MCP

### 연결 방법
```bash
cp .claude/settings.json.example .claude/settings.json
# 파일 열고 토큰 + project-ref 입력 후 Claude Code 재시작
```

자세한 절차 → **[SETUP.md 7단계](./SETUP.md)**

### MCP 연결 후 요청 예시

```
contacts 테이블 만들고 문의 폼이 Supabase에 저장되게 해줘
```

Claude가 테이블 생성 + `src/app/actions/contact.ts` 수정을 한 번에 처리.

### MCP 없이 쓸 때 (클라이언트가 Supabase 계정 안 줄 때)

```
문의 폼은 이메일로만 받을게 (Resend)
```

→ SETUP.md 6단계 Resend 연동으로 처리.

---

## 섹션 조합 치트시트

| 레퍼런스 유형 | 추천 섹션 조합 |
|---|---|
| 서비스업 (병원, 학원, 렌탈) | `VideoHero` or `CarouselHero` → `TrustBand` → `Stats` → `Process` → `Team` → `Map` → `Contact` |
| 제조/B2B | `VideoHero` → `TabsSection` → `Gallery` → `Stats` → `LogoBand` → `Map` → `Contact` |
| 웨딩/이벤트 | `CarouselHero` → `Team` → `YoutubeGrid` → `Gallery` → `Process` → `Contact` |
| 스타트업/SaaS | `Hero` (기존) → `LogoBand` → `Features` → `Stats` → `Testimonials` → `Pricing` → `FAQ` |
| 부동산/투자 | `VideoHero` → `Stats` → `Features` → `Process` → `Testimonials` → `Map` → `Contact` |
| 대출/금융 | `CarouselHero` → `TrustBand` → `Features` → `Process` → `Stats` → `FAQ` → `Contact` |
| **풀빌라/호텔/프리미엄 브랜드** | `CarouselHero` or `ParallaxHero` → `FixedBackgroundReveal` → `StickyScrollReveal` → `Gallery` → `Contact` |

---

## Hero 섹션

### `Hero` (기존)
- 위치: `src/components/sections/hero.tsx`
- 텍스트 + 버튼 2개. 가장 단순한 형태.
- 서버 컴포넌트

### `HeroVideo` — 단순 버전
- 위치: `src/components/sections/hero-video.tsx`
- 배경 동영상 + 고정 오버레이(black/60) + 텍스트 + 버튼 2개
- 설정: 파일 내 `VIDEO_SRC`, 헤드라인/서브텍스트 직접 수정
- 서버 컴포넌트

```tsx
import { HeroVideo } from "@/components/sections/hero-video";
<HeroVideo />
```

### `VideoHero` — 고급 버전
- 위치: `src/components/sections/video-hero.tsx`
- 배경 동영상 + **오버레이 농도 조절** (`"light" | "medium" | "dark"`) + **텍스트 정렬** (`"left" | "center"`) + 스크롤 인디케이터
- 설정: 파일 내 `defaultProps` 수정
- 서버 컴포넌트

```tsx
import { VideoHero } from "@/components/sections/video-hero";
<VideoHero />  // 파일 내 defaultProps 수정해서 사용
```

### `HeroCarousel` — 단순 버전
- 위치: `src/components/sections/hero-carousel.tsx`
- 이미지 슬라이더 + 이전/다음 화살표 버튼 + 자동 전환(4초)
- 설정: 파일 내 `slides` 배열, `AUTOPLAY_DELAY` 수정
- 클라이언트 컴포넌트

```tsx
import { HeroCarousel } from "@/components/sections/hero-carousel";
<HeroCarousel />
```

### `CarouselHero` — 고급 버전
- 위치: `src/components/sections/carousel-hero.tsx`
- 이미지 슬라이더 + **닷 인디케이터** + **슬라이드별 overlayOpacity/eyebrow/cta 설정** + 자동 전환(5초)
- 설정: 파일 내 `slides` 배열 수정
- 클라이언트 컴포넌트

```tsx
import { CarouselHero } from "@/components/sections/carousel-hero";
<CarouselHero />  // slides 배열 수정해서 사용
```

### `ParallaxHero`
- 위치: `src/components/sections/parallax-hero.tsx`
- 배경 이미지가 콘텐츠보다 느리게 스크롤되는 패럴랙스 효과
- 설정: 파일 내 `defaultProps` 수정 (`image`, `parallaxStrength`, `overlayOpacity`, `align`)
- 클라이언트 컴포넌트

```tsx
import { ParallaxHero } from "@/components/sections/parallax-hero";
<ParallaxHero />  // defaultProps 수정해서 사용
```

---

## 스크롤 리빌 섹션 (풀빌라/호텔/프리미엄 브랜드)

### `FixedBackgroundReveal`
- 위치: `src/components/sections/fixed-background-reveal.tsx`
- 배경 이미지가 화면에 **고정**된 상태에서 콘텐츠 블록이 위로 스크롤되고, 블록 사이 간격에서 배경이 조금씩 드러나는 효과
- iOS Safari `bg-attachment: fixed` 버그를 sticky + marginBottom 트릭으로 우회
- 설정: `BACKGROUND_IMAGE`, `OVERLAY`, `HERO_TITLE`, `HERO_SUBTITLE`, `blocks` 배열
- 서버 컴포넌트

```tsx
import { FixedBackgroundReveal } from "@/components/sections/fixed-background-reveal";
<FixedBackgroundReveal />
```

### `StickyScrollReveal`
- 위치: `src/components/sections/sticky-scroll-reveal.tsx`
- 섹션이 화면에 **pin(고정)**된 상태에서 스크롤 진행도에 따라 내부 텍스트·이미지가 순차 전환
- 데스크탑: 좌(텍스트+진행 바) / 우(이미지 크로스페이드) 분할 레이아웃, 모바일: 스택 폴백
- 설정: `SECTION_TITLE`, `SECTION_SUBTITLE`, `steps` 배열 (eyebrow, title, description, image)
- 이미지 경로: `/public/sticky/room-N.jpg`
- 클라이언트 컴포넌트

```tsx
import { StickyScrollReveal } from "@/components/sections/sticky-scroll-reveal";
<StickyScrollReveal />  // steps 배열 수정해서 사용
```

---

## 콘텐츠 섹션

### `Features` (기존)
- 위치: `src/components/sections/features.tsx`
- 아이콘 + 제목 + 설명 3열 카드
- 서버 컴포넌트

### `Team`
- 위치: `src/components/sections/team.tsx`
- 팀원 카드 그리드 (기본 4열)
- hover 시 상단부터 오버레이로 bio + career 표시
- 이미지 경로: `/public/team/member-N.jpg`
- 서버 컴포넌트 (CSS group-hover 사용)

```tsx
import { Team } from "@/components/sections/team";
<Team />
```

### `Gallery`
- 위치: `src/components/sections/gallery.tsx`
- 이미지 그리드 (기본 4열) + 클릭 시 라이트박스
- 라이트박스: 이전/다음 버튼, 키보드 ← → 지원
- 이미지 경로: `/public/gallery/photo-N.jpg`
- 클라이언트 컴포넌트

```tsx
import { Gallery } from "@/components/sections/gallery";
<Gallery />
```

### `YoutubeGrid`
- 위치: `src/components/sections/youtube-grid.tsx`
- YouTube iframe 그리드 (16:9 비율 유지)
- 컬럼 수: 파일 내 `COLUMNS` 상수 수정 (`"2" | "3" | "4"`)
- `videoId`: YouTube URL의 `?v=` 뒤 값
- 서버 컴포넌트

```tsx
import { YoutubeGrid } from "@/components/sections/youtube-grid";
<YoutubeGrid />
```

### `Process`
- 위치: `src/components/sections/process.tsx`
- 단계별 프로세스 (아이콘 + 번호 + 제목 + 설명)
- 데스크탑: 가로 4열, 모바일: 세로 스택
- 서버 컴포넌트

```tsx
import { Process } from "@/components/sections/process";
<Process />
```

### `Stats`
- 위치: `src/components/sections/stats.tsx`
- 숫자 카운트업 애니메이션 (스크롤 진입 시 실행)
- `prefix`, `suffix` 옵션 (`+`, `%`, `년` 등)
- 클라이언트 컴포넌트

```tsx
import { Stats } from "@/components/sections/stats";
<Stats />
```

### `TabsSection`
- 위치: `src/components/sections/tabs-section.tsx`
- 탭 네비게이션 + 좌(텍스트/기능목록) + 우(이미지) 레이아웃
- 각 탭: `id`, `icon`, `label`, `title`, `description`, `features[]`, `image`
- 이미지 경로: `/public/tabs/tab-N.jpg`
- 서버 컴포넌트

```tsx
import { TabsSection } from "@/components/sections/tabs-section";
<TabsSection />
```

### `Map`
- 위치: `src/components/sections/map.tsx`
- 좌: 주소/전화/이메일/영업시간, 우: 지도 iframe
- 카카오 roughmap, 네이버 지도, 구글 지도 모두 지원 (iframe src 교체)
- 파일 내 `mapConfig.iframeSrc`와 `info` 객체 수정
- 서버 컴포넌트

```tsx
import { MapSection } from "@/components/sections/map";
<MapSection />
```

### 기존 섹션 데이터 수정 위치

| 컴포넌트 | 파일 | 수정할 것 |
|---|---|---|
| `Testimonials` | `sections/testimonials.tsx` | `testimonials` 배열 (quote, author, role) |
| `Pricing` | `sections/pricing.tsx` | `plans` 배열 (name, price, features, badge) |
| `FAQ` | `sections/faq.tsx` | `faqs` 배열 (question, answer) |
| `CTA` | `sections/cta.tsx` | title, description, 버튼 텍스트/링크 |
| `Contact` | `sections/contact.tsx` | 폼 레이블 (한국어 필요 시 교체) |

---

## 공용 컴포넌트

### `GoogleAnalytics`
- 위치: `src/components/common/google-analytics.tsx`
- **이미 `layout.tsx`에 연결됨** — 별도 추가 불필요
- `NEXT_PUBLIC_GA_ID` 환경변수만 `.env.local`에 넣으면 자동 활성화
- `NEXT_PUBLIC_GA_ID`가 없으면 렌더링 안 됨 (조건부)

```env
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### `FadeIn` (기존)
- 위치: `src/components/common/fade-in.tsx`
- 스크롤 진입 시 fade + slide up 애니메이션
- props: `delay`, `duration`, `y`, `className`

### `FloatingCta`
- 위치: `src/components/common/floating-cta.tsx`
- 화면 우하단 고정 플로팅 버튼 (전화, 카카오 등)
- hover 시 툴팁 표시
- **`layout.tsx` 또는 `page.tsx` 최하단에 추가**
- 위치: `"right" | "left"` (`POSITION` 상수 수정)
- 서버 컴포넌트

```tsx
// layout.tsx
import { FloatingCta } from "@/components/common/floating-cta";
// <body> 내부 최하단에 추가
<FloatingCta />
```

### `Marquee` / `LogoBand` / `TrustBand`
- 위치: `src/components/common/marquee.tsx`
- 무한 수평 스크롤 애니메이션
- 아이템 타입: 텍스트(`MarqueeTextItem`) 또는 로고 이미지(`MarqueeLogoItem`)
- `LogoBand`: 파트너사 로고 띠 (그레이스케일 → 컬러 hover)
- `TrustBand`: primary 배경 + 신뢰 문구 띠
- 클라이언트 컴포넌트

```tsx
// 방법 1: 바로 쓰는 래퍼 컴포넌트
import { LogoBand } from "@/components/common/marquee";
<LogoBand />

import { TrustBand } from "@/components/common/marquee";
<TrustBand />

// 방법 2: 커스텀
import { Marquee, type MarqueeItem } from "@/components/common/marquee";
const items: MarqueeItem[] = [
  { type: "text", text: "✔ 고객 만족도 98%" },
  { type: "logo", src: "/partners/logo.png", alt: "파트너" },
];
<Marquee items={items} speed={25} pauseOnHover />
```

---

## 버튼을 링크로 쓸 때

이 보일러플레이트의 Button은 `asChild`를 지원하지 않음.
링크 버튼이 필요하면 `buttonVariants`로 `<a>` 태그에 직접 스타일 적용.

```tsx
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

// primary 버튼 링크
<a href="/contact" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
  문의하기
</a>

// outline 버튼 링크
<a href="/about" className={buttonVariants({ variant: "outline", size: "lg" })}>
  더 알아보기
</a>
```

---

## 지도 iframe 발급 방법

### 카카오맵 (roughmap)
1. [map.kakao.com](https://map.kakao.com) → 장소 검색
2. 장소 클릭 → **지도 퍼가기** → iframe 코드 복사
3. `map.tsx`의 `mapConfig.iframeSrc`에 붙여넣기

### 네이버 지도
1. [map.naver.com](https://map.naver.com) → 장소 검색
2. **공유** → **지도 퍼가기** → iframe `src` 복사
3. `map.tsx`의 `mapConfig.iframeSrc`에 붙여넣기

---

## 이미지 경로 컨벤션

```
public/
  hero/        # CarouselHero 배경 이미지
  video/       # VideoHero 영상 파일
  team/        # Team 멤버 사진
  gallery/     # Gallery 이미지
  tabs/        # TabsSection 탭 이미지
  partners/    # Marquee 파트너 로고
```

---

## 카카오톡 링크 종류

| 링크 종류 | URL 형식 | 용도 |
|---|---|---|
| 오픈채팅 | `https://open.kakao.com/o/XXXXXXX` | 채팅방 직접 연결 |
| 카카오 채널 | `https://pf.kakao.com/_XXXXX` | 기업 채널 |
| 카카오톡 1:1 | `https://talk.kakao.com/t/XXXXX` | 1:1 채팅 |

---

## 문의 폼 통합

`src/app/actions/contact.ts` 기본 흐름:

| 환경변수 | 동작 |
|---|---|
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | contacts 테이블에 저장 |
| `RESEND_API_KEY` + `CONTACT_EMAIL` | 알림 이메일 발송 |
| 둘 다 없음 | placeholder 성공 응답 (개발 환경) |

Supabase와 Resend는 동시에 사용 가능. 각 패키지는 사용 시점에 설치:

```bash
pnpm add @supabase/supabase-js   # Supabase 저장 시
pnpm add resend                  # Resend 이메일 시
```

자세한 연동 절차 → **[SETUP.md 6단계](./SETUP.md)**

---

## 필요 시 요청 가능한 섹션 (Out of Scope)

아래 섹션은 보일러플레이트에 미리 포함되어 있지 않다.
외주 진행 중 필요해지면 "이 섹션 만들어줘"라고 요청하면 그때 추가된다.

| 섹션 | 설명 |
|---|---|
| **견적 계산기** | 수량/옵션 선택 → 가격 자동 산출. 제조업, 렌탈, 인테리어에서 자주 사용 |
| **예약 폼** | 날짜/시간 슬롯 선택 + 고객 정보 입력. 병원, 학원, 뷰티샵 등 |
| **Before/After 슬라이더** | 드래그로 전/후 이미지 비교. 시공, 리모델링, 뷰티 |
| **블로그/공지 카드 그리드** | 게시물 카드 목록 + 페이지네이션. CMS 연동 시 ISR 사용 |
| **포트폴리오 카테고리 필터** | 카테고리 탭으로 이미지/카드 필터링. 인테리어, 사진작가 등 |
| **인증/허가/수상내역 그리드** | 배지/로고 형태의 신뢰 지표 나열. 제조업, 의료, 교육 |
| **채용 공고 리스트** | 포지션 목록 + 상세 펼침(Accordion). 스타트업, 기업 홈페이지 |
| **Cookie Banner** | GDPR/PIPA 쿠키 동의 팝업. 해외 서비스 또는 GA 사용 시 |

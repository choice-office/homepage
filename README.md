# Landing Page Boilerplate

외주 랜딩페이지/홈페이지를 빠르게 찍어내기 위한 보일러플레이트.

## 특징

- **섹션 템플릿 21종** — Hero, Features, Team, Gallery, Stats, Map 등 바로 쓸 수 있는 섹션
- **모바일 퍼스트** — 모든 섹션 반응형 대응
- **다크모드** — next-themes 기반, 토글 포함
- **스크롤 애니메이션** — FadeIn 래퍼 + Framer Motion
- **SEO** — sitemap, robots.txt 자동 생성, OG 메타태그

## 기술 스택

| 분류 | 사용 기술 |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (base-nova) |
| Animation | Framer Motion |
| Theme | next-themes (다크모드) |
| Lint/Format | Biome + lefthook |
| Package | pnpm |
| Deploy | Vercel |

## 빠른 시작

```bash
git clone git@github.com:KKIMDoHyun/next-boilerplate.git my-project
cd my-project
pnpm install
pnpm dev
```

→ 자세한 설정은 **[SETUP.md](./SETUP.md)** 참고  
→ 컴포넌트 목록 및 사용법은 **[SPEC.md](./SPEC.md)** 참고

## 주요 명령어

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm lint         # Biome lint
pnpm lint:fix     # Biome lint 자동 수정
pnpm format       # 코드 포맷팅
pnpm check-types  # 타입 검사 (tsgo, 빠름)
```

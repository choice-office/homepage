---
name: landing-kickoff
description: 보일러플레이트 기반 외주 랜딩페이지 빌드 — 클라이언트 브리프에서 완성까지
argument-hint: "<클라이언트 브리프 또는 킥오프 프롬프트>"
level: 4
---

<Purpose>
클라이언트 브리프(업종, 사이트명, 컬러, 콘텐츠)를 받아 landing-boilerplate의 섹션을 조합하고, 데이터를 교체하고, 테마를 설정하여 완성된 랜딩페이지를 만든다.
</Purpose>

<Use_When>
- 새 외주 프로젝트를 시작할 때
- 클라이언트 브리프가 주어졌을 때
- "OOO 홈페이지 만들어줘", "랜딩페이지 셋업해줘" 같은 요청
- SPEC.md의 킥오프 프롬프트 형식으로 요청이 들어올 때
</Use_When>

<Do_Not_Use_When>
- 기존 프로젝트에서 특정 섹션 하나만 수정할 때 — 직접 수정
- 보일러플레이트 자체를 개선할 때 — 일반 개발 워크플로우
- 디자인 시안만 검토할 때
</Do_Not_Use_When>

<Inputs>
필수:
- 업종 (서비스업, SaaS, 웨딩, 제조/B2B, 부동산, 대출/금융 등)
- 사이트명
- SEO 설명문

권장:
- 레퍼런스 사이트 URL
- 메인 컬러 (hex 또는 색상 계열)
- 콘텐츠: 서비스 목록, 연락처, 주소, 영업시간, 팀원 정보
- 필요 기능: 문의 폼 연동(Supabase/Resend), 카카오 플로팅 버튼, GA

선택:
- 로고/이미지 에셋 (public/ 에 배치)
- 가격표, FAQ, 후기 텍스트
</Inputs>

<Workflow>

## Phase 1: 브리프 분석 및 섹션 결정

1. 클라이언트 브리프에서 업종을 파악한다.
2. `SPEC.md`의 **섹션 조합 치트시트**를 참조하여 섹션 구성을 결정한다:

| 업종 | 추천 섹션 |
|------|-----------|
| 서비스업 (병원, 학원, 렌탈) | VideoHero → TrustBand → Stats → Process → Team → Map → Contact |
| 제조/B2B | VideoHero → TabsSection → Gallery → Stats → LogoBand → Map → Contact |
| 웨딩/이벤트 | CarouselHero → Team → YoutubeGrid → Gallery → Process → Contact |
| SaaS/스타트업 | Hero → LogoBand → Features → Stats → Testimonials → Pricing → FAQ |
| 부동산/투자 | VideoHero → Stats → Features → Process → Testimonials → Map → Contact |
| 대출/금융 | CarouselHero → TrustBand → Features → Process → Stats → FAQ → Contact |
| 풀빌라/호텔/프리미엄 브랜드 | CarouselHero or ParallaxHero → FixedBackgroundReveal → StickyScrollReveal → Gallery → Contact |

3. 브리프에 명시된 추가 요구사항(FloatingCta, Marquee 등)을 반영한다.

## Phase 2: 핵심 설정 (`config/site.ts`)

`src/config/site.ts`를 클라이언트 정보로 교체한다:
- `siteConfig.name` — 사이트명
- `siteConfig.description` — SEO 설명 (160자 이내)
- `siteConfig.url` — 실제 도메인 (미정이면 placeholder)
- `siteConfig.locale` — "ko" 또는 "en"
- `navLinks` — Phase 1에서 결정한 섹션에 맞게 수정 (href와 섹션 id 일치)
- `footerLinks` — 필요 시 수정

## Phase 3: 페이지 조합 (`app/page.tsx`)

1. Phase 1에서 결정한 섹션 목록에 따라 import 추가/제거
2. JSX에서 섹션 순서 배치
3. 불필요한 섹션 import 완전 제거

## Phase 4: 섹션 데이터 교체

각 섹션 파일의 **상단 데이터 배열**(`★ 설정`)을 클라이언트 콘텐츠로 교체:

- Hero: 헤드라인, 서브텍스트, CTA 버튼 텍스트/링크
- Features/Process: 아이콘(lucide-react) + 제목 + 설명
- Team: 이름, 직책, 이미지 경로, 소개
- Stats: 숫자, prefix/suffix, 레이블
- FAQ: 질문/답변 배열
- Pricing: 플랜명, 가격, 기능 목록
- Map: iframeSrc, 주소/전화/영업시간
- Contact: 폼 레이블 한국어화

**아이콘**: [lucide.dev](https://lucide.dev)에서 업종에 적합한 아이콘 선택.

## Phase 5: 테마 설정

1. 클라이언트가 지정한 메인 컬러로 `globals.css` 수정
   - shadcn/ui 테마 생성기(https://ui.shadcn.com/themes) 활용 권장
   - 최소한 `--primary`, `--primary-foreground` oklch 값 교체
2. `--radius` 조정 (각진 느낌: 0rem, 둥근 느낌: 1rem)

## Phase 6: 공용 컴포넌트 설정

필요한 경우에만:
- `FloatingCta`: `common/floating-cta.tsx`의 buttons 배열 수정 → `layout.tsx` 최하단에 추가
- `LogoBand`/`TrustBand`: `common/marquee.tsx`의 아이템 배열 수정 → `page.tsx` 섹션 사이에 배치
- GA: `.env.local`에 `NEXT_PUBLIC_GA_ID` 설정 (코드 변경 불필요)

## Phase 7: 문의 폼 연동

`contact.ts`는 환경변수 유무에 따라 자동으로 동작을 선택한다. **코드 수정 불필요.**

| 환경변수 | 동작 |
|---|---|
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | contacts 테이블에 저장 |
| `RESEND_API_KEY` + `CONTACT_EMAIL` | 알림 이메일 발송 (Supabase와 동시 사용 가능) |
| 둘 다 없음 | placeholder 성공 응답 (개발용) |

패키지 설치 (사용 시에만):
```bash
pnpm add @supabase/supabase-js   # Supabase 사용 시
pnpm add resend                  # Resend 사용 시
```

Supabase 사용 시 MCP 연결 후 테이블 생성: "contacts 테이블 만들어줘"

## Phase 8: 검증

1. `pnpm check-types` — 타입 에러 없음 확인
2. `pnpm build` — 빌드 성공 확인
3. `pnpm lint` — lint 통과 확인
4. 체크리스트:
   - [ ] 모바일(375px) 레이아웃 정상
   - [ ] 다크모드 전환 정상
   - [ ] 앵커 링크 스무스 스크롤
   - [ ] 문의 폼 제출 동작
   - [ ] navLinks href와 섹션 id 일치
   - [ ] favicon 교체 (app/favicon.ico)

</Workflow>

<Success_Criteria>
- `pnpm build` 성공
- `pnpm lint` 에러 없음
- config/site.ts에 클라이언트 정보 반영
- page.tsx에 결정된 섹션만 존재 (불필요한 import 없음)
- 모든 섹션의 데이터가 클라이언트 콘텐츠로 교체됨 (placeholder 텍스트 없음)
- navLinks와 섹션 id 동기화
</Success_Criteria>

<Pitfalls>
- navLinks의 href와 섹션 id 불일치 — 스크롤 네비게이션이 깨짐
- Hero 변형 선택 후 이전 Hero import 미삭제 — 빌드는 되지만 불필요한 코드
- globals.css 테마 교체 시 .dark 블록 누락 — 다크모드에서 깨짐
- FloatingCta를 page.tsx가 아닌 layout.tsx에 넣어야 모든 페이지에서 보임
- 이미지 경로 컨벤션(public/hero/, public/team/ 등) 미준수 시 관리 어려움
- Map 섹션의 iframeSrc 미교체 — 기본 placeholder 지도 노출
</Pitfalls>

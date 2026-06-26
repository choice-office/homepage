# 블로그 SEO/AEO 설계 — 데이터 모델 · JSON-LD · 공개 렌더

> 목표: 직접 작성한 블로그 글의 검색(SEO)·AI 답변엔진(AEO) 효과 극대화. 도메인이 비자·법률 = **YMYL**이라 **E-E-A-T**(전문성·권위·신뢰)가 특히 중요.
> 원칙: **AI 없음(전부 규칙/데이터 기반)**, **필드 최소화 + 자동 파생**, **구조 > 메타**, **JSON-LD는 화면에 보이는 것만 마크업**.

## 1. 데이터 모델 (`lib/blog-data.ts` `BlogPost`)
필수 최소 + 나머지는 옵션(채우면 렌더·스키마에 반영, 비우면 안전한 기본값 또는 생략).

| 필드 | 필수 | 비우면 | 산출물 |
|---|---|---|---|
| title | ✅ | — | H1 · `BlogPosting.headline` |
| slug(영문) | ✅ | 규칙 폴백(아래) | URL `/blog/{slug}` |
| category | ✅ | — | Breadcrumb · 카드 배지 · `articleSection` |
| content(HTML) | ✅ | — | `.prose` 본문 |
| excerpt | ✅ | — | 카드 요약 · 메타설명 기본값 |
| author | ✅ | 기본 행정사 | 작성자 박스 · `author(Person)` |
| date | ✅ | — | 발행일(가시) · `datePublished` |
| cover(+대표 alt) | 권장 | 그라데이션 | OG image · 카드 · `BlogPosting.image` |
| **tldr** | 옵션 | 안 보임 | 상단 "요점" 콜아웃(답-우선) |
| **faq[] {q,a}** | 옵션 | 안 보임 | 가시 FAQ 블록 + **`FAQPage` JSON-LD** |
| **sources[] {label,href}** | 옵션 | 안 보임 | "참고/근거" 링크(E-E-A-T·AEO) |
| dateModified | 자동 | = date | 수정일 · `dateModified` |
| metaTitle | 옵션 | = title | `<title>` |
| metaDescription | 옵션 | = excerpt | meta description · OG |
| canonical | 고급 | 자기 URL | **절대 네이버로 걸지 말 것** |

- slug 폴백(AI 없음): 영문 입력칸 비면 `{categoryCode}-{shortId}`(예 `f6-3a8c`). 한글 slug보다 영문이 SEO·공유에 유리.
- author는 현재 문자열. 추후 E-E-A-T 강화 시 `AUTHORS`(이름·자격·등록번호·소개) 레지스트리로 확장해 `Person` 풍부화.

## 2. JSON-LD 전략 (상세 페이지 `/blog/[id]`)
- **항상 출력**: `BlogPosting`(headline·description·image·author·datePublished·dateModified·publisher=Organization·mainEntityOfPage·articleSection) + `BreadcrumbList`(홈>블로그>카테고리>제목).
- **조건부**: `FAQPage` — `faq[]`가 있을 때만(가시 FAQ 블록과 **반드시 함께**).
- 출력 방식: 서버 컴포넌트에서 `<script type="application/ld+json">`(layout의 Organization과 동일 패턴, `biome-ignore lint/security/noDangerouslySetInnerHtml`).
- 사업체: 루트 `layout.tsx`의 `Organization`을 **`["Organization","LegalService"]`** 로, `CONTACT`(주소·전화·영업시간)와 `areaServed` 포함해 강화.

> ⚠️ 현실: 2023년 이후 **FAQ 리치결과는 공공/의료 등으로 제한**돼 구글 *리치스니펫*은 대체로 안 뜸. 그래도 **AEO(AI가 읽음)·UX**엔 유효 → 가시 FAQ + FAQPage 유지.

## 3. 공개 상세 페이지 렌더 순서 (구조가 곧 SEO/AEO)
1. (라이트 헤더) breadcrumb · 카테고리 배지 · **H1(title)** · 작성자 · 발행/수정일
2. 커버 이미지(있으면)
3. **요점(TL;DR) 콜아웃**(있으면) — 답-우선
4. 본문 `.prose`(시맨틱 h2/h3 · 목록 · 인용 · figure/img)
5. **자주 묻는 질문**(faq 있으면) — 가시 Q/A
6. **참고/근거**(sources 있으면) — 공식 출처 링크
7. **면책 문구**(자동) — "일반 정보, 개별 사안은 상담"
8. 관련 글(내부링크)
9. JSON-LD(BlogPosting + BreadcrumbList + FAQPage?)

## 4. 메타데이터 (`generateMetadata`)
- title = `metaTitle ?? title`, description = `metaDescription ?? excerpt`, canonical = 자기 URL.
- OpenGraph `type:"article"` + `publishedTime`/`modifiedTime` + image(cover).

## 5. 중복 콘텐츠 / 캐노니컬 전략 (가장 중요)
같은 글이 네이버 + 자사에 동시 존재 시, **자사 도메인을 원본(캐노니컬)** 으로 둔다.
- 자사 글에 **네이버로 `rel=canonical` 걸지 않는다**(걸면 자사 랭킹 포기).
- 이상적: **자사 먼저 게시 → 네이버엔 요약 + 자사 원문 링크**(역링크). 네이버 = 유입 채널.
- 이미지는 **자사/Supabase로 재호스팅 + alt**(핫링크 깨짐 방지 + 이미지 SEO).

## 6. 작성 측 규칙(요지) — 상세는 `docs/BLOG-AUTHORING.md`
제목 질문형/키워드 · 첫 문단 결론(답-우선) · 질문형 H2 3개+ · 목록/표 · 글 끝 FAQ · 이미지 alt · 내부링크/출처 1개+.

## 구현 상태
- ✅ 공개 렌더 + JSON-LD 레이어: **구현됨**(이 문서대로). 옵션 필드는 채우면 렌더·스키마에 반영, 비우면 생략/기본값.
- ⏳ 관리자 작성기능: 미구현(`docs/BLOG-AUTHORING.md` 설계만). 구현 시 위 필드를 채우는 폼만 얹으면 됨.

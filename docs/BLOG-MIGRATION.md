# 블로그 이식 설계 & 계획 — 네이버 원문 200여 개 (근거 기반)

> 목적: 초이스 행정사 네이버 블로그(k-visa1345)의 **자사 1차 전문 콘텐츠(실제 사례)**를 우리 도메인으로 이식.
> 원칙: **본문은 원문 그대로**(구조·이미지·표·지도 충실) + **검색·노출(SEO/AEO)을 위한 가치 레이어**를 얹는다.
> 이 문서는 파일럿 3글(거소증·E6·국적회복)에서 검증한 템플릿을 200여 개로 확장하기 위한 근거·설계·실행계획이다.
> 관련: [BLOG-SEO.md](BLOG-SEO.md) · [BLOG-PORTING.md](BLOG-PORTING.md) · [BLOG-NAVER-INDEX.md](BLOG-NAVER-INDEX.md)

---

## ✅ 이식 완료 현황 (2026-07-18)
**핵심 205개 전량 이식 완료** — 파일럿 3 + 8배치 202. 이미지 약 2,000장 Supabase Storage 재호스팅. 각 글에 품질 레이어(원문 충실 + tldr + 진짜 FAQ 3 + 고유 메타 + 정부 출처 + 이미지 alt + 저자 E-E-A-T + intent 분화 + self-canonical + BlogPosting/Breadcrumb/FAQPage JSON-LD + 업무분야 내부링크) 전부 적용.

| 배치 | 카테고리 | 수 |
| --- | --- | --- |
| 1 | C3·C4 단기 | 9 |
| 2 | D8 주재원·F5 영주권 | 12 |
| 3 | F6 결혼·F1F2F3 | 22 |
| 4 | E6 연예인 | 20(+파일럿1) |
| 5 | E7·D10·H2 취업 | 23 |
| 6 | 국적회복·귀화 | 21(+파일럿1) |
| 7 | F4 거소증군(신청/연장/중국동포/남자/정보/범죄) | 56(+파일럿1) |
| 8 | 해외서류(아포스티유·중국공증·미국여권·한국여권) | 39 |

**미이식(의도적 제외/보류)**: 의뢰인 후기(28, 홈 이미지 섹션 중복) · 선별 공지/정보(24 중 오시는길·소개 제외 → 공지/정보/일기만 선택 이식은 보류) · 기타(3).
재현 파이프라인: `scratchpad/parse-batch.py`(SE 파서) + `build-generic.mjs`(이미지 재호스팅+삽입) + `batchN-records.json`(품질 레이어). logNo 인덱스는 [BLOG-NAVER-INDEX.md](BLOG-NAVER-INDEX.md).

---

## 0. 결론(TL;DR)

**조건부 GO.** 순수 verbatim 대량 복제는 위험하다(스팸정책 회색지대 · 네이버와 중복 deindex · 자기잠식). 그러나 이 콘텐츠는 **긁어온 남의 글이 아니라 자사 행정사의 실제 사례**다. 아래 **가치 레이어 + 자기잠식 방지 설계 + 품질 게이트**를 얹으면 정당하고 가치 있는 이식이 된다.

- **하면 안 되는 방식**: 본문만 붙여넣고 순위용으로 대량 살포 → 2024 스팸정책·중복 deindex 직격.
- **해야 하는 방식**: 본문 충실 + (자기 canonical · 고유 메타 · 답-우선 tldr · 진짜 FAQ · **정부 출처** · **저자 E-E-A-T** · 내부링크 · **의도(intent) 분화**) + 배치별 검수.
- **기대치**: 급반전 아님. **구글 롱테일 + AEO 인용 + 도메인 주제권위**의 누적형. 네이버 원문이 살아있는 한 상한은 존재.

---

## 1. 이식 여부 — 객관적 판단(근거)

### 1-1. 구글 "스케일 콘텐츠 남용" 정책 (2024.3) — 가장 큰 리스크
- 정의: *"가치 추가 없이 순위 조작을 주목적으로 다수 페이지를 생성"*. 자동/수동 무관, **의도와 결과**로 판단.
- **핵심**: *"republish 앞에 요약 문단 하나 붙이는 건 변형으로 안 쳐준다"* → **thin 추가로 대량 복제하면 위반 소지**.
- 단, *"분량 자체는 문제 아님 — 고품질 페이지 수천 개는 벌 안 받음. 문제는 **가치 없는 분량**"*.
- **우리 케이스 판정**: 콘텐츠가 **자사 1차 전문(실제 처리 사례·수치·절차)** 이라 사용자 가치가 실재 → 스팸의 "핵심 의도(순위조작 대량생산)"와 다르다. 그러나 **thin하게 대량 이식하면 회색지대**. → **실질 가치 레이어 + 차별화가 안전선**.
- 근거: [Google March 2024 core update & spam policies](https://developers.google.com/search/blog/2024/03/core-update-spam-policies) · [SEJ: Google spam policies](https://www.searchenginejournal.com/in-depth-look-at-google-spam-policies-updates/511005/)

### 1-2. 네이버와의 교차도메인 중복 — deindex 위험
- 구글은 **교차도메인 canonical을 힌트로만** 취급하고, 비뉴스 신디케이션엔 **의존하지 말라**고 권고.
- 우리는 **네이버에 우리 도메인으로 canonical을 걸 수 없다**(네이버 소유). 즉 "우리가 원본"을 네이버 쪽에서 선언 불가.
- **2025 구글**: canonical 없어도 **저가치 중복 페이지를 더 공격적으로 deindex**.
- **완화**: (a) 우리 버전을 **차별화**(tldr·FAQ·출처·구조=고유 부가가치) → 순수 복제본이 아니게, (b) **self-canonical** 유지, (c) [선택] 클라이언트가 네이버 원문 비공개/색인차단(사업 판단 — 네이버 검색 가치가 있어 보통 유지).
- 근거: [Google cross-domain canonicals](https://developers.google.com/search/blog/2009/12/handling-legitimate-cross-domain) · [SEJ: cross-domain canonicals](https://www.searchenginejournal.com/google-guidance-on-cross-domain-canonicals/486097/) · [Search Engine Land: canonicalization 2026](https://searchengineland.com/canonicalization-seo-448161)

### 1-3. 키워드 자기잠식 — 200개 규모에서만 생기는 문제
- F4 거소증 **57개**, 결혼 22, 국적회복 22 등 **유사 주제 다수** → 같은 키워드로 **자기들끼리 경쟁**해 전부 순위 하락.
- 해법: **병합 / 리다이렉트 / 의도 차별화 / 대표(pillar)로 내부링크 집중**. 발행 전 **키워드-URL 의도맵**을 짜는 게 정석.
- 근거: [Yoast](https://yoast.com/keyword-cannibalization/) · [Semrush](https://www.semrush.com/blog/keyword-cannibalization-guide/) · [Ahrefs](https://ahrefs.com/blog/keyword-cannibalization/)

### 1-4. E-E-A-T / YMYL (비자·법률 = YMYL) — 신뢰 없으면 노출 없음
- 2025.9 품질평가 가이드라인은 **법률 사이트에 더 엄격**(부정확한 법률정보는 심각).
- **저자 익명(회사명만)은 YMYL 레드플래그** → **실명 저자 + 자격·경력 bio** 필요.
- **정부(.gov) 1차 출처 인용**을 보상(하이코리아·법무부·출입국).
- **신선도**(법·절차 변경 반영), **검증 가능한 자격·사례 성과**.
- 우리 강점: 글이 **실제 사례(성과)** → 경험(Experience) 신호는 강함. **저자·출처·자격 표기만 보강**하면 큰 상승 여지.
- 근거: [E-E-A-T & YMYL 2026 guide](https://outpaceseo.com/article/eeat-seo/) · [E-E-A-T for lawyers](https://goconstellation.com/blog/eeat-ymyl-for-lawyers/) · [Immigration lawyer SEO checklist](https://authorityspecialist.com/industry/legal/immigration-lawyer/seo-checklist)

### 1-5. AEO/GEO — AI 답변엔진 인용 요인
- **인용을 가장 크게 올리는 요소(학술 연구)**: ① **통계/수치 추가** ② **출처 인용** ③ **인용문**. 키워드 스터핑은 오히려 저조.
- **답-우선**: 첫 **40–60단어**에 직접 답. **사실 밀도**: 150–200단어마다 수치.
- **주의(냉정)**: AI 엔진은 **earned media(제3자 권위)를 압도적으로 선호** — 비유료 AI 인용의 **85%+가 earned media**, 자사(brand-owned) 콘텐츠는 인용률이 낮음. → 자사 블로그 AEO는 **롱테일·틈새 절차질문**에서 승부(그런 질문은 earned media가 얇음).
- 구글 AI Overviews는 **기존 상위 랭킹 콘텐츠를 우선** → SEO와 AEO는 연결됨.
- 근거: [Frase GEO 2026](https://www.frase.io/blog/what-is-generative-engine-optimization-geo) · [Geoptie GEO guide](https://geoptie.com/blog/generative-engine-optimization) · (Princeton/GT/IIT GEO 논문, 2024)

### 1-6. 종합 판정
| 관점 | 순수 verbatim 대량 | 본문충실 + 가치레이어 + 차별화 |
| --- | --- | --- |
| 스팸정책 | 회색지대(위험) | 안전(1차 전문 + 실질가치) |
| 중복 deindex | 높음 | 낮음(차별화) |
| 자기잠식 | 심각(F4 57 등) | 완화(의도맵·pillar) |
| YMYL 신뢰 | 약함 | 강함(저자·출처) |
| AEO | 낮음 | 중상(구조·통계·출처) |
→ **가치레이어를 반드시 얹는 조건에서 GO.** 안 얹으면 **하지 않는 편이 낫다.**

---

## 2. 검색·노출 설계 — "원문 충실 + 얹는 레이어" (글마다)

> 본문(HTML)은 네이버 원문 그대로 유지. 아래는 **본문을 바꾸지 않고 얹는 메타/구조/데이터**이며, ★는 200개 규모에서 추가된 항목.

| # | 레이어 | 무엇을 | 근거 |
| --- | --- | --- | --- |
| 1 | 본문 | 원문 그대로(구조·이미지·표·지도·굵기·정렬). 원문의 **수치(9일/8개월/30여종)** 보존 = GEO "통계" 요인에 부합 | GEO |
| 2 | **self-canonical** | 우리 URL이 대표(네이버로 안 검) | 교차도메인 |
| 3 | 고유 meta title/description | 원문과 다른 **검색어 중심**. title은 랭킹요인 | 일반 SEO |
| 4 | **tldr(답-우선)** | 첫 40–60단어에 결론. `요점` 콜아웃 렌더 | GEO 답-우선 |
| 5 | **진짜 FAQ 3–5문답 + FAQPage 스키마** | 본문에서 실제 뽑히는 Q&A만. thin 금지 | AEO |
| 6 | ★ **정부 출처(sources[])** | 하이코리아/법무부/출입국 공식 링크 1+ | GEO 출처 · E-E-A-T |
| 7 | ★ **저자 E-E-A-T** | 회사명 대신 **실명 대표 행정사** + 자격/경력 bio, `author` 스키마(Person), 저자 페이지 연결 | YMYL |
| 8 | 내부링크 | 글→업무분야(서비스), 글→관련글, ★글→**카테고리 허브/대표글** | 자기잠식·크롤 |
| 9 | ★ **의도(intent) 분화 맵** | 유사 글마다 **고유 롱테일 각도** 배정, 겹치면 **pillar 지정 + 나머지는 내부링크로 대표 보강** | 자기잠식 |
| 10 | published_at = **원문 날짜** | 정렬·datePublished 정확. updated_at로 신선도 | E-E-A-T 신선도 |
| 11 | ★ **이미지 alt** | 현재 `alt=""` → **서술적 alt**(이미지검색·접근성·AEO 맥락) | 이미지 SEO |
| 12 | 스키마 | BlogPosting(+author Person) · BreadcrumbList · FAQPage(조건부). 절차글엔 HowTo 선택 | 리치/AEO |
| 13 | sitemap / robots | 블로그 URL 포함(구현됨) · index 허용 · lastmod | 크롤 |

### 2-1. 자기잠식 방지 — 의도맵(핵심 설계)
카테고리 안에서 각 글에 **서로 다른 검색 의도**를 배정한다. 예 — **F4 거소증군(57)**:
- **pillar(대표)**: "재외동포 F4비자·거소증 신청 방법"(총론) ← 서비스 `/services/f4`와 연결, 나머지 글이 내부링크로 보강.
- supporting(각기 다른 롱테일): `거소증 급행/빠르게` · `거소증 필요서류` · `F4-42 신청` · `F4비자 연장` · `중국동포 F4` · `거소증 남자(병역)` · `거소증 범죄경력` · `거소증 소지자 은행/본인인증` …
- 같은 롱테일이 2개 이상이면 → **더 완성도 높은 1개를 대표로**, 나머지는 사례로서 대표를 내부링크. (병합/삭제는 원문 충실 원칙상 지양, 대신 **차별 각도 + 내부링크**로 해소)

### 2-2. 저자 E-E-A-T (1회 셋업, 전 글 공유)
- `blog_authors`에 **대표 행정사 실명 + 직함 + 자격(행정사 자격/시험 합격)+ 주요 경력** 저장, 글의 author로 연결.
- 상세 페이지: 저자 바이라인 + (선택)저자 소개 링크(`/greeting` 또는 `/members`). JSON-LD `author: Person`에 `name`, `jobTitle`, `url`, (가능하면)`knowsAbout`.
- 이유: YMYL 익명 콘텐츠 = 레드플래그. 사이트에 이미 대표 자격/경력 데이터 존재(`site-data.ts` TEAM) → 재사용.

---

## 3. 실행 계획

### 3-1. 파이프라인(글 1개 처리)
1. 크롤(모바일 HTML) → **SE 파서**(본문 충실, `scratchpad/parse2.py` 확장)
2. 이미지 **재호스팅**(Supabase Storage `blog/naver/{pid}/n`) + **alt 자동 생성**(제목·문맥 기반, 핵심 글은 검수)
3. **slug**(한글 kebab, 키워드 포함, **중복 회피**)
4. 원문에서 **제목·작성일·해시태그** 추출
5. **가치 레이어**: tldr · FAQ · 고유 meta · **gov 출처** · **intent 각도** 배정
   - 핵심 카테고리(F4·국적회복·E6·결혼·취업) = **손 검수(고품질)**
   - 그 외 = **자동 생성 + 스팟 체크**(thin FAQ면 FAQ 생략)
6. `blog_posts` insert(status=published, category 매핑, author 연결)

### 3-2. 순서(리스크 관리)
0. **1회 셋업**: 저자 E-E-A-T + 정부 출처 라이브러리(카테고리별 공식 링크) + intent맵 템플릿
1. **파일럿 확장**: 단기초청 C3(5)+C4(4)=9 → 자동화+품질레이어 완성·검수
2. **중형 핵심**: 영주권(11) → 결혼(22) → E6(21) → 취업(23) → 국적회복·귀화(22) → 주재원(1)
3. **최대**: F4 거소증군(57) — **intent 분화가 가장 중요**(대표 지정 + 롱테일 분산)
4. **해외서류(39)**: 아포스티유·중국공증·미국여권·한국여권
5. **선별 공지/정보**(오시는 길·사무소 소개 제외 = 페이지 중복). **후기(28)=제외**(이미지 섹션 중복)

### 3-3. 배치별 품질 게이트(통과해야 다음)
- [ ] 본문 충실(이미지·표·지도·정렬·굵기)
- [ ] 고유 meta / tldr(답-우선) / **thin 아닌 FAQ**
- [ ] **gov 출처 1+** · **이미지 alt** · **원문 날짜** · 저자 연결
- [ ] **intent 중복 검사**: 같은 롱테일 2+ → 대표 지정 + 내부링크
- [ ] 렌더 스팟체크(Playwright 스냅샷)

### 3-4. 배치 메커니즘/주의
- 네이버 이미지 fetch **rate limit** → 딜레이·재시도. 스토리지 용량 모니터.
- slug **전역 중복 검사**(260개).
- 커밋만(배포는 `git deploy`) — [DEPLOY.md](DEPLOY.md).

---

## 4. 리스크 & 완화 요약
| 리스크 | 완화 |
| --- | --- |
| 스케일 콘텐츠 남용 | 자사 1차 전문 + 실질 가치레이어. "순위조작 대량생산" 아님. thin 자동 살포 금지 |
| 중복 deindex(네이버) | 차별화(구조·가치) + self-canonical. (선택)네이버 원문 정책=클라이언트 결정 |
| 자기잠식 | intent맵 + pillar + 내부링크 |
| YMYL 신뢰 부족 | 실명 저자·자격·gov 출처·신선도 |
| AEO earned-media 편향 | 기대치 관리 — 롱테일·도메인권위 중심 |

## 5. 구현 현황(파일럿 3글 기준)
- ✅ 본문 충실, self-canonical, BlogPosting/Breadcrumb/FAQPage, tldr, 진짜 FAQ, 내부링크(업무분야), 고유 메타(H1=원문/`<title>`=SEO), 원문 날짜, sitemap 포함
- ✅ **저자 E-E-A-T** — 실명 비공개(대표 행정사 결정) → 브랜드명 저자 + 바이라인 `자격·경력 보기`→`/members`(구성원) + JSON-LD `author.jobTitle/url(/members)/worksFor`
- ✅ **정부 출처(sources[])** — 하이코리아·법무부/문체부 공식 링크(글별 2개)
- ✅ **이미지 alt** — 서술형 자동 부여(빈 alt 0)
- ⬜ **남은 것(대량 이식용)**: ★intent 분화 맵(카테고리별) · 파이프라인 자동화(slug/날짜/제목/태그 추출 + 품질레이어 배치)

> 저자 표기 결정: 대표 행정사가 **실명 비공개** 요청 → 실명 Person 대신 **브랜드명 + `/members`(자격·경력·등록번호) 연결**로 E-E-A-T 확보. 실명 Person이 미세하게 더 강하나, 등록번호(고유 식별)+자격 페이지 링크로 검증 가능성은 충족.

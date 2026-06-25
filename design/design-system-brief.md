# 디자인 시스템 브리프 — 초이스 행정사 (LawUs Tone Down)

> Claude Design / Figma에 **그대로 붙여넣어** 디자인 시스템을 생성하기 위한 사양서.
> 색상 단일 출처는 [color-palette.md](./color-palette.md), 코드 구현은 `src/app/globals.css` + 컴포넌트.

---

## 0. 브랜드 한 줄
출입국·비자 전문 **행정사 사무소**. 따뜻하지만 **묵직하고 신뢰감 있는 토프 브라운**.
**흰 배경 + 무게감 있는 브라운 포인트.** 한국어 우선(Noto Sans KR), 클래식·전문가 톤.

---

## 1. 컬러 토큰
| 이름 | HEX | 용도 |
|---|---|---|
| Primary | `#6C5D4C` | 버튼·헤더 강조·아이콘 |
| Primary Dark | `#524636` | hover·푸터 배경·진한 강조 |
| Primary Light | `#8C7D6A` | 보조 강조 |
| Accent | `#7C6346` | 링크·세컨더리 강조 |
| Accent Soft | `#E1D7C6` | 배지·태그 배경 / 밝은 강조 면 |
| Background | `#FFFFFF` | 기본 배경 |
| Surface | `#F5F3EF` | 카드·섹션 배경 |
| Surface Alt | `#ECE7DF` | 교차 섹션 |
| Border | `#E2DDD3` | 테두리·구분선 |
| Ink | `#222222` | 제목 |
| Body | `#3F3A34` | 본문 |
| Muted | `#888888` | 보조·캡션 |
| On Primary / On Accent | `#FFFFFF` | primary·accent 위 텍스트 |

**규칙:** primary/accent 면 위 텍스트는 흰색. 밝은 면(surface/accentSoft) 위는 ink/body.

---

## 2. 타이포그래피
- **서체:** Noto Sans KR (400 Regular / 500 Medium / 700 Bold)
- **스케일**
  | 토큰 | 크기(데스크탑) | 굵기 | 비고 |
  |---|---|---|---|
  | Display / H1 | 48–60px | 700 | tracking tight, `text-wrap: balance` |
  | H2 | 30–36px | 700 | 섹션 제목 |
  | H3 | 18–20px | 600 | 카드 제목 |
  | Body | 16–18px | 400 | 본문, `text-wrap: pretty` |
  | Small | 14px | 400/500 | 메뉴·라벨 |
  | Caption | 12–13px | 400 | 보조 |
- **한글 줄바꿈:** `word-break: keep-all` (어절 단위로 줄바꿈, 단어 중간 끊김 방지)

---

## 3. 모양 · 간격
- **Radius:** 기본 `6px`(0.375rem) — 살짝 각진 클래식. sm 4 / md 5 / lg 6 / xl 8 / 2xl 11px
- **그리드:** 4px 베이스. 섹션 상하 여백 96px(py-24)
- **컨테이너:** 본문 max 1152px / 헤더 max 1280px, 좌우 패딩 16/24/32px
- **그림자:** 아주 약하게만 (카드 hover 시 soft shadow). 과한 그림자 금지
- **z-index:** dialog 100 / header 50 / floating 40

---

## 4. 핵심 컴포넌트
- **Button**
  - Primary: bg `Primary`, text 흰색, radius 6, 크기 sm/md/lg
  - Outline: 투명 bg + `Border` 테두리 + `Ink` 텍스트
  - Secondary: bg `Accent Soft` + `Primary Dark` 텍스트
- **Card:** bg 흰색, 1px `Border`, radius 6, hover 시 soft shadow
- **Badge / Tag:** bg `Accent Soft`, text `Primary Dark`, pill
- **Input / Select / Textarea:** 1px `Border`, radius 6, placeholder `Muted`, focus ring `Primary`
- **Header:** 높이 80px, 고정. 홈 최상단 **투명**(흰 글자) → 스크롤/메뉴 펼침 시 **흰 배경**(짙은 글자). 메가메뉴(상위 메뉴 아래 하위 항목 일자 정렬)
- **Footer:** bg `Primary Dark`, 흰색 계열 텍스트, 로고+가로 메뉴(구분선 `|`)+정보 라인
- **Section 리듬:** 흰색 / `Surface` 교차

---

## 5. 화면(스크린) — 디자인 시스템 적용 대상
홈 1페이지: Hero(풀배경 사진+좌측 텍스트) → 신뢰 띠 → 의뢰인 후기 → 업무분야(비자 8종 카드) → 강점 → 프로세스 → 통계 → 대표 소개 → 자격·인증 → FAQ → 상담 CTA → 오시는 길 → 문의 폼.
서브: 사무소 소개 / 업무분야 목록·상세 / 후기 / 문의 / 블로그.

---

## 6. Claude Design → Figma 시작 순서 (권장)
1. **Design systems 탭 → 새 디자인 시스템 생성.** 이름: `초이스 행정사 (LawUs Tone Down)`.
2. 위 **§1 컬러 → 색상 토큰**, **§2 타이포 → 텍스트 스타일**, **§3 radius/spacing → 토큰**으로 등록. (이 md 전체를 프롬프트에 붙여넣어 자동 생성도 가능)
3. **§4 컴포넌트**를 컴포넌트 라이브러리로 생성(Button/Card/Input/Header/Footer/Badge).
4. 새 프로젝트(또는 Prototype 템플릿) 생성 시 **이 디자인 시스템 선택** → §5 화면을 디자인.
5. 완료 후 **Figma로 내보내기**(Export/Copy to Figma) — 디자인 시스템이 컴포넌트/스타일로 연결됨.
</content>

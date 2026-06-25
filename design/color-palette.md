# 컬러 팔레트 — 로어스 톤다운 / LawUs Tone Down

신뢰감 있고 차분한 **토프 브라운** 계열. 따뜻하지만 묵직한 전문가 톤.
전체적으로 **흰 배경 + 묵직한 브라운 포인트**.

> 적용 위치: [`src/app/globals.css`](../src/app/globals.css) 의 `:root` (oklch 변환). 이 문서가 색상의 단일 출처(source of truth).

---

## 1. 원본 팔레트 (hex)

### 주조색 (브랜드 메인 / 버튼·헤더·강조)
| 토큰 | hex | 용도 |
|---|---|---|
| `primary` | `#6C5D4C` | 기본 브랜드 색 (버튼·헤더·강조) |
| `primaryDark` | `#524636` | hover·진한 강조·**푸터** |
| `primaryLight` | `#8C7D6A` | 보조 강조·아이콘 |

### 포인트색
| 토큰 | hex | 용도 |
|---|---|---|
| `accent` | `#7C6346` | 링크·세컨더리 강조 |
| `accentSoft` | `#E1D7C6` | 태그·배지 배경 (위에 `primaryDark` 텍스트) |

### 배경 / 면
| 토큰 | hex | 용도 |
|---|---|---|
| `background` | `#FFFFFF` | 페이지 기본 배경 |
| `surface` | `#F5F3EF` | 카드·섹션 배경 |
| `surfaceAlt` | `#ECE7DF` | 교차 섹션·구분 배경 |
| `border` | `#E2DDD3` | 테두리·구분선 |

### 텍스트
| 토큰 | hex | 용도 |
|---|---|---|
| `ink` | `#222222` | 제목·강한 텍스트 |
| `body` | `#3F3A34` | 본문 |
| `muted` | `#888888` | 보조·캡션 |
| `onPrimary` | `#FFFFFF` | primary 위 텍스트 |
| `onAccent` | `#FFFFFF` | accent 위 텍스트 |

### 규칙
- `primary` / `accent` 배경 위 텍스트는 **흰색** (`onPrimary` / `onAccent`).
- 밝은 면(`surface` / `accentSoft`) 위 텍스트는 `ink` / `body`.
- 전체적으로 흰 배경 + 묵직한 브라운 포인트.

---

## 2. shadcn/Tailwind 변수 매핑 (`globals.css` `:root`)

| shadcn 변수 | 팔레트 토큰 | hex | oklch |
|---|---|---|---|
| `--background` | background | `#FFFFFF` | `oklch(1 0 0)` |
| `--foreground` | ink | `#222222` | `oklch(0.26 0.004 60)` |
| `--card` / `--popover` | background | `#FFFFFF` | `oklch(1 0 0)` |
| `--card-foreground` / `--popover-foreground` | ink | `#222222` | `oklch(0.26 0.004 60)` |
| `--primary` / `--ring` / `--chart-1` | primary | `#6C5D4C` | `oklch(0.46 0.03 72)` |
| `--primary-foreground` | onPrimary | `#FFFFFF` | `oklch(0.99 0 0)` |
| `--secondary` / `--accent` / `--chart-4` | accentSoft | `#E1D7C6` | `oklch(0.88 0.022 85)` |
| `--secondary-foreground` / `--accent-foreground` | primaryDark | `#524636` | `oklch(0.37 0.03 72)` |
| `--muted` | surface | `#F5F3EF` | `oklch(0.965 0.005 85)` |
| `--muted-foreground` | muted | `#888888` | `oklch(0.63 0.004 70)` |
| `--border` / `--input` | border | `#E2DDD3` | `oklch(0.89 0.008 85)` |
| `--chart-2` | accent | `#7C6346` | `oklch(0.49 0.05 68)` |
| `--chart-3` | primaryLight | `#8C7D6A` | `oklch(0.58 0.03 78)` |
| `--chart-5` | ink | `#222222` | `oklch(0.26 0.004 60)` |
| `--radius` | — | — | `0.375rem` (클래식·각진 느낌) |

### 컴포넌트별 적용
- **헤더**: 홈 최상단 투명 → 스크롤/펼침 시 `background`(흰색). 텍스트 `ink`/흰색 전환.
- **푸터**: 배경 `primaryDark #524636` + 흰색 계열 텍스트 (`src/components/layout/footer.tsx` 에 hex 직접 지정).
- **버튼(primary)**: `primary` 배경 + `onPrimary` 흰 텍스트.
- **CTA 블록 / TrustBand**: `secondary`(accentSoft) 밝은 면 + `primaryDark` 텍스트.
- **PageHeader / 히어로 하이라이트**: `accent`(accentSoft).
- **아이콘 틴트 배경**: `bg-primary/10` (연한 브라운).

---

## 3. 참고 / 주의

- **다크모드 비활성화**: 현재 라이트 전용 (`providers.tsx` `defaultTheme="light"`, 토글 제거). `.dark` 블록은 재활성화 대비 톤만 맞춰 둠.
- **접근성(muted #888)**: `#888`은 흰 배경에서 명암비 약 3.5:1 로 WCAG AA(본문 4.5:1) **미달**. 현재는 스펙대로 적용했으나, **국적회복 등 고령 의뢰인** 대상임을 고려하면 본문·부제에는 조금 더 진한 톤(예: `#5F574B`, 약 6:1) 권장. 순수 `#888`은 캡션 등 보조 텍스트에 한정 사용 권장.
- 색 변경 시 이 표의 `:root` 값만 바꾸면 헤더·버튼·카드 등 전체 일괄 반영. 푸터 배경 hex(`#524636`)는 별도 교체 필요.
</content>

# 설계 결정 & 보류 항목 (왜 이렇게 했는가)

> 미래의 Claude Code가 **의도된 선택을 "버그"로 오인해 되돌리지 않도록**, 그리고 **이미 검토한 큰 작업을 다시 분석하지 않도록** 기록한다.

## 확정된 결정 (의도적 — 함부로 바꾸지 말 것)
- **인라인 style + CSS 변수**가 기본. Claude Design export를 포팅한 결과. 새 코드는 이 스타일을 따른다(전면 Tailwind 이관은 아래 '보류').
- **사이트 컴포넌트는 `ds.tsx`** 를 쓰고 `components/ui/*`(shadcn)는 거의 안 쓴다(Select 제외). `ui/`는 직접 수정 금지.
- **헤더 메가메뉴는 JS 상태 기반**(순수 CSS hover 아님). 이유: 클릭 시 강제 닫힘/hover-intent 지연/포커스 정리를 위해 필요. 헤더에 **`backdrop-filter` 금지**(fixed 메가패널 기준이 헤더로 잡혀 위치가 어긋남 — 실제로 겪고 제거함).
- **페이지 전환은 `app/template.tsx` + `.page-enter` CSS 페이드.** React `<ViewTransition>`/Next `experimental.viewTransition`은 **쓰지 않는다**: React 19.2 stable엔 `ViewTransition` export가 없고(canary 전용), Next 공식 문서가 프로덕션 비권장. `next-view-transitions` 라이브러리도 nav 전체를 감싸는 부담이라 미채택.
- **블로그 본문 = HTML 문자열**(에디터 출력 가정). docs/BLOG.md 참고.
- **연락처는 `CONTACT` 단일 출처**(site-data). 전화/주소/이메일 하드코딩 금지.
- 동적 className은 **`cn(...)`** 으로(템플릿 리터럴 X) — biome `lint:fix --unsafe`가 조건부 템플릿 공백을 깨뜨린 적 있음.
- 배포는 **git push(main)** 경로로. 커밋 author 이메일과 Vercel Git 계정 불일치 시 CLI `vercel deploy`는 BLOCKED 됨.

## 보류 항목 (검토 완료 — 가치는 있으나 현재 미적용, 사용자 합의로 보류)
세계 최고 수준 코드리뷰(3개 에이전트)에서 도출. *"라이브 클라이언트 사이트 안정성 우선 + 가장 잘 맞도록"* 판단으로 아래는 의도적으로 보류했다. 착수 시 회귀 위험이 있으니 별도 합의 후 진행.

| 항목 | 상태 | 비고 |
|---|---|---|
| **사이트 전체 `<button onClick go()>` → `<Link>` 전환** | 보류 | SEO 가치 큼(크롤러는 `<a href>` 선호). 하지만 모든 내비에 영향 → 회귀 위험. 블로그는 이미 `<Link>`. **신규 링크는 `<Link>` 우선.** |
| **`sections.tsx`(~1700줄, "use client") 분할** | 보류 | 정적 컴포넌트가 다수 클라이언트 번들에 포함됨. 분할하면 서버 컴포넌트화 가능하나 churn 큼. `#Link 전환`과 묶어서 하는 게 효율적. |
| **인라인 style → Tailwind 전면 이관(268곳)** | 보류 | 다크모드 재개·일관성에 좋지만 대형 리팩터. ROI 낮다고 판단. *점진 이관*만 권장(신규/수정 코드부터). |
| **다크모드 재활성화** | 보류 | 인라인 하드코딩 색(#fff 등) 때문에 절반만 전환돼 깨짐. Tailwind/CSS변수 이관이 선행돼야. 현재 `providers.tsx` light 고정. |
| **`ContactForm` → `useActionState`** | 보류 | 액션은 호환 시그니처지만 폼은 수동 state. 현재 폼은 Supabase 저장까지 **검증 완료·정상 동작** → 회귀 위험 피해 보류. |
| **scroll 리스너 → IntersectionObserver**(header/ConsultBar) | 보류 | React가 동일 boolean state는 리렌더 bail-out → 실효 이득 marginal. 센티넬 DOM 추가 복잡도 대비 가치 낮다고 판단. |
| **`routePath`/`pathToRoute` 단일화** | 보류 | 역함수 이중 정의. 저위험이나 가치 marginal. `#Link 전환` 시 상당 부분 소멸 → 그때 함께. |
| **중복 UI 컴포넌트 추출**(IconChip 6회, ContactRow) | 일부 | 데이터 중복(CONTACT)은 해결. 시각 컴포넌트(IconChip/ContactRow) 추출은 미적용 — 여력 시 진행. |

## 이미 적용된 개선 (리뷰 반영분)
- `ds.tsx` Button/Input/Textarea: hover/focus를 `useState`→CSS(.ds-btn/.ds-field) — 리렌더·할당 제거.
- 연락처 데이터 단일화(`CONTACT`) + 내가 만들었던 `LOCATION_ROWS` 값 중복 제거.
- `next.config` 이미지 호스트 `**` → unsplash + `*.supabase.co` 로 제한(오픈 프록시 차단).
- 헤더 인터랙션 정리(hover-intent, prefetch, ARIA `aria-controls`/`aria-current`, 포커스 박스 제거, 경계선 정리).
- 블로그 목록 페이지네이션 + 상세 + `.prose` + sitemap.

## 검증 기준 (완료로 부르기 전)
`pnpm check-types` · `pnpm lint` · `pnpm build` 통과 + (push 시) `knip` 통과. 가능하면 프로덕션 READY 확인.

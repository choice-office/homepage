# 공식 등록·소속 로고 (Affiliations 밴드)

메인 하단 `Affiliations` 섹션( `src/components/site/sections.tsx` )에서 쓰는 공식 단체 로고 자리.
현재는 로고 SVG가 없어 **emblem 아이콘**으로 자리만 잡아 두었다. 실제 로고를 받으면 아래대로 교체한다.

## 1) 로고 파일 받기 (직접 구해야 함 — 자동 수집 불가)

| 배지 | 어디서 받나 | 비고 |
|---|---|---|
| **법무부 등록 출입국민원 대행기관** | 법무부 정부상징(CI)은 [gov.kr 정부상징체계](https://www.gov.kr) 에서. 단, 정부 CI는 사용규정 확인 필요. | 보통 **텍스트 배지로 충분**(로고 없이도 OK). |
| **대한행정사회** | 협회 공식 홈페이지 [haengjeongsa.or.kr](https://www.haengjeongsa.or.kr) 의 CI/로고, 또는 협회에 요청 | 행정사법상 법정단체 |
| **한국행정사회 / 시험행정사회** | 해당 협회 공식 홈페이지에서 다운로드, 또는 협회에 요청 | **실제 소속 협회만** 표기 |

> ⚠️ 공식 로고/정부 CI는 저작권·사용규정이 있다. **사무소가 실제 소속/등록된 단체의 로고만**, 사용 허가 범위 내에서 사용할 것. 소속 여부가 불확실하면 표기하지 말 것.

가능하면 **투명 배경 SVG**(없으면 PNG@2x). 파일명 예: `moj.svg`, `daehan-haengjeongsa.svg`, `korea-haengjeongsa.svg` → 이 폴더에 둔다.

## 2) 코드 연결

`src/components/site/sections.tsx` 의 `AFFILIATIONS` 배열에 `logo` 경로를 추가하고,
`Affiliations` 컴포넌트의 `.affiliation-emblem` 자리를 로고로 교체:

```tsx
// SVG 라면 인라인 <img> 대신 next/image 사용 권장(또는 인라인 svg)
import Image from "next/image";

// 배열
{ name: "대한행정사회", note: "행정사 법정단체 소속", logo: "/badges/daehan-haengjeongsa.svg" },

// 렌더 (emblem 대신)
{a.logo
  ? <Image className="affiliation-logo" src={a.logo} alt={a.name} width={120} height={44} />
  : <span className="affiliation-emblem" aria-hidden="true"><Icon n={a.icon} style={{ width: 24, height: 24 }} /></span>}
```

`.affiliation-logo` 스타일(높이 44px)은 `globals.css` 에 이미 정의돼 있다.

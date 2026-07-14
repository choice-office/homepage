# 의뢰인 후기 이미지 (review_images)

카카오톡·이메일 캡처(개인정보 **마스킹본**)를 매트 프레임 갤러리로 노출한다. 후기는 텍스트가 아닌 **이미지 전용** 데이터다(과거 텍스트 후기 카드는 이미지 갤러리로 대체·제거됨).

## 렌더 흐름

```
Supabase review_images (is_published=true, sort_order)
      │  getPublishedReviewImages()  ← src/lib/review-images.ts
      │  (미설정/빈/오류 → 로컬 REVIEW_IMAGES 폴백)
      ▼
app/page.tsx (async)         → <ReviewsPreview images={...} />      → 홈 마퀴(전체 흐름)
app/reviews/page.tsx (async) → <ReviewImageGallery images={...} />  → /reviews 그리드(페이지당 6, 페이저 상시)
```

- 두 페이지 모두 `export const revalidate = 60` (ISR).
- `ReviewImageGallery`는 `images` prop을 받고, 기본값은 로컬 `REVIEW_IMAGES`(하위호환).
- 컴포넌트는 client(`"use client"`) — 서버 페이지에서 fetch해 prop으로 주입한다(blog_posts와 동일 구조).

## 데이터 모델

`REVIEW_IMAGES`(src/lib/site-data.ts)와 DB `review_images`가 1:1 대응한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK |
| `src` | text **unique** | 이미지 URL(Supabase Storage) 또는 `/public` 경로 |
| `w`, `h` | integer | 원본 픽셀 크기 — 카드/라이트박스 비율 계산 |
| `tag` | text | 사건 유형 (예: `거소증 · 상담`) |
| `quote` | text | 발췌 인용(각색 가능) |
| `meta` | text | 익명 속성 (예: `재방문 의뢰인`) |
| `is_published` | boolean | 공개 노출 여부(기본 false) |
| `sort_order` | integer | 노출 순서(오름차순) |
| `created_at`, `updated_at` | timestamptz | 생성/수정(수정은 트리거 자동 갱신) |

**RLS**: 공개(anon/authenticated)는 `is_published=true`만 SELECT. 쓰기는 관리자가 `service_role`(RLS 우회)로 처리.

## 이미지 저장

- **지금**: `public/review/review-NN.*` — 이미 마스킹된 캡처. `src`에 `/review/...` 경로.
- **admin 도입 후**: **Supabase Storage 버킷**(예: `reviews`)에 관리자가 마스킹본 업로드 → `src`에 public URL 저장. `next.config.ts`의 `images.remotePatterns`가 해당 호스트를 허용해야 한다(현재 `**`).
- 업로드 시 `w`/`h`는 이미지 실제 해상도를 넣는다(비율 유지). 가로형(이메일)도 그대로.

## 적용 상태 (DB — 적용 완료)

프로젝트 `pohfmrzgtoxdbwdsrckt`에 **적용 완료**. 현재 `review_images` 11건(전부 published)을 DB에서 읽는다.

- `supabase/migrations/0001_review_images.sql` — 테이블·인덱스·트리거·RLS(공개 published 읽기 + authenticated CRUD)
- `supabase/migrations/0002_reviews_storage.sql` — `reviews` 스토리지 버킷(공개 읽기 + authenticated 쓰기)
- `supabase/seed.sql` — 현재 11장 시드(`on conflict (src) do nothing` — 재실행 안전)

RLS 쓰기는 `reviews`/`blog_posts`와 동일하게 **authenticated 롤**(admin 로그인 세션)에 부여 — admin은 anon 키 + Supabase Auth 세션으로 쓴다. 미설정/오류 시 코드가 로컬 `REVIEW_IMAGES`로 폴백.

env: `SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (공개 읽기).

## 관리자(choice-admin) 로드맵

`blog_posts`와 동일하게 별도 어드민에서 처리:

- 마스킹본 업로드(Storage) → 행 생성(src/w/h/tag/quote/meta)
- `is_published` 토글, `sort_order` 드래그 정렬
- 인라인 편집/삭제

공개 렌더는 이 저장소, 작성/관리는 choice-admin으로 분리한다.

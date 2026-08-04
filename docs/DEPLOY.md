# 배포 / 커밋 규칙 (Vercel)

> 온케팅 공통 규칙(`onketing/homepage`·`tool`과 동일 방식). 평소엔 **커밋만 하고 push 하지 않는다**(push = Vercel 배포 트리거). 배포할 때만 배포 커밋을 HEAD로 얹고 push.

## 배경 — 왜 "배포 커밋"을 따로 두나
- private repo + Vercel이면, **배포되는 HEAD 커밋의 author가 프로젝트 소유자(검증된 이메일)여야만** 배포된다. 아니면 "Deployment Blocked — commit author did not have contributing access". Vercel은 **HEAD 커밋 author만** 검사(중간 커밋 무관, 토큰으로 우회 불가).
- 그래서 작업 커밋은 개발자 개인 author로 쌓고(개인 잔디 유지), 배포 순간에만 소유자 author의 빈 커밋을 HEAD로 얹어 push한다.

## 신원 (이 repo)
- **작업 author** = `KKIMDoHyun <kdh5998@naver.com>` (repo git config 기본) → 개발자 개인 잔디.
- **배포 author** = `choice <lawforyou7@naver.com>` (Vercel 소유자 검증 이메일) → 이 author의 HEAD 커밋만 배포됨.

## 워크플로
- 평소엔 **커밋만, push 금지**.
- 배포할 때만:
  ```bash
  git deploy   # 이 repo 전용 별칭
  # = git commit --allow-empty --author="choice <lawforyou7@naver.com>" -m "chore: deploy" && git push
  ```
  → 대기 중이던 개인 커밋 + 배포 커밋이 함께 push되고 **HEAD(choice)** 로 배포됨(READY).

## 잔디(기여 그래프)
- 작업 커밋(KKIMDoHyun author) → 개발자 개인 계정 잔디.
- 배포 커밋(choice author) → `lawforyou7@naver.com` 연결 계정 잔디.

## Claude Code 규칙
- **"커밋해"** → 개인 author(KKIMDoHyun)로 커밋만. **push 금지.**
- **"배포해 / 푸시해"** → `git deploy`로 choice 배포 커밋 생성 + push.
- git config·`git deploy` 별칭은 이 repo에만(repo-local) 적용 — 전역/다른 프로젝트 무영향.

> 별칭 재설정이 필요하면:
> ```bash
> git config alias.deploy '!git commit --allow-empty --author="choice <lawforyou7@naver.com>" -m "chore: deploy" && git push'
> ```

## 함수 리전 — 서울(icn1)

`vercel.json`의 `"regions": ["icn1"]`. Vercel 신규 프로젝트 기본값은 **iad1(미국 버지니아)**인데,
이 프로젝트의 데이터는 전부 **Supabase ap-northeast-2(서울)**에 있어 매 쿼리가 태평양을 왕복했다.
페이지 렌더·ISR 재생성·이미지 최적화·Server Action이 모두 함수 리전에서 돌기 때문에 영향이 컸다.

- 정적/ISR 응답은 리전과 무관하게 방문자 최근접 CDN 엣지에서 나간다(리전은 "생성" 위치만 결정).
- 단일 리전은 Hobby 플랜에서도 허용(여러 리전은 Pro 이상).
- 되돌리려면 `regions` 키를 지우고 재배포하면 끝.
- 확인: `curl -sID https://kvisa1345.com/blog | grep x-vercel-id` → `엣지::함수` 중 **함수**가 `icn1`이어야 한다.

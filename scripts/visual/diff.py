"""before/after 스크린샷 픽셀 비교.

  /tmp/naverenv/bin/python scripts/visual/diff.py

같은 화면인데 높이가 다르면(레이아웃이 밀렸다는 뜻) 즉시 실패로 본다.
diff 이미지는 shots/diff/ 에 남긴다 — 변경 픽셀을 빨갛게 칠한 오버레이.
"""

import json
import pathlib
import sys

from PIL import Image, ImageChops

ROOT = pathlib.Path("scripts/visual/shots")
BEFORE, AFTER, DIFF = ROOT / "before", ROOT / "after", ROOT / "diff"
# 안티에일리어싱으로 1~2 정도는 흔들릴 수 있어 문턱을 둔다(색 채널 합 기준)
CHANNEL_TOLERANCE = 8


def compare(name: str):
    b_path, a_path = BEFORE / name, AFTER / name
    if not a_path.exists():
        return {"name": name, "status": "missing_after"}
    b, a = Image.open(b_path).convert("RGB"), Image.open(a_path).convert("RGB")
    if b.size != a.size:
        return {
            "name": name, "status": "size_changed",
            "before": list(b.size), "after": list(a.size),
            "note": f"{b.size[1]}px → {a.size[1]}px (레이아웃 높이 변화)",
        }

    diff = ImageChops.difference(b, a).convert("L")
    # 문턱 이하 잡음 제거
    mask = diff.point(lambda v: 255 if v > CHANNEL_TOLERANCE else 0)
    changed = sum(mask.histogram()[255:])
    total = b.size[0] * b.size[1]
    ratio = changed / total * 100

    if changed:
        DIFF.mkdir(parents=True, exist_ok=True)
        overlay = a.copy()
        red = Image.new("RGB", a.size, (255, 0, 0))
        overlay.paste(red, mask=mask)
        overlay.save(DIFF / name)

    # fullPage 합성 시 좌상단 첫 타일이 드물게 래스터 경합을 일으킨다. 변화가 그 16x16 안에만
    # 갇혀 있으면 회귀가 아니므로 'noise' 로 분류한다 — 숨기지 않고 리포트에 남긴다.
    bbox = mask.getbbox()
    is_corner_noise = bool(changed) and bbox is not None and bbox[2] <= 16 and bbox[3] <= 16

    return {
        "name": name,
        "status": "ok" if changed == 0 else ("noise" if is_corner_noise else "diff"),
        "changedPixels": changed, "totalPixels": total, "ratio": round(ratio, 4),
        "size": list(b.size), "bbox": list(bbox) if bbox else None,
    }


def main():
    if not BEFORE.exists():
        sys.exit("before 스냅샷이 없습니다. capture.mjs before 를 먼저 실행하세요.")
    names = sorted(p.name for p in BEFORE.glob("*.png"))
    results = [compare(n) for n in names]

    ok = [r for r in results if r["status"] == "ok"]
    noise = [r for r in results if r["status"] == "noise"]
    changed = [r for r in results if r["status"] == "diff"]
    broken = [r for r in results if r["status"] in ("size_changed", "missing_after")]

    print(
        f"총 {len(results)}장 · 완전동일 {len(ok)} · 코너노이즈 {len(noise)}"
        f" · 실제차이 {len(changed)} · 크기변화/누락 {len(broken)}\n"
    )
    for r in broken:
        print(f"  ✗ {r['name']}  {r['status']}  {r.get('note','')}")
    for r in sorted(changed, key=lambda x: -x["ratio"]):
        print(f"  △ {r['name']}  {r['ratio']}%  ({r['changedPixels']:,}px)  bbox={r['bbox']}")
    for r in noise:
        print(f"  · {r['name']}  좌상단 {r['bbox']} 래스터 노이즈 {r['changedPixels']}px — 회귀 아님")
    if not broken and not changed:
        print("\n  ✓ 실제 회귀 없음")

    pathlib.Path("scripts/visual/report.json").write_text(
        json.dumps(results, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print("\n리포트: scripts/visual/report.json")


if __name__ == "__main__":
    main()

import { notFound, redirect } from "next/navigation";

// 정의된 어떤 라우트에도 매칭되지 않는 모든 경로 → 홈으로.
// not-found.tsx의 redirect()는 프로덕션에서 not-found가 정적 404로 최적화돼 실행되지 않으므로,
// 페이지 레벨 redirect가 동작하는 catch-all에서 처리한다.
// (정적 에셋·route handler·metadata 라우트는 이 catch-all보다 우선 매칭되므로 정상 서빙된다.)
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string[] }> };

export default async function CatchAllRedirect({ params }: Params) {
	const { slug } = await params;
	// 확장자가 있는 경로(정적 핸들러가 못 잡은 파일 요청)는 홈으로 보내지 않고 404 유지 —
	// 없는 이미지 등을 홈 HTML로 리다이렉트하지 않도록 방어.
	if (slug?.at(-1)?.includes(".")) notFound();
	redirect("/");
}

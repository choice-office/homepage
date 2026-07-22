import { redirect } from "next/navigation";

// 존재하지 않는 경로(404)는 홈으로 이동시킨다.
// 매칭되지 않는 URL과 페이지 내부의 notFound() 호출(없는 블로그/업무분야 id 등)이 모두 여기로 온다.
export default function NotFound() {
	redirect("/");
}

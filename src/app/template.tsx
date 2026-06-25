// 라우트 전환마다 재마운트되는 표준 template — 페이지 진입 페이드(.page-enter)를 재생한다.
// 순수 CSS 애니메이션이라 서버 컴포넌트로 동작(클라이언트 JS 0). prefers-reduced-motion은 globals.css에서 존중.
export default function Template({ children }: { children: React.ReactNode }) {
	return <div className="page-enter">{children}</div>;
}

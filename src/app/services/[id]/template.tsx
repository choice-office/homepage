// 서비스 상세 간 이동(/services/[id])도 페이지 페이드가 재생되도록 하위 template 추가.
export default function ServiceDetailTemplate({ children }: { children: React.ReactNode }) {
	return <div className="page-enter">{children}</div>;
}

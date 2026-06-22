import { FadeIn } from "@/components/common/fade-in";

type YoutubeVideo = {
	videoId: string; // YouTube 영상 ID (URL의 ?v= 뒤 값)
	title: string;
};

// ★ 설정: YouTube 영상 ID와 제목을 수정하세요
// 영상 URL: https://www.youtube.com/watch?v=VIDEO_ID  →  videoId: "VIDEO_ID"
const videos: YoutubeVideo[] = [
	{ videoId: "dQw4w9WgXcQ", title: "영상 제목 1" },
	{ videoId: "dQw4w9WgXcQ", title: "영상 제목 2" },
	{ videoId: "dQw4w9WgXcQ", title: "영상 제목 3" },
	{ videoId: "dQw4w9WgXcQ", title: "영상 제목 4" },
];

// ★ 설정: 컬럼 수 — "2" | "3" | "4"
const COLUMNS = "2" as const;

const colClass = {
	"2": "sm:grid-cols-2",
	"3": "sm:grid-cols-2 lg:grid-cols-3",
	"4": "sm:grid-cols-2 lg:grid-cols-4",
};

export const YoutubeGrid = () => {
	return (
		<section id="videos" className="px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<FadeIn className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">영상 포트폴리오</h2>
					<p className="mt-4 text-lg text-muted-foreground">실제 작업 영상을 확인해보세요.</p>
				</FadeIn>

				<div className={`mt-16 grid grid-cols-1 gap-6 ${colClass[COLUMNS]}`}>
					{videos.map((video, i) => (
						<FadeIn key={video.videoId} delay={i * 0.1}>
							<div className="overflow-hidden rounded-xl bg-muted shadow-sm">
								{/* 16:9 비율 iframe */}
								<div className="relative aspect-video w-full">
									<iframe
										src={`https://www.youtube.com/embed/${video.videoId}`}
										title={video.title}
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
										className="absolute inset-0 h-full w-full"
										loading="lazy"
									/>
								</div>
								{video.title && (
									<div className="px-4 py-3">
										<p className="font-medium">{video.title}</p>
									</div>
								)}
							</div>
						</FadeIn>
					))}
				</div>
			</div>
		</section>
	);
};

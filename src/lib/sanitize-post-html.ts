import sanitizeHtml from "sanitize-html";

// 블로그 본문 HTML 살균 — 관리자 에디터(Tiptap)와 네이버 이식본이 만드는 마크업만 통과시킨다.
//
// 왜: 본문은 dangerouslySetInnerHTML 로 그대로 렌더되므로, DB 에 스크립트가 섞이면
//     방문자 브라우저에서 실행된다(저장형 XSS). CSP 에 'unsafe-inline' 이 있어 CSP 만으로는 못 막는다.
// 원칙: **현재 렌더 결과를 1바이트도 바꾸지 않는 허용목록**. 실제 발행글 205건의 태그·속성·클래스·스타일을
//     전수 조사해 허용목록을 구성했고, 에디터가 만들 수 있는 마크업(체크리스트·정렬·색·표·첨부)까지 미리 포함한다.
// 서버 전용: 서버 컴포넌트/route handler 에서만 import 한다(클라이언트 번들에 포함되지 않게).
//
// 조사 결과(발행글 205건): 태그 br p figure img span strong div blockquote a svg path table/tbody/tr/th/td,
// 클래스 se-t·se-q·se-q-u·se-q-c·se-map*, style 은 color 만, href/src 는 https 만.

const COLOR = [
	/^#(0x)?[0-9a-f]+$/i,
	/^rgba?\(\s*\d+%?(\s*,?\s*\d+%?){2,3}\s*\/?\s*[\d.]*%?\)$/i,
	/^[a-z]+$/i,
];
const LENGTH = [/^\d+(\.\d+)?(px|em|rem|%|pt|vw)?$/i, /^auto$/i];

export const sanitizePostHtml = (html: string): string =>
	sanitizeHtml(html, {
		allowedTags: [
			// 본문
			"p",
			"br",
			"span",
			"strong",
			"b",
			"em",
			"i",
			"u",
			"s",
			"del",
			"mark",
			"sub",
			"sup",
			"small",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"div",
			"blockquote",
			"hr",
			"pre",
			"code",
			// 목록 · 체크리스트(taskList)
			"ul",
			"ol",
			"li",
			"label",
			"input",
			// 링크 · 이미지 · 캡션
			"a",
			"img",
			"figure",
			"figcaption",
			// 표
			"table",
			"thead",
			"tbody",
			"tfoot",
			"tr",
			"th",
			"td",
			"caption",
			"colgroup",
			"col",
			// 네이버 지도 블록의 인라인 아이콘
			"svg",
			"path",
			"g",
			"circle",
			"rect",
			// 임베드(허용 호스트만 — allowedIframeHostnames)
			"iframe",
		],
		allowedAttributes: {
			"*": ["class", "style", "dir", "lang", "title", "data-type", "data-checked", "data-align"],
			a: ["href", "target", "rel", "download"],
			img: ["src", "alt", "width", "height", "loading", "decoding", "sizes", "srcset"],
			input: ["type", "checked", "disabled"],
			th: ["colspan", "rowspan", "scope", "width", "height"],
			td: ["colspan", "rowspan", "width", "height"],
			col: ["span", "width"],
			table: ["width", "border", "cellpadding", "cellspacing"],
			// SVG — HTML 파서가 속성명을 소문자로 낮추므로 두 표기 모두 허용
			svg: [
				"viewbox",
				"viewBox",
				"width",
				"height",
				"fill",
				"stroke",
				"xmlns",
				"aria-hidden",
				"focusable",
				"preserveaspectratio",
				"preserveAspectRatio",
				"role",
			],
			path: [
				"d",
				"fill",
				"fill-rule",
				"fillrule",
				"clip-rule",
				"cliprule",
				"stroke",
				"stroke-width",
				"stroke-linecap",
				"stroke-linejoin",
				"opacity",
			],
			g: ["fill", "stroke", "opacity", "transform"],
			circle: ["cx", "cy", "r", "fill", "stroke", "stroke-width"],
			rect: ["x", "y", "width", "height", "rx", "ry", "fill", "stroke"],
			iframe: [
				"src",
				"width",
				"height",
				"allow",
				"allowfullscreen",
				"title",
				"loading",
				"frameborder",
				"referrerpolicy",
			],
		},
		// 인라인 스타일 — 에디터가 쓰는 속성만(그 외는 값째로 제거)
		allowedStyles: {
			"*": {
				color: COLOR,
				"background-color": COLOR,
				"text-align": [/^(left|right|center|justify|start|end)$/i],
				"font-size": LENGTH,
				"font-weight": [/^(normal|bold|bolder|lighter|[1-9]00)$/i],
				"font-family": [/^[\w\s,'"\-.()가-힣]+$/],
				"text-decoration": [/^(none|underline|line-through|overline)( solid| wavy)?$/i],
				width: LENGTH,
				height: LENGTH,
				"max-width": LENGTH,
				margin: [/^[\d.\spxemrt%auto-]+$/i],
				"aspect-ratio": [/^[\d.\s/]+$/],
			},
		},
		allowedSchemes: ["http", "https", "mailto", "tel"],
		allowedSchemesAppliedToAttributes: ["href", "src", "srcset"],
		allowProtocolRelative: false,
		allowedIframeHostnames: [
			"www.youtube.com",
			"youtube.com",
			"youtu.be",
			"www.youtube-nocookie.com",
			"map.naver.com",
			"map.kakao.com",
			"www.google.com",
			"maps.google.com",
		],
		// 태그와 함께 내용까지 버릴 것들(스크립트 본문이 텍스트로 남지 않게)
		nonTextTags: ["script", "style", "textarea", "noscript", "template", "iframe"],
		// 외부 링크는 항상 안전한 rel 부여(기존 rel 유지 + 보강)
		transformTags: {
			a: (tagName, attribs) => {
				if (attribs.target === "_blank") {
					const rel = new Set((attribs.rel ?? "").split(/\s+/).filter(Boolean));
					rel.add("noopener");
					rel.add("noreferrer");
					attribs.rel = [...rel].join(" ");
				}
				return { tagName, attribs };
			},
		},
	});

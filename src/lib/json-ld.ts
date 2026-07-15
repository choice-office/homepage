// JSON-LD를 <script type="application/ld+json">에 안전하게 주입하기 위한 직렬화.
//
// React에서 script 태그에 원시 JSON을 넣는 방법은 dangerouslySetInnerHTML 뿐이라
// JSON-LD 주입 자체는 표준·불가피하다(대안 없음). 다만 JSON.stringify 결과를 그대로
// 넣으면 데이터에 "</script>"·"<!--"·"<script" 가 섞였을 때 스크립트가 조기 종료되어
// HTML 인젝션이 가능하다. 특히 블로그 JSON-LD는 DB(관리자 입력) 필드를 넣으므로 실제 표면.
//
// script 텍스트를 끝낼 수 있는 유일한 문자는 '<' 이므로 이를 유니코드 이스케이프한다.
// 결과는 여전히 유효한 JSON(파서가 < 를 '<' 로 복원) → 구조화 데이터로 정상 인식된다.
// '>'·'&' 도 관례적으로 함께 이스케이프한다(무해, 방어적).
export const toJsonLd = (data: unknown): string =>
	JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

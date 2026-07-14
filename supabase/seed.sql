-- seed.sql — 현재 로컬 REVIEW_IMAGES(마스킹본 11장)를 review_images 초기 시드로 삽입.
-- src 기준 멱등(재실행 안전). 이미지 파일은 public/review/ 에 있으며, 추후 Storage 이전 시 src만 URL로 교체하면 된다.
-- 순서(sort_order)는 src/lib/site-data.ts 의 REVIEW_IMAGES 배열 순서와 일치.

insert into public.review_images (src, w, h, tag, quote, meta, is_published, sort_order) values
  ('/review/review-04.jpg',  967, 1450, '재외동포 · 거소증 갱신', '진심으로 감사드립니다. 고맙습니다.',                   '해외 거주 재외동포',        true, 0),
  ('/review/review-01.jpg',  972, 1401, '체류 연장 · 재방문',     '매번 문제 없이 바로 처리해 주셔서 감사합니다.',        '재방문 의뢰인',            true, 1),
  ('/review/review-11.jpg',  972, 1469, '체류 연장 · 우편 처리',   '늘 민첩하고 정확하게 일해 주셔서 고맙습니다.',          '체류 연장 의뢰인',          true, 2),
  ('/review/review-06.jpg', 3524, 1252, '비자 · 거소증 접수',     '처음부터 끝까지 정확한 정보와 빠른 일 처리에 감탄했습니다.', '비자·거소증 의뢰인 (이메일)', true, 3),
  ('/review/review-02.jpg',  864, 1412, '거소증 · 상담',         '공적인 걸 떠나 마음 편히 이야기할 수 있어 감사했어요.',   '거소증 의뢰인',            true, 4),
  ('/review/review-08.jpg',  648,  617, '거소증 · 지인 추천',     '깔끔하게 잘 해주셔서 친구들에게 소개했어요.',            '재방문·추천 의뢰인',        true, 5),
  ('/review/review-09.jpg', 3428, 1785, '거소증 신청 · 추천',     '복잡한 절차를 편하게 마쳤습니다. 주저 없이 소개하겠습니다.', '거소증 의뢰인 (이메일)',     true, 6),
  ('/review/review-05.jpg', 1019, 1369, '거소증 발급 · 신속 처리', '와, 엄청 빨리 잘 됐네요. 감사합니다!',                  '거소증 발급 의뢰인',        true, 7),
  ('/review/review-03.jpg', 1080,  555, '재방문 · 감사 인사',     '늘 일 처리 잘해 주셔서 대단히 감사합니다.',             '재방문 의뢰인',            true, 8),
  ('/review/review-07.png', 1360, 1157, '거소증 · 서류 대행',     '모든 서류 과정을 문제없이 준비하고 배려해 주셨습니다.',   '거소증 의뢰인 (이메일)',     true, 9),
  ('/review/review-10.jpg', 4400, 1271, '고난도 건 · 해결',       '남들은 다 안 된다던 일을 끝까지 만들어 내셨습니다.',      '소개 의뢰인 (이메일)',       true, 10)
on conflict (src) do nothing;

# 홈페이지 개선 검증 기록

검증일: 2026-11-14. 작업 폴더: `jc020230.github.io`.

## 반영 사항

- Pretendard Variable을 직접 제공하고 제목 굵기·여백·강조색을 조정했습니다. 별도 프레임워크나 빌드 도구를 도입하지 않았습니다.
- CAU ET Lab·DLmath Lab·지도교수·학교 등의 이름을 각각 연결합니다. 소식 전체 문장을 하나의 링크로 감싸지 않습니다.
- Challenge·수상을 소개 다음에 배치했습니다. DCASE Overall·Lightweight 1위와 점수, Judge’s Award 상장, SAND Track 2 4위를 표시합니다.
- `이력서.hwpx`의 사진 5장과 연구실의 DCASE 사진 1장을 4개 행사로 묶었습니다. DCASE는 사용자 요청대로 CAU 팀 발표로 표시합니다.
- 사진 확대, 이전·다음 버튼, 방향키, Esc 닫기, 닫은 뒤 초점 복원을 지원합니다. 사진과 설명은 한·영으로 제공됩니다.
- 행사 포스터에서 확인한 세미나 날짜 2026-11-06을 반영했습니다. 월만 확인한 소식·사진의 날짜는 YYYY-MM을 유지합니다.
- 기존 학력·논문·검색·필터·CV 인쇄 기능을 유지했습니다. 사용자 요청으로 제외한 출생·고교·군 복무를 복구하지 않았습니다.
- README·자료 출처·검사 도구를 현재 내용과 데이터 관리 방법에 맞췄습니다.

## 검사 결과

| 검사 | 결과 |
| --- | --- |
| 문법·데이터·사진 경로·번역·SEO 동기화·실제 데이터 공개 준비 | 통과 |
| 종합 브라우저 검사 | 244개 통과 |
| 기존 실제 프로필 검사 | 45개 통과 |
| 정상 페이지 JavaScript·콘솔 오류 / 리소스 실패 | 0건 / 0건 |
| axe-core WCAG A·AA 자동 검사 | 한·영 홈페이지·CV·사진 확대 화면, 6개 화면 위반 0건 |
| 직접 확인한 외부 링크 | CAU ET Lab·DLmath Lab·DCASE 공식 순위·SAND·연구실 사진 페이지 모두 HTTP 200 |
| Git diff 공백 오류 검사 | 통과 |

브라우저 검사는 Chromium으로 수행했습니다. 한·영 전환, 검색·연도/유형/주요 논문 필터, BibTeX·이메일 복사, 소식 펼치기, 개별 연구실 링크, 사진 6장 로딩·탐색, 글꼴 로딩, 모바일 메뉴, CV 인쇄/PDF를 포함합니다. 홈페이지와 CV를 루트 및 `/researcher-site/` 하위 경로에서 320·360·390·768·1024·1051·1280·1440px 폭으로 검사했습니다.

데스크톱·모바일 전체 화면, 1051px 영문 내비게이션, 모바일 사진 확대 화면을 시각적으로 검토했습니다. 검사 결과 JSON·스크린샷·PDF는 `.preview/`에 저장되며 Git·소스 ZIP에서는 제외합니다.

## 주요 변경 파일

- `assets/js/data.js`: 개별 링크·사진·대회 표시 데이터와 소식 자료 연결.
- `assets/js/app.js`: 개별 이름 링크, Challenge 표시, 행사 갤러리와 확대 기능, CV 자료별 링크 이름.
- `assets/js/i18n.js`: 새 기능의 한·영 UI 문구.
- `assets/css/style.css`: 글꼴·여백·목록·사진·모바일 레이아웃.
- `index.html`: Challenge·사진 섹션과 접근 가능한 사진 대화상자.
- `assets/images/activity/`: 실제 활동 사진 6장과 출처 문서.
- `assets/fonts/`: Pretendard Variable과 OFL 라이선스.
- `tools/check.mjs`, `tools/browser_check.py`: 사진·링크·글꼴 및 새 상호작용 검사.
- `README.md`: 실제 Git 폴더·배포 설정·콘텐츠 유지보수 방법.

## 유지보수 및 검증 범위

원본 이력서·ZIP과 이전 작업 폴더는 보존합니다. 새 활동은 `assets/js/data.js`에서 추가하고 사진 파일을 함께 저장하세요. 제공되지 않은 논문 코드·개인 CV PDF·연구 자료는 임의로 추가하지 않았습니다.

실물 모바일·Safari/Firefox·스크린리더 수동 검사는 수행하지 않았습니다. 자동 접근성 검사는 완전한 접근성 인증이 아니며 외부 사이트의 계속된 가용성을 보장하지 않습니다.

재실행: `node tools/check.mjs --release`, `python tools/browser_check.py --axe /path/to/axe.min.js`, `python tools/profile_check.py`.

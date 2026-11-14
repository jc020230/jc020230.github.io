# 류정찬 · 개인 연구 홈페이지

중앙대학교 통계데이터사이언스학과 석사과정 류정찬(Jungchan Ryu)의 실제 학술 이력을 정리한 한·영 홈페이지입니다. 예시 인물이나 가상 연구 실적을 사용하지 않습니다.

- 이메일: jungchan0202@cau.ac.kr
- 배포 대상: https://jc020230.github.io/
- 저장소: https://github.com/jc020230/jc020230.github.io
- 최신 작업 폴더: `researcher-site-news-update`. 이전 `researcher-site`와 원본 ZIP은 보존했습니다.
- push·공개 배포는 아직 실행하지 않았습니다. 실행 전 사용자 승인이 필요합니다.

## 콘텐츠와 근거

학력·학생 대표 활동·학부연구생 이력은 사용자가 제공했습니다. 출생 연도·고등학교·군 복무는 사용자 요청으로 제외했습니다. 학회 소식의 직접 발표는 사용자가 확인한 사실로 유지합니다. 세미나 소식은 사용자가 제공한 업데이트의 실제 활동 기록입니다.

공개 자료와 첨부 자료를 함께 참고합니다.

- [CAU ET 학생 소개](https://ikwak2.github.io/students/index.html): 소속과 관심 분야
- [CAU ET 연구 소식](https://ikwak2.github.io/index.html): 논문·팀 성과
- [ALS 벤치마크 학술지 원문](https://www.kjas.or.kr/journal/view.html?uid=278&vmd=Full): 2026-10-31 발행, 39(5), 537–552, DOI 10.5351/KJAS.2026.39.5.537
- [ALS 하이브리드 특징 논문](https://doi.org/10.5351/KJAS.2026.39.4.401): 39(4), 401–417
- [DCASE 워크숍 논문](https://dcase.community/documents/workshop2026/proceedings/DCASE2026Workshop_Jun_36.pdf)
- `assets/files/dcase-2026-task5-judges-award.webp`: 공동 수상 상장
- `assets/files/korean-statistical-society-2026-als-abstract.pdf`: 프로시딩 인쇄 페이지 124의 1페이지 발췌본

## 로컬 미리보기

```bash
python3 tools/serve.py
```

Windows에서는 `py -3 tools/serve.py`를 사용할 수 있습니다. 브라우저에서 `http://127.0.0.1:8000/`을 열고, 종료할 때 Ctrl+C를 누릅니다. VS Code의 Terminal → Run Task에서도 미리보기·검사·SEO 동기화를 실행할 수 있습니다.

웹사이트는 HTML/CSS/JavaScript 정적 파일만 사용합니다. 방문자에게 Python·Node.js·npm 설치가 필요하지 않습니다. Python은 미리보기, Node.js는 관리 도구에만 사용합니다.

## 데이터 수정

`assets/js/data.js`에서 프로필·소개·관심 분야·소식·논문·프로젝트·학력·경력·수상·연락처를 관리합니다. 번역은 `{ko: "한국어", en: "English"}`이며, 논문 원제처럼 번역이 필요 없는 항목은 문자열을 사용할 수 있습니다.

소식 날짜는 확인된 정밀도로 입력합니다.

- `2026-11`: 월만 아는 소식. 내부 날짜값과 HTML의 `datetime`도 월 단위를 유지합니다.
- `2026-03-01`: 정확한 일자를 아는 소식.
- `site.updated`는 실제 수정일인 `YYYY-MM-DD` 형식으로 입력합니다.

소식은 날짜 내림차순으로 표시하며 처음 3개 이후는 펼쳐 볼 수 있습니다. 같은 달에서 일자가 없는 소식은 정확한 일자 순서를 뜻하지 않습니다.

논문은 고유 `id`, 숫자 `year`, `type`(conference/journal/preprint), `selected`, 제목·저자·학회/학술지·초록·태그·링크·BibTeX로 구성합니다. 저자의 `me: true`는 본인 이름 강조 표시입니다. 검색은 두 언어와 여러 단어를 지원하고, 연도·유형·주요 논문 필터를 조합할 수 있습니다.

`links.pdf`, `paper`, `code`, `project`, `slides`, `data`에 실제 주소를 입력합니다. 빈 문자열은 버튼을 숨깁니다. 제공되지 않은 초록·코드·BibTeX를 임의로 채우지 마세요. 로컬 파일은 `./assets/...` 상대 경로를 사용합니다. 수상의 `url`은 상장 보기 링크입니다.

사진은 `profile.photo`, 기존 CV PDF는 `profile.cvUrl`로 지정합니다. HTML CV는 같은 데이터를 공유하며 브라우저에서 인쇄/PDF 저장이 가능합니다. 학력과 경력은 입력 순서를 유지합니다.

`example`과 `showDemoNotice`는 향후 예시 콘텐츠를 추가할 때를 위한 보호 기능입니다. 현재 실제 데이터에서는 모두 false입니다. 기록을 삭제하지 않고 예시 표시만 바꾸는 용도가 아닙니다.

## 수정 후 검사

Node.js가 설치된 터미널에서 실행합니다. npm 설치는 필요 없습니다.

```bash
node tools/sync-meta.mjs
node tools/check.mjs --release
```

동기화 도구는 기본 언어의 HTML 제목·설명·Open Graph·canonical·robots·sitemap을 갱신합니다. 검사 도구는 문법·날짜·번역·논문 ID·로컬 파일·URL 형식·메타데이터 동기화 및 예시 데이터 잔존 여부를 확인합니다. 실제 이력의 진위를 자동 판정하지 않습니다.

실제 콘텐츠 기준 브라우저 검사:

```bash
python -m pip install playwright
python -m playwright install chromium
python tools/browser_check.py
python tools/profile_check.py
```

axe-core 파일이 있으면 `python tools/browser_check.py --axe /path/to/axe.min.js`로 접근성 자동 검사도 수행할 수 있습니다. 결과는 Git에서 제외된 `.preview/`에 저장됩니다. 브라우저 검사의 검색어·실적 개수는 현재 프로필 기준이므로 연구 실적을 추가하면 해당 기대값도 갱신하세요. 검사 도구는 서버를 직접 시작하고 종료합니다.

## GitHub Pages 배포

현재 폴더에는 Git 저장소를 새로 만들지 않았습니다. 기존 `researcher-site/.git`은 보존되어 있습니다. 최신 파일을 기존 저장소에 반영할 때에는 먼저 차이를 검토하고 `.git`을 덮어쓰지 마세요. 원격에 새로운 커밋이 있다면 fetch하여 변경을 비교합니다.

기존 Git 저장소에서 사용자 공개 승인 후 진행할 명령입니다.

```bash
git status
git remote -v
gh auth status
git ls-remote origin
# 최신 파일 반영 및 로컬 검토 후
node tools/sync-meta.mjs
node tools/check.mjs --release
git add .
git diff --cached
git commit -m "Update academic profile and research news"
# 공개 승인 후에만
git push -u origin main
```

강제 push는 사용하지 않습니다. Git 작성자 정보가 없다면 본인의 이름과 검증된 이메일로 설정합니다. 저장소 루트에 `index.html`, `cv.html`, `.nojekyll`, `assets/`를 배치합니다. GitHub Settings → Pages → Deploy from a branch → main → /(root)를 설정하면 됩니다. 실제 배포 후 공개 URL의 파일·언어 전환을 별도로 확인하세요.

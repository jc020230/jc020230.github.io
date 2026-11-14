# 류정찬 · 개인 연구 홈페이지

중앙대학교 통계데이터사이언스학과 석사과정 류정찬(Jungchan Ryu)의 실제 학술 이력을 정리한 한·영 홈페이지입니다. 예시 인물이나 가상 연구 실적을 사용하지 않습니다.

- 이메일: jungchan0202@cau.ac.kr
- 홈페이지: https://jc020230.github.io/
- 저장소: https://github.com/jc020230/jc020230.github.io
- 최신 작업 폴더: `jc020230.github.io` (원격 저장소와 연결된 Git 작업본).
- 이전 `researcher-site`, `researcher-site-news-update`, 원본 ZIP은 보존했습니다. 이후 수정은 최신 작업 폴더에서 진행하세요.
- GitHub Pages는 `main` 브랜치의 루트에서 배포합니다.

## 콘텐츠와 근거

학력·학생 대표 활동·학부연구생 이력은 사용자가 제공했습니다. 출생 연도·고등학교·군 복무는 사용자 요청으로 제외했습니다. 학회 소식의 직접 발표는 사용자가 확인한 사실로 유지합니다. 세미나 소식은 사용자가 제공한 업데이트의 실제 활동 기록입니다.

공개 자료와 첨부 자료를 함께 참고합니다.

- [CAU ET 학생 소개](https://ikwak2.github.io/students/index.html): 소속과 관심 분야
- [CAU ET 연구 소식](https://ikwak2.github.io/index.html): 논문·팀 성과
- [ALS 벤치마크 학술지 원문](https://www.kjas.or.kr/journal/view.html?uid=278&vmd=Full): 2026-10-31 발행, 39(5), 537–552, DOI 10.5351/KJAS.2026.39.5.537
- [ALS 하이브리드 특징 논문](https://doi.org/10.5351/KJAS.2026.39.4.401): 39(4), 401–417
- [DCASE 워크숍 논문](https://dcase.community/documents/workshop2026/proceedings/DCASE2026Workshop_Jun_36.pdf)
- [DCASE 공식 순위](https://dcase.community/challenge2026/task-audio-dependent-question-answering-results): Overall 58.33%, Lightweight 57.30%, 두 부문 1위
- 사용자 제공 `이력서.hwpx`: 학회·세미나 사진 5장. 행사 포스터에서 2026-11-06 세미나 날짜를 확인했습니다. 원본 이력서 파일은 공개 저장소에 포함하지 않습니다.
- [CAU ET Lab 사진](https://ikwak2.github.io/photos/index.html): DCASE 사진은 사용자 요청에 따라 ‘CAU 팀 발표’로 표기합니다.
- `assets/files/dcase-2026-task5-judges-award.webp`: 공동 수상 상장
- `assets/files/korean-statistical-society-2026-als-abstract.pdf`: 프로시딩 인쇄 페이지 124의 1페이지 발췌본

## 로컬 미리보기

```bash
python3 tools/serve.py
```

Windows에서는 `py -3 tools/serve.py`를 사용할 수 있습니다. 브라우저에서 `http://127.0.0.1:8000/`을 열고, 종료할 때 Ctrl+C를 누릅니다. VS Code의 Terminal → Run Task에서도 미리보기·검사·SEO 동기화를 실행할 수 있습니다.

웹사이트는 HTML/CSS/JavaScript 정적 파일만 사용합니다. 방문자에게 Python·Node.js·npm 설치가 필요하지 않습니다. Python은 미리보기, Node.js는 관리 도구에만 사용합니다.

## 데이터 수정

`assets/js/data.js`에서 프로필·소개·관심 분야·소식·논문·프로젝트·학력·경력·수상·사진·연락처를 관리합니다. 번역은 `{ko: "한국어", en: "English"}`이며, 논문 원제처럼 번역이 필요 없는 항목은 문자열을 사용할 수 있습니다.

소식 날짜는 확인된 정밀도로 입력합니다.

- `2026-09`: 월만 아는 소식. 내부 날짜값과 HTML의 `datetime`도 월 단위를 유지합니다.
- `2026-11-06`: 정확한 일자를 아는 소식.
- `site.updated`는 실제 수정일인 `YYYY-MM-DD` 형식으로 입력합니다.

소식은 날짜 내림차순으로 표시하며 처음 5개 이후는 펼쳐 볼 수 있습니다. 표시 개수는 `site.newsLimit`에서 바꿉니다. 같은 달에서 일자가 없는 소식은 정확한 일자 순서를 뜻하지 않습니다.

`entities`에는 본문에서 각각 연결할 이름(`labels`)과 주소(`url`)를 등록합니다. 예를 들어 CAU ET Lab과 DLmath Lab은 같은 문장에서도 서로 다른 링크가 됩니다. 본문에 HTML을 넣지 마세요. 소식의 `resources`에는 `{label: {ko, en}, url}` 형태로 논문·상장 등 별도 자료 링크를 추가하고, `galleryId`에 연결할 사진 행사의 `id`를 적습니다.

논문은 고유 `id`, 숫자 `year`, `type`(conference/journal/preprint), `selected`, 제목·저자·학회/학술지·초록·태그·링크·BibTeX로 구성합니다. 저자의 `me: true`는 본인 이름 강조 표시입니다. 검색은 두 언어와 여러 단어를 지원하고, 연도·유형·주요 논문 필터를 조합할 수 있습니다.

`links.pdf`, `paper`, `code`, `project`, `slides`, `data`에 실제 주소를 입력합니다. 빈 문자열은 버튼을 숨깁니다. 제공되지 않은 초록·코드·BibTeX를 임의로 채우지 마세요. 로컬 파일은 `./assets/...` 상대 경로를 사용합니다.

Challenge·수상은 `awards`에서 관리합니다. `rank`는 1st·4th·Award 등의 강조 표기, `subtitle`은 대회명, `title`은 성과, `organization`은 설명입니다. `url`과 `linkLabel`은 공식 순위·상장·대회 홈페이지 등 실제 연결 대상에 맞춰 입력하고, 상장 미리보기가 있으면 `image`를 지정합니다. 홈페이지와 CV가 같은 수상 데이터를 사용합니다.

행사 사진은 `gallery`에 추가합니다. 각 행사는 고유 `id`, `date`, `title`, `description`, `sourceLabel`, 선택적 `sourceUrl`, `images` 배열을 가집니다. 각 사진에는 `src`, 한·영 `alt`, 실제 `width`·`height`를 입력합니다. 이미지 파일은 `assets/images/activity/`에 저장합니다. 사진 출처는 해당 폴더의 README를 참고하세요. 썸네일을 누르면 확대되고, 이전·다음 버튼이나 좌우 방향키로 전체 사진을 탐색하며 Esc로 닫습니다.

사진은 `profile.photo`, 기존 CV PDF는 `profile.cvUrl`로 지정합니다. HTML CV는 같은 데이터를 공유하며 브라우저에서 인쇄/PDF 저장이 가능합니다. 학력과 경력은 입력 순서를 유지합니다.

글꼴은 Pretendard Variable v1.3.9를 `assets/fonts/`에서 직접 제공합니다. 외부 폰트 서비스에 접속하지 않습니다. 재배포 시 동봉된 `OFL.txt`를 유지하세요. 색상·여백·타이포그래피는 `assets/css/style.css`에서 수정합니다.

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

`jc020230.github.io` 폴더는 이미 Git 저장소이며, `origin`은 `https://github.com/jc020230/jc020230.github.io.git`입니다. `git init`이나 원격 재등록은 필요하지 않습니다. 원격에 새로운 커밋이 있다면 fetch하여 변경을 비교합니다.

이 폴더를 VS Code에서 열고, 수정 내용을 확인한 뒤 업로드할 명령입니다.

```bash
git status
git remote -v
gh auth status
git fetch origin
git status -sb
node tools/sync-meta.mjs
node tools/check.mjs --release
git add .
git diff --cached
git commit -m "Update academic website"
git push origin main
```

원격 변경이 있다면 내용을 비교·통합한 다음 push합니다. 강제 push는 사용하지 않습니다. Git 작성자 정보가 없다면 본인의 이름과 이메일로 설정합니다. GitHub Settings → Pages → Deploy from a branch → main → /(root)가 현재 배포 설정입니다. 공개 전에 변경 내용을 검토하고, 배포 후 공개 URL의 파일·언어 전환을 확인하세요.

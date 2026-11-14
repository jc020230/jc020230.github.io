# Jungchan Ryu — 개인 연구 홈페이지

HTML, CSS, JavaScript로 만든 한·영 정적 홈페이지입니다. 내용은 `assets/js/data.js`에서 관리하며 빌드나 npm 설치가 필요하지 않습니다.

## 현재 작업본

실제 수정·배포 폴더는 `/Data2/data/jc25/jc020230.github.io`입니다. 내용은 `assets/js/data.js`에서 관리합니다. 기존 Git 이력을 유지합니다.

상단 프로젝트 메뉴와 큰 수상 순위 표시를 포함한 간결한 디자인입니다. 순위는 `awards[].rank`에서, 크기는 CSS의 `.challenge-rank`에서 수정합니다. 운영체제 기본 글꼴을 사용하므로 외부 폰트 서비스나 폰트 파일이 필요하지 않습니다.

## 로컬 실행

VS Code에서 `index.html`이 바로 보이는 프로젝트 루트를 엽니다.

Windows:

```powershell
py -3 tools/serve.py
```

Linux/macOS:

```bash
python3 tools/serve.py
```

브라우저에서 `http://127.0.0.1:8000/`을 엽니다. 종료는 `Ctrl+C`입니다. Python 없이 `index.html`을 직접 열 수도 있지만, 게시 환경과 비슷하게 보려면 로컬 서버를 사용하세요.

## 내용 수정

| 내용 | 파일/항목 |
| --- | --- |
| 이름·소속·이메일·프로필 사진 | `assets/js/data.js`의 `profile` |
| 소개 문단·관심 분야 | `about.paragraphs`, `about.interests` |
| 소식 | `news` |
| 논문 | `publications` |
| 수상 | `awards` |
| 프로젝트 | `projects` |
| 학회·세미나 사진 | `gallery` |
| 학력·경력 | `education`, `experience` |
| 메뉴·버튼 번역 | `assets/js/i18n.js` |
| 색상·글자 크기·화면 폭 | `assets/css/style.css` |

`{ko: "한국어", en: "English"}` 형태로 두 언어를 함께 입력합니다. 논문 제목은 원문 문자열을 그대로 사용할 수 있습니다. 주소를 빈 문자열로 두면 해당 링크는 표시하지 않습니다.

소개 영역의 큰 제목은 `profile.name`입니다. 이전 데이터 형식과의 호환을 위해 `about.headline`은 남겨두었지만 현재 디자인에서 슬로건으로 표시하지 않습니다.

연구 관심 분야는 배지가 아닌 한 줄 텍스트로 표시합니다. 논문의 `selected`, `tags`, `type` 데이터는 검색·필터에 계속 사용합니다. 모든 논문에 ‘주요 논문’ 장식을 붙이지는 않습니다.

## 검색·사진·CV

- 논문 우측 **검색 · 필터**를 펼치면 기존 검색, 연도·유형·주요 논문 필터를 사용할 수 있습니다.
- News의 **이전 소식 보기**로 나머지 소식을 펼칩니다.
- 사진 링크나 썸네일은 원본 비율의 확대 창을 엽니다. 좌우 방향키로 이동하고 Esc로 닫습니다.
- CV는 같은 데이터에서 생성됩니다. 상단 **인쇄 / PDF 저장**으로 브라우저 인쇄 기능을 사용합니다.
- `?lang=ko`, `?lang=en`으로 언어를 지정할 수 있습니다. 기존 언어 선택 저장 기능을 유지했습니다.

## 정적 검사

Node.js가 설치된 터미널에서 다음 명령을 실행합니다.

```bash
node tools/sync-meta.mjs
node tools/check.mjs --release
```

첫 명령은 `data.js`의 내용으로 HTML 메타데이터를 갱신합니다. 두 번째는 문법, 데이터, 번역, 내부 파일 경로, 메타데이터를 검사합니다. 외부 논문의 실재 여부나 원격 사이트의 응답까지 검증하지는 않습니다.

브라우저 검사는 선택 사항입니다. 홈페이지 실행에는 필요하지 않습니다.

```bash
python -m pip install playwright
python -m playwright install chromium
python tools/browser_check.py
```

시스템 Chromium을 지정하려면 `--executable /path/to/chromium`을 추가합니다. 로컬 URL 탐색이 차단된 검사 환경에서는 `--inline`을 사용할 수 있지만, 이 방식은 실제 브라우저 HTTP 로딩·URL 이동·저장된 언어의 재방문 동작을 검증하지 못합니다. 검사 결과와 스크린샷은 `.preview/`에 생성되며 Git에서는 제외됩니다. 이번 검증 범위는 `TEST_REPORT.md`에 기록했습니다.

## 기존 GitHub Pages 업데이트

최초 저장소 생성이나 원격 연결을 다시 할 필요는 없습니다. 기존 저장소에서 변경 사항을 확인한 뒤 커밋합니다.

```bash
git status
git diff --stat
git diff -- assets/js/data.js
```

로컬 화면과 내용이 맞으면:

```bash
git add .
git diff --cached --stat
git commit -m "Simplify personal research homepage"
git push
```

커밋 전 staged 파일을 확인하세요. 개인 파일이나 실험용 파일이 함께 들어 있으면 제외합니다. `.git` 폴더를 삭제하거나 `git init`을 다시 하거나 강제 push할 필요가 없습니다. 기존 Pages 게시 브랜치 설정을 그대로 사용합니다.

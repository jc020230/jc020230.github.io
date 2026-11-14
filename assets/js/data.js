/** 실제 연구자 정보. 텍스트 내 기관 링크: entities. 소식 자료 링크: resources.
 * 사진은 gallery의 행사별 images에서 관리합니다. 날짜는 YYYY-MM 또는 YYYY-MM-DD.
 * 수정 후 node tools/sync-meta.mjs 실행. */
window.SITE_DATA = {
  "site": {
    "url": "https://jc020230.github.io/",
    "defaultLanguage": "ko",
    "showDemoNotice": false,
    "updated": "2026-11-14",
    "title": {
      "ko": "연구 홈페이지",
      "en": "Academic Portfolio"
    },
    "description": {
      "ko": "류정찬 · 중앙대학교 통계데이터사이언스학과 석사과정. 오디오 질의응답, 오디오·비전·언어 모델과 음성 분석 연구.",
      "en": "Jungchan Ryu, M.S. student in Statistics and Data Science at Chung-Ang University. Audio question answering, audio-vision-language models, and speech analysis."
    },
    "newsLimit": 5
  },
  "profile": {
    "example": false,
    "name": {
      "ko": "류정찬",
      "en": "Jungchan Ryu"
    },
    "nameSecondary": {
      "ko": "Jungchan Ryu",
      "en": "류정찬"
    },
    "initials": "JR",
    "role": {
      "ko": "석사과정",
      "en": "M.S. Student"
    },
    "department": {
      "ko": "통계데이터사이언스학과",
      "en": "Department of Statistics and Data Science"
    },
    "institution": {
      "ko": "중앙대학교",
      "en": "Chung-Ang University"
    },
    "lab": "CAU ET Lab",
    "location": {
      "ko": "대한민국 서울",
      "en": "Seoul, South Korea"
    },
    "email": "jungchan0202@cau.ac.kr",
    "photo": "./assets/images/profile.png",
    "photoAlt": {
      "ko": "류정찬 프로필 사진",
      "en": "Portrait of Jungchan Ryu"
    },
    "cvUrl": "",
    "links": [
      {
        "label": "GitHub",
        "url": "https://github.com/jc020230"
      },
      {
        "label": "Google Scholar",
        "url": ""
      },
      {
        "label": "ORCID",
        "url": ""
      },
      {
        "label": "LinkedIn",
        "url": ""
      },
      {
        "label": {
          "ko": "연구실",
          "en": "Lab"
        },
        "url": "https://ikwak2.github.io/"
      }
    ]
  },
  "about": {
    "headline": {
      "ko": "음성을 이해하는 AI를 연구합니다.",
      "en": "Researching AI that understands Audio."
    },
    "paragraphs": [
      {
        "ko": "중앙대학교 일반대학원 통계데이터사이언스학과 석사과정 류정찬입니다. CAU ET Lab에서 곽일엽 교수님의 지도를 받고 있습니다.",
        "en": "I am Jungchan Ryu, an M.S. student in Statistics and Data Science at Chung-Ang University, advised by Prof. Il-Youp Kwak at CAU ET Lab."
      },
      {
        "ko": "문헌정보학을 전공하고 응용통계학을 복수전공했습니다. 오디오 질의응답과 오디오·비전·언어 모델에 관심이 있으며, 음성을 활용한 ALS 평가 연구에도 참여하고 있습니다.",
        "en": "I studied Library and Information Science with a double major in Applied Statistics. My interests include audio question answering and audio-vision-language models, and my research also includes speech-based ALS assessment."
      }
    ],
    "interests": [
      {
        "ko": "딥러닝",
        "en": "Deep Learning"
      },
      {
        "ko": "오디오·비전·언어 모델",
        "en": "Audio-Vision-Language Models"
      },
      {
        "ko": "오디오 질의응답",
        "en": "Audio Question Answering"
      },
      {
        "ko": "생체신호 데이터",
        "en": "Bio-Signal Data"
      }
    ]
  },
  "news": [
    {
      "example": false,
      "date": "2026-11-06",
      "category": {
        "ko": "세미나",
        "en": "Seminar"
      },
      "text": {
        "ko": "데이터사이언스융합연구소 세미나에서 연구 내용을 발표했습니다.",
        "en": "Gave a research presentation at a Data Science Convergence Research Institute seminar."
      },
      "url": "",
      "resources": [],
      "galleryId": "data-science"
    },
    {
      "example": false,
      "date": "2026-10",
      "category": {
        "ko": "수상",
        "en": "Award"
      },
      "text": {
        "ko": "CAU 팀이 DCASE 2026 Challenge Task 5에서 Overall 및 Lightweight 부문 모두 1위를 달성했습니다.",
        "en": "Our CAU team won first place in both the Overall and Lightweight categories of Task 5 at the DCASE 2026 Challenge."
      },
      "url": "",
      "resources": [
        {
          "label": {
            "ko": "공식 순위",
            "en": "Official results"
          },
          "url": "https://dcase.community/challenge2026/task-audio-dependent-question-answering-results"
        }
      ]
    },
    {
      "example": false,
      "date": "2026-10",
      "category": {
        "ko": "수상",
        "en": "Award"
      },
      "text": {
        "ko": "DCASE 2026 Task 5에서 CAU 팀의 연구가 Judge’s Award를 공동 수상했습니다.",
        "en": "Our CAU team received the Judge’s Award for our work on DCASE 2026 Task 5."
      },
      "url": "",
      "resources": [
        {
          "label": {
            "ko": "상장 보기",
            "en": "View certificate"
          },
          "url": "./assets/files/dcase-2026-task5-judges-award.webp"
        }
      ]
    },
    {
      "example": false,
      "date": "2026-09",
      "category": {
        "ko": "세미나",
        "en": "Seminar"
      },
      "text": {
        "ko": "중앙대학교 CAU ET Lab과 고려대학교 DLmath Lab 합동 세미나에서 발표했습니다.",
        "en": "Presented at the joint seminar of CAU ET Lab (Chung-Ang University) and DLmath Lab (Korea University)."
      },
      "url": "",
      "resources": [],
      "galleryId": "joint-seminar"
    },
    {
      "example": false,
      "date": "2026-07",
      "category": {
        "ko": "학회 발표",
        "en": "Conference"
      },
      "text": {
        "ko": "한국통계학회 2026년 하계학술논문발표회에서 음성 기반 ALS 중증도 예측 연구를 포스터로 발표했습니다.",
        "en": "Presented our research on speech-based ALS severity prediction at the 2026 Korean Statistical Society Summer Meeting."
      },
      "url": "",
      "resources": [
        {
          "label": {
            "ko": "프로시딩 초록 PDF",
            "en": "Proceedings abstract"
          },
          "url": "./assets/files/korean-statistical-society-2026-als-abstract.pdf"
        }
      ],
      "galleryId": "statistics"
    },
    {
      "example": false,
      "date": "2026-10-31",
      "category": {
        "ko": "논문",
        "en": "Publication"
      },
      "text": {
        "ko": "ALS 음성 평가 벤치마크 논문이 응용통계연구 39권 5호에 게재되었습니다.",
        "en": "Our ALS speech assessment benchmark was published in The Korean Journal of Applied Statistics, 39(5)."
      },
      "url": "",
      "resources": [
        {
          "label": {
            "ko": "논문 · DOI",
            "en": "Article · DOI"
          },
          "url": "https://doi.org/10.5351/KJAS.2026.39.5.537"
        }
      ]
    },
    {
      "example": false,
      "date": "2026-10-28",
      "category": {
        "ko": "논문",
        "en": "Paper"
      },
      "text": {
        "ko": "DCASE 2026 Workshop 공동저자 논문이 공개되었습니다.",
        "en": "Our coauthored paper is available in the DCASE 2026 Workshop proceedings."
      },
      "url": "",
      "resources": [
        {
          "label": {
            "ko": "워크숍 논문",
            "en": "Workshop paper"
          },
          "url": "https://dcase.community/documents/workshop2026/proceedings/DCASE2026Workshop_Jun_36.pdf"
        }
      ],
      "galleryId": "dcase"
    },
    {
      "example": false,
      "date": "2026-03-01",
      "category": {
        "ko": "학업",
        "en": "Education"
      },
      "text": {
        "ko": "중앙대학교 통계데이터사이언스학과 석사과정을 시작했습니다.",
        "en": "Started the M.S. program in Statistics and Data Science at Chung-Ang University."
      },
      "url": "",
      "resources": [
        {
          "label": {
            "ko": "연구실 소개",
            "en": "Lab profile"
          },
          "url": "https://ikwak2.github.io/students/index.html"
        }
      ]
    }
  ],
  "publications": [
    {
      "example": false,
      "id": "dcase-adqa-2026",
      "year": 2026,
      "type": "conference",
      "selected": true,
      "title": "Acoustic Tagger-Assisted Inference and Audio-Contrastive Adaptation for Audio-Dependent Question Answering",
      "authors": [
        {
          "name": "Hyun Jun Kim",
          "me": false
        },
        {
          "name": "Byeongchan Kim",
          "me": false
        },
        {
          "name": "Jung Chan Ryu",
          "me": true
        },
        {
          "name": "Yu Ra Kim",
          "me": false
        },
        {
          "name": "Yuri Oh",
          "me": false
        },
        {
          "name": "Bo Eun Choi",
          "me": false
        },
        {
          "name": "Changwon Lim",
          "me": false
        },
        {
          "name": "Il-Youp Kwak",
          "me": false
        }
      ],
      "venue": "DCASE 2026 Workshop",
      "note": "",
      "tags": [
        "Audio Question Answering",
        "DCASE"
      ],
      "abstract": "",
      "links": {
        "pdf": "https://dcase.community/documents/workshop2026/proceedings/DCASE2026Workshop_Jun_36.pdf",
        "paper": "",
        "code": "",
        "project": ""
      },
      "bibtex": ""
    },
    {
      "example": false,
      "id": "als-benchmark-2026",
      "year": 2026,
      "type": "journal",
      "selected": true,
      "title": "A Controlled Benchmark of Pretrained Speech Representations, Acoustic Features, and Classifiers for ALS Speech Assessment",
      "authors": [
        {
          "name": "Jungchan Ryu",
          "me": true
        },
        {
          "name": "Il-Youp Kwak",
          "me": false
        }
      ],
      "venue": "The Korean Journal of Applied Statistics, 39(5), 537–552",
      "note": "",
      "tags": [
        "Audio",
        "Speech"
      ],
      "abstract": "",
      "links": {
        "pdf": "https://pdf.medrang.co.kr/KJAS/2026/039/KJAS039-05-537.pdf",
        "paper": "https://doi.org/10.5351/KJAS.2026.39.5.537",
        "code": "",
        "project": ""
      },
      "bibtex": "@article{ryu2026alsbenchmark,\n  title = {A Controlled Benchmark of Pretrained Speech Representations, Acoustic Features, and Classifiers for ALS Speech Assessment},\n  author = {Ryu, Jungchan and Kwak, Il-Youp},\n  journal = {The Korean Journal of Applied Statistics},\n  year = {2026},\n  volume = {39},\n  number = {5},\n  pages = {537--552},\n  doi = {10.5351/KJAS.2026.39.5.537}\n}"
    },
    {
      "example": false,
      "id": "als-hybrid-2026",
      "year": 2026,
      "type": "journal",
      "selected": true,
      "title": "A Deep Learning Approach Using Hybrid Features for ALS Severity Prediction from Speech",
      "authors": [
        {
          "name": "Chaerin Song",
          "me": false
        },
        {
          "name": "Jungchan Ryu",
          "me": true
        },
        {
          "name": "Chaerin Lee",
          "me": false
        },
        {
          "name": "Minsu Kim",
          "me": false
        },
        {
          "name": "Il-Youp Kwak",
          "me": false
        }
      ],
      "venue": "The Korean Journal of Applied Statistics, 39(4), 401–417",
      "note": "",
      "tags": [
        "Audio",
        "Speech"
      ],
      "abstract": "",
      "links": {
        "pdf": "https://pdf.medrang.co.kr/KJAS/2026/039/KJAS039-04-401.pdf",
        "paper": "https://doi.org/10.5351/KJAS.2026.39.4.401",
        "code": "",
        "project": ""
      },
      "bibtex": ""
    }
  ],
  "projects": [
    {
      "example": false,
      "id": "dcase-adqa",
      "number": "01",
      "category": {
        "ko": "공동 연구",
        "en": "Collaborative research"
      },
      "title": "DCASE 2026 · Audio-Dependent Question Answering",
      "description": {
        "ko": "오디오 질의응답 시스템 공동 연구. DCASE 2026 Workshop 논문의 공동저자로 참여했습니다.",
        "en": "Collaborative research on audio-dependent question answering, published at the DCASE 2026 Workshop."
      },
      "status": {
        "ko": "2026 · 워크숍 논문 공개",
        "en": "2026 · Workshop paper available"
      },
      "tags": [
        "Audio",
        "Question Answering"
      ],
      "links": {
        "paper": "https://dcase.community/documents/workshop2026/proceedings/DCASE2026Workshop_Jun_36.pdf"
      }
    },
    {
      "example": false,
      "id": "als-assessment",
      "number": "02",
      "category": {
        "ko": "음성 분석",
        "en": "Speech analysis"
      },
      "title": {
        "ko": "음성 기반 ALS 평가",
        "en": "Speech-based ALS Assessment"
      },
      "description": {
        "ko": "사전학습 음성 표현·음향 특징·분류기 비교 및 하이브리드 특징을 활용한 ALS 중증도 예측 연구.",
        "en": "Research on comparing speech representations, acoustic features and classifiers, and predicting ALS severity with hybrid features."
      },
      "status": {
        "ko": "2026 · 관련 논문 2편",
        "en": "2026 · Two related papers"
      },
      "tags": [
        "Speech",
        "ALS"
      ],
      "links": {
        "paper": "https://doi.org/10.5351/KJAS.2026.39.5.537"
      }
    }
  ],
  "education": [
    {
      "period": {
        "ko": "2026 — 현재",
        "en": "2026 — Present"
      },
      "title": {
        "ko": "일반대학원 통계데이터사이언스학과 석사과정",
        "en": "M.S. in Statistics and Data Science (in progress)"
      },
      "institution": {
        "ko": "중앙대학교",
        "en": "Chung-Ang University"
      },
      "description": {
        "ko": "지도교수: 곽일엽 교수 · CAU ET Lab",
        "en": "Advisor: Prof. Il-Youp Kwak · CAU ET Lab"
      },
      "example": false
    },
    {
      "period": "2020 — 2026",
      "title": {
        "ko": "문헌정보학 전공 · 응용통계학 복수전공",
        "en": "Library and Information Science · Double major in Applied Statistics"
      },
      "institution": {
        "ko": "중앙대학교",
        "en": "Chung-Ang University"
      },
      "description": {
        "ko": "사회과학대학 · 2026년 졸업",
        "en": "College of Social Sciences · Graduated in 2026"
      },
      "example": false
    }
  ],
  "experience": [
    {
      "period": "2025",
      "title": {
        "ko": "학부연구생",
        "en": "Undergraduate Researcher"
      },
      "institution": "CAU ET Lab",
      "description": {
        "ko": "중앙대학교",
        "en": "Chung-Ang University"
      },
      "example": false
    },
    {
      "period": "2025",
      "title": {
        "ko": "제63대 비상대책위원회 비상대책위원장",
        "en": "Chair, 63rd Emergency Committee"
      },
      "institution": {
        "ko": "중앙대학교 문헌정보학과",
        "en": "Department of Library and Information Science, Chung-Ang University"
      },
      "description": {
        "ko": "학생 대표 활동",
        "en": "Student leadership"
      },
      "example": false
    }
  ],
  "awards": [
    {
      "example": false,
      "year": "2026",
      "title": {
        "ko": "DCASE 2026 Task 5 · Overall 및 Lightweight 두 부문 1위",
        "en": "DCASE 2026 Task 5 · 1st Place in Both Overall and Lightweight Tracks"
      },
      "organization": {
        "ko": "CAU 팀 공동 성과 · Overall 58.33%, Lightweight 57.30%",
        "en": "CAU team achievement · Overall 58.33%, Lightweight 57.30%"
      },
      "rank": "1st",
      "subtitle": "DCASE 2026 · Task 5",
      "url": "https://dcase.community/challenge2026/task-audio-dependent-question-answering-results",
      "linkLabel": {
        "ko": "공식 순위",
        "en": "Official results"
      }
    },
    {
      "example": false,
      "year": "2026",
      "title": {
        "ko": "DCASE 2026 Task 5 · Judge’s Award",
        "en": "Judge’s Award · DCASE 2026 Task 5"
      },
      "organization": {
        "ko": "Audio-Grounded Hard-Example Training with Acoustic Tagging for Audio-Dependent Question Answering · 공동 수상",
        "en": "Audio-Grounded Hard-Example Training with Acoustic Tagging for Audio-Dependent Question Answering · Team award"
      },
      "url": "./assets/files/dcase-2026-task5-judges-award.webp",
      "rank": "Award",
      "subtitle": "DCASE 2026 · Task 5",
      "linkLabel": {
        "ko": "상장 보기",
        "en": "View certificate"
      },
      "image": "./assets/files/dcase-2026-task5-judges-award.webp"
    },
    {
      "example": false,
      "year": "2025",
      "title": {
        "ko": "SAND Challenge Track 2 4위",
        "en": "4th Place, SAND Challenge Track 2"
      },
      "organization": {
        "ko": "CAU 팀 공동 성과",
        "en": "Team achievement · CAU"
      },
      "rank": "4th",
      "subtitle": "ICASSP · SAND Challenge",
      "url": "https://www.sand.icar.cnr.it/",
      "linkLabel": {
        "ko": "대회 홈페이지",
        "en": "Challenge website"
      }
    }
  ],
  "contact": {
    "headline": {
      "ko": "연구에 관한 대화를 환영합니다.",
      "en": "Let’s talk about research."
    },
    "text": {
      "ko": "공동 연구, 프로젝트, 연구 내용에 관한 문의는 이메일로 보내주세요. 관심 있는 주제와 간단한 소개를 함께 보내주시면 좋습니다.",
      "en": "For research collaborations, projects, or questions about my work, please get in touch by email with a brief introduction and your topic of interest."
    }
  },
  "entities": [
    {
      "labels": [
        "CAU ET Lab",
        "CAU ET LAB"
      ],
      "url": "https://ikwak2.github.io/"
    },
    {
      "labels": [
        "DLmath Lab",
        "DLmath LAB"
      ],
      "url": "https://dlmath-lab.github.io/"
    },
    {
      "labels": [
        "곽일엽 교수",
        "Prof. Il-Youp Kwak"
      ],
      "url": "https://ikwak2.github.io/aboutme.html"
    },
    {
      "labels": [
        "중앙대학교",
        "Chung-Ang University"
      ],
      "url": "https://www.cau.ac.kr/"
    },
    {
      "labels": [
        "한국통계학회",
        "Korean Statistical Society"
      ],
      "url": "https://www.kss.or.kr/"
    }
  ],
  "gallery": [
    {
      "id": "data-science",
      "date": "2026-11-06",
      "title": {
        "ko": "데이터사이언스융합연구소 세미나",
        "en": "Statistics & Data Science Seminar"
      },
      "description": {
        "ko": "음성 기반 ALS 분석 연구 발표",
        "en": "Presenting research on speech-based ALS analysis"
      },
      "sourceLabel": {
        "ko": "발표 사진 · 행사 포스터",
        "en": "Presentation · event program"
      },
      "sourceUrl": "",
      "images": [
        {
          "src": "./assets/images/activity/data-science-seminar.webp",
          "alt": {
            "ko": "데이터사이언스융합연구소 세미나 발표 현장",
            "en": "Research presentation at the Statistics & Data Science Seminar"
          },
          "width": 1058,
          "height": 1411
        },
        {
          "src": "./assets/images/activity/data-science-program.webp",
          "alt": {
            "ko": "2026년 11월 6일 세미나 행사 포스터",
            "en": "Seminar program, November 6, 2026"
          },
          "width": 1060,
          "height": 1500
        }
      ]
    },
    {
      "id": "dcase",
      "date": "2026-10",
      "title": {
        "ko": "DCASE 2026 Workshop",
        "en": "DCASE 2026 Workshop"
      },
      "description": {
        "ko": "CAU 팀 발표 · Boston, USA",
        "en": "CAU team presentation · Boston, USA"
      },
      "sourceLabel": {
        "ko": "사진: CAU ET Lab",
        "en": "Photo: CAU ET Lab"
      },
      "sourceUrl": "https://ikwak2.github.io/photos/index.html",
      "images": [
        {
          "src": "./assets/images/activity/dcase-presentation.webp",
          "alt": {
            "ko": "DCASE 2026 Workshop의 CAU 팀 연구 발표",
            "en": "CAU team presentation at the DCASE 2026 Workshop"
          },
          "width": 1400,
          "height": 1050
        }
      ]
    },
    {
      "id": "joint-seminar",
      "date": "2026-09",
      "title": {
        "ko": "CAU ET Lab × DLmath Lab",
        "en": "CAU ET Lab × DLmath Lab"
      },
      "description": {
        "ko": "중앙대학교·고려대학교 합동 세미나 발표",
        "en": "Research presentation at the joint lab seminar"
      },
      "sourceLabel": {
        "ko": "발표 사진",
        "en": "Presentation photo"
      },
      "sourceUrl": "",
      "images": [
        {
          "src": "./assets/images/activity/joint-seminar.webp",
          "alt": {
            "ko": "CAU ET Lab과 DLmath Lab 합동 세미나 발표 현장",
            "en": "Presentation at the joint CAU ET Lab and DLmath Lab seminar"
          },
          "width": 1050,
          "height": 1400
        }
      ]
    },
    {
      "id": "statistics",
      "date": "2026-07",
      "title": {
        "ko": "한국통계학회 하계학술논문발표회",
        "en": "Korean Statistical Society Summer Meeting"
      },
      "description": {
        "ko": "음성 기반 ALS 중증도 예측 · 포스터 발표",
        "en": "Speech-based ALS severity prediction · Poster presentation"
      },
      "sourceLabel": {
        "ko": "발표·학회 참가 사진",
        "en": "Poster presentation · conference moments"
      },
      "sourceUrl": "",
      "images": [
        {
          "src": "./assets/images/activity/statistics-poster.webp",
          "alt": {
            "ko": "한국통계학회에서 ALS 연구 포스터를 발표하는 모습",
            "en": "Presenting the ALS research poster at the Korean Statistical Society meeting"
          },
          "width": 1058,
          "height": 1411
        },
        {
          "src": "./assets/images/activity/statistics-meeting.webp",
          "alt": {
            "ko": "한국통계학회 참가자들의 명찰을 모은 기념사진",
            "en": "Conference moment with participants’ badges at the Korean Statistical Society meeting"
          },
          "width": 1058,
          "height": 1411
        }
      ]
    }
  ]
};

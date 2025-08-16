# 🎁 MOA MOA (모아모아) - Frontend

### 🔗 트러블슈팅 기록
[Notion Link](https://foregoing-zebra-57b.notion.site/Web-201d68872da8806ea1b1fa86e5c38b34?source=copy_link)

---

## 📌 프로젝트 소개
**모아모아**는 사용자가 함께 선물을 준비하고, 감성적인 편지를 주고받을 수 있는 **공동 선물 플랫폼**입니다.  
본 저장소는 **프론트엔드 개발을 담당하는 레포지토리**입니다.

---

## 🏛 아키텍처 & 폴더 구조

### 전체 아키텍처 개요
- **Frontend**: React + TypeScript + Tailwind CSS (Vercel 배포)  
- **Backend**: Node.js (Express) + MySQL (AWS EC2)  
- **Infra**: AWS S3 & CloudFront, RDS  
- **CI/CD**: GitHub Actions 자동 배포 파이프라인  

### 📂 디렉토리 구조
src/
├── assets/ # 정적 파일 (이미지, 아이콘)
├── components/ # Atomic Design 기반 공용 컴포넌트
│ ├── atoms/
│ ├── molecules/
│ ├── organisms/
│ └── common/
├── hooks/ # 커스텀 훅
├── pages/ # 페이지 컴포넌트
│ ├── Home/
│ ├── Login/
│ ├── Wishlist/
│ ├── Shopping/
│ ├── MyPage/
│ └── MoaLetter/
├── routes/ # 라우팅 파일
├── stores/ # 상태 관리
├── services/ # API 요청 함수
├── types/ # TypeScript 타입 정의
├── utils/ # 유틸 함수
├── styles/ # Tailwind 설정, 글로벌 CSS
├── App.tsx # 라우팅 진입 파일
├── main.tsx # React 엔트리 파일
└── index.css # 글로벌 CSS



---

## 🚀 기술 스택 및 선정 이유
- **React + TypeScript** : 빠른 UI 개발과 정적 타입 안정성  
- **Tailwind CSS** : Figma 디자인을 픽셀 단위로 반영 가능한 Utility-first 스타일링  
- **Recoil / Zustand** : 전역 상태 관리에 가볍고 직관적인 도구  
- **Axios** : 인터셉터 기반 JWT 자동첨부 및 에러 핸들링  
- **react-router-dom** : SPA 라우팅 구현  

---

## 🌱 협업 규칙

### Git Flow 브랜치 전략
| 브랜치 | 설명 |
| ------ | ---- |
| main | 서비스 배포 브랜치 |
| develop | 개발 통합 브랜치 |
| feat | 기능 개발 브랜치 |
| fix | 버그 수정 브랜치 |
| chore | 설정/의존성 작업 |
| refactor | 리팩토링 브랜치 |
| hotfix | 긴급 수정 브랜치 |

예시:  
- `feat/login-page-#5`  
- `fix/wishlist-error-#10`  
- `hotfix/cart-bug-#8`

### PR 규칙
- **PR 제목**: `[Feat] 로그인 기능 구현`  
- **merge 대상**: develop  
- **최소 1명 이상 리뷰 승인 필수**

---


---

## 🚀 기술 스택 및 선정 이유
- **React + TypeScript** : 빠른 UI 개발과 정적 타입 안정성  
- **Tailwind CSS** : Figma 디자인을 픽셀 단위로 반영 가능한 Utility-first 스타일링  
- **Recoil / Zustand** : 전역 상태 관리에 가볍고 직관적인 도구  
- **Axios** : 인터셉터 기반 JWT 자동첨부 및 에러 핸들링  
- **react-router-dom** : SPA 라우팅 구현  

---

## 🌱 협업 규칙

### Git Flow 브랜치 전략
| 브랜치 | 설명 |
| ------ | ---- |
| main | 서비스 배포 브랜치 |
| develop | 개발 통합 브랜치 |
| feat | 기능 개발 브랜치 |
| fix | 버그 수정 브랜치 |
| chore | 설정/의존성 작업 |
| refactor | 리팩토링 브랜치 |
| hotfix | 긴급 수정 브랜치 |

예시:  
- `feat/login-page-#5`  
- `fix/wishlist-error-#10`  
- `hotfix/cart-bug-#8`

### PR 규칙
- **PR 제목**: `[Feat] 로그인 기능 구현`  
- **merge 대상**: develop  
- **최소 1명 이상 리뷰 승인 필수**

---

## 📝 Commit Message Convention
| 타입 | 설명 |
| ---- | ---- |
| Feat | 새로운 기능 추가 |
| Fix | 버그 수정 |
| Docs | 문서 수정 |
| Style | 코드 포맷팅 |
| Refactor | 리팩토링 |
| Test | 테스트 코드 추가 |
| Chore | 설정/빌드 업무 |
| Design | UI/CSS 디자인 수정 |
| Comment | 주석 추가 |
| Rename | 파일/폴더명 변경 |
| Remove | 파일 삭제 |
| !HOTFIX | 긴급 수정 |

예시:
Feat: 로그인 기능 구현 (#5)

로그인 UI 구현

회원가입 페이지 연결

로그인 실패 시 에러 처리 추가


---

## 💡 개발 중 겪은 어려움 & 해결 과정
- **CORS 문제**: Vite 프록시 & Vercel rewrites 설정으로 해결  
- **JWT 인증 만료**: Axios 인터셉터를 활용해 자동 재발급 로직 구현  
- **배포 이슈**: AWS S3 → CloudFront 캐시 무효화 및 CI/CD 자동화  
- **디자인 일관성**: Tailwind config를 커스텀하여 Figma와 100% 매칭  

👉 상세 기록은 [Notion 트러블슈팅 문서](https://foregoing-zebra-57b.notion.site/Web-201d68872da8806ea1b1fa86e5c38b34?source=copy_link) 참고

---

## 🤖 AI 활용
- **GPT API** : 사용자의 위시리스트 촬영 사진에서 물건을 예측하여 등록

---

## 👩‍💻 팀원 역할
| 이름 | 담당 |
| ---- | ---- |
| 주디 | Login, Shopping |
| 지니 | Wishlist, Home |
| 주니 | MoaLetter, MyPage |

---

## 📢 기타 전달사항
- 본 프로젝트는 **UMC 8기 활동**의 산출물입니다.  
- 배포 주소: https://moamoa-front-end.vercel.app
- 프론트/백엔드/AI 모두 **실제 API 연동 기반**으로 구현되었습니다.


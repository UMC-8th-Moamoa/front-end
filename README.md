# 🎁 MOA MOA (모아모아) - Frontend

## 📌 프로젝트 소개

**모아모아**는 사용자가 함께 선물을 준비하고, 감성적인 편지를 주고받을 수 있는 **공동 선물 플랫폼**입니다.

본 레포지토리는 **프론트엔드 개발을 담당하는 저장소**입니다.

---

## 🚀 기술 스택

- **Frontend Framework:** `React`  
- **Language:** `TypeScript`  
- **Styling:** `Tailwind CSS`  
- **State Management:** `Recoil` (or `Zustand`)  
- **API Communication:** `Axios`  
- **Routing:** `react-router-dom`


---

## 📂 디렉토리 구조

```
src/
├── assets/            # 정적 파일 (이미지, 아이콘)
├── components/        # Atomic Design 기반 공용 컴포넌트
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── common/
├── hooks/             # 커스텀 훅
├── pages/             # 페이지 컴포넌트
│   ├── Home/
│   ├── Login/
│   ├── Wishlist/
│   ├── Shopping/
│   ├── MyPage/
│   └── MoaLetter/
├── routes/            # 라우팅 파일
├── stores/            # 상태 관리
├── services/          # API 요청 함수
├── types/             # TypeScript 타입 정의
├── utils/             # 유틸 함수
├── styles/            # Tailwind 설정, 글로벌 CSS
├── App.tsx            # 라우팅 진입 파일
├── main.tsx           # React 엔트리 파일
└── index.css          # 글로벌 CSS

```

---

## 🌱 Git Flow 브랜치 전략

| 브랜치 | 설명 |
| --- | --- |
| main | 서비스 배포 브랜치 |
| develop | 개발 통합 브랜치 |
| fix | 버그 수정 브랜치 |
| feat | 기능 개발 브랜치 |
| chore | 설정, 의존성, yml 등 작업 브랜치 |
| refactor | 리팩토링 브랜치 |
| hotfix | 긴급 수정 브랜치 |

### 📂 브랜치 예시

- `feat/login-page-#5`
- `fix/wishlist-error-#10`
- `hotfix/cart-bug-#8`

---

## 🤝 PR 규칙

### 📌 PR 제목

`[커밋 유형] 작업 내용 요약`

- 예시: `[Feat] 로그인 기능 구현`

### 📌 PR 세부 규칙

- merge 대상: `develop`
- 최소 1명 이상의 코드 리뷰 승인 필요

### 📌 PR 템플릿

```
## 🪺 Summary
(변경한 내용을 간단히 작성)

## 🌱 Issue Number
- #

## 🙏 To Reviewers
(리뷰어에게 전달하고 싶은 말)
```

---

## ✅ Issue Template

```
---
name: 이슈 생성 템플릿
about: 이슈를 생성해주세요.
title: ''
labels: ''
assignees: ''
---

## 📌 Description
이슈 설명

## ✅ Changes
- [ ] 세부 사항 1
- [ ] 세부 사항 2

## 🚀 API
| URL | Method | Usage | Authorization |
| --- | ------ | ----- | ------------- |
| api 경로 | POST | API 설명 | 필요 여부 |

## 💬 Additional Context
추가 내용
```

---

## 📝 Commit Message Convention

| 커밋 유형 | 설명 |
| --- | --- |
| Feat | 새로운 기능 추가 |
| Fix | 버그 수정 |
| Docs | 문서 수정 |
| Style | 코드 포맷팅 |
| Refactor | 코드 리팩토링 |
| Test | 테스트 코드 추가 |
| Chore | 설정 파일 수정 |
| Design | UI/CSS 디자인 수정 |
| Comment | 주석 추가 |
| Rename | 파일/폴더명 수정 |
| Remove | 파일 삭제 |
| !HOTFIX | 긴급 수정 |

### 📌 Commit 작성 예시

```
Feat: 로그인 기능 구현 (#5)

- 로그인 UI 구현
- 회원가입 페이지 연결
- 로그인 실패 시 에러 처리 추가
```

---

## 👩‍💻 팀원 역할

| 이름 | 담당 |
| --- | --- |
<<<<<<< HEAD
| 주디 | Login |
| 지니 | Shopping, WishList, Home |
| 주니 | MoaLetter, MyPage |
=======
<<<<<<< HEAD
| 주디 | 로그인, 회원가입, 설정, 공용 버튼 |
| 지니 | 홈, 위시리스트, 쇼핑, 상품 카드 |
| 주니 | 마이페이지, 모아편지, 롤링페이퍼, 편지지 |
=======
| 주디 | Login |
| 지니 | Shopping, WishList, Home |
| 주니 | MoaLetter, MyPage |
>>>>>>> d51d00f8fa47f4e558a84e58cd71d7fdc394b8fc
>>>>>>> develop

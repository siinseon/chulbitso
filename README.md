# 출빛소 (Chulbitso) - 책 덕후를 위한 기록 앱

Next.js 14 (App Router), Tailwind CSS, Supabase, Lucide React 기반의 독서 기록 앱입니다.

## 시작하기

### 사전 요구사항

- Node.js 18.x 이상 설치
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 디자인

- **배경**: #F2F2F2 (종이 질감)
- **메인 컬러**: #11593F (딥 그린)
- **폰트**: Nanum Myeongjo (구글 폰트)

## 기능

- 중앙 검색창을 통한 책 검색
- 가짜 데이터 기반 검색 (알라딘 API 연동 예정)
- 검색 결과 카드 UI

## 프로젝트 구조

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BookCard.tsx    # 검색 결과 카드
│   └── SearchBar.tsx   # 검색창
├── lib/
│   └── utils.ts        # cn() 유틸리티
└── package.json
```

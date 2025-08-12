import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setAccessToken } from './lib/http';

// 개발 테스트용: 앱 실행 전에 임시토큰 세팅
setAccessToken(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJlbWFpbCI6ImRscnVkYWxzQGdtYWlsLmNvbSIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzU0ODM3NjAwLCJleHAiOjE3NTc0Mjk2MDAsImF1ZCI6Im1vYW1vYS11c2VycyIsImlzcyI6Im1vYW1vYS1wbGF0Zm9ybSJ9.YCzK-U4p8tg1tk8USA-gsFS22RQLnSc9Awyvz2bWGXM'
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

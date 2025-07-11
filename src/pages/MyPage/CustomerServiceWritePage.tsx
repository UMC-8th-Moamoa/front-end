import React, { useState } from 'react';
import TopBar from '../../components/common/TopBar';
import BackButton from '../../components/common/BackButton';
import InputBox from '../../components/common/InputBox';
import { useNavigate } from 'react-router-dom';

export default function CustomerServiceWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // 제출 로직 (예: 서버 전송) 구현 예정
    alert('문의가 등록되었습니다');
    navigate('/mypage/customer-service');
  };

  return (
    <div className="flex flex-col bg-white max-w-[393px] mx-auto text-black min-h-screen">
      <TopBar />

      {/* 상단 바 */}
      <div className="flex items-center mb-6 ml-5 mt-3">
        <BackButton />
        <span className="text-lg font-bold ml-3">문의 작성</span>
      </div>

      {/* 입력 영역 */}
      <div className="flex flex-col gap-4 px-5">
        <InputBox
          type="text"
          placeholder="제목을 입력해 주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="문의 내용을 입력해 주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 p-4 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* 잠금 여부 */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isLocked}
            onChange={(e) => setIsLocked(e.target.checked)}
          />
          <span className="text-sm">비밀글로 설정</span>
        </div>

        {isLocked && (
          <InputBox
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </div>

      {/* 버튼 */}
      <div className="flex justify-around mt-10 px-5">
        <button
          onClick={() => navigate('/mypage/customer-service')}
          className="text-gray-500 text-sm"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="text-black text-sm font-bold"
        >
          제출하기
        </button>
      </div>
    </div>
  );
}

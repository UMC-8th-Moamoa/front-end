// src/pages/MyPage/CustomerServiceDetailPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/common/TopBar';
import BackButton from '../../components/common/BackButton';

export default function CustomerServiceDetailPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col max-w-[393px] mx-auto text-black px-5 py-4 bg-white h-screen">
      <TopBar />
      <div className="flex items-center mb-5">
        <BackButton />
        <span className="text-lg font-bold ml-[90px]">문의 상세</span>
      </div>

      {/* 유저 정보 */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/30"
            className="w-[30px] h-[30px] rounded-full mr-2"
          />
          <span className="text-sm font-semibold">chaoni_gold</span>
        </div>
        <span className="text-xs text-gray-500">2025.04.06</span>
      </div>

      {/* 제목 */}
      <div className="text-md font-bold mb-2">결제에 문제가 생겼습니다</div>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        Amet magna et consectetur egestas faucibus praesent libero. Ut turpis orci amet fames magna donec tincidunt.
        Ut sagittis adipiscing porta lorem auctor porta vestibulum risus. A at fermentum bibendum maecenas sit.
      </p>

      {/* 답변 영역 */}
      <div className="text-center text-sm text-gray-400 mt-10">아직 답변이 없습니다</div>
    </div>
  );
}

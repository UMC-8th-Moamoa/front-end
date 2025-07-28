import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';

export default function CustomerServiceDetailPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { title, content, date, username } = state || {};

  return (
    <div className="mt-[12px] flex flex-col max-w-[393px] mx-auto text-black bg-white min-h-screen px-5 pt-4">
      {/* 상단바: 백버튼 + 유저정보 + 날짜 (한 줄 정렬) */}
      <div className="flex justify-between items-center mb-[15px]">
        <div className="flex items-center gap-[8px]">
          <BackButton />
          <div className="w-[34px] h-[34px] bg-[#97B1FF] rounded-full" />
          <span className="text-[16px] font-semibold text-[#1F1F1F] font-pretendard">{username}</span>
        </div>
        <span className="text-[14px] font-normal text-[#B7B7B7] font-pretendard">{date}</span>
      </div>

      {/* 구분선 */}
      <div className="mb-[40px] w-[350px] h-[1px] bg-[#E1E1E1] mb-[20px] mx-auto" />

  {/* 제목 */}
      <div className="w-[350px] mx-auto text-[18px] font-medium text-[#1F1F1F] font-pretendard mb-[8px]">
        결제에 문제가 생겼습니다
      </div>

      {/* 내용 */}
      <div className="w-[350px] mx-auto text-[16px] font-normal text-[#1F1F1F] font-pretendard leading-[24px] whitespace-pre-line mb-[40px]">
        Amet magna et consectetur egestas faucibus praesent libero. Ut turpis orci amet fames magnis
        donec tincidunt. Ut sagittis adipiscing porta lorem auctor porta vestibulum risus. A at
        fermentum bibendum maecenas sit.
      </div>

      {/* 답변 없음 */}
      <div className="w-[350px] mx-auto mt-[129px] text-center text-[18px] text-[#B7B7B7] font-pretendard">
        아직 답변이 없습니다
   </div>

    </div>
  );
}

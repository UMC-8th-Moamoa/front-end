import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';

export default function CustomerServiceDetailPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { title, content, date, username } = state || {};

  return (
<div className="flex flex-col max-w-[393px] mx-auto text-black bg-white min-h-screen px-5 pt-[60px]">
      {/* 상단바 - 고정 */}
      <div
        className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[393px] h-[60px] flex justify-between items-center px-5 z-50 border-b border-[#EAEAEA] bg-white"
      >
        <div className="flex items-center gap-[8px]">
          <BackButton />
          <div className="w-[34px] h-[34px] bg-[#97B1FF] rounded-full" />
          <span className="text-[16px] font-semibold text-[#1F1F1F] font-pretendard">
            {username ?? ''}
          </span>
        </div>
        <span className="text-[14px] font-normal text-[#B7B7B7] font-pretendard">
          {date ?? ''}
        </span>
      </div>

      

      {/* 구분선 */}
      <div className=" w-[350px] h-[1px] bg-[#E1E1E1]  mx-auto" />

  {/* 제목 */}
      <div className="w-[350px] mx-auto text-[18px] font-medium text-[#1F1F1F] font-pretendard mt-[40px] mb-[8px]">
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

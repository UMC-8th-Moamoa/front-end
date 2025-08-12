import React from 'react';

interface CustomerCardProps {
  title: string;
  content: string;
  date: string;
  status: '답변 보기' | '답변 대기';
  isLocked: boolean;
  username: string;
  onClick?: () => void;
}

export default function CustomerCard({
  title,
  content,
  date,
  status,
  isLocked,
  username,
  onClick,
}: CustomerCardProps) {
  const isAnswerAvailable = status === '답변 보기';

  return (
    <div
      className={`flex flex-col justify-center items-end w-[340px] px-[16px] py-[12px] rounded-[7px] border border-[#E1E1E1] bg-white 
        ${isAnswerAvailable ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={isAnswerAvailable ? onClick : undefined}
    >
      {/* 제목 + 날짜 */}
      <div className="flex justify-between w-full items-start">
        <p className="text-[#1F1F1F] text-[18px] font-semibold w-[244px] truncate font-pretendard">
          {title}
        </p>
        <p className="text-[#B7B7B7] text-[14px] font-pretendard">{date}</p>
      </div>

      {/* 내용 */}
      <p className="text-[#1F1F1F] text-[16px] my-[8px] font-pretendard w-full line-clamp-2">
        {content}
      </p>

      {/* 아이디 + 상태 */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-[8px]">
          <div className="w-[17px] h-[17px] rounded-full bg-[#97B1FF]" />
          <p className="text-[#1F1F1F] text-[12px] font-pretendard">
            {username}
          </p>
        </div>

        {/* 상태 버튼 */}
        <div
          className={`flex min-w-[73px] h-[26px] justify-center items-center rounded-full text-[12px] font-bold font-pretendard
            ${isAnswerAvailable ? 'bg-[#6282E1] text-white' : 'border border-[#6282E1] text-[#6282E1] bg-white'}`}
        >
          {status}
        </div>
      </div>
    </div>
  );
}

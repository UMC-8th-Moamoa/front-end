// src/components/mypage/CustomerCard.tsx
import React from 'react';

interface CustomerCardProps {
  title: string;
  content: string;
  date: string;
  status: '접수 완료' | '답변 보기';
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
  return (
    <div
      className="w-full p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between mb-1">
        <p className="font-bold text-sm text-gray-800">{title}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
      <p className="text-xs text-gray-500 mb-2">{content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-gray-400 mr-1" />
          {username}
        </div>
        <div
          className={`text-xs px-2 py-1 rounded-full border 
            ${status === '답변 보기' ? 'bg-gray-300 text-white' : 'border-gray-300 text-gray-500'}`}
        >
          {status}
        </div>
      </div>
    </div>
  );
}

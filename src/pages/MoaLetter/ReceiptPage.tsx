import React from "react";
import BackButton from "../../components/common/BackButton";

export default function ReceiptPage() {
  return (
    <div className="w-full max-w-[350px] min-h-screen mx-auto bg-white font-pretendard px-4 pt-6 pb-10">
      {/* 상단바 */}
      <div className="relative w-full mb-6">
        {/* 왼쪽에 BackButton */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <BackButton />
        </div>

        {/* 중앙 타이틀 */}
        <h1 className="text-center text-[18px] font-semibold text-black">
          전자 기부금 영수증
        </h1>
      </div>

      {/* 내용 영역 */}
      <div className="w-[350px] h-[677px] mt-[28px] flex-shrink-0 rounded-[10px] bg-[#F2F2F2] mx-auto">
        {/* 실제 영수증 내용 추후 삽입 예정 */}
      </div>
    </div>
  );
}

import React from "react";

const TopBar = () => {
  return (
    <div className="w-full h-14 flex items-center justify-between px-4 relative max-w-[393px] mx-auto">
      {/* 좌측 (빈 공간 or 뒤로가기 아이콘 자리) */}
      <div className="w-5 h-5" />

      {/* 로고 중앙 정렬 */}
      <img
        src="/assets/MoamoaLogo.svg"
        alt="MOA MOA"
        className="h-5 absolute left-1/2 transform -translate-x-1/2"
      />

      {/* 검색 아이콘 우측 */}
      <div onClick={() => alert('검색')} className="cursor-pointer">
        <img src="/assets/Search.svg" alt="검색" className="w-5 h-5 select-none" />
      </div>
    </div>
  );
};

export default TopBar;

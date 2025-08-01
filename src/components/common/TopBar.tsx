import React from "react";
import AlarmIcon from "../../assets/Alarm.svg";
import SearchIcon from "../../assets/Search.svg";
import MoamoaLogo from "../../assets/MoamoaLogo.svg";

const TopBar = () => {
  return (
<<<<<<< HEAD
    <div className="w-[350px] h-[44px] px-[20px] flex items-center justify-between mx-auto fixed top-0 left-1/2 -translate-x-1/2 z-[1000] bg-[#FFF]">
      {/* 알람 아이콘 */}
      <div className="w-[24px] h-[24px] ml-[10px] flex items-center justify-center">
        <img
          src={AlarmIcon}
          alt="알람"
          className="w-full h-full object-contain"
=======
    <div className="w-[393px] h-14 relative flex items-center justify-center px-4 ">
      {/* 좌측 알람 아이콘 */}
      <div
        onClick={() => navigate("/alarm")} 
        className="absolute left-8 cursor-pointer"
      >
        <img
          src="/assets/Alarm.svg"
          alt="알림"
          className="w-[20px] h-[20px] mt-[2px] select-none"
>>>>>>> origin/develop
        />
      </div>

      {/* 중앙 로고 */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img
          src={MoamoaLogo}
          alt="MOA MOA"
          className="h-[18px] object-contain"
        />
      </div>

<<<<<<< HEAD
      {/* 검색 아이콘 */}
      <div className="w-[24px] h-[24px] flex items-center mr-[10px] justify-center">
        <img
          src={SearchIcon}
          alt="검색"
          className="w-full h-full object-contain"
=======
      {/* 우측 돋보기 아이콘 */}
      <div
        onClick={() => navigate("/search")}
        className="absolute right-8 cursor-pointer"
      >
        <img
          src="/assets/Search.svg"
          alt="검색"
          className="w-[21px] h-[21px] select-none"
>>>>>>> origin/develop
        />
      </div>
    </div>
  );
};

export default TopBar;

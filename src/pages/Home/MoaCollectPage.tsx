import React from "react";
import Button from "../../components/common/Button";
import BottomNavigation, { type MenuType } from "../../components/common/BottomNavigation";
import ParticipantList from "../../components/HomePage/Participation/ParticipantList";

const MoaCollectedPage = () => {
  const moaMoney = 80000;

  const [activeMenu, setActiveMenu] = React.useState<MenuType>("home");

  return (
    <div className="relative w-[393px] min-h-screen bg-[#8F8F8F] mx-auto pb-[100px] overflow-hidden">
      {/* 금액 */}
      <div className="pt-[50px] text-center">
        <p className="text-white text-[40px] font-medium">
          {moaMoney.toLocaleString()}원
        </p>
        <p className="text-white text-[18px] font-medium mt-1">
          의 마음이 모였어요!
        </p>
      </div>

      {/* 참여자 리스트 */}
      <div className="mt-10 px-4">
        <ParticipantList />
      </div>

      {/* 달걀모양 이미지 */}
      <img
        src="/assets/Eclipse.svg"
        alt="Eclipse"
        className="absolute bottom-[-30px] left-1/3 -translate-x-[20%] w-[444px] h-[517px] object-contain"
      />

      {/* 선물 고르기 버튼 */}
      <div className="w-[350px] absolute bottom-[80px] left-1/2 -translate-x-1/2">
        <Button>
          <p className="text-[20px] text-white text-center">선물 고르기</p>
        </Button>
      </div>

      {/* 바텀 내비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default MoaCollectedPage;
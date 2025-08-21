// src/components/common/TopBar.tsx
import { useNavigate } from "react-router-dom";
import AlarmIcon from "../../assets/Alarm.svg";
import SearchIcon from "../../assets/Search.svg";
import MoamoaLogo from "../../assets/MoamoaLogo.svg";

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[393px] h-14 relative flex items-center justify-center px-4 bg-[#FFF] fixed top-0 left-1/2 -translate-x-1/2 z-[1000]">
      {/* 좌측 알람 아이콘 (항상 Alarm.svg) */}
      <div
        onClick={() => navigate("/alarm")}
        className="absolute left-8 cursor-pointer"
      >
        <img
          src={AlarmIcon}
          alt="알림"
          className="w-[24px] h-[24px] object-contain"
        />
      </div>

      {/* 중앙 로고 */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img src={MoamoaLogo} alt="MOA MOA" className="h-[18px] object-contain" />
      </div>

      {/* 우측 검색 아이콘 */}
      <div
        onClick={() => navigate("/search")}
        className="absolute right-8 cursor-pointer"
      >
        <img
          src={SearchIcon}
          alt="검색"
          className="w-[21px] h-[21px] object-contain"
        />
      </div>
    </div>
  );
};

export default TopBar;

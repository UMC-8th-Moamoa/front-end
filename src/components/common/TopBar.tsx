// src/components/common/TopBar.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlarmIcon from "../../assets/Alarm.svg";
import UnreadAlarmIcon from "../../assets/UnreadAlarm.svg";
import SearchIcon from "../../assets/Search.svg";
import MoamoaLogo from "../../assets/MoamoaLogo.svg";

// ✅ 읽지 않은 알림 상태 조회 API
import { getUnreadStatus } from "../../services/notification/notifications";

const TopBar = () => {
  const navigate = useNavigate();
  const [hasUnread, setHasUnread] = useState(false);

  const refreshUnread = async () => {
    try {
      const unread = await getUnreadStatus();
      setHasUnread(unread);
    } catch {
      // 실패해도 UI는 기본 아이콘 유지
      setHasUnread(false);
    }
  };

  useEffect(() => {
    // 최초 1회 체크
    refreshUnread();

    // 탭이 다시 활성화될 때마다 갱신 (알림 화면 다녀온 뒤 반영용)
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshUnread();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return (
    <div className="w-[393px] h-14 relative flex items-center justify-center px-4 bg-[#FFF] fixed top-0 left-1/2 -translate-x-1/2 z-[1000]">
      {/* 좌측 알람 아이콘 */}
      <div
        onClick={() => navigate("/alarm")}
        className="absolute left-8 cursor-pointer"
      >
        <img
          src={hasUnread ? UnreadAlarmIcon : AlarmIcon}
          alt={hasUnread ? "읽지 않은 알림 있음" : "알림"}
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

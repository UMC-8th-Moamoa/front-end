// src/components/HomePage/Participation/RecipientBanner.tsx

type RecipientBannerProps = {
  /** 수신자 이름 (예: "김민수") */
  name: string;
  /** 프로필 이미지 URL (없으면 기본 회색 원 표시) */
  photo?: string | null;
  /** 생일까지 남은 일수 (서버 countdown.daysRemaining) */
  daysRemaining: number;
};

/**
 * 참여 화면 상단의 수신자/디데이 배너
 */
const RecipientBanner = ({ name, photo, daysRemaining }: RecipientBannerProps) => {
  const dday = Math.max(0, Math.floor(Number.isFinite(daysRemaining) ? daysRemaining : 0));

  return (
    <div className="w-[350px] h-[152px] bg-white rounded-[20px] shadow-md flex items-center justify-center ml-[6px]">
      {/* 왼쪽 - 프로필 */}
      <div className="flex flex-col items-center justify-center w-[69px] mr-5">
        {photo ? (
          <img
            src={photo}
            alt={`${name}의 프로필`}
            className="w-[69px] h-[69px] rounded-full object-cover"
          />
        ) : (
          <div className="w-[69px] h-[69px] rounded-full bg-[#D9D9D9]" />
        )}
        <div className="mt-2 text-[15px] font-medium text-black">{name}</div>
      </div>

      {/* 중앙 세로선 */}
      <div className="w-px h-[102px] bg-[#D9D9D9] mx-5" />

      {/* 오른쪽 - D-day */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-[52px] font-semibold text-transparent ml-4 bg-clip-text bg-gradient-to-b from-[#6282E1] to-[#FEC3FF]">
          D-{dday}
        </div>
      </div>
    </div>
  );
};

export default RecipientBanner;

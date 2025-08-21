import { useNavigate } from "react-router-dom";

interface UpcomingFriendItemProps {
  name: string;
  displayDate: string;   // 예: "8월 23일"
  dday: number;          // 서버 제공값(표시 보정용으로만 참고)
  image?: string | null;
  eventId?: number | string | null;
}

const DEFAULT_PROFILE = "/assets/profile.svg";

// "8월 23일" → {month, day}
function parseMonthDayFromDisplay(s: string): { month: number; day: number } | null {
  const m = String(s ?? "").match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  if (!m) return null;
  const month = +m[1], day = +m[2];
  if (month >= 1 && month <= 12 && day >= 1 && day <= 31) return { month, day };
  return null;
}

// 다음 발생(올해 또는 내년)까지 남은 '정수 일수'
function daysUntilNext(md: { month: number; day: number }): number {
  const now = new Date();
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target0 = new Date(now.getFullYear(), md.month - 1, md.day, 0, 0, 0, 0);
  if (target0 < today0) target0 = new Date(now.getFullYear() + 1, md.month - 1, md.day, 0, 0, 0, 0);
  const diff = Math.floor((target0.getTime() - today0.getTime()) / 86400000);
  return Math.max(0, diff);
}

const UpcomingFriendItem = ({
  name,
  displayDate,
  dday,
  image,
  eventId,
}: UpcomingFriendItemProps) => {
  const navigate = useNavigate();

  const md = parseMonthDayFromDisplay(displayDate);
  const displayDday = md ? daysUntilNext(md) : Math.max(0, Math.floor(dday ?? 0));

  const dText = displayDday === 0 ? "D-DAY" : `D-${displayDday}`;
  const isUrgent = displayDday <= 7;

  const handleClick = () => {
    const n = Number(eventId);
    if (Number.isFinite(n) && n > 0) navigate(`/participation?eventId=${n}`);
    else navigate(`/participation`);
  };

  const src = (image ?? "").trim() || DEFAULT_PROFILE;

  return (
    <div className="w-[350px] flex items-center gap-4 mb-4 mx-auto">
      <img
        src={src}
        alt={`${name}의 프로필`}
        loading="lazy"
        className="w-[64px] h-[64px] rounded-full object-cover bg-gray-300"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (!img.src.endsWith("profile.svg")) {
            img.src = DEFAULT_PROFILE;
          }
        }}
      />

      <div className="flex-1">
        <p className="text-[16px] text-black">{name}</p>
        <p className="text-[16px] text-[#B7B7B7]">
          {displayDate}
          <span className={isUrgent ? "text-red-500" : "text-[#B7B7B7]"}>
            {" "}
            ({dText})
          </span>
        </p>
      </div>

      {isUrgent && (
        <button
          onClick={handleClick}
          className="w-[99px] h-[33px] rounded-[8px] text-[14px] font-bold text-[#6282E1] border border-[#6282E1] bg-white"
        >
          모아 참여
        </button>
      )}
    </div>
  );
};

export default UpcomingFriendItem;

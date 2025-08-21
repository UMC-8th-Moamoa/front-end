import { useNavigate } from "react-router-dom";

interface UpcomingFriendItemProps {
  name: string;
  displayDate: string;   // API: "8월 23일"
  dday: number;          // API: dDay
  image?: string | null; // 친구 프로필 이미지 URL
  eventId?: number | string | null;
}

const DEFAULT_PROFILE = "/assets/profile.svg";

const UpcomingFriendItem = ({
  name,
  displayDate,
  dday,
  image,
  eventId,
}: UpcomingFriendItemProps) => {
  const navigate = useNavigate();

  const isUrgent = dday <= 7;                // 당일 포함
  const dText = dday === 0 ? "D-DAY" : `D-${dday}`;

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

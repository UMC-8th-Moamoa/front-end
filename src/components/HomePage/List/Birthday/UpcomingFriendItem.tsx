import { useNavigate } from "react-router-dom";

interface UpcomingFriendItemProps {
  name: string;
  displayDate: string;   // API의 "8월 23일"
  dday: number;          // API의 dDay
  image?: string | null;
  eventId: number;
}

const UpcomingFriendItem = ({
  name,
  displayDate,
  dday,
  image,
  eventId,
}: UpcomingFriendItemProps) => {
  const navigate = useNavigate();
  const isUrgent = dday <= 7; // 스펙상 7일 이내만 내려오지만 안전망

  const handleClick = () => {
    // 참여 페이지로 이동 (프로젝트 규칙에 맞춰 경로/파라미터 조정 가능)
    navigate(`/participation?eventId=${eventId}`);
  };

  return (
    <div className="w-[350px] flex items-center gap-4 mb-4 mx-auto">
      {/* 프로필 이미지 */}
      {image ? (
        <img
          src={image}
          alt={`${name}의 프로필`}
          className="w-[64px] h-[64px] rounded-full object-cover"
        />
      ) : (
        <div className="w-[64px] h-[64px] rounded-full bg-gray-300" />
      )}

      <div className="flex-1">
        <p className="text-[16px] text-black">{name}</p>
        <p className="text-[16px] text-[#B7B7B7]">
          {displayDate}
          <span className={isUrgent ? "text-red-500" : "text-[#B7B7B7]"}>
            {" "}
            (D-{dday})
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

import { useNavigate } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";

interface UpcomingFriendItemProps {
  name: string;
  birthday: string;
  image?: string;
}

const UpcomingFriendItem = ({ name, birthday }: UpcomingFriendItemProps) => {
  const navigate = useNavigate();
  const today = new Date();
  const birthDate = new Date(birthday);
  if (birthDate < today) birthDate.setFullYear(today.getFullYear() + 1);
  const dday = differenceInCalendarDays(birthDate, today);

  const formattedDate = `${birthDate.getMonth() + 1}월 ${birthDate.getDate()}일`;
  const isUrgent = dday <= 7;

  const handleClick = () => {
    navigate("/participation");
  };

  return (
    <div className="w-[350px] flex items-center gap-4 mb-4 mx-auto">
      {/* 동그란 회색 박스 */}
      <div className="w-[64px] h-[64px] rounded-full bg-gray-300" />

      <div className="flex-1">
        <p className="text-[16px] font-semibold text-black">{name}</p>
        <p className="text-[16px] text-gray-500">
          {formattedDate}
          <span className={isUrgent ? "text-red-500" : "text-gray-400"}>
            {" "}
            (D-{dday})
          </span>
        </p>
      </div>

      {isUrgent && (
        <button
          onClick={handleClick}
          className="w-[99px] h-[33px] rounded-[8px] bg-[#888] text-white text-[14px]"
        >
          모아 참여
        </button>
      )}
    </div>
  );
};

export default UpcomingFriendItem;

// components/HomePage/List/Birthday/FriendLetterItem.tsx
import EnvelopeIcon from "/assets/Envelope.svg";
import { useNavigate } from "react-router-dom";

interface FriendLetterItemProps {
  name: string;              // birthdayPersonName
  birthday: string;          // "YYYY-MM-DD"
  daysLeft: number;          // API 제공 D-day
  hasLetter: boolean;
  letterId?: number | null;  // 수정 시 필요
  eventId: number;           // 작성 시 필요
}

const FriendLetterItem = ({
  name,
  birthday,
  daysLeft,
  hasLetter,
  letterId,
  eventId,
}: FriendLetterItemProps) => {
  const navigate = useNavigate();

  const formattedDate = (() => {
    const d = new Date(birthday);
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  })();

  const handleClick = () => {
    if (hasLetter && letterId) {
      // ✍️ 편지 수정 화면으로 (라우팅 규칙에 맞춰 경로만 바꿔)
      navigate(`/moaletter/edit/${letterId}`);
    } else {
      // 📝 새 편지 작성 화면으로 (이벤트 ID 전달)
      navigate(`/moaletter/write?eventId=${eventId}`);
    }
  };

  return (
    <div className="flex items-center justify-between w-[350px] h-[64px]">
      <div className="flex items-center gap-[12px]">
        <img src={EnvelopeIcon} alt="편지 아이콘" width={64} height={64} />
        <div>
          <p className="text-[16px]">{name}</p>
          <p className="text-[16px] text-[#B7B7B7]">
            {formattedDate} (D-{daysLeft})
          </p>
        </div>
      </div>

      <button
        onClick={handleClick}
        className={`text-[14px] font-bold rounded-[10px] px-6 py-[6px] border-[1px] ${
          hasLetter
            ? "text-[#6282E1] border-[#6282E1] bg-white"
            : "text-white bg-[#6282E1] border-[#6282E1]"
        }`}
      >
        {hasLetter ? "수정하기" : "작성하기"}
      </button>
    </div>
  );
};

export default FriendLetterItem;

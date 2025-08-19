// components/HomePage/List/Birthday/FriendLetterItem.tsx
import EnvelopeIcon from "/assets/Envelope.svg";
import { useNavigate } from "react-router-dom";

interface FriendLetterItemProps {
  name: string;     
  birthday: string;      
  daysLeft: number;        
  hasLetter: boolean;
  letterId?: number | null; 
  eventId: number;         
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
      navigate(`/moaletter/edit/${letterId}`);
    } else {
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

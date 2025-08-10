import { differenceInCalendarDays } from "date-fns";
import EnvelopeIcon from "/assets/Envelope.svg";
import { useNavigate } from "react-router-dom"; //라우팅추가

interface FriendLetterItemProps {
  type: string;
  date: string; 
  hasWrittenLetter: boolean; 
}

const FriendLetterItem = ({ type, date, hasWrittenLetter }: FriendLetterItemProps) => {
  const today = new Date();
  const targetDate = new Date(date);
  const navigate = useNavigate(); //라우팅추가
  if (targetDate < today) {
    targetDate.setFullYear(today.getFullYear() + 1);
  }

  const dDay = differenceInCalendarDays(targetDate, today);
  const formattedDate = `${targetDate.getMonth() + 1}월 ${targetDate.getDate()}일`;

  return (
    <div className="flex items-center justify-between w-[350px] h-[64px]">
      {/* 왼쪽 아이콘 + 텍스트 */}
      <div className="flex items-center gap-[12px]">
        <img src={EnvelopeIcon} alt="편지 아이콘" width={64} height={64} />
        <div>
          <p className="text-[16px]">{type}</p>
          <p className="text-[16px] text-[#B7B7B7]">
            {formattedDate} (D-{dDay})
          </p>
        </div>
      </div>

      {/* 버튼 */}
      <button
        onClick={() => navigate("/moaletter/write")}//라우팅추가
        className={`text-[14px] font-bold rounded-[10px] px-6 py-[6px] border-[1px] ${
          hasWrittenLetter
            ? "text-[#6282E1] border-[#6282E1] bg-white"
            : "text-white bg-[#6282E1] border-[#6282E1]"
        }`}
      >
        {hasWrittenLetter ? "수정하기" : "작성하기"}
      </button>
    </div>
  );
};

export default FriendLetterItem;

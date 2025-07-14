import { differenceInCalendarDays } from "date-fns";
import EnvelopeIcon from "/assets/Envelope.svg";

interface FriendLetterItemProps {
  type: string;
  date: string; // yyyy-mm-dd 형식
}

const FriendLetterItem = ({ type, date }: FriendLetterItemProps) => {
  const today = new Date();
  const targetDate = new Date(date);

  // 이미 지난 날짜라면 다음 해로 설정
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
          <p className="text-[16px] font-semibold">{type}</p>
          <p className="text-[16px] text-[#999]">
            {formattedDate} (D-{dDay})
          </p>
        </div>
      </div>

      {/* 버튼 */}
      <button className="w-[99px] h-[33px] rounded-[8px] bg-[#888] text-white text-[14px]">
        수정하기
      </button>
    </div>
  );
};

export default FriendLetterItem;

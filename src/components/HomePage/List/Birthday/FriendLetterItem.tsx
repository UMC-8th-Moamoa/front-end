// components/HomePage/List/Birthday/FriendLetterItem.tsx
import EnvelopeIcon from "/assets/Envelope.svg";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface FriendLetterItemProps {
  name: string;
  birthday: string | number;
  daysLeft: number;
  hasLetter: boolean;
  letterId?: number | null;
  eventId?: number | null;
}

function parseMonthDay(input: unknown): { month: number; day: number } | null {
  if (input == null) return null;

  if (typeof input === "number") {
    const d = new Date(input);
    if (!Number.isNaN(d.getTime())) return { month: d.getMonth() + 1, day: d.getDate() };
    return null;
  }

  const s = String(input).trim();
  if (!s) return null;

  let m = s.match(/^\s*\d{4}[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (m) {
    const mm = +m[1], dd = +m[2];
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) return { month: mm, day: dd };
  }

  m = s.match(/^\s*(\d{1,2})[-/.](\d{1,2})\s*$/);
  if (m) {
    const mm = +m[1], dd = +m[2];
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) return { month: mm, day: dd };
  }

  m = s.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  if (m) {
    const mm = +m[1], dd = +m[2];
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) return { month: mm, day: dd };
  }

  m = s.match(/^\s*(\d{4})(\d{2})(\d{2})\s*$/);
  if (m) {
    const mm = +m[2], dd = +m[3];
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) return { month: mm, day: dd };
  }

  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return { month: d.getMonth() + 1, day: d.getDate() };
  return null;
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

  const formattedDate = useMemo(() => {
    const md = parseMonthDay(birthday);
    return md ? `${md.month}월 ${md.day}일` : "날짜 미정";
  }, [birthday]);

  const dText = daysLeft === 0 ? "D-DAY" : `D-${daysLeft}`;

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
            {formattedDate} ({dText})
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
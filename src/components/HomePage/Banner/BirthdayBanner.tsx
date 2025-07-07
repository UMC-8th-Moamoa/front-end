import { differenceInCalendarDays } from "date-fns";

interface BirthdayBannerProps {
  name: string;
  birthday: string; // e.g., '2025-01-19'
}

const BirthdayBanner = ({ name, birthday }: BirthdayBannerProps) => {
  const today = new Date();
  const targetDate = new Date(birthday);

  // D-day 계산 (과거 날짜일 경우 다음 해로)
  if (targetDate < today) {
    targetDate.setFullYear(today.getFullYear() + 1);
  }

  const dday = differenceInCalendarDays(targetDate, today);

  return (
    <div className="w-[350px] h-[81px] flex items-center justify-center bg-gray-300 rounded-2xl text-black font-semibold">
      <div className="flex-1 flex items-center justify-center text-4xl">D-{dday}</div>
      <div className="w-px h-6 bg-white mx-2" />
      <div className="flex-1 flex items-center justify-center text-lg">
        {name}님의 생일
      </div>
    </div>
  );
};

export default BirthdayBanner;

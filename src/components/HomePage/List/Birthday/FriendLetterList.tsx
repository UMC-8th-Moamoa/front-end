import { differenceInCalendarDays } from "date-fns";
import { FriendBirthdayDummy } from "./FriendBirthdayDummy";
import FriendLetterItem from "./FriendLetterItem";

const FriendLetterList = () => {
  const today = new Date();

  const getDday = (dateStr: string) => {
    const target = new Date(dateStr);
    if (target < today) target.setFullYear(today.getFullYear() + 1);
    return differenceInCalendarDays(target, today);
  };

  const sortedList = [...FriendBirthdayDummy].sort(
    (a, b) => getDday(a.birthday) - getDday(b.birthday)
  );

  return (
    <section className="mt-[30px] px-4">
      <h2 className="text-[18px] font-semibold text-black px-1 mb-[16px]">친구에게 줄 편지</h2>
      <div className="flex flex-col gap-[16px]">
        {sortedList.map((item, index) => (
          <FriendLetterItem key={index} type={item.name} date={item.birthday} />
        ))}
      </div>
    </section>
  );
};

export default FriendLetterList;


import { FriendBirthdayDummy } from "./FriendBirthdayDummy";
import UpcomingFriendItem from "./UpcomingFriendItem";
import { differenceInCalendarDays } from "date-fns";

const UpcomingFriendList = () => {
  const today = new Date();
  const sortedList = [...FriendBirthdayDummy].sort((a, b) => {
    const dateA = new Date(a.birthday);
    const dateB = new Date(b.birthday);
    if (dateA < today) dateA.setFullYear(today.getFullYear() + 1);
    if (dateB < today) dateB.setFullYear(today.getFullYear() + 1);
    return differenceInCalendarDays(dateA, today) - differenceInCalendarDays(dateB, today);
  });

  return (
    <section className="mt-[32px] px-4">
      <h2 className="text-[18px] font-semibold text-black mb-[16px]">다가오는 친구의 생일</h2>
      {sortedList.map((friend, idx) => (
        <UpcomingFriendItem
          key={idx}
          name={friend.name}
          birthday={friend.birthday}
          image={friend.image}
        />
      ))}
    </section>
  );
};

export default UpcomingFriendList;

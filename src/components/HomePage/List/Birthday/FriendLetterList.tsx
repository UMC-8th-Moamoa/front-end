
import { FriendBirthdayDummy } from "./FriendBirthdayDummy";
import FriendLetterItem from "./FriendLetterItem";

const FriendLetterList = () => {
  return (
    <section className="mt-[32px] px-4">
      <h2 className="text-[18px] font-semibold text-black mb-[16px]">친구에게 줄 편지</h2>
      <div className="flex flex-col gap-[16px]">
        {FriendBirthdayDummy.map((item, index) => (
          <FriendLetterItem key={index} type={item.name} date={item.birthday} />
        ))}
      </div>
    </section>
  );
};

export default FriendLetterList;

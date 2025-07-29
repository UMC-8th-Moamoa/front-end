import { differenceInCalendarDays } from "date-fns";
import { participantDummy } from "./ParticipantDummy";
import { recipientDummy } from "./RecipientDummy";

const RecipientBanner = () => {
  const today = new Date();
  const birthday = new Date(recipientDummy.birthday);

  if (birthday < today) {
    birthday.setFullYear(today.getFullYear() + 1);
  }

  const dday = differenceInCalendarDays(birthday, today);
  const numParticipants = participantDummy.length;

  return (
    <div className="w-[350px] h-[152px] bg-white rounded-[20px] shadow-md flex items-center justify-center ml-[6px]">
      {/* 왼쪽 - 프로필 */}
      <div className="flex flex-col items-center justify-center w-[69px] mr-5">
        {recipientDummy.profile ? (
          <img
            src={`/assets/${recipientDummy.profile}`}
            alt={`${recipientDummy.name}의 프로필`}
            className="w-[69px] h-[69px] rounded-full object-cover"
          />
        ) : (
          <div className="w-[69px] h-[69px] rounded-full bg-[#D9D9D9]" />
        )}
        <div className="mt-2 text-[15px] font-medium text-black">
          {recipientDummy.name}
        </div>
        <div className="text-[11px] font-normal text-[#B7B7B7]">
          {recipientDummy.userId}
        </div>
      </div>

      {/* 중앙 세로선 */}
      <div className="w-px h-[102px] bg-[#D9D9D9] mx-5" />

      {/* 오른쪽 - 디데이 & 보탬 인원 */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-[52px] font-semibold text-transparent ml-4 bg-clip-text bg-gradient-to-b from-[#6282E1] to-[#FEC3FF]">D-{dday}</div>
      </div>
    </div>
  );
};

export default RecipientBanner;

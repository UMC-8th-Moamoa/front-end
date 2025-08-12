import ParticipantItem from "./ParticipantItem";
import { participantDummy } from "./ParticipantDummy";

const ParticipantList = () => {
  return (
    <div className="w-full overflow-x-auto h-[74px] scrollbar-hide">
      <div className="flex items-center space-x-2.5 mt-2 whitespace-nowrap px-4">
        {participantDummy.map((user) => (
          <ParticipantItem key={user.id} name={user.name} profile={user.profile} />
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;

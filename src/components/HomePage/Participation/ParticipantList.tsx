import ParticipantItem from "./ParticipantItem";
import { participantDummy } from "./ParticipantDummy";

const ParticipantList = () => {
  return (
    <div className="w-full max-w-[350px] h-[74px] overflow-x-auto scrollbar-hide">
      <div className="flex items-center space-x-3 whitespace-nowrap">
        {participantDummy.map((user) => (
          <ParticipantItem key={user.id} name={user.name} />
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;

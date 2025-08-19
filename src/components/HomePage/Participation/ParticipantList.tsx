import ParticipantItem from "./ParticipantItem";

export type Participant = {
  id: number;
  name: string;
  photo: string | null;
};

type Props = {
  participants: Participant[];
};

const ParticipantList = ({ participants }: Props) => {
  return (
    <div className="w-full overflow-x-auto h-[74px] scrollbar-hide">
      <div className="flex items-center space-x-2.5 whitespace-nowrap px-4">
        {participants.map((p) => (
          <ParticipantItem
            key={p.id}
            name={p.name}
            profile={p.photo ?? "/assets/profile.svg"}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;

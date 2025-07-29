interface ParticipantItemProps {
  name: string;
  profile: string;
}

const ParticipantItem = ({ name, profile }: ParticipantItemProps) => {
  return (
    <div className="flex flex-col items-center w-[40px]">
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
        <img src={profile} alt={`${name} 프로필`} className="w-full h-full object-cover" />
      </div>
      <span className="mt-1 text-xs text-center">{name}</span>
    </div>
  );
};

export default ParticipantItem;
